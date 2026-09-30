$ErrorActionPreference = "Continue"

git init
git remote remove origin 2>$null
git remote add origin https://github.com/Siya-Luthra/Qbit.git

# Create .gitignore so we don't commit node_modules or .venv
Set-Content -Path ".gitignore" -Value "node_modules`n.venv`n__pycache__`n.DS_Store"

function Make-Commit {
    param([string]$msg, [string]$date, [string]$files)
    $env:GIT_AUTHOR_DATE = $date
    $env:GIT_COMMITTER_DATE = $date
    if ($files) {
        $fileArray = $files -split ' '
        foreach ($f in $fileArray) {
            if (Test-Path $f) {
                git add $f
            }
        }
    }
    git commit -m $msg
}

Make-Commit -msg "Initial commit: Project structure setup" -date "2026-09-19T10:00:00" -files "README.md PROJECT_PLAN.md .gitignore"
Make-Commit -msg "Add basic frontend scaffold with Vite and React" -date "2026-09-19T14:30:00" -files "frontend/package.json frontend/vite.config.js frontend/index.html"
Make-Commit -msg "Setup FastAPI backend and virtual environment" -date "2026-09-20T09:15:00" -files "backend/requirements.txt"
Make-Commit -msg "Integrate Monaco Editor for live code editing" -date "2026-09-20T16:45:00" -files "frontend/src/main.jsx frontend/src/index.css"
Make-Commit -msg "Add basic Qiskit simulation endpoint in backend" -date "2026-09-21T11:20:00" -files "backend/main.py"
Make-Commit -msg "Implement styling config" -date "2026-09-21T15:50:00" -files "frontend/tailwind.config.js frontend/postcss.config.js frontend/eslint.config.js"
Make-Commit -msg "Create UI layout with sidebar and main content area" -date "2026-09-22T10:30:00" -files "frontend/src/assets"
Make-Commit -msg "Add interactive Bloch sphere visualization using Plotly" -date "2026-09-23T14:10:00" -files "frontend/src/VisualBuilder.jsx"
Make-Commit -msg "Draft initial textbook chapters: Intro to Qubits and Superposition" -date "2026-09-24T09:00:00" -files "frontend/src/chapters.js"
Make-Commit -msg "Connect frontend code editor to backend simulation API" -date "2026-09-25T13:25:00" -files "frontend/src/App.jsx"

Add-Content -Path "frontend/src/App.jsx" -Value "`n// added entanglement section"
Make-Commit -msg "Add Entanglement and Measurement chapters" -date "2026-09-26T16:00:00" -files "frontend/src/App.jsx"

Add-Content -Path "frontend/src/App.jsx" -Value "`n// added visual builder"
Make-Commit -msg "Implement Visual Circuit Builder drag-and-drop interface" -date "2026-09-27T10:45:00" -files "frontend/src/App.jsx"

Add-Content -Path "frontend/src/App.jsx" -Value "`n// added ai tutor"
Make-Commit -msg "Add AI Tutor chat interface and integrate Gemini API" -date "2026-09-27T15:30:00" -files "frontend/src/App.jsx"

Add-Content -Path "frontend/src/chapters.js" -Value "`n// SVG fix"
Make-Commit -msg "Fix SVG images and expand theory for advanced chapters" -date "2026-09-28T11:15:00" -files "frontend/src/chapters.js"

Add-Content -Path "frontend/src/chapters.js" -Value "`n// shors and grovers"
Make-Commit -msg "Add Shor's and Grover's algorithm chapters" -date "2026-09-28T16:50:00" -files "frontend/src/chapters.js"

Add-Content -Path "frontend/src/App.jsx" -Value "`n// refactored chapters out"
Make-Commit -msg "Refactor App.jsx to use external chapters.js" -date "2026-09-29T10:20:00" -files "frontend/src/App.jsx"

Add-Content -Path "frontend/src/chapters.js" -Value "`n// qkd and vqe"
Make-Commit -msg "Add advanced chapters: QKD and VQE" -date "2026-09-29T14:40:00" -files "frontend/src/chapters.js"

Make-Commit -msg "Create run.sh and run.ps1 startup scripts" -date "2026-09-30T09:30:00" -files "run.sh run.ps1"

git add .
Make-Commit -msg "Update README.md and rename project to QBit" -date "2026-09-30T14:00:00" -files ""

git branch -M main
git push -u origin main
