<?php
/**
 * AIpex Digital — contact form handler.
 * Requires a PHP host with mail() available (OVH mutualized hosting works out of the box).
 * Does NOT work on GitHub Pages (static hosting only) — the JS form falls back to a mailto link there.
 */

header('Content-Type: application/json; charset=utf-8');

// --- Configuration -----------------------------------------------------
$destinationEmail = 'contact@aipex-digital.com'; // TODO: remplacer par l'adresse réelle d'AIpex Digital
$siteName = 'AIpex Digital';

function respond(bool $success, string $message): void {
    http_response_code($success ? 200 : 400);
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Méthode non autorisée.');
}

// Honeypot anti-spam field: humans never fill it.
if (!empty($_POST['website'])) {
    respond(true, 'Merci, votre message a bien été envoyé.');
}

// Time trap: bots submit instantly. The page stores its load time (ms) in "ts".
$ts = (int)($_POST['ts'] ?? 0);
if ($ts > 0 && (microtime(true) * 1000 - $ts) < 3000) {
    respond(true, 'Merci, votre message a bien été envoyé.');
}

$name    = trim((string)($_POST['name'] ?? ''));
$email   = trim((string)($_POST['email'] ?? ''));
$phone   = trim((string)($_POST['phone'] ?? ''));
$company = trim((string)($_POST['company'] ?? ''));
$subject = trim((string)($_POST['subject'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

if ($name === '' || $email === '' || $subject === '' || $message === '') {
    respond(false, 'Merci de renseigner tous les champs obligatoires.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, "Cet email semble incomplet. Vérifiez le format, par exemple nom@entreprise.fr.");
}

if (mb_strlen($message) > 5000 || mb_strlen($name) > 200) {
    respond(false, 'Votre message est trop long (5 000 caractères maximum). Raccourcissez-le ou écrivez-nous directement par email.');
}

// Messages stuffed with links are almost always spam.
if (preg_match_all('#https?://#i', $message) > 3) {
    respond(false, 'Votre message contient trop de liens. Retirez-en quelques-uns ou écrivez-nous directement par email.');
}

// Strip line breaks from header-sensitive fields to prevent header injection.
$sanitizeHeader = static fn(string $value): string => str_replace(["\r", "\n"], '', $value);
$name  = $sanitizeHeader($name);
$email = $sanitizeHeader($email);

$mailSubject = "[$siteName] Nouvelle demande — $subject";

$body = "Nouvelle demande reçue depuis le site $siteName\n\n";
$body .= "Nom : $name\n";
$body .= "Email : $email\n";
$body .= "Téléphone : " . ($phone !== '' ? $phone : '-') . "\n";
$body .= "Entreprise : " . ($company !== '' ? $company : '-') . "\n";
$body .= "Type de demande : $subject\n\n";
$body .= "Message :\n$message\n";

$headers = [
    'From: ' . $siteName . ' <no-reply@aipex-digital.com>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'Content-Type: text/plain; charset=utf-8',
];

$sent = @mail($destinationEmail, $mailSubject, $body, implode("\r\n", $headers));

if ($sent) {
    respond(true, 'Nous revenons vers vous sous 48 h ouvrées, à l\'adresse ' . $email . '.');
}

respond(false, "Le serveur n'a pas pu envoyer votre message. Réessayez dans quelques minutes, ou écrivez-nous directement à $destinationEmail.");
