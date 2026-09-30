from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from google import genai
from qiskit.quantum_info import Statevector # Moved here
app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Quantum Prototype API is running!"}

# React ko connect karne ke liye CORS allow karna padega
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os
# AI Setup
API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_API_KEY")
client = genai.Client(api_key=API_KEY) 


class CodeRequest(BaseModel):
    code: str
    engine: str = "Qiskit Aer"

class ChatRequest(BaseModel):
    message: str

@app.post("/run-quantum")
async def run_quantum(request: CodeRequest):
    try:
        local_vars = {}
        # User ka code execute karo 
        exec(request.code, globals(), local_vars)
        
        result_data = {"success": True}
        
        if 'counts' in local_vars:
            result_data['counts'] = local_vars['counts']
        else:
            return {"success": False, "error": "No 'counts' variable found. Did you measure the qubit?"}
            
        # Extract Statevector for Bloch Sphere if Qiskit
        if request.engine == 'Qiskit Aer' and 'qc' in local_vars:
            try:
                qc_copy = local_vars['qc'].copy()
                qc_copy.remove_final_measurements()
                sv = Statevector.from_instruction(qc_copy)
                result_data['statevector'] = [[amp.real, amp.imag] for amp in sv.data]
            except Exception as e:
                pass # Statevector extraction failed, but we still have counts
                
        return result_data
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/chat")
async def chat_with_ai(request: ChatRequest):
    prompt = f"You are a Quantum Computing Tutor. Answer simply. User says: {request.message}"
    
    def generate():
        try:
            response = client.models.generate_content_stream(
                model='gemini-1.5-flash', 
                contents=prompt
            )
            for chunk in response:
                if chunk.text:
                    yield chunk.text
        except Exception as e:
            yield f"Error: {str(e)}"
            
    return StreamingResponse(generate(), media_type="text/plain")