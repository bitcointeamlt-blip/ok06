# PowerShell Script: Commit su GitHub Token
# Token: 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
# Repository: bitcointeamlt-blip/ok06

$GitHubToken = "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"
$GitHubUsername = "bitcointeamlt-blip"
$Repository = "ok06"

Write-Host "🚀 Commit'inama su GitHub Token..." -ForegroundColor Cyan
Write-Host ""

# Patikrinti, ar Git įdiegtas
try {
    $gitVersion = git --version 2>&1
    Write-Host "✅ Git rastas: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git NERASTAS!" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 REIKIA ĮDIEGTI GIT:" -ForegroundColor Yellow
    Write-Host "   1. Atsisiųskite: https://git-scm.com/download/win" -ForegroundColor Cyan
    Write-Host "   2. Įdiekite su numatytomis nustatymais" -ForegroundColor Cyan
    Write-Host "   3. Paleiskite script'ą dar kartą" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💡 ARBA naudokite GitHub Desktop:" -ForegroundColor Yellow
    Write-Host "   https://desktop.github.com/" -ForegroundColor Cyan
    Write-Host "   Jis automatiškai tvarko viską!" -ForegroundColor Cyan
    exit 1
}

Write-Host ""
Write-Host "📦 Konfigūruojama repository..." -ForegroundColor Cyan

# Patikrinti, ar yra Git repository
if (-not (Test-Path ".git")) {
    Write-Host "⚠️  Git repository nerastas. Inicializuojame..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git repository inicializuotas" -ForegroundColor Green
}

# Nustatyti remote su token'u
$remoteUrl = "https://${GitHubToken}@github.com/${GitHubUsername}/${Repository}.git"
Write-Host "🔗 Nustatomas remote: https://github.com/${GitHubUsername}/${Repository}.git" -ForegroundColor Cyan

# Patikrinti, ar remote jau egzistuoja
$existingRemote = git config --get remote.origin.url 2>&1
if ($existingRemote -and -not $existingRemote.Contains("error")) {
    Write-Host "⚠️  Remote jau egzistuoja. Atnaujiname..." -ForegroundColor Yellow
    git remote set-url origin $remoteUrl
} else {
    git remote add origin $remoteUrl
}

Write-Host "✅ Remote nustatytas" -ForegroundColor Green
Write-Host ""

# Nustatyti Git konfigūraciją (jei reikia)
$currentName = git config --get user.name 2>&1
$currentEmail = git config --get user.email 2>&1

if (-not $currentName -or $currentName.Contains("error")) {
    Write-Host "⚠️  Git user.name nenustatytas. Nustatome..." -ForegroundColor Yellow
    git config --global user.name "bitcointeamlt-blip"
}

if (-not $currentEmail -or $currentEmail.Contains("error")) {
    Write-Host "⚠️  Git user.email nenustatytas. Nustatome..." -ForegroundColor Yellow
    git config --global user.email "bitcointeamlt-blip@users.noreply.github.com"
}

Write-Host ""

# Pridėti visus failus
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
    
    # Bandyti push'inti į main branch
    git push -u origin main 2>&1 | Out-Null
    
    if ($LASTEXITCODE -ne 0) {
        # Jei main neegzistuoja, bandyti master
        Write-Host "⚠️  Branch 'main' nerastas. Bandome 'master'..." -ForegroundColor Yellow
        git push -u origin master 2>&1 | Out-Null
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Push sėkmingas! Kodas dabar GitHub'e!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Kitas žingsnis: Colyseus Cloud automatiškai gaus naują kodą" -ForegroundColor Cyan
        Write-Host "   Palaukite 2-5 minučių ir patikrinkite Colyseus Cloud logs" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Push nepavyko. Patikrinkite:" -ForegroundColor Red
        Write-Host "  1. Ar token'as teisingas" -ForegroundColor Yellow
        Write-Host "  2. Ar repository egzistuoja GitHub'e" -ForegroundColor Yellow
        Write-Host "  3. Ar turite teises push'inti" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Commit nepavyko" -ForegroundColor Red
}

Write-Host ""

