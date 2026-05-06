import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from 'recharts';
import { Trophy, Clock, Target, AlertTriangle } from 'lucide-react';
import { useData } from '../context/DataContext';

const Dashboard = () => {
  const { data } = useData();

  // Calculations
  let totalTime = 0;
  let correctAnswers = 0;
  const questionStats = {};

  data.responses.forEach(r => {
    totalTime += r.timeMs;
    const q = data.questions.find(q => q.id === r.questionId);
    if (q) {
      const isCorrect = r.chosenOption === q.correctOption;
      if (isCorrect) correctAnswers++;

      if (!questionStats[q.id]) {
        questionStats[q.id] = { total: 0, correct: 0, round: q.round, text: q.text };
      }
      questionStats[q.id].total++;
      if (isCorrect) questionStats[q.id].correct++;
    }
  });

  const avgTimeSeconds = data.responses.length > 0 ? (totalTime / data.responses.length / 1000).toFixed(1) : 0;
  const accuracy = data.responses.length > 0 ? Math.round((correctAnswers / data.responses.length) * 100) : 0;

  // Chart: Accuracy by Question
  const accuracyData = Object.values(questionStats).map((stat, i) => ({
    name: `Q${i + 1}`,
    accuracy: Math.round((stat.correct / stat.total) * 100)
  }));

  // Find most missed question
  let mostMissed = null;
  let lowestAcc = 100;
  Object.values(questionStats).forEach(stat => {
    const acc = (stat.correct / stat.total) * 100;
    if (acc < lowestAcc) {
      lowestAcc = acc;
      mostMissed = stat;
    }
  });

  return (
    <div className="animate-fade">
      <h1 style={{ marginBottom: '1.5rem' }}>SNEAC Finale Overview</h1>
      
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 'bold' }}>FINALISTS</span>
            <Trophy size={20} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700' }}>{data.students.length}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Students competing</div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 'bold' }}>OVERALL ACCURACY</span>
            <Target size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700' }}>{accuracy}%</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Across all answered questions</div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 'bold' }}>AVG RESPONSE TIME</span>
            <Clock size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700' }}>{avgTimeSeconds}s</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Speed across all rounds</div>
        </div>
        <div className="card" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: '#991b1b', fontSize: '0.875rem', fontWeight: 'bold' }}>HARDEST QUESTION</span>
            <AlertTriangle size={20} color="#ef4444" />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#7f1d1d', lineHeight: 1.2 }}>
            {mostMissed ? `${Math.round(lowestAcc)}% Accuracy` : 'N/A'}
          </div>
          <div style={{ color: '#991b1b', fontSize: '0.75rem', marginTop: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {mostMissed ? mostMissed.text : '-'}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Accuracy Trend by Question</h3>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accuracyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow)', background: 'var(--surface)' }}
                  formatter={(value) => [`${value}%`, 'Accuracy']}
                />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="var(--primary)" 
                  strokeWidth={3}
                  dot={{ r: 6, fill: 'var(--primary)', stroke: 'white', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
