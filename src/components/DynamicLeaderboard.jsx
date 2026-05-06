import React, { useState, useMemo } from 'react';
import { Trophy, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '../context/DataContext';

const DynamicLeaderboard = () => {
  const { data } = useData();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(data.questions.length - 1);

  // Calculate scores up to the current question index, and generate history data for the chart
  const { calculateLeaderboard, historyData } = useMemo(() => {
    const history = [];
    
    // Initialize cumulative scores tracking
    const cumulativeScores = {};
    data.students.forEach(s => {
      cumulativeScores[s.id] = { score: 0, time: 0, correct: 0 };
    });

    // Build history step by step for ALL questions to keep the X-axis stable
    for (let i = 0; i < data.questions.length; i++) {
      const q = data.questions[i];
      const historyStep = { name: `Q${i + 1}` };
      
      data.students.forEach(student => {
        if (i <= currentQuestionIndex) {
          const response = data.responses.find(r => r.studentId === student.id && r.questionId === q.id);
          if (response) {
            cumulativeScores[student.id].time += response.timeMs;
            if (response.chosenOption === q.correctOption) {
              // Speed Bonus Logic: max 15 points bonus for fast answers
              const timeSeconds = Math.floor(response.timeMs / 1000);
              const speedBonus = Math.max(0, 15 - timeSeconds);
              cumulativeScores[student.id].score += (q.points + speedBonus);
              cumulativeScores[student.id].correct++;
            }
          }
          historyStep[student.name] = cumulativeScores[student.id].score;
        } else {
          // Setting future values to null prevents Recharts from resizing the domain,
          // allowing for a buttery smooth animation when the slider is dragged.
          historyStep[student.name] = null;
        }
      });
      history.push(historyStep);
    }

    const scores = data.students.map(student => ({
      ...student,
      totalScore: cumulativeScores[student.id].score,
      totalTime: (cumulativeScores[student.id].time / 1000).toFixed(1),
      correctCount: cumulativeScores[student.id].correct
    }));

    // Sort by score (desc), then by time (asc)
    scores.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      return a.totalTime - b.totalTime;
    });

    return { calculateLeaderboard: scores, historyData: history };
  }, [data, currentQuestionIndex]);

  const currentQ = data.questions[currentQuestionIndex];

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Dynamic Leaderboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>Track rankings after every question. (Includes Speed Bonus)</p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ margin: 0 }}>Timeline Selector</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>Drag to see how rankings evolved over time</p>
          </div>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 'bold' }}>
            Viewing: Question {currentQuestionIndex + 1}
          </div>
        </div>
        
        <input 
          type="range" 
          min="0" 
          max={data.questions.length - 1} 
          value={currentQuestionIndex}
          onChange={(e) => setCurrentQuestionIndex(parseInt(e.target.value))}
          style={{ width: '100%', cursor: 'pointer', height: '8px', borderRadius: '4px', appearance: 'none', background: '#e2e8f0' }}
        />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          <span>Start (Q1)</span>
          <span>End (Q{data.questions.length})</span>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Score Progression</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow)', background: 'var(--surface)' }}
                wrapperStyle={{ zIndex: 9999 }}
              />
              {data.students.map(student => (
                <Line 
                  key={student.id}
                  type="monotone" 
                  dataKey={student.name} 
                  stroke={student.color} 
                  strokeWidth={3}
                  dot={{ r: 4, fill: student.color, strokeWidth: 0 }}
                  activeDot={{ r: 8 }}
                  isAnimationActive={true}
                  animationDuration={250}
                  animationEasing="ease-out"
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem', background: 'var(--secondary)', color: 'white' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Question Context:</h3>
        <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{currentQ?.text}</p>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem' }}>
          <span style={{ color: '#94a3b8' }}>Base Points: <strong style={{ color: 'white' }}>{currentQ?.points}</strong></span>
          <span style={{ color: '#94a3b8' }}>Correct Option: <strong style={{ color: 'var(--accent)' }}>{currentQ?.correctOption}</strong></span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {calculateLeaderboard.map((student, index) => (
          <div key={student.id} className="card" style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: index === 0 ? '#fef3c7' : index === 1 ? '#f1f5f9' : index === 2 ? '#ffedd5' : 'transparent', border: index > 2 ? '2px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '1.5rem', flexShrink: 0 }}>
              {index === 0 ? <Trophy size={28} color="#d97706" /> : 
               index === 1 ? <Trophy size={24} color="#64748b" /> : 
               index === 2 ? <Trophy size={24} color="#b45309" /> : 
               <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>#{index + 1}</span>}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: student.color }}></div>
                <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-main)' }}>{student.name}</h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>{student.school}</p>
            </div>

            <div style={{ display: 'flex', gap: '3rem', textAlign: 'right' }}>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold', margin: 0 }}>Correct</p>
                <p style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>{student.correctCount} / {currentQuestionIndex + 1}</p>
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold', margin: 0 }}>Time</p>
                <p style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                  <Clock size={16} color="var(--text-muted)" /> {student.totalTime}s
                </p>
              </div>
              <div style={{ minWidth: '100px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold', margin: 0 }}>Score</p>
                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)', margin: 0, lineHeight: 1 }}>{student.totalScore}</p>
              </div>
            </div>
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '4px', background: student.color }}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicLeaderboard;
