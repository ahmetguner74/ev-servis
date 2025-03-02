@echo off
chcp 65001 >nul
color 0A

echo ============================================================
echo          GitHub'a Otomatik Push Araci
echo ============================================================
echo.
echo Lutfen kullanmak istediginiz yontemi secin:
echo.
echo [1] GitHub Desktop ile Push (Gorsel Arayuz)
echo [2] Git Komut Satiri ile Push (PowerShell)
echo [3] Cikis
echo.
set /p choice=Seciminiz (1-3): 

if "%choice%"=="1" (
    echo.
    echo GitHub Desktop ile push islemi baslatiliyor...
    powershell -ExecutionPolicy Bypass -File ".\githubdesktop-push.ps1"
) else if "%choice%"=="2" (
    echo.
    echo Git ile push islemi baslatiliyor...
    powershell -ExecutionPolicy Bypass -File ".\git-push.ps1"
) else if "%choice%"=="3" (
    echo.
    echo Programdan cikiliyor...
    exit /b 0
) else (
    echo.
    echo Hatali secim! Lutfen 1, 2 veya 3 seceneklerinden birini girin.
    exit /b 1
)

echo.
echo Islem tamamlandi!
pause