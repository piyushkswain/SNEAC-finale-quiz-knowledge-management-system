import React, { useState } from 'react'
import './App.css'
import { 
  LayoutDashboard, 
  BookOpen, 
  Zap, 
  Settings as SettingsIcon, 
  HelpCircle, 
  ChevronRight,
  Plus,
  Search,
  Filter,
  BarChart3,
  Calendar,
  Activity,
  Trophy,
  Database
} from 'lucide-react'

import Dashboard from './components/Dashboard'
import DynamicLeaderboard from './components/DynamicLeaderboard'
import RoundAnalytics from './components/RoundAnalytics'
import DataManager from './components/DataManager'
import Settings from './components/Settings'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [hoveredTab, setHoveredTab] = useState(null)

  const menuItems = [
    { id: 'dashboard', label: 'Overall Analytics', icon: LayoutDashboard },
    { id: 'leaderboard', label: 'Dynamic Leaderboard', icon: Trophy },
    { id: 'roundAnalytics', label: 'Round Analytics', icon: Activity },
    { id: 'dataManager', label: 'Data Manager', icon: Database },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />
      case 'leaderboard': return <DynamicLeaderboard />
      case 'roundAnalytics': return <RoundAnalytics />
      case 'dataManager': return <DataManager />
      case 'settings': return <Settings />
      default: return (
        <div className="animate-fade">
          <h1>{menuItems.find(m => m.id === activeTab)?.label}</h1>
          <div className="card" style={{ marginTop: '2rem', textAlign: 'center', padding: '4rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>This module is currently under development.</p>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside style={{ 
        width: '80px', 
        background: 'var(--secondary)', 
        color: 'var(--sidebar-text)', 
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        position: 'fixed',
        right: 0,
        height: '100vh',
        borderLeft: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
        zIndex: 9999
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
          <img src="/logo.png" alt="Swadhyay Logo" style={{ height: '40px', objectFit: 'contain' }} />
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          {menuItems.map((item) => (
            <div 
              key={item.id} 
              style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}
              onMouseEnter={() => setHoveredTab(item.id)}
              onMouseLeave={() => setHoveredTab(null)}
            >
              <button 
                onClick={() => setActiveTab(item.id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: '0.75rem', 
                  borderRadius: '8px',
                  background: activeTab === item.id ? 'var(--primary-light)' : 'transparent',
                  color: activeTab === item.id ? 'var(--primary)' : 'var(--sidebar-text-muted)',
                  width: '100%',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <item.icon size={24} />
              </button>
              
              {/* Tooltip */}
              <div style={{
                position: 'absolute',
                right: '100%',
                top: '50%',
                transform: hoveredTab === item.id ? 'translateY(-50%) translateX(0)' : 'translateY(-50%) translateX(10px)',
                opacity: hoveredTab === item.id ? 1 : 0,
                visibility: hoveredTab === item.id ? 'visible' : 'hidden',
                transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                marginRight: '1rem',
                background: 'var(--text-main)',
                color: 'var(--surface)',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                boxShadow: 'var(--shadow)',
                pointerEvents: 'none'
              }}>
                {item.label}
                {/* Tooltip Arrow */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  right: '-4px',
                  transform: 'translateY(-50%) rotate(45deg)',
                  width: '8px',
                  height: '8px',
                  background: 'var(--text-main)'
                }} />
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ marginRight: '80px', width: 'calc(100% - 80px)' }}>
        {renderContent()}
      </main>
    </div>
  )
}

export default App
