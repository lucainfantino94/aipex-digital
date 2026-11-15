# Serveur statique minimal pour l'aperçu local (aucune dépendance).
# Usage : powershell -ExecutionPolicy Bypass -File .claude/serve.ps1 [-Port 8420]
param([int]$Port = 8420)
$root = (Resolve-Path "$PSScriptRoot\..").Path
$types = @{ ".html"="text/html; charset=utf-8"; ".css"="text/css"; ".js"="application/javascript"; ".png"="image/png"; ".jpg"="image/jpeg"; ".ico"="image/x-icon"; ".svg"="image/svg+xml"; ".xml"="application/xml"; ".txt"="text/plain"; ".webmanifest"="application/manifest+json" }
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving $root on http://localhost:$Port"
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $path = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
  if ($path -eq "/") { $path = "/index.html" }
  $file = Join-Path $root $path.TrimStart("/")
  $res = $ctx.Response
  if ((Test-Path $file -PathType Leaf) -and ($file.StartsWith($root))) {
    $res.StatusCode = 200
  } else {
    $res.StatusCode = 404
    $file = Join-Path $root "404.html"
  }
  $ext = [IO.Path]::GetExtension($file)
  # PHP n'est pas exécuté : contact.php renvoie une 501 pour tester le repli du formulaire.
  if ($ext -eq ".php") { $res.StatusCode = 501; $res.ContentType = "text/plain"; $bytes = [Text.Encoding]::UTF8.GetBytes("PHP indisponible en local") }
  else { $res.ContentType = $types[$ext]; $bytes = [IO.File]::ReadAllBytes($file) }
  try {
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
  } catch { }
  $res.Close()
  Write-Host "$($res.StatusCode) $path"
}
