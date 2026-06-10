# AI PPT Generator - Local Server + CORS Proxy
# Usage: Right-click -> Run with PowerShell
# Then open http://localhost:3001 in browser
#
# The proxy uses query parameter to pass target URL:
#   /api-proxy?url=https://api.moonshot.cn/v1/chat/completions
# This avoids the double-slash issue in URL paths.

$port = 3001
$basePath = Split-Path -Parent $MyInvocation.MyCommand.Path
$indexFile = Join-Path $basePath "index.html"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  AI PPT Generator - Server (port $port)" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Open in browser: " -NoNewline
Write-Host "http://localhost:$port" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "[OK] Server listening on port $port" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Cannot start: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit
}

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    # ---------- CORS Proxy ----------
    # URL format: /api-proxy?url=https%3A%2F%2Fapi.moonshot.cn%2Fv1%2Fchat%2Fcompletions
    # Or:         /api-proxy?url=https://api.moonshot.cn/v1/chat/completions
    if ($request.Url.AbsolutePath -eq "/api-proxy") {

        # Get target URL from query parameter
        $targetUrl = $request.QueryString["url"]

        if (-not $targetUrl) {
            # Fallback: try to extract from path (for backward compatibility)
            # /api-proxy/https://api.moonshot.cn/... -> need to reconstruct double slash
            $rawPath = $request.Url.AbsolutePath
            if ($rawPath.Length -gt 12) {
                $urlPart = $rawPath.Substring(12) # after /api-proxy/
                if ($urlPart.StartsWith("https:/") -and -not $urlPart.StartsWith("https://")) {
                    $urlPart = "https://" + $urlPart.Substring(8)
                } elseif ($urlPart.StartsWith("http:/") -and -not $urlPart.StartsWith("http://")) {
                    $urlPart = "http://" + $urlPart.Substring(7)
                }
                $targetUrl = $urlPart
            }
        }

        Write-Host "[PROXY] $targetUrl" -ForegroundColor DarkGray

        if (-not $targetUrl) {
            $errMsg = '{"error":{"message":"Missing url parameter. Use /api-proxy?url=<target_url>"}}'
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.ContentType = "application/json; charset=utf-8"
            $response.StatusCode = 400
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($errMsg)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.OutputStream.Close()
            Write-Host "[ERROR] No target URL specified" -ForegroundColor Red
            continue
        }

        try {
            # Read request body (always use UTF-8)
            $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
            $body = $reader.ReadToEnd()
            $reader.Close()

            Write-Host "[PROXY] Body preview: $($body.Substring(0, [Math]::Min($body.Length, 120)))..." -ForegroundColor DarkGray

            # Create forwarded request
            $webReq = [System.Net.HttpWebRequest]::Create($targetUrl)
            $webReq.Method = $request.HttpMethod
            $webReq.ContentType = $request.ContentType

            # Forward Authorization header
            $authHeader = $request.Headers["Authorization"]
            if ($authHeader) {
                $webReq.Headers.Add("Authorization", $authHeader)
            }

            # Write request body
            if ($body.Length -gt 0) {
                $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
                $webReq.ContentLength = $bodyBytes.Length
                $reqStream = $webReq.GetRequestStream()
                $reqStream.Write($bodyBytes, 0, $bodyBytes.Length)
                $reqStream.Close()
            }

            # Get remote response (handle non-2xx status codes)
            $webResp = $null
            try {
                $webResp = $webReq.GetResponse()
            } catch [System.Net.WebException] {
                # WebException contains the actual response for 4xx/5xx errors
                $webResp = $_.Exception.Response
                if (-not $webResp) {
                    throw  # No response at all, re-throw
                }
            }

            $respStream = $webResp.GetResponseStream()
            $respReader = New-Object System.IO.StreamReader($respStream, [System.Text.Encoding]::UTF8)
            $respBody = $respReader.ReadToEnd()
            $respReader.Close()
            $statusCode = [int]$webResp.StatusCode
            $webResp.Close()

            # Forward response with CORS headers
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
            $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization")
            $response.ContentType = "application/json; charset=utf-8"
            $response.StatusCode = $statusCode

            $buffer = [System.Text.Encoding]::UTF8.GetBytes($respBody)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.OutputStream.Close()

            Write-Host "[OK] Proxy -> $statusCode" -ForegroundColor Green

        } catch {
            $errMessage = $_.Exception.Message -replace '"','\"' -replace '`',''
            $errMsg = '{"error":{"message":"Proxy error: ' + $errMessage + '"}}'
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.ContentType = "application/json; charset=utf-8"
            $response.StatusCode = 502
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($errMsg)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.OutputStream.Close()
            Write-Host "[ERROR] Proxy failed: $($_.Exception.Message)" -ForegroundColor Red
        }

    # ---------- OPTIONS preflight (CORS) ----------
    } elseif ($request.HttpMethod -eq "OPTIONS") {
        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.Headers.Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        $response.StatusCode = 204
        $response.Close()

    # ---------- Static file serving ----------
    } else {
        $reqPath = $request.Url.AbsolutePath
        if ($reqPath -eq "/") {
            $filePath = $indexFile
        } else {
            $relativePath = $reqPath.TrimStart("/").Replace("/", "\")
            $filePath = Join-Path $basePath $relativePath
        }

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            switch ($ext) {
                ".html" { $response.ContentType = "text/html; charset=utf-8" }
                ".js"   { $response.ContentType = "application/javascript" }
                ".css"  { $response.ContentType = "text/css" }
                ".json" { $response.ContentType = "application/json" }
                ".png"  { $response.ContentType = "image/png" }
                ".jpg"  { $response.ContentType = "image/jpeg" }
                ".svg"  { $response.ContentType = "image/svg+xml" }
                default { $response.ContentType = "application/octet-stream" }
            }
            $response.StatusCode = 200

            $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $fileBytes.Length
            $response.OutputStream.Write($fileBytes, 0, $fileBytes.Length)
            $response.OutputStream.Close()
            Write-Host "[FILE] $reqPath" -ForegroundColor DarkCyan
        } else {
            $response.StatusCode = 404
            $notFound = "404 Not Found: $reqPath"
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($notFound)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.OutputStream.Close()
            Write-Host "[404] $reqPath" -ForegroundColor DarkYellow
        }
    }
}
