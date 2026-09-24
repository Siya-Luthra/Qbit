export const CHAPTERS = {
  'intro': {
    id: 'intro',
    title: '1. Intro to Qubits',
    theory: `
      <h2 class="text-2xl font-semibold text-white mt-4 mb-2 border-b border-gray-700 pb-2">What is a Qubit?</h2>
      <div class="flex justify-center my-6">
        <svg width="150" height="150" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#4a5568" stroke-width="2" stroke-dasharray="4 4" />
          <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="#4a5568" stroke-width="2" />
          <line x1="50" y1="95" x2="50" y2="5" stroke="#718096" stroke-width="2" />
          <line x1="5" y1="50" x2="95" y2="50" stroke="#718096" stroke-width="2" />
          <line x1="50" y1="50" x2="70" y2="20" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow)" />
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
            </marker>
          </defs>
          <text x="45" y="15" fill="#e2e8f0" font-size="8">|0⟩</text>
          <text x="45" y="92" fill="#e2e8f0" font-size="8">|1⟩</text>
          <text x="75" y="18" fill="#60a5fa" font-size="8" font-weight="bold">|ψ⟩</text>
        </svg>
      </div>
      <p class="mb-4 text-gray-300 leading-relaxed">
        A qubit is the fundamental unit of quantum information. While classical bits can only be <strong>0</strong> or <strong>1</strong>, qubits can exist in a state of 0, 1, or any quantum superposition of these states, represented mathematically as a vector on the Bloch sphere.
      </p>
      <div class="bg-gray-800/40 p-5 rounded-lg border border-gray-700 my-6">
        <h3 class="text-xl font-medium text-white mb-2">Dirac Notation & Linear Algebra</h3>
        <p class="text-gray-300 text-sm leading-relaxed mb-3">
          In quantum mechanics, we use Dirac notation (or "bra-ket" notation) to represent states. The state |0⟩ (pronounced "ket zero") is represented as a column vector [1, 0]^T, and the state |1⟩ as [0, 1]^T. A general single-qubit state |ψ⟩ is a linear combination of these basis states:
        </p>
        <code class="block bg-black/50 p-3 rounded text-blue-300 font-mono text-sm border border-gray-800 text-center">|ψ⟩ = α|0⟩ + β|1⟩</code>
        <p class="text-gray-400 text-xs mt-3">
          Here, α and β are complex numbers known as probability amplitudes. The sum of their absolute squares must equal 1 (|α|² + |β|² = 1). This is known as the normalization condition.
        </p>
      </div>
      <div class="grid grid-cols-2 gap-4 my-6">
        <div class="bg-blue-900/20 p-4 rounded-lg border border-blue-900/50">
          <h4 class="font-bold text-blue-400 mb-2">Classical Bit</h4>
          <p class="text-sm text-gray-400">Deterministic. Exists strictly as 0 or 1.</p>
        </div>
        <div class="bg-purple-900/20 p-4 rounded-lg border border-purple-900/50">
          <h4 class="font-bold text-purple-400 mb-2">Quantum Bit (Qubit)</h4>
          <p class="text-sm text-gray-400">Probabilistic. Exists as a linear combination of |0⟩ and |1⟩.</p>
        </div>
      </div>
      <h3 class="text-xl font-medium text-white mt-6 mb-2">The Pauli-X Gate</h3>
      <p class="mb-4 text-gray-300 leading-relaxed">
        Quantum operations are represented by unitary matrices. The Pauli-X gate acts as a quantum NOT gate. It flips the state around the X-axis of the Bloch sphere, converting |0⟩ to |1⟩ and vice versa. When applied to the state vector, it swaps the probability amplitudes.
      </p>
      <div class="bg-[#161b22] p-4 rounded-md border border-gray-700 font-mono text-blue-400 my-4 flex items-center justify-between">
        <span>X |0⟩ = |1⟩<br/>X |1⟩ = |0⟩</span>
        <span class="text-gray-500 text-sm">Matrix: [0 1]<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[1 0]</span>
      </div>
    `,
    defaultCode: `from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler

# Create a 1-qubit circuit with 1 classical bit
qc = QuantumCircuit(1, 1)

# Apply X gate to flip 0 to 1
qc.x(0)

# Measure the qubit
qc.measure([0], [0])

# --- Run the circuit and get counts ---
sampler = StatevectorSampler()
job = sampler.run([qc])
result = job.result()
counts = result[0].data.c.get_counts()
print("Counts:", counts)`,
    challenge: 'Challenge: Modify the code to put the qubit into a superposition state using the Hadamard (H) gate, then run the simulation to check your results.'
  },
  'superposition': {
    id: 'superposition',
    title: '2. Superposition',
    theory: `
      <h2 class="text-2xl font-semibold text-white mt-4 mb-2 border-b border-gray-700 pb-2">Quantum Superposition</h2>
      <div class="flex justify-center my-6">
        <div class="relative w-32 h-32 rounded-full border-4 border-dashed border-indigo-500 flex items-center justify-center bg-indigo-500/10">
          <span class="text-2xl text-white font-bold">|0⟩ + |1⟩</span>
          <div class="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse"></div>
        </div>
      </div>
      <p class="mb-4 text-gray-300 leading-relaxed">
        Superposition allows a quantum system to be in multiple states at the same time. It's the property that gives quantum computers their immense parallel processing potential. Unlike a coin that is either heads or tails, a qubit in superposition is like a coin spinning in the air—it is a combination of both states until it lands.
      </p>
      <div class="bg-indigo-900/20 p-5 rounded-lg border border-indigo-800/50 my-6">
        <h4 class="font-bold text-indigo-300 mb-3">Exponential Power</h4>
        <p class="text-sm text-gray-300">
          A classical register with N bits can store exactly <strong>1</strong> number out of 2^N possible values. 
          A quantum register with N qubits in superposition stores a linear combination of <strong>all 2^N possible values simultaneously!</strong> 
          This is why adding just a few extra qubits dramatically increases the computational space of a quantum computer.
        </p>
      </div>
      <h3 class="text-xl font-medium text-white mt-6 mb-2">The Hadamard (H) Gate</h3>
      <p class="mb-4 text-gray-300 leading-relaxed">
        The Hadamard gate is the most common way to create a superposition. It transforms a definite basis state into a perfectly balanced, equal superposition of |0⟩ and |1⟩.
      </p>
      <div class="bg-[#161b22] p-4 rounded-md border border-gray-700 font-mono text-blue-400 my-4">
        H |0⟩ = (|0⟩ + |1⟩) / √2 = |+⟩<br/>
        H |1⟩ = (|0⟩ - |1⟩) / √2 = |-⟩
      </div>
      <div class="bg-yellow-900/20 p-4 rounded-lg border border-yellow-900/50 mb-4">
        <p class="text-sm text-yellow-200"><strong>Note:</strong> Measuring a qubit in this state will randomly collapse it to either 0 or 1 with exactly a 50% probability each, because the square of the amplitude (1/√2)² is 1/2.</p>
      </div>
    `,
    defaultCode: `from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler

qc = QuantumCircuit(1, 1)
# Apply Hadamard gate
qc.h(0)
qc.measure([0], [0])

# --- Run the circuit and get counts ---
sampler = StatevectorSampler()
job = sampler.run([qc])
result = job.result()
counts = result[0].data.c.get_counts()
print("Counts:", counts)`
  },
  'entanglement': {
    id: 'entanglement',
    title: '3. Entanglement',
    theory: `
      <h2 class="text-2xl font-semibold text-white mt-4 mb-2 border-b border-gray-700 pb-2">Spooky Action at a Distance</h2>
      <div class="flex justify-center items-center gap-8 my-8 relative">
        <div class="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)] flex items-center justify-center animate-pulse">
           <span class="text-cyan-300 font-bold">Q0</span>
        </div>
        <div class="absolute w-24 h-1 bg-gradient-to-r from-cyan-400 to-fuchsia-400 opacity-50 shadow-[0_0_15px_rgba(255,255,255,0.8)]" style="left: 50%; transform: translateX(-50%);"></div>
        <div class="w-16 h-16 rounded-full bg-fuchsia-500/20 border-2 border-fuchsia-400 shadow-[0_0_20px_rgba(232,121,249,0.5)] flex items-center justify-center animate-pulse" style="animation-delay: 0.5s">
           <span class="text-fuchsia-300 font-bold">Q1</span>
        </div>
      </div>
      <p class="mb-4 text-gray-300 leading-relaxed">
        Entanglement is a phenomenon where two or more qubits become perfectly correlated. The state of one qubit cannot be described independently of the state of the others, no matter how far apart they are in the universe. Einstein famously referred to this as "spooky action at a distance."
      </p>
      <p class="mb-4 text-gray-300 leading-relaxed">
        When two qubits are entangled, measuring one immediately determines the state of the other. This strong correlation defies classical intuition and is the foundation for quantum cryptography, teleportation, and error correction.
      </p>
      <h3 class="text-xl font-medium text-white mt-6 mb-2">Creating a Bell State</h3>
      <p class="mb-4 text-gray-300 leading-relaxed">
        A <strong>Bell State</strong> is the simplest example of maximal entanglement between two qubits. It is created by a two-step process:
      </p>
      <ol class="list-decimal list-inside text-sm text-gray-300 space-y-2 mb-4 ml-2">
        <li>Apply a Hadamard (H) gate to the first qubit (putting it into superposition).</li>
        <li>Apply a CNOT (Controlled-NOT) gate using the first qubit as the control and the second as the target.</li>
      </ol>
      <p class="mb-4 text-gray-300 leading-relaxed">
        The CNOT gate flips the target qubit <em>if and only if</em> the control qubit is |1⟩. Since the control is in a superposition of |0⟩ and |1⟩, the target becomes entangled with it.
      </p>
      <div class="bg-[#161b22] p-4 rounded-md border border-gray-700 font-mono text-blue-400 my-4 overflow-x-auto text-center">
        |Φ⁺⟩ = (|00⟩ + |11⟩) / √2
      </div>
      <p class="text-sm text-gray-400 italic">If you measure the first qubit and get a 0, the overall state collapses to |00⟩, meaning the second qubit must also be 0. If you get a 1, the second must be 1. They will always match!</p>
    `,
    defaultCode: `from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler

qc = QuantumCircuit(2, 2)
# Create a Bell State
qc.h(0)
qc.cx(0, 1) # CNOT gate

qc.measure([0, 1], [0, 1])

# --- Run the circuit and get counts ---
sampler = StatevectorSampler()
job = sampler.run([qc])
result = job.result()
counts = result[0].data.c.get_counts()
print("Counts:", counts)`
  },
  'pauli_y_z': {
    id: 'pauli_y_z',
    title: '4. Pauli Y & Z Gates',
    theory: `
      <h2 class="text-2xl font-semibold text-white mt-4 mb-2 border-b border-gray-700 pb-2">Phase Flips & Rotations</h2>
      <p class="mb-4 text-gray-300 leading-relaxed">
        While the X gate flips the probability amplitudes (like a classical NOT), the Z and Y gates introduce <strong>phase</strong> shifts. Phase is a uniquely quantum property that enables interference.
      </p>
      <div class="grid grid-cols-2 gap-4 my-6 text-sm">
        <div class="bg-green-900/20 p-4 rounded-lg border border-green-900/50">
          <h4 class="font-bold text-green-400 mb-2">Pauli-Z Gate</h4>
          <p class="text-gray-300 mb-2">Leaves |0⟩ unchanged, but flips the sign of |1⟩ to -|1⟩.</p>
          <code class="text-green-300 bg-black/30 px-2 py-1 rounded">Z |+⟩ = |-⟩</code>
        </div>
        <div class="bg-red-900/20 p-4 rounded-lg border border-red-900/50">
          <h4 class="font-bold text-red-400 mb-2">Pauli-Y Gate</h4>
          <p class="text-gray-300 mb-2">Combines bit and phase flips with an imaginary component (i).</p>
          <code class="text-red-300 bg-black/30 px-2 py-1 rounded">Y |0⟩ = i|1⟩</code>
        </div>
      </div>
      <p class="mb-4 text-gray-300 leading-relaxed">
        A phase flip doesn't change the probability of measuring 0 or 1, but it changes how the qubit interacts with other gates (like the H gate) later on.
      </p>
    `,
    defaultCode: `from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler

qc = QuantumCircuit(1, 1)
qc.h(0) # Put into superposition (|+> state)
qc.z(0) # Phase flip (changes |+> to |->)

# If we applied another H gate here, it would become |1>!
qc.measure([0], [0])

# --- Run the circuit and get counts ---
sampler = StatevectorSampler()
job = sampler.run([qc])
result = job.result()
counts = result[0].data.c.get_counts()
print("Counts:", counts)`
  },
  'measurement': {
    id: 'measurement',
    title: '5. Quantum Measurement',
    theory: `
      <h2 class="text-2xl font-semibold text-white mt-4 mb-2 border-b border-gray-700 pb-2">The Observer Effect</h2>
      <div class="flex justify-center items-center py-6">
        <svg width="200" height="100" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M 10 50 Q 50 10 100 50 T 190 50" fill="none" stroke="#60a5fa" stroke-width="4" class="opacity-50" stroke-dasharray="10 10" />
          <circle cx="100" cy="50" r="20" fill="#1e293b" stroke="#38bdf8" stroke-width="3" />
          <circle cx="100" cy="50" r="6" fill="#38bdf8" />
          <line x1="100" y1="20" x2="100" y2="0" stroke="#fcd34d" stroke-width="3" />
          <polygon points="95,5 105,5 100,0" fill="#fcd34d" />
          <text x="110" y="20" fill="#fcd34d" font-size="12" font-family="monospace">Observe</text>
          <text x="20" y="80" fill="#60a5fa" font-size="14" font-family="monospace">Superposition</text>
          <text x="130" y="80" fill="#cbd5e1" font-size="14" font-family="monospace">Collapse (0 or 1)</text>
          <line x1="100" y1="50" x2="190" y2="50" stroke="#cbd5e1" stroke-width="4" />
        </svg>
      </div>
      <p class="mb-4 text-gray-300 leading-relaxed">
        Measurement is a destructive process in quantum mechanics. When you observe (measure) a qubit in superposition, it irreversibly collapses into a single classical state (0 or 1). All the intricate probability waves and phases are destroyed in the process. This is why reading the result of a quantum calculation is tricky—you only get to look once per execution!
      </p>
      <div class="bg-gray-800/40 p-5 rounded-lg border border-gray-700 my-6">
        <h4 class="font-bold text-white mb-2">Z-Basis Measurement</h4>
        <p class="text-sm text-gray-300 leading-relaxed">
          Standard measurement is done in the "computational basis" (the Z-basis), which corresponds to the North and South poles of the Bloch sphere (|0⟩ and |1⟩). If you want to measure in a different basis (like the X-basis), you must rotate the qubit using quantum gates before performing the standard Z measurement.
        </p>
      </div>
      <h3 class="text-xl font-medium text-white mt-6 mb-2">The Born Rule</h3>
      <p class="mb-4 text-gray-300 leading-relaxed">
        How do we know the probability of a specific outcome? Max Born formulated the Born Rule: the probability of measuring a specific state is equal to the <em>squared magnitude</em> of its probability amplitude.
      </p>
      <div class="bg-[#161b22] p-4 rounded-md border border-gray-700 font-mono text-blue-400 my-4">
        State Vector: |ψ⟩ = α|0⟩ + β|1⟩<br/>
        Probability of measuring 0 = |α|²<br/>
        Probability of measuring 1 = |β|²<br/>
        Normalization Constraint: |α|² + |β|² = 1
      </div>
      <p class="text-sm text-gray-400 italic mt-2">
        Because the amplitudes (α and β) can be complex numbers (involving 'i'), we take their absolute magnitude squared, ensuring the resulting probabilities are real, positive numbers between 0 and 1.
      </p>
    `,
    defaultCode: `from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler

qc = QuantumCircuit(1, 1)
qc.h(0)

# The moment of measurement collapses the state!
qc.measure(0, 0)

# --- Run the circuit and get counts ---
sampler = StatevectorSampler()
job = sampler.run([qc])
result = job.result()
counts = result[0].data.c.get_counts()
print("Counts:", counts)`
  },
  'interference': {
    id: 'interference',
    title: '6. Quantum Interference',
    theory: `
      <h2 class="text-2xl font-semibold text-white mt-4 mb-2 border-b border-gray-700 pb-2">Wave Interference</h2>
      <div class="flex justify-center items-center py-6">
        <svg width="240" height="120" viewBox="0 0 240 120" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0 60 Q 30 10 60 60 T 120 60" fill="none" stroke="#4ade80" stroke-width="3" opacity="0.8" />
          <path d="M 0 60 Q 30 110 60 60 T 120 60" fill="none" stroke="#f87171" stroke-width="3" opacity="0.8" />
          <text x="10" y="20" fill="#4ade80" font-size="12">Wave 1</text>
          <text x="10" y="110" fill="#f87171" font-size="12">Wave 2</text>
          <line x1="130" y1="60" x2="150" y2="60" stroke="#fff" stroke-width="2" marker-end="url(#arrow)" />
          <path d="M 160 60 L 240 60" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4 4" />
          <text x="165" y="50" fill="#94a3b8" font-size="12">Destructive</text>
          <text x="165" y="80" fill="#94a3b8" font-size="12">Cancellation</text>
        </svg>
      </div>
      <p class="mb-4 text-gray-300 leading-relaxed">
        Just like ripples in a pond, quantum probability waves can interfere with each other. This is the secret sauce of quantum computing!
      </p>
      <ul class="list-disc list-inside text-gray-300 space-y-2 mb-4">
        <li><strong>Constructive Interference:</strong> Amplitudes with the same sign add up, increasing the probability of that outcome.</li>
        <li><strong>Destructive Interference:</strong> Amplitudes with opposite signs cancel out, reducing the probability to zero.</li>
      </ul>
      <p class="mb-4 text-gray-300 leading-relaxed">
        Applying two Hadamard gates in succession demonstrates this perfectly. The first H creates a superposition, and the second H causes interference that brings the state deterministically back to |0⟩.
      </p>
    `,
    defaultCode: `from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler

qc = QuantumCircuit(1, 1)
qc.h(0) # Step 1: Creates superposition
qc.h(0) # Step 2: Destructive interference for |1>, constructive for |0>

qc.measure([0], [0])

# --- Run the circuit and get counts ---
sampler = StatevectorSampler()
job = sampler.run([qc])
result = job.result()
counts = result[0].data.c.get_counts()
print("Counts:", counts)`
  },
  'phase_gates': {
    id: 'phase_gates',
    title: '7. Phase Gates (S & T)',
    theory: `
      <h2 class="text-2xl font-semibold text-white mt-4 mb-2 border-b border-gray-700 pb-2">Fine-Grained Rotations</h2>
      <p class="mb-4 text-gray-300 leading-relaxed">
        The Z gate rotates the quantum state by 180° (π) around the Z-axis of the Bloch sphere. But we often need smaller, more precise rotations.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div class="bg-[#161b22] p-4 rounded-lg border border-gray-700">
          <h4 class="font-bold text-teal-400 mb-2">S Gate (Phase Gate)</h4>
          <p class="text-sm text-gray-300 mb-2">Rotates by 90° (π/2). Applying S twice equals a Z gate (S² = Z).</p>
        </div>
        <div class="bg-[#161b22] p-4 rounded-lg border border-gray-700">
          <h4 class="font-bold text-cyan-400 mb-2">T Gate (π/8 Gate)</h4>
          <p class="text-sm text-gray-300 mb-2">Rotates by 45° (π/4). Applying T twice equals an S gate (T² = S).</p>
        </div>
      </div>
      <p class="mb-4 text-gray-300 leading-relaxed">
        The T gate is especially important in quantum error correction. Combined with H and CNOT gates, it allows for <em>Universal Quantum Computing</em>—meaning any quantum operation can be approximated!
      </p>
    `,
    defaultCode: `from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler

qc = QuantumCircuit(1, 1)
qc.h(0)  # Move to equator of Bloch sphere
qc.s(0)  # 90 degree phase shift around Z-axis

qc.measure([0], [0])

# --- Run the circuit and get counts ---
sampler = StatevectorSampler()
job = sampler.run([qc])
result = job.result()
counts = result[0].data.c.get_counts()
print("Counts:", counts)`
  },
  'teleportation': {
    id: 'teleportation',
    title: '8. Quantum Teleportation',
    theory: `
      <h2 class="text-2xl font-semibold text-white mt-4 mb-2 border-b border-gray-700 pb-2">Beaming Information</h2>
      <p class="mb-4 text-gray-300 leading-relaxed">
        Quantum teleportation transmits the exact quantum state (information) of a qubit from one location (Alice) to another (Bob), using shared entanglement and classical communication.
      </p>
      <div class="bg-indigo-900/20 p-4 rounded-lg border border-indigo-800/50 my-6">
        <h4 class="font-bold text-indigo-300 mb-3">The Protocol Steps:</h4>
        <ol class="list-decimal list-inside text-sm text-gray-300 space-y-2">
          <li>Create an entangled pair (Bell state) and share one qubit with Alice and one with Bob.</li>
          <li>Alice applies a CNOT and H gate to her secret qubit and her entangled qubit.</li>
          <li>Alice measures her two qubits and sends the classical results (00, 01, 10, or 11) to Bob over a standard network.</li>
          <li>Bob applies X and/or Z gates to his qubit based on Alice's message, transforming it into the exact state Alice originally had!</li>
        </ol>
      </div>
    `,
    defaultCode: `from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler

qc = QuantumCircuit(3, 3)
# q0: Alice's secret state
# q1: Alice's half of entangled pair
# q2: Bob's half of entangled pair

# 1. Entangle q1 and q2
qc.h(1)
qc.cx(1, 2)
qc.barrier()

# 2. Alice's operations
qc.cx(0, 1)
qc.h(0)
qc.barrier()

# 3 & 4. Measure and conditionally apply Bob's gates
# (Simplified: measuring all for demonstration)
qc.measure([0,1,2], [0,1,2])

# --- Run the circuit and get counts ---
sampler = StatevectorSampler()
job = sampler.run([qc])
result = job.result()
counts = result[0].data.c.get_counts()
print("Counts:", counts)`
  },
  'grover': {
    id: 'grover',
    title: "9. Grover's Algorithm",
    theory: `
      <h2 class="text-2xl font-semibold text-white mt-4 mb-2 border-b border-gray-700 pb-2">Quantum Search</h2>
      <p class="mb-4 text-gray-300 leading-relaxed">
        Imagine finding a specific name in an unsorted phonebook of N entries. A classical computer takes O(N) steps. Grover's algorithm can find it in O(√N) steps!
      </p>
      <div class="flex items-center justify-center my-6">
        <div class="bg-[#161b22] px-6 py-4 rounded-lg border border-gray-700 text-center">
          <p class="text-gray-400 text-sm mb-1">Classical Speed</p>
          <p class="text-red-400 font-mono font-bold text-xl mb-4">N / 2 tries</p>
          <div class="border-t border-gray-800 my-2"></div>
          <p class="text-gray-400 text-sm mt-4 mb-1">Quantum Speed (Grover)</p>
          <p class="text-green-400 font-mono font-bold text-xl">√N tries</p>
        </div>
      </div>
      <h3 class="text-xl font-medium text-white mt-6 mb-2">Amplitude Amplification</h3>
      <p class="mb-4 text-gray-300 leading-relaxed">
        The algorithm works by using an <strong>Oracle</strong> that flips the phase of the correct answer, and a <strong>Diffuser</strong> that performs inversion about the average. This amplifies the probability of the correct answer while shrinking the incorrect ones.
      </p>
    `,
    defaultCode: `from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler

# 2-qubit Grover search (finds state |11>)
qc = QuantumCircuit(2, 2)

# Initialization
qc.h([0,1])

# Oracle (flips phase of |11>)
qc.cz(0, 1)

# Diffuser
qc.h([0,1])
qc.z([0,1])
qc.cz(0,1)
qc.h([0,1])

qc.measure([0, 1], [0, 1])

# --- Run the circuit and get counts ---
sampler = StatevectorSampler()
job = sampler.run([qc])
result = job.result()
counts = result[0].data.c.get_counts()
print("Counts:", counts)`
  },
  'shor': {
    id: 'shor',
    title: "10. Shor's Algorithm",
    theory: `
      <h2 class="text-2xl font-semibold text-white mt-4 mb-2 border-b border-gray-700 pb-2">Breaking RSA Encryption</h2>
      <p class="mb-4 text-gray-300 leading-relaxed">
        Modern encryption (like RSA) relies on the mathematical difficulty of finding the prime factors of very large numbers. A classical computer would take billions of years to factor a 2048-bit number. Shor's algorithm, running on a sufficiently powerful quantum computer, could solve this exponentially faster—in mere hours!
      </p>
      <div class="bg-red-950/30 p-5 rounded-lg border border-red-900/50 my-6">
        <h4 class="font-bold text-red-400 mb-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          The Threat to Cybersecurity
        </h4>
        <p class="text-sm text-gray-300 leading-relaxed">
          A fault-tolerant quantum computer running Shor's algorithm could break current public-key cryptography infrastructures used for secure internet communication, banking, and data storage. This looming threat is why the NIST and researchers worldwide are actively standardizing "post-quantum cryptography" today.
        </p>
      </div>
      <h3 class="text-xl font-medium text-white mt-6 mb-2">How it works: Period Finding</h3>
      <p class="mb-4 text-gray-300 leading-relaxed">
        Shor's algorithm relies on a clever mathematical trick: turning the factoring problem into a <em>period-finding</em> problem using modular arithmetic.
      </p>
      <ol class="list-decimal list-inside text-sm text-gray-300 space-y-3 mb-6 ml-2">
        <li><strong>Classical Part:</strong> Pick a random number 'a' and define the function f(x) = a^x mod N. This function is periodic. If we can find its period (r), we can use classical GCD math to find the prime factors of N!</li>
        <li><strong>Quantum Superposition:</strong> We use a quantum register to evaluate f(x) for all possible values of x simultaneously using superposition.</li>
        <li><strong>Quantum Fourier Transform (QFT):</strong> Simply measuring the superposition won't reveal the period due to random collapse. Instead, we apply the QFT. The QFT creates massive constructive interference at the frequency corresponding to the period 'r', and destructive interference everywhere else.</li>
        <li><strong>Measurement:</strong> We measure the register to obtain a value from which the period 'r' can be extracted with high probability.</li>
      </ol>
      <p class="mb-4 text-gray-300 leading-relaxed">
        Shor's algorithm is a hybrid algorithm. The quantum computer only performs the hardest part (finding the period using QFT), while a classical computer handles the setup and the final factoring math.
      </p>
    `,
    defaultCode: `from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler

# This is a highly simplified structure demonstrating QFT setup
qc = QuantumCircuit(4, 4)

# Create superposition for Quantum Fourier Transform
qc.h([0,1,2,3])

# ... Complex Modular Exponentiation logic goes here ...

qc.measure([0,1,2,3], [0,1,2,3])

# --- Run the circuit and get counts ---
sampler = StatevectorSampler()
job = sampler.run([qc])
result = job.result()
counts = result[0].data.c.get_counts()
print("Counts:", counts)`
  },
  'construct_circuits': {
    id: 'construct_circuits',
    title: "11. IBM: Circuit Construction",
    theory: `
      <h2 class="text-2xl font-semibold text-white mt-4 mb-2 border-b border-gray-700 pb-2">Building Scalable Circuits</h2>
      <p class="mb-4 text-gray-300 leading-relaxed">
        When building advanced algorithms using the Qiskit SDK (inspired by IBM Quantum's official guides), circuits often grow complex. Organizing operations correctly is crucial for readability and transpilation.
      </p>
      <div class="bg-blue-900/20 p-5 rounded-lg border border-blue-800/50 my-6">
        <h4 class="font-bold text-blue-300 mb-3">Key Concepts</h4>
        <ul class="list-disc list-inside text-sm text-gray-300 space-y-2">
          <li><strong>Registers:</strong> Use <code class="text-blue-200">QuantumRegister</code> and <code class="text-blue-200">ClassicalRegister</code> to logically group qubits rather than addressing them globally.</li>
          <li><strong>Parameterized Circuits:</strong> Use <code class="text-blue-200">Parameter</code> objects from Qiskit to create generic templates (like ansatzes) without locking in specific angle values until execution.</li>
          <li><strong>Barriers:</strong> Use <code class="text-blue-200">qc.barrier()</code> to prevent the transpiler from mistakenly combining or altering operations across boundaries.</li>
        </ul>
      </div>
    `,
    defaultCode: `from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from qiskit.circuit import Parameter
from qiskit.primitives import StatevectorSampler

# 1. Use Registers for clean organization
qr = QuantumRegister(2, 'q_reg')
cr = ClassicalRegister(2, 'c_reg')
qc = QuantumCircuit(qr, cr)

# 2. Use a Parameter for machine learning or VQE setups
theta = Parameter('θ')
qc.h(qr[0])
qc.cx(qr[0], qr[1])

# Apply a parameterized rotation
qc.ry(theta, qr[0])

# 3. Use barriers to isolate sections
qc.barrier()
qc.measure(qr, cr)

# Bind the parameter to a concrete value before running!
bound_qc = qc.assign_parameters({theta: 3.14159/2})

# --- Run the circuit and get counts ---
sampler = StatevectorSampler()
job = sampler.run([bound_qc])
result = job.result()
counts = result[0].data.c_reg.get_counts()
print("Counts:", counts)`
  },
  'transpilation': {
    id: 'transpilation',
    title: "12. IBM: Transpilation",
    theory: `
      <h2 class="text-2xl font-semibold text-white mt-4 mb-2 border-b border-gray-700 pb-2">Optimizing for Hardware</h2>
      <p class="mb-4 text-gray-300 leading-relaxed">
        Abstract quantum circuits rarely match physical hardware constraints perfectly. <strong>Transpilation</strong> is the process of translating your abstract circuit into a physical circuit optimized for a specific quantum device.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div class="bg-[#161b22] p-4 rounded-lg border border-gray-700">
          <h4 class="font-bold text-indigo-400 mb-2">Routing & Mapping</h4>
          <p class="text-sm text-gray-300">Not all physical qubits are connected. The transpiler inserts <em>SWAP gates</em> to move quantum states so that 2-qubit operations can happen on physically adjacent qubits.</p>
        </div>
        <div class="bg-[#161b22] p-4 rounded-lg border border-gray-700">
          <h4 class="font-bold text-indigo-400 mb-2">Gate Translation</h4>
          <p class="text-sm text-gray-300">Hardware only natively supports a small set of "basis gates" (e.g. CX, RZ, SX, X). High-level gates (like H or T) are broken down into these native operations.</p>
        </div>
      </div>
      <div class="bg-gray-800/40 p-4 rounded border border-gray-700 text-sm text-gray-400">
        In Qiskit, you can set the <code>optimization_level</code> (0 to 3). Level 3 does aggressive optimization, eliminating redundant gates to reduce noise.
      </div>
    `,
    defaultCode: `from qiskit import QuantumCircuit
from qiskit.compiler import transpile
from qiskit.providers.fake_provider import GenericBackendV2

# Create an abstract circuit
qc = QuantumCircuit(3)
qc.h(0)
qc.cx(0, 2) # Often requires SWAP gates if 0 and 2 aren't connected!

print("Abstract Depth:", qc.depth())

# Simulate transpilation for a generic 5-qubit device
backend = GenericBackendV2(num_qubits=5)

# Transpile the circuit
# Note: In real life, you send this to a real backend.
transpiled_qc = transpile(qc, backend, optimization_level=3)

print("Transpiled Depth:", transpiled_qc.depth())
print("\\nThe transpiler adapted the circuit for the physical hardware layout!")`
  },
  'error_mitigation': {
    id: 'error_mitigation',
    title: "13. IBM: Error Mitigation",
    theory: `
      <h2 class="text-2xl font-semibold text-white mt-4 mb-2 border-b border-gray-700 pb-2">Fighting Quantum Noise</h2>
      <p class="mb-4 text-gray-300 leading-relaxed">
        Modern quantum computers are noisy. <strong>Error Mitigation</strong> involves techniques to extract accurate signals from noisy hardware without needing full fault-tolerant Error Correction.
      </p>
      <div class="space-y-4 my-6">
        <div class="flex items-start gap-4 bg-[#161b22] p-4 rounded-lg border border-gray-700">
          <div class="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/50 flex-shrink-0 text-red-400 font-bold">1</div>
          <div>
            <h4 class="font-bold text-white">Zero Noise Extrapolation (ZNE)</h4>
            <p class="text-sm text-gray-300 mt-1">Intentionally amplifies the noise in the circuit by folding gates, runs multiple experiments, and then extrapolates the curve backwards to mathematically estimate the "zero noise" result.</p>
          </div>
        </div>
        <div class="flex items-start gap-4 bg-[#161b22] p-4 rounded-lg border border-gray-700">
          <div class="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/50 flex-shrink-0 text-yellow-400 font-bold">2</div>
          <div>
            <h4 class="font-bold text-white">Twirled Readout Error Extinction (TREX)</h4>
            <p class="text-sm text-gray-300 mt-1">Randomizes the measurement basis using Pauli gates to transform biased measurement noise into symmetric noise, which is much easier to cancel out.</p>
          </div>
        </div>
      </div>
    `,
    defaultCode: `from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler
# In a real IBM Quantum environment, you would use IBM's EstimatorV2 
# and enable resilience_level=1 or 2 for automatic error mitigation.

qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure([0,1], [0,1])

# --- Local Simulation (No Noise) ---
sampler = StatevectorSampler()
job = sampler.run([qc])
counts = job.result()[0].data.c.get_counts()

print("Ideal Counts:", counts)
print("Error mitigation is handled transparently by IBM's server-side primitives when running on real hardware using resilience options!")`
  },
  'primitives': {
    id: 'primitives',
    title: "14. IBM: Primitives & Execution",
    theory: `
      <h2 class="text-2xl font-semibold text-white mt-4 mb-2 border-b border-gray-700 pb-2">Qiskit Primitives (V2)</h2>
      <p class="mb-4 text-gray-300 leading-relaxed">
        IBM Quantum execution relies on two core interfaces known as <strong>Primitives</strong>. They abstract away the messy details of packaging jobs and return high-level data types.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div class="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 p-5 rounded-lg border border-blue-700/50">
          <h4 class="font-bold text-blue-300 mb-2 text-lg">1. Sampler</h4>
          <p class="text-sm text-gray-300 mb-3">Calculates the probability distribution of quasi-probabilities from bitstrings.</p>
          <ul class="text-xs text-gray-400 list-disc list-inside">
            <li>Outputs: Bitstring Counts / Probabilities</li>
            <li>Use Case: Grover's, Shor's, general circuit testing</li>
          </ul>
        </div>
        <div class="bg-gradient-to-br from-fuchsia-900/40 to-purple-900/40 p-5 rounded-lg border border-fuchsia-700/50">
          <h4 class="font-bold text-fuchsia-300 mb-2 text-lg">2. Estimator</h4>
          <p class="text-sm text-gray-300 mb-3">Calculates the expectation value of quantum observables (like Pauli operators).</p>
          <ul class="text-xs text-gray-400 list-disc list-inside">
            <li>Outputs: Floating point expectation values</li>
            <li>Use Case: VQE, QAOA, quantum chemistry</li>
          </ul>
        </div>
      </div>
    `,
    defaultCode: `from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler

# We have been using StatevectorSampler in earlier chapters!
# It is the local reference implementation of the Sampler primitive.

qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)
qc.measure_all()

# Using the V2 Sampler Primitive
sampler = StatevectorSampler()

# Run the circuit (pass as an array for batch execution)
job = sampler.run([qc])
result = job.result()

# Extract DataBin and counts
pub_result = result[0]
counts = pub_result.data.meas.get_counts()

print("Counts from Sampler:", counts)`
  },
  'qkd': {
    id: 'qkd',
    title: "15. Quantum Key Distribution",
    theory: `
      <h2 class="text-2xl font-semibold text-white mt-4 mb-2 border-b border-gray-700 pb-2">Unbreakable Security</h2>
      <p class="mb-4 text-gray-300 leading-relaxed">
        Quantum Key Distribution (QKD), specifically the BB84 protocol, uses the principles of quantum mechanics to securely share a cryptographic key between two parties (Alice and Bob).
      </p>
      <div class="bg-indigo-900/20 p-5 rounded-lg border border-indigo-800/50 my-6">
        <h4 class="font-bold text-indigo-300 mb-3">Why it's secure:</h4>
        <ul class="list-disc list-inside text-sm text-gray-300 space-y-2">
          <li><strong>No-Cloning Theorem:</strong> An eavesdropper (Eve) cannot perfectly copy an unknown quantum state.</li>
          <li><strong>Observer Effect:</strong> If Eve tries to measure the qubits while they are in transit, she collapses their state. Alice and Bob can detect this disturbance!</li>
        </ul>
      </div>
    `,
    defaultCode: `from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler
import random

# Simplified BB84 single-qubit transmission
qc = QuantumCircuit(1, 1)

# Alice prepares a qubit in a random state and basis
alice_bit = random.choice([0, 1])
alice_basis = random.choice(['Z', 'X'])

if alice_bit == 1:
    qc.x(0)
if alice_basis == 'X':
    qc.h(0)

qc.barrier()

# Bob measures in a random basis
bob_basis = random.choice(['Z', 'X'])
if bob_basis == 'X':
    qc.h(0)

qc.measure(0, 0)

# Simulate
sampler = StatevectorSampler()
result = sampler.run([qc]).result()[0].data.c.get_counts()
measured_bit = int(list(result.keys())[0])

print(f"Alice sent: {alice_bit} (Basis: {alice_basis})")
print(f"Bob measured: {measured_bit} (Basis: {bob_basis})")
if alice_basis == bob_basis:
    print("Bases matched! They can use this bit for their secure key.")
else:
    print("Bases mismatched. Discard this bit.")`
  },
  'vqe': {
    id: 'vqe',
    title: "16. Variational Quantum Eigensolver (VQE)",
    theory: `
      <h2 class="text-2xl font-semibold text-white mt-4 mb-2 border-b border-gray-700 pb-2">Hybrid Quantum-Classical</h2>
      <p class="mb-4 text-gray-300 leading-relaxed">
        VQE is the flagship algorithm for near-term (NISQ) quantum computers. It finds the lowest energy state (ground state) of a molecule or physical system.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div class="bg-[#161b22] p-4 rounded-lg border border-gray-700 text-sm text-gray-300">
          <strong class="text-blue-400 block mb-2">Quantum Part</strong>
          Prepares a parameterized trial state (ansatz) and measures its energy using the Estimator primitive.
        </div>
        <div class="bg-[#161b22] p-4 rounded-lg border border-gray-700 text-sm text-gray-300">
          <strong class="text-green-400 block mb-2">Classical Part</strong>
          Takes the measured energy and uses an optimizer (like COBYLA or SPSA) to adjust the parameters to minimize the energy.
        </div>
      </div>
    `,
    defaultCode: `from qiskit import QuantumCircuit
from qiskit.circuit import Parameter
from qiskit.primitives import StatevectorSampler

# 1. Define a parameterized ansatz
theta = Parameter('θ')
qc = QuantumCircuit(1)
qc.ry(theta, 0)
qc.measure_all()

# In a full VQE, you would use an Estimator to measure 
# an Observable (Hamiltonian), and a classical optimizer 
# to update theta in a loop!

# Here, we just bind the parameter and run it once
bound_qc = qc.assign_parameters({theta: 3.14159/3})

sampler = StatevectorSampler()
counts = sampler.run([bound_qc]).result()[0].data.meas.get_counts()

print("Ansatz Output Distribution:", counts)`
  }
};

// SVG fix

// shors and grovers

// qkd and vqe
