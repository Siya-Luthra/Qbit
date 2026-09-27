import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Play, MessageSquare, Terminal } from 'lucide-react';
import Plot from 'react-plotly.js';
import VisualBuilder from './VisualBuilder';

import { CHAPTERS } from './chapters';


function App() {
  const [activeChapter, setActiveChapter] = useState('intro');
  const [code, setCode] = useState(CHAPTERS['intro'].defaultCode);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);
  const [aiErrorHelp, setAiErrorHelp] = useState(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  
  // New States
  const [completedChapters, setCompletedChapters] = useState(['intro']);
  const [selectedFramework, setSelectedFramework] = useState('Qiskit Aer');
  const [activeTab, setActiveTab] = useState('probabilities');
  const [statevector, setStatevector] = useState(null);
  const [currentView, setCurrentView] = useState('docs'); // 'docs' or 'editor'
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleRunSimulation = async () => {
    setError(null);
    setAiErrorHelp(null);
    setIsAiThinking(false);
    try {
      const response = await fetch('http://localhost:8000/run-quantum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, engine: selectedFramework })
      });
      const data = await response.json();
      
      if (data.success) {
        const formattedData = Object.keys(data.counts).map(key => ({
          state: key,
          count: data.counts[key]
        }));
        setChartData(formattedData);
        if (data.statevector) {
           setStatevector(data.statevector);
        } else {
           setStatevector(null);
        }
        // Mark chapter as completed if simulation succeeds
        if (!completedChapters.includes(activeChapter)) {
          setCompletedChapters([...completedChapters, activeChapter]);
        }
      } else {
        setError(data.error);
        setChartData([]);
        
        // Auto-Debugging feature: Send error and code to Gemini for the UI
        setIsAiThinking(true);
        const debugPrompt = `I got this error running my quantum code:

Error: ${data.error}

Code:
${code}

Please explain what went wrong and provide the corrected code. Keep it brief.`;
        
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
        }
      }
    } catch (err) {
      setError("Failed to connect to the backend server. Make sure it is running on port 8000.");
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessages = [...chatMessages, { role: 'user', content: chatInput }];
    setChatMessages(newMessages);
    const currentInput = chatInput;
    setChatInput('');

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput })
      });
      const data = await response.json();
      setChatMessages([...newMessages, { role: 'ai', content: data.reply }]);
    } catch (err) {
      setChatMessages([...newMessages, { role: 'ai', content: 'Error connecting to backend.' }]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0d1117] text-gray-300 font-sans relative overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-[#161b22] border-b border-gray-800 flex items-center justify-between px-6 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <Terminal size={24} className="text-blue-500" />
          <span className="text-xl font-bold text-white tracking-wide">QBit</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 h-full">
          <button className="text-gray-300 hover:text-white font-medium text-sm transition-colors border-b-2 border-transparent hover:border-blue-500 h-full">Home</button>
          <button className="text-blue-400 font-medium text-sm transition-colors border-b-2 border-blue-500 h-full">Documentation</button>
          <button className="text-gray-300 hover:text-white font-medium text-sm transition-colors border-b-2 border-transparent hover:border-blue-500 h-full">Visual Builder</button>
          <button className="text-gray-300 hover:text-white font-medium text-sm transition-colors border-b-2 border-transparent hover:border-blue-500 h-full">Help & Support</button>
        </nav>
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white text-sm font-medium transition-colors">Log In</button>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20">Sign Up</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Navigation Only */}
        <div className="w-80 border-r border-gray-800 flex flex-col bg-[#161b22] z-10 shrink-0">

        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col">
          <div className="mb-4 pb-4 border-b border-gray-800">
            <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
              <span>Your Progress</span>
              <span>{Math.round((completedChapters.length / Object.keys(CHAPTERS).length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5">
              <div 
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${(completedChapters.length / Object.keys(CHAPTERS).length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Chapters</h2>
          <div className="space-y-1 flex-1">
            {Object.values(CHAPTERS).map((chap) => (
              <button
                key={chap.id}
                onClick={() => {
                  setActiveChapter(chap.id);
                  setCode(chap.defaultCode);
                  setChartData([]);
                  setError(null);
                  setCurrentView('docs'); // Go to docs on chapter switch
                }}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center justify-between ${activeChapter === chap.id ? 'bg-blue-600/10 text-blue-400 font-medium' : 'hover:bg-gray-800/50 text-gray-400'}`}
              >
                <span>{chap.title}</span>
                {completedChapters.includes(chap.id) && (
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                )}
              </button>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-800">
              <span className="block text-center text-xs font-medium text-gray-500 italic bg-gray-800/20 py-2 rounded-md border border-dashed border-gray-700">
                More chapters coming soon...
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {currentView === 'docs' ? (
          /* Documentation View */
          <div className="flex-1 p-12 overflow-y-auto bg-[#0d1117] flex flex-col items-center">
            <div className="max-w-4xl w-full">
              <h1 className="text-4xl font-extrabold text-white mb-8 tracking-tight border-b border-gray-800 pb-4">
                {CHAPTERS[activeChapter].title}
              </h1>
              
              <div 
                className="prose prose-invert prose-blue max-w-none mb-12"
                dangerouslySetInnerHTML={{ __html: CHAPTERS[activeChapter].theory }} 
              />
              
              <div className="mt-12 pt-8 border-t border-gray-800 flex justify-end">
                <button 
                  onClick={() => setCurrentView('editor')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all flex items-center gap-3 text-lg hover:shadow-blue-900/40 hover:-translate-y-1 active:translate-y-0"
                >
                  Start Coding <Play size={24} fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Editor View */
          <div className="flex-1 flex flex-col bg-[#0d1117] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-4 bg-[#161b22]">
              <button 
                onClick={() => setCurrentView('docs')}
                className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors bg-gray-800/50 hover:bg-gray-700/50 px-3 py-1.5 rounded-lg text-sm font-medium"
              >
                ← Back to Docs
              </button>
              <h2 className="text-xl font-bold text-white">{CHAPTERS[activeChapter].title} - Editor</h2>
            </div>
            
            <div className="flex-1 p-6 flex flex-col gap-6">
              <div 
                className="rounded-xl border border-gray-700 shadow-2xl bg-[#1e1e1e] flex flex-col resize-y overflow-hidden min-h-[200px]"
                style={{ height: '400px' }}
              >
                <div className="bg-[#161b22] px-4 py-3 text-xs text-gray-400 font-mono border-b border-gray-700 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                      <span className="ml-2 font-medium">quantum_script.py</span>
                    </span>
                    
                    <select 
                      value={selectedFramework}
                      onChange={(e) => setSelectedFramework(e.target.value)}
                      className="bg-[#0d1117] border border-gray-700 rounded text-gray-300 px-2 py-1 outline-none"
                    >
                      <option>Qiskit Aer</option>
                      <option>PennyLane</option>
                      <option>Cirq</option>
                    </select>
                  </div>
                  
                  <span className="text-blue-400 font-medium tracking-wide">PYTHON</span>
                </div>
                
                {CHAPTERS[activeChapter].challenge && (
                  <div className="bg-indigo-900/30 border-b border-indigo-700/50 px-4 py-3 text-indigo-300 text-sm flex items-start gap-3">
                    <span className="text-lg">🎯</span>
                    <div>
                      <span className="font-bold block mb-1">Objective:</span> 
                      {CHAPTERS[activeChapter].challenge}
                    </div>
                  </div>
                )}
                
                <div className="flex-1 py-2">
                  <Editor
                    height="100%"
                    defaultLanguage="python"
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => setCode(value)}
                    options={{ 
                      minimap: { enabled: false }, 
                      fontSize: 14,
                      padding: { top: 16 },
                      scrollBeyondLastLine: false,
                      lineNumbersMinChars: 3
                    }}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={handleRunSimulation}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-blue-900/30 active:scale-95"
                >
                  <Play size={18} fill="currentColor" /> Run Simulation
                </button>
              </div>

              {/* Results Area */}
              <div className={`${activeTab === 'dragdrop' ? 'h-[32rem]' : 'h-72'} bg-[#161b22] border border-gray-800 rounded-xl shadow-inner flex flex-col overflow-hidden transition-all duration-300 ease-in-out`}>
                <div className="flex border-b border-gray-800 bg-[#0d1117]">
                  <button 
                    onClick={() => setActiveTab('probabilities')}
                    className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${activeTab === 'probabilities' ? 'text-blue-400 border-b-2 border-blue-500 bg-[#161b22]' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Measurement Probabilities
                  </button>
                  <button 
                    onClick={() => setActiveTab('bloch')}
                    className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${activeTab === 'bloch' ? 'text-blue-400 border-b-2 border-blue-500 bg-[#161b22]' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Bloch Sphere (State)
                  </button>
                  <button 
                    onClick={() => setActiveTab('dragdrop')}
                    className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${activeTab === 'dragdrop' ? 'text-blue-400 border-b-2 border-blue-500 bg-[#161b22]' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    Drag & Drop Builder
                  </button>
                </div>
                
                <div className="flex-1 p-5 min-h-0">
                  {activeTab === 'dragdrop' ? (
                    <VisualBuilder onCodeUpdate={(newCode) => setCode(newCode)} />
                  ) : error ? (
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
                  ) : chartData.length > 0 ? (
                    activeTab === 'probabilities' ? (
                      <div className="h-full flex flex-col">
                        <div className="text-gray-400 text-sm mb-4">
                          <strong>Measurement Probabilities:</strong> This chart displays the statistical outcome of measuring your quantum circuit over many shots.
                        </div>
                        <div className="flex-1 min-h-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" vertical={false} />
                              <XAxis dataKey="state" stroke="#718096" tick={{fill: '#718096'}} axisLine={{ stroke: '#4a5568' }} />
                              <YAxis stroke="#718096" tick={{fill: '#718096'}} axisLine={{ stroke: '#4a5568' }} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #2d3748', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                                itemStyle={{ color: '#60a5fa', fontWeight: 'bold' }}
                                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                              />
                              <Bar dataKey="count" fill="url(#colorUv)" radius={[6, 6, 0, 0]}>
                                <defs>
                                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8}/>
                                  </linearGradient>
                                </defs>
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    ) : activeTab === 'bloch' ? (
                      <div className="h-full flex flex-col bg-[#0a0d12] rounded-lg p-2">
                        <div className="text-gray-400 text-sm mb-2 px-2 text-center">
                          <strong>Bloch Sphere:</strong> A geometric representation of the quantum state of a single qubit as a point on the surface of a unit sphere.
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center relative">
                          {statevector && statevector.length === 2 ? (() => {
                            const [a_real, a_imag] = statevector[0];
                            const [b_real, b_imag] = statevector[1];
                            const mag_a = Math.sqrt(a_real*a_real + a_imag*a_imag);
                            const mag_b = Math.sqrt(b_real*b_real + b_imag*b_imag);
                            const theta = 2 * Math.acos(mag_a);
                            const phase_a = Math.atan2(a_imag, a_real);
                            const phase_b = Math.atan2(b_imag, b_real);
                            const phi = phase_b - phase_a;
                            const r = 1;
                            const x = r * Math.sin(theta) * Math.cos(phi);
                            const y = r * Math.sin(theta) * Math.sin(phi);
                            const z = r * Math.cos(theta);

                            return (
                              <Plot
                                data={[
                                  { type: 'scatter3d', mode: 'lines+markers', x: [0, x], y: [0, y], z: [0, z], marker: { size: 6, color: '#ef4444' }, line: { color: '#ef4444', width: 6 } },
                                  { type: 'mesh3d', x: Array.from({length: 400}, () => Math.random() * 2 - 1), y: Array.from({length: 400}, () => Math.random() * 2 - 1), z: Array.from({length: 400}, () => Math.random() * 2 - 1), alphahull: 0, opacity: 0.1, color: '#3b82f6', hoverinfo: 'none' }
                                ]}
                                layout={{ width: 300, height: 300, margin: { l: 0, r: 0, t: 0, b: 0 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)', scene: { xaxis: { visible: false, range: [-1.2, 1.2] }, yaxis: { visible: false, range: [-1.2, 1.2] }, zaxis: { visible: false, range: [-1.2, 1.2] }, camera: { eye: { x: 1.5, y: 1.5, z: 1.2 } } } }}
                                config={{ displayModeBar: false }}
                              />
                            );
                          })() : (
                            <div className="text-center text-gray-500">
                              <p className="text-sm">Statevector not available for this execution.</p>
                              <p className="text-xs mt-2">Make sure it's a 1-qubit circuit without intermediate measurements.</p>
                            </div>
                          )}
                          <div className="absolute top-2 left-2 text-xs font-semibold bg-gray-800 px-2 py-1 rounded text-gray-300">|ψ⟩ = α|0⟩ + β|1⟩</div>
                        </div>
                      </div>
                    ) : null
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-600 text-sm italic bg-[#0d1117]/50 rounded-lg border border-dashed border-gray-800">
                      Execute code to visualize quantum states and results
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Floating Chat Button */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-full shadow-[0_0_30px_rgba(147,51,234,0.3)] flex items-center justify-center text-white transition-all z-50 hover:scale-110 active:scale-95"
      >
        <MessageSquare size={28} />
      </button>

      {/* Floating Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-28 right-8 w-96 h-[32rem] bg-[#161b22] border border-gray-700 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden ring-1 ring-white/10">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-gradient-to-r from-[#21262d] to-[#161b22]">
            <div className="flex items-center gap-3 text-base font-bold text-gray-100">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <MessageSquare size={18} className="text-purple-400" />
              </div>
              Quantum AI Tutor
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
              ✕
            </button>
          </div>
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0d1117]/80 backdrop-blur-sm">
            {chatMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center">
                  <MessageSquare size={32} className="text-purple-500/50" />
                </div>
                <div>
                  <p className="text-gray-300 font-medium mb-1">Hello! I'm your AI Tutor.</p>
                  <p className="text-gray-500 text-sm">Ask me any question about quantum computing, Qiskit, or algorithms.</p>
                </div>
              </div>
            )}
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`text-sm ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-3 rounded-2xl max-w-[90%] shadow-md ${msg.role === 'user' ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-sm' : 'bg-[#21262d] text-gray-200 border border-gray-700 rounded-bl-sm'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-700 bg-[#161b22]">
            <div className="relative">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Message AI Tutor..."
                className="w-full bg-[#0d1117] border border-gray-700 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-600"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-purple-500 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                disabled={!chatInput.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;

// added entanglement section

// added visual builder

// added ai tutor

// refactored chapters out

// added entanglement section

// added visual builder
