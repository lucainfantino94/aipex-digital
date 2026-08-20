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
    respond(false, "L'adresse email renseignée n'est pas valide.");
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
    respond(true, 'Merci ! Votre message a bien été envoyé, nous revenons vers vous sous 48h ouvrées.');
}

respond(false, "Une erreur est survenue lors de l'envoi. Merci de réessayer ou de nous écrire directement à $destinationEmail.");
