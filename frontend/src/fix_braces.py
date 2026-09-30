import re

with open('App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = '<div className="flex-1 p-5 min-h-0">'
end_marker = 'Execute code to visualize quantum states and results\n                  </div>\n                )}\n              </div>'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker) + len(end_marker)

if start_idx != -1 and end_idx != -1:
    new_block = '''<div className="flex-1 p-5 min-h-0">
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
                            <p className="text-xs mt-2">Make sure it\'s a 1-qubit circuit without intermediate measurements.</p>
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
              </div>'''
    
    new_content = content[:start_idx] + new_block + content[end_idx:]
    with open('App.jsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Replaced successfully')
else:
    print('Failed to find markers')
