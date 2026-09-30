import re

with open('App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

def replace_code(match):
    prefix = match.group(1)
    original_code = match.group(2)
    suffix = match.group(3)
    
    if 'StatevectorSampler' not in original_code:
        new_code = original_code.replace('from qiskit import QuantumCircuit\n', 'from qiskit import QuantumCircuit\nfrom qiskit.primitives import StatevectorSampler\n')
        
        append_str = """
# --- NEW: Run the circuit and get counts ---
sampler = StatevectorSampler()
job = sampler.run([qc])
result = job.result()
counts = result[0].data.c.get_counts()
print(\"Counts:\", counts)
"""
        new_code += append_str
        return prefix + new_code + suffix
    return match.group(0)

new_content = re.sub(r'(defaultCode:\s*`)(.*?)(`,)', replace_code, content, flags=re.DOTALL)

with open('App.jsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
