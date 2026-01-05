# scaffold.ps1

Write-Host "Starting Govee Soffit Planner Project Scaffolding..." -ForegroundColor Cyan

# Helper function to create directories
function Ensure-Directory {
    param ( [string]$Path )
    if (-not (Test-Path -Path $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
        Write-Host "Created directory: $Path" -ForegroundColor Green
    } else {
        Write-Host "Directory exists: $Path" -ForegroundColor DarkGray
    }
}

# Helper function to create empty files (simulates 'touch')
function Ensure-File {
    param ( [string]$Path )
    if (-not (Test-Path -Path $Path)) {
        New-Item -ItemType File -Path $Path -Force | Out-Null
        Write-Host "Created file: $Path" -ForegroundColor Green
    } else {
        Write-Host "File exists: $Path" -ForegroundColor DarkGray
    }
}

# 1. Create Directory Structure
$directories = @(
    "public/assets",
    "src/app",
    "src/components/canvas",
    "src/components/controls",
    "src/components/ui",
    "src/lib/algorithms",
    "src/store",
    "src/types"
)

foreach ($dir in $directories) {
    Ensure-Directory -Path $dir
}

# 2. Create Configuration & Documentation Files
$rootFiles = @(
    "README.md",
    "tailwind.config.ts",
    "tsconfig.json"
)

foreach ($file in $rootFiles) {
    Ensure-File -Path $file
}

# 3. Create App Router Files
$appFiles = @(
    "src/app/layout.tsx",
    "src/app/page.tsx",
    "src/app/globals.css"
)

foreach ($file in $appFiles) {
    Ensure-File -Path $file
}

# 4. Create Component Placeholders
$componentFiles = @(
    "src/components/canvas/SoffitCanvas.tsx",
    "src/components/canvas/LightPuck.tsx",
    "src/components/canvas/WireSegment.tsx",
    "src/components/controls/ConfigurationPanel.tsx",
    "src/components/controls/SpacingControls.tsx"
)

foreach ($file in $componentFiles) {
    Ensure-File -Path $file
}

# 5. Create Logic & Store Placeholders
$logicFiles = @(
    "src/lib/algorithms/centric.ts",
    "src/lib/algorithms/biased.ts",
    "src/lib/algorithms/maxDensity.ts",
    "src/lib/constants.ts",
    "src/lib/utils.ts",
    "src/store/useLayoutStore.ts"
)

foreach ($file in $logicFiles) {
    Ensure-File -Path $file
}

# 6. Create Types Definition
Ensure-File -Path "src/types/index.ts"

Write-Host "`nProject structure created successfully!" -ForegroundColor Cyan
