# Ev Servis Projesi - GitHub Push Otomasyonu
# Karakter kodlamasi duzenlenecek

# Commit mesajini tanimla
$commitMessage = "Ev servis projesi guncellemeleri: Ucretsiz teklif al butonu ve WhatsApp entegrasyonu duzeltmesi"

# Commit mesajina tarih/saat ekle
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
$commitMessage = "$commitMessage ($timestamp)"

# Git'in yuklu olup olmadigini kontrol et
try {
    $gitVersion = git --version
    Write-Host "Git Surumu: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "HATA: Git yuklu degil veya PATH'te bulunamiyor!" -ForegroundColor Red
    Write-Host "Lutfen Git'i yukleyin: https://git-scm.com/downloads" -ForegroundColor Yellow
    exit 1
}

# Mevcut branch'i goster
$currentBranch = git branch --show-current
Write-Host "Mevcut branch: $currentBranch" -ForegroundColor Cyan

# Degisiklikleri goster
Write-Host "Degisiklikler: " -ForegroundColor Yellow    
git status

# Kullaniciya onay iste
$confirmation = Read-Host "Yukaridaki degisiklikleri commit edip push etmek istiyor musunuz? (E/H)"
if ($confirmation -ne "E" -and $confirmation -ne "e") {
    Write-Host "Islem iptal edildi." -ForegroundColor Red
    exit 0
}

# Degisiklikleri ekle, commit ve push
Write-Host "Tum degisiklikler ekleniyor..." -ForegroundColor Yellow
git add .

Write-Host "Degisiklikler commit ediliyor..." -ForegroundColor Yellow
git commit -m "$commitMessage"

Write-Host "Degisiklikler push ediliyor ($currentBranch)..." -ForegroundColor Yellow
git push origin $currentBranch

Write-Host "Islem tamamlandi!" -ForegroundColor Green
Write-Host "Commit mesaji: $commitMessage" -ForegroundColor Cyan
Write-Host "Branch: $currentBranch" -ForegroundColor Cyan 