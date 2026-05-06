import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useData } from '../context/DataContext';

const RoundAnalytics = () => {
  const { data } = useData();
  const [selectedQuestion, setSelectedQuestion] = useState(data.questions[0].id);
  const [isOpen, setIsOpen] = useState(false);

  const currentQ = data.questions.find(q => q.id === selectedQuestion);
  
  // Calculate distribution
  const optionCounts = { 'A': 0, 'B': 0, 'C': 0, 'D': 0 };
  const studentTimes = [];

  data.responses.forEach(r => {
    if (r.questionId === selectedQuestion) {
      if (optionCounts[r.chosenOption] !== undefined) {
        optionCounts[r.chosenOption]++;
      }
      
      const student = data.students.find(s => s.id === r.studentId);
      if (student) {
        studentTimes.push({
          name: student.name,
          time: r.timeMs / 1000,
          correct: r.chosenOption === currentQ?.correctOption,
          color: student.color
        });
      }
    }
  });

  const chartData = [
    { name: 'Option A', count: optionCounts['A'], isCorrect: currentQ?.correctOption === 'A' },
    { name: 'Option B', count: optionCounts['B'], isCorrect: currentQ?.correctOption === 'B' },
    { name: 'Option C', count: optionCounts['C'], isCorrect: currentQ?.correctOption === 'C' },
    { name: 'Option D', count: optionCounts['D'], isCorrect: currentQ?.correctOption === 'D' },
  ];

  // Sort times from fastest to slowest
  studentTimes.sort((a, b) => a.time - b.time);

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Round Analytics</h1>
        <p style={{ color: 'var(--text-muted)' }}>Deep dive into student responses and answering speeds.</p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Select Question to Analyze</label>
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setIsOpen(!isOpen)}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  border: '2px solid var(--border)', 
                  fontSize: '1rem',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontWeight: '500',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <span>{currentQ ? `Round ${currentQ.round} - Q${currentQ.id.replace('q', '')}: ${currentQ.text}` : 'Select a question...'}</span>
                <svg 
                  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                  style={{ color: 'var(--text-muted)', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </div>

              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '0.5rem',
                backgroundColor: 'var(--surface)',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                zIndex: 50,
                maxHeight: isOpen ? '400px' : '0px',
                opacity: isOpen ? 1 : 0,
                overflowY: 'auto',
                overflowX: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: isOpen ? 'auto' : 'none'
              }}>
                {[1, 2, 3, 4].map(round => {
                  const roundQuestions = data.questions.filter(q => q.round === round);
                  if (roundQuestions.length === 0) return null;
                  return (
                    <div key={round}>
                      <div style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', backgroundColor: '#f8fafc' }}>
                        Round {round}
                      </div>
                      {roundQuestions.map(q => (
                        <div 
                          key={q.id}
                          onClick={() => { setSelectedQuestion(q.id); setIsOpen(false); }}
                          style={{
                            padding: '0.75rem 1rem',
                            cursor: 'pointer',
                            backgroundColor: selectedQuestion === q.id ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                            color: selectedQuestion === q.id ? 'var(--primary)' : 'var(--text-main)',
                            borderLeft: selectedQuestion === q.id ? '3px solid var(--primary)' : '3px solid transparent',
                            transition: 'background-color 0.2s ease',
                            fontSize: '0.875rem'
                          }}
                          onMouseEnter={(e) => { if(selectedQuestion !== q.id) e.currentTarget.style.backgroundColor = '#f1f5f9' }}
                          onMouseLeave={(e) => { if(selectedQuestion !== q.id) e.currentTarget.style.backgroundColor = 'transparent' }}
                        >
                          Q{q.id.replace('q', '')}: {q.text}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        
        {/* Option Distribution Chart */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Option Distribution</h3>
          {currentQ && (
            <div style={{ marginBottom: '1rem', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {currentQ.options.map(opt => (
                <div key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: '600', width: '20px' }}>{opt.charAt(0)}</span>
                  <span>{opt.substring(2)}</span>
                  {opt.charAt(0) === currentQ.correctOption && <span style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 'bold' }}>(Correct)</span>}
                </div>
              ))}
            </div>
          )}
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isCorrect ? 'var(--accent)' : '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Speed Analysis */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Answering Speed (Fastest to Slowest)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {studentTimes.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No data entered for this question yet.</p>
            ) : (
              studentTimes.map((st, index) => (
                <div key={st.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '30px', fontWeight: 'bold', color: 'var(--text-muted)' }}>#{index + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: st.color }}></div>
                        {st.name}
                      </span>
                      <span style={{ fontWeight: 'bold' }}>{st.time.toFixed(1)}s</span>
                    </div>
                    {/* Progress Bar visualization of time */}
                    <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${Math.min(100, (st.time / 10) * 100)}%`, // Assuming 10s is max for visual scale
                        background: st.correct ? 'var(--accent)' : '#ef4444' 
                      }}></div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: st.correct ? 'var(--accent)' : '#ef4444', marginTop: '0.25rem', textAlign: 'right' }}>
                      {st.correct ? 'Correct' : 'Incorrect'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default RoundAnalytics;
