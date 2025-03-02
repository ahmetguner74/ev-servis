# GitHub Desktop kullanarak değişiklikleri otomatik commit edip push etme script'i

# Commit Mesajı
$commitMessage = "Ev servis projesi için yapılan güncellemeler"

# GitHub Desktop komut satırı aracının (CLI) yolunu belirtelim
$githubDesktopPath = "$env:LOCALAPPDATA\GitHubDesktop\app-*\resources\app\static\github.bat"
$githubPath = (Resolve-Path $githubDesktopPath -ErrorAction SilentlyContinue | Select-Object -First 1).Path

if (-not $githubPath) {
    Write-Error "GitHub Desktop bulunamadı! Lütfen kurulu olduğundan emin olun."
    exit 1
}

# Mevcut çalışma dizini
$repoPath = (Get-Location).Path

Write-Host "GitHub Desktop kullanılarak değişiklikler commit ediliyor..." -ForegroundColor Green

# Tüm değişiklikleri staged olarak işaretleyelim
& $githubPath add .

# Değişiklikleri commit edelim
& $githubPath commit -m $commitMessage

# Değişiklikleri push edelim
& $githubPath push origin

Write-Host "İşlem tamamlandı!" -ForegroundColor Green
Write-Host "Değişiklikler '$commitMessage' mesajı ile commit edildi ve push edildi." 