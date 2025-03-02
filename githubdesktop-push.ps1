# Ev Servis Projesi - GitHub Desktop ile Push
# Karakter kodlamasi duzenlenecek

# Varsayilan commit mesaji
$commitMessage = "Ev servis projesi icin yapilan guncellemeler"

# Mevcut proje dizinini al
$projectDir = Get-Location

Write-Host "GitHub Desktop uygulamasi aciliyor..." -ForegroundColor Green
Write-Host "Lutfen asagidaki adimlari izleyin:" -ForegroundColor Yellow
Write-Host "1. Degisiklikleri kontrol edin" -ForegroundColor Cyan
Write-Host "2. Commit mesajini girin: '$commitMessage' (veya kendi mesajinizi yazin)" -ForegroundColor Cyan 
Write-Host "3. 'Commit to master' butonuna tiklayin" -ForegroundColor Cyan
Write-Host "4. 'Push origin' butonuna tiklayin" -ForegroundColor Cyan

# GitHub Desktop'i acma
Start-Process "GitHub Desktop"

Write-Host "Not: GitHub Desktop uygulamasinda islem tamamlandiktan sonra buraya donebilirsiniz." -ForegroundColor Magenta
Write-Host "Islem tamamlandi mi? (E/H): " -ForegroundColor Green -NoNewline
$confirmation = Read-Host

if ($confirmation -eq "E" -or $confirmation -eq "e") {
    Write-Host "Islem basariyla tamamlandi!" -ForegroundColor Green
} else {
    Write-Host "Islem tamamlanmadi. Lutfen GitHub Desktop uygulamasinda gerekli adimlari tamamlayin." -ForegroundColor Yellow
} 