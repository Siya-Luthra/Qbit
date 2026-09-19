# QBit

QBit is a comprehensive, interactive quantum computing learning platform. It combines a textbook-style theoretical guide with a live quantum code editor and an AI-powered tutor to help you master quantum mechanics and quantum programming using Qiskit.

## Features

- **Interactive Quantum Textbook**: Chapters covering everything from basic Qubits to advanced algorithms like Shor's, Grover's, QKD, and VQE.
- **Live Code Editor**: Write Qiskit code directly in the browser and see real-time outputs.
- **Visual Circuit Builder**: Drag-and-drop interface for building quantum circuits.
- **AI Tutor**: Integrated AI assistant that can help debug your code, explain quantum concepts, and answer questions.
- **Real-time Simulation**: Uses Qiskit `StatevectorSampler` on the backend to simulate your circuits and return probability distributions, statevectors, and Bloch sphere visualizations.

## Quick Start

You can launch both the frontend and backend servers simultaneously using the provided startup scripts.

### Windows (PowerShell)

Right-click `run.ps1` and select "Run with PowerShell", or run from the terminal:
```powershell
.\run.ps1
```

### Linux / macOS (Bash)

Make the script executable and run it:
```bash
chmod +x run.sh
./run.sh
```

---

## Manual Setup

If you prefer to run the servers manually or need to install dependencies:

### 1. Backend (Python/FastAPI)

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```
The backend will run on `http://localhost:8000`.

### 2. Frontend (React/Vite)

Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.
