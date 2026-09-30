import re

with open('App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add new state variables
content = content.replace(
    "const [error, setError] = useState(null);",
    "const [error, setError] = useState(null);\n  const [aiErrorHelp, setAiErrorHelp] = useState(null);\n  const [isAiThinking, setIsAiThinking] = useState(false);"
)

# 2. Update handleRunSimulation
handle_run_sim_old = """    setError(null);
    try {
      const response = await fetch('http://localhost:8000/run-quantum', {"""
handle_run_sim_new = """    setError(null);
    setAiErrorHelp(null);
    setIsAiThinking(false);
    try {
      const response = await fetch('http://localhost:8000/run-quantum', {"""
content = content.replace(handle_run_sim_old, handle_run_sim_new)

# Update the error handling in handleRunSimulation
old_error_handling = """        // Auto-Debugging feature: Send error and code to Gemini
        setChatMessages(prev => [...prev, { text: "⚠️ Analyzing your error...", sender: 'bot' }]);
        const debugPrompt = `I got this error running my quantum code:\\n\\nError: ${data.error}\\n\\nCode:\\n${code}\\n\\nPlease explain what went wrong and provide the corrected code.`;
        
        try {
          const chatRes = await fetch('http://localhost:8000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: debugPrompt })
          });
          const chatData = await chatRes.json();
          
          setChatMessages(prev => {
            // Remove the temporary analyzing message
            const newMsgs = prev.filter(msg => msg.text !== "⚠️ Analyzing your error...");
            return [...newMsgs, { text: chatData.reply, sender: 'bot' }];
          });
        } catch (chatErr) {
          setChatMessages(prev => prev.filter(msg => msg.text !== "⚠️ Analyzing your error..."));
        }"""

new_error_handling = """        // Auto-Debugging feature: Send error and code to Gemini for the UI
        setIsAiThinking(true);
        const debugPrompt = `I got this error running my quantum code:\\n\\nError: ${data.error}\\n\\nCode:\\n${code}\\n\\nPlease explain what went wrong and provide the corrected code. Keep it brief.`;
        
        try {
          const chatRes = await fetch('http://localhost:8000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: debugPrompt })
          });
          const chatData = await chatRes.json();
          setAiErrorHelp(chatData.reply);
        } catch (chatErr) {
          setAiErrorHelp("Failed to get AI assistance for this error.");
        } finally {
          setIsAiThinking(false);
        }"""
content = content.replace(old_error_handling, new_error_handling)


# 3. Update the error UI
old_error_ui = """                {error ? (
                  <div className="h-full bg-red-950/20 border border-red-900/50 rounded-lg p-4 overflow-y-auto">
                    <div className="text-red-400 text-sm font-mono whitespace-pre-wrap">{error}</div>
                  </div>
                ) : chartData.length > 0 ? ("""

new_error_ui = """                {error ? (
                  <div className="h-full bg-[#161b22] rounded-lg p-4 overflow-y-auto flex flex-col gap-4">
                    <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-4">
                      <div className="text-red-400 font-bold mb-1">Execution Error</div>
                      <div className="text-red-400 text-sm font-mono whitespace-pre-wrap">{error}</div>
                    </div>
                    {isAiThinking ? (
                      <div className="bg-blue-900/20 border border-blue-900/50 rounded-lg p-4 animate-pulse flex items-center gap-3 text-blue-400">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        AI Tutor is analyzing your error...
                      </div>
                    ) : aiErrorHelp ? (
                      <div className="bg-blue-900/10 border border-blue-800/50 rounded-lg p-4">
                        <div className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                          <span>🤖 AI Assistant Suggestion</span>
                        </div>
                        <div className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{aiErrorHelp}</div>
                      </div>
                    ) : null}
                  </div>
                ) : chartData.length > 0 ? ("""
content = content.replace(old_error_ui, new_error_ui)

# 4. Add descriptions to the tabs
# Find probabilities
old_prob_ui = """                  activeTab === 'probabilities' ? (
                    <ResponsiveContainer width="100%" height="100%">"""
new_prob_ui = """                  activeTab === 'probabilities' ? (
                    <div className="h-full flex flex-col">
                      <div className="text-gray-400 text-sm mb-4">
                        <strong>Measurement Probabilities:</strong> This chart displays the statistical outcome of measuring your quantum circuit over many shots.
                      </div>
                      <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">"""
content = content.replace(old_prob_ui, new_prob_ui)
# Add closing tags for prob
old_prob_end = """                      </BarChart>
                    </ResponsiveContainer>
                  ) : activeTab === 'bloch' ? ("""
new_prob_end = """                      </BarChart>
                    </ResponsiveContainer>
                      </div>
                    </div>
                  ) : activeTab === 'bloch' ? ("""
content = content.replace(old_prob_end, new_prob_end)

# Find Bloch sphere
old_bloch_ui = """                  ) : activeTab === 'bloch' ? (
                    <div className="h-full flex flex-col items-center justify-center relative bg-[#0a0d12] rounded-lg">"""
new_bloch_ui = """                  ) : activeTab === 'bloch' ? (
                    <div className="h-full flex flex-col bg-[#0a0d12] rounded-lg p-2">
                      <div className="text-gray-400 text-sm mb-2 px-2 text-center">
                        <strong>Bloch Sphere:</strong> A geometric representation of the quantum state of a single qubit as a point on the surface of a unit sphere.
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center relative">"""
content = content.replace(old_bloch_ui, new_bloch_ui)
old_bloch_end = """                          return <Plot data={plotData} layout={layout} config={{displayModeBar: false}} />;
                        })()
                      ) : (
                        <div className="text-gray-500 text-center px-8">
                          Bloch Sphere visualization is only available for single qubit states without measurements.
                        </div>
                      )}
                    </div>
                  ) : activeTab === 'dragdrop' ? ("""
new_bloch_end = """                          return <Plot data={plotData} layout={layout} config={{displayModeBar: false}} />;
                        })()
                      ) : (
                        <div className="text-gray-500 text-center px-8">
                          Bloch Sphere visualization is only available for single qubit states without measurements.
                        </div>
                      )}
                      </div>
                    </div>
                  ) : activeTab === 'dragdrop' ? ("""
content = content.replace(old_bloch_end, new_bloch_end)

with open('App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
