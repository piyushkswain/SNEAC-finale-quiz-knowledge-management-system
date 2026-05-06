import React from 'react'
import { Book, FileText, Shield, Users, Info } from 'lucide-react'

const Wiki = () => {
  const articles = [
    {
      title: 'Competition Rules 2026',
      desc: 'Official rules for school-level and regional rounds.',
      icon: Shield,
      category: 'Legal'
    },
    {
      title: 'Volunteer Onboarding',
      desc: 'How to manage school registrations and student data.',
      icon: Users,
      category: 'Operations'
    },
    {
      title: 'Question Quality Guidelines',
      desc: 'Standards for adding new questions to the KMS.',
      icon: FileText,
      category: 'Content'
    },
    {
      title: 'Event Setup Checklist',
      desc: 'Step-by-step guide for setting up the quiz venue.',
      icon: Info,
      category: 'Logistics'
    }
  ]

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '2rem' }}>
        <h1>Knowledge Wiki (SOPs)</h1>
        <p style={{ color: 'var(--text-muted)' }}>Standard Operating Procedures and guidelines for NGO staff.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {articles.map((article) => (
          <div key={article.title} className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ padding: '0.75rem', background: '#f1f5f9', borderRadius: '12px', height: 'fit-content' }}>
                <article.icon size={24} color="var(--primary)" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {article.category}
                </span>
                <h3 style={{ marginTop: '0.25rem', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{article.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{article.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '2rem', background: 'var(--secondary)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Book size={24} />
          </div>
          <div>
            <h3 style={{ color: 'white' }}>Need more help?</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Contact the NGO central coordination student for technical support.</p>
          </div>
          <button style={{ marginLeft: 'auto', background: 'white', color: 'var(--secondary)', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '600' }}>
            Open Support Ticket
          </button>
        </div>
      </div>
    </div>
  )
}

export default Wiki
