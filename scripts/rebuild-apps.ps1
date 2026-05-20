# rebuild-apps.ps1 — new app/ 配下の 8 アプリをまとめて build し、xbp/apps/<slug>/ にコピーする
# 使い方: PowerShell で  .\scripts\rebuild-apps.ps1
$ErrorActionPreference = "Stop"

$apps = @(
  @{ Src = "focus-recipe";       Slug = "focus-recipe" }
  @{ Src = "not-today";          Slug = "not-today" }
  @{ Src = "note frame";         Slug = "noteframe" }
  @{ Src = "taskflow";           Slug = "taskflow" }
  @{ Src = "three-minute-start"; Slug = "three-minute-start" }
  @{ Src = "keshibato";          Slug = "keshibato" }
  @{ Src = "スクショToDo";       Slug = "screenshot-todo" }
  @{ Src = "英会話rpg";          Slug = "english-quest-rpg" }
)

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
New-Item -ItemType Directory -Force -Path "$root\apps" | Out-Null

foreach ($a in $apps) {
  $srcPath = Join-Path $root (Join-Path "new app" $a.Src)
  $destPath = Join-Path $root (Join-Path "apps" $a.Slug)
  Write-Host ""
  Write-Host "=== $($a.Src) -> apps\$($a.Slug) ===" -ForegroundColor Cyan
  Push-Location $srcPath
  try {
    if (-not (Test-Path "node_modules")) {
      Write-Host "  installing dependencies..." -ForegroundColor Yellow
      npm install --no-audit --no-fund --prefer-offline
    }
    Write-Host "  building..." -ForegroundColor Yellow
    npm run build
  } finally {
    Pop-Location
  }

  if (Test-Path $destPath) { Remove-Item -Recurse -Force $destPath }
  New-Item -ItemType Directory -Force -Path $destPath | Out-Null
  Copy-Item -Recurse -Force (Join-Path $srcPath "dist\*") $destPath
  Write-Host "  copied -> $destPath" -ForegroundColor Green
}

Write-Host ""
Write-Host "All apps rebuilt and mirrored to xbp\apps\<slug>\" -ForegroundColor Green
