# fix-and-run.ps1

Write-Host "Checking project configuration..." -ForegroundColor Cyan

$packageFile = "package.json"

if (-not (Test-Path $packageFile)) {
    Write-Error "package.json not found! Make sure you are in the root of the project."
    exit 1
}

# 1. Read package.json
try {
    $jsonContent = Get-Content $packageFile -Raw | ConvertFrom-Json
} catch {
    Write-Error "Could not read package.json. It might be invalid JSON."
    exit 1
}

# 2. Check if 'scripts' exists, if not create it
if (-not $jsonContent.PSObject.Properties['scripts']) {
    $jsonContent | Add-Member -MemberType NoteProperty -Name "scripts" -Value @{}
}

# 3. Check if 'dev' script exists, if not add Next.js scripts
if (-not $jsonContent.scripts.PSObject.Properties['dev']) {
    Write-Host "Adding missing Next.js scripts to package.json..." -ForegroundColor Yellow
    
    # Add standard Next.js scripts
    # We check individually to avoid errors if partial scripts exist
    if (-not $jsonContent.scripts.PSObject.Properties['dev']) { 
        $jsonContent.scripts | Add-Member -MemberType NoteProperty -Name "dev" -Value "next dev" 
    }
    if (-not $jsonContent.scripts.PSObject.Properties['build']) { 
        $jsonContent.scripts | Add-Member -MemberType NoteProperty -Name "build" -Value "next build" 
    }
    if (-not $jsonContent.scripts.PSObject.Properties['start']) { 
        $jsonContent.scripts | Add-Member -MemberType NoteProperty -Name "start" -Value "next start" 
    }
    if (-not $jsonContent.scripts.PSObject.Properties['lint']) { 
        $jsonContent.scripts | Add-Member -MemberType NoteProperty -Name "lint" -Value "next lint" 
    }
    
    # Save back to file
    $jsonContent | ConvertTo-Json -Depth 10 | Set-Content $packageFile
    Write-Host "package.json updated successfully." -ForegroundColor Green
}

# 4. Check if Next.js is actually installed
# (Checks for the binary in node_modules)
$nextBin = Join-Path "node_modules" ".bin" | Join-Path -ChildPath "next"
$nextBinCmd = Join-Path "node_modules" ".bin" | Join-Path -ChildPath "next.cmd"

if (-not (Test-Path $nextBin) -and -not (Test-Path $nextBinCmd)) {
    Write-Host "Next.js dependency missing. Installing required packages..." -ForegroundColor Yellow
    # Installing the stack defined in your requirements
    npm install next@14 react react-dom typescript @types/node @types/react @types/react-dom tailwindcss postcss autoprefixer zustand lucide-react
}

# 5. Run the server
Write-Host "Starting Next.js Development Server..." -ForegroundColor Green
npm run dev
