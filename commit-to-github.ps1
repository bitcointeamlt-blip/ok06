# PowerShell Script: Commit ir Push į GitHub
# Naudojimas: .\commit-to-github.ps1

Write-Host "🚀 Paruošiamas commit į GitHub..." -ForegroundColor Cyan

# Patikrinti, ar Git įdiegtas
try {
    $gitVersion = git --version
    Write-Host "✅ Git rastas: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git nerastas! Įdiekite Git iš: https://git-scm.com/download/win" -ForegroundColor Red
    Write-Host "Arba naudokite GitHub Desktop: https://desktop.github.com/" -ForegroundColor Yellow
    exit 1
}

# Patikrinti, ar yra Git repo
if (-not (Test-Path ".git")) {
    Write-Host "⚠️  Nerastas Git repository. Inicializuojame..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git repository inicializuotas" -ForegroundColor Green
}

# Patikrinti Git konfigūraciją
$userName = git config --get user.name
$userEmail = git config --get user.email

if (-not $userName -or -not $userEmail) {
    Write-Host "⚠️  Git konfigūracija nerasta. Reikia nustatyti:" -ForegroundColor Yellow
    Write-Host "git config --global user.name 'Jūsų Vardas'" -ForegroundColor Cyan
    Write-Host "git config --global user.email 'jūsų@email.com'" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Arba naudokite GitHub Desktop - jis automatiškai nustato konfigūraciją" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Git konfigūracija: $userName <$userEmail>" -ForegroundColor Green

# Patikrinti remote repository
$remoteUrl = git config --get remote.origin.url
if (-not $remoteUrl) {
    Write-Host "⚠️  Remote repository nerastas. Reikia pridėti:" -ForegroundColor Yellow
    Write-Host "git remote add origin https://github.com/jūsų-username/ok06.git" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Arba naudokite GitHub Desktop - jis automatiškai sukonfigūruoja remote" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Remote repository: $remoteUrl" -ForegroundColor Green

# Pridėti visus failus
Write-Host ""
Write-Host "📦 Pridedami failai..." -ForegroundColor Cyan
git add .

# Patikrinti, ar yra pakeitimų
$status = git status --porcelain
if (-not $status) {
    Write-Host "ℹ️  Nėra pakeitimų commit'inti" -ForegroundColor Yellow
    exit 0
}

# Rodyti pakeitimus
Write-Host ""
Write-Host "📋 Pakeitimai:" -ForegroundColor Cyan
git status --short

# Commit message
$commitMessage = "Fix: Colyseus CORS - HTTP server request listener for matchmaking endpoints"

Write-Host ""
Write-Host "💾 Commit'inama su žinute: '$commitMessage'" -ForegroundColor Cyan
git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit sėkmingas!" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "🚀 Push'inama į GitHub..." -ForegroundColor Cyan
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Push sėkmingas! Kodas dabar GitHub'e!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Kitas žingsnis: Colyseus Cloud automatiškai gaus naują kodą" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Push nepavyko. Patikrinkite:" -ForegroundColor Red
        Write-Host "  1. Ar turite teises push'inti į repository" -ForegroundColor Yellow
        Write-Host "  2. Ar naudojate teisingą branch'ą (main/master)" -ForegroundColor Yellow
        Write-Host "  3. Ar turite interneto ryšį" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Commit nepavyko" -ForegroundColor Red
}

