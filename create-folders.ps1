$folders = @(
    "src\app\(site)",
    "src\app\(dashboard)",
    "src\app\components",
    "src\app\hooks",
    "src\app\lib",
    "src\app\providers",
    "src\app\utils",
    "src\app\styles"
)

foreach ($folder in $folders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force
        Write-Host "Created: $folder"
    } else {
        Write-Host "Already exists: $folder"
    }
} 