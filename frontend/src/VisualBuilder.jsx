import React, { useState, useEffect } from 'react';

const GATES = ['H', 'X', 'Y', 'Z', 'CX', 'M'];

export default function VisualBuilder({ onCodeUpdate }) {
  const [grid, setGrid] = useState({
    0: [null, null, null, null, null],
    1: [null, null, null, null, null],
  });

  const handleDragStart = (e, gate) => {
    e.dataTransfer.setData('gate', gate);
  };

  const handleDrop = (e, qubit, col) => {
    e.preventDefault();
    const gate = e.dataTransfer.getData('gate');
    if (!gate) return;

    const newGrid = { ...grid };
    newGrid[qubit][col] = gate;
    setGrid(newGrid);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const clearGrid = () => {
    setGrid({
      0: [null, null, null, null, null],
      1: [null, null, null, null, null],
    });
  };

  useEffect(() => {
    // Generate Qiskit code from grid
    let code = "from qiskit import QuantumCircuit\n";
    code += "from qiskit.primitives import StatevectorSampler\n\n";
    code += "qc = QuantumCircuit(2, 2)\n";

    // Process column by column
    let measuredQ0 = false;
    let measuredQ1 = false;

    for (let col = 0; col < 5; col++) {
      let q0_gate = grid[0][col];
      let q1_gate = grid[1][col];

      if (q0_gate === 'CX') {
        code += `qc.cx(0, 1)\n`;
      } else if (q1_gate === 'CX') {
        code += `qc.cx(1, 0)\n`;
      } else {
        if (q0_gate === 'M') {
          code += `qc.measure([0], [0])\n`;
          measuredQ0 = true;
        } else if (q0_gate) {
          code += `qc.${q0_gate.toLowerCase()}(0)\n`;
        }

        if (q1_gate === 'M') {
          code += `qc.measure([1], [1])\n`;
          measuredQ1 = true;
        } else if (q1_gate) {
          code += `qc.${q1_gate.toLowerCase()}(1)\n`;
        }
      }
    }

    code += "\n# --- Run the circuit and get counts ---\n";
    code += "sampler = StatevectorSampler()\n";
    code += "job = sampler.run([qc])\n";
    code += "result = job.result()\n";
    code += "counts = result[0].data.c.get_counts()\n";
    code += "print('Counts:', counts)\n";

    onCodeUpdate(code);
  }, [grid, onCodeUpdate]);

  return (
    <div className="h-full flex flex-col bg-[#0a0d12] rounded-lg border border-gray-800 p-4 overflow-y-auto">
      <div className="mb-6 bg-[#161b22] p-4 rounded-md border border-gray-700">
        <h2 className="text-lg font-bold text-white mb-2">How to use the Visual Builder:</h2>
        <ol className="list-decimal list-inside text-sm text-gray-300 space-y-1">
          <li><strong>Identify the lines (Qubits):</strong> Horizontal lines represent qubits starting at |0⟩.</li>
          <li><strong>Choose your gates:</strong>
            <span className="ml-1 text-indigo-400 font-mono text-xs px-1 bg-indigo-900/30 rounded">H</span> puts a qubit into superposition.
            <span className="ml-1 text-indigo-400 font-mono text-xs px-1 bg-indigo-900/30 rounded">X</span> flips a qubit (NOT gate).
          </li>
          <li><strong>Drag and Drop:</strong> Drag a gate onto a qubit line.</li>
          <li><strong>Add a Measurement:</strong> Drag <span className="ml-1 text-red-400 font-mono text-xs px-1 bg-red-900/30 rounded">M</span> to the end of the line to read the final result.</li>
          <li><strong>Run it:</strong> Click "Run Simulation" above to calculate the results!</li>
        </ol>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-300 font-semibold text-sm">Gate Palette</h3>
        <button onClick={clearGrid} className="text-xs text-red-400 hover:text-red-300 px-2 py-1 bg-red-900/20 rounded">Clear</button>
      </div>

      <div className="flex gap-2 mb-6 p-2 bg-[#161b22] rounded-md overflow-x-auto">
        {GATES.map(gate => (
          <div
            key={gate}
            draggable
            onDragStart={(e) => handleDragStart(e, gate)}
            className={`w-10 h-10 min-w-10 flex items-center justify-center rounded font-bold cursor-grab active:cursor-grabbing shadow-lg border ${gate === 'M' ? 'bg-red-600 text-white border-red-500' : 'bg-indigo-600 text-white border-indigo-500'}`}
          >
            {gate}
          </div>
        ))}
      </div>

      <h3 className="text-gray-300 font-semibold text-sm mb-2">Circuit Canvas (Drag gates here)</h3>
      <div className="flex-1 overflow-x-auto">
        <div className="flex flex-col gap-4 min-w-max">
          {[0, 1].map(qubit => (
            <div key={qubit} className="flex items-center gap-2">
              <div className="text-gray-400 font-mono text-xs w-8">q[{qubit}]</div>
              <div className="flex gap-2 relative">
                {/* Quantum Wire */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-gray-600 -z-10"></div>

                {grid[qubit].map((gate, col) => (
                  <div
                    key={col}
                    onDrop={(e) => handleDrop(e, qubit, col)}
                    onDragOver={handleDragOver}
                    className={`w-10 h-10 flex items-center justify-center rounded border-2 ${gate === 'M' ? 'bg-red-600 border-red-500 text-white font-bold' : gate ? 'bg-indigo-600 border-indigo-500 text-white font-bold' : 'bg-[#161b22] border-dashed border-gray-600'}`}
                  >
                    {gate}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
