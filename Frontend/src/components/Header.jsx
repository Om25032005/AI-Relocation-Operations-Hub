import React from 'react';
import { Truck, Sparkles, Plus, LayoutDashboard, FileText } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, onOpenAddModal, totalCases, highPriorityCount }) {
  return (
    <header style={{
      background: '#0f172a',
      color: 'white',
      borderBottom: '1px solid #1e293b',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            background: 'var(--ai-gradient)',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)'
          }}>
            <Truck color="white" size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>QuickMove</span>
              <span style={{
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#a5b4fc',
                border: '1px solid rgba(165, 180, 252, 0.3)',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '99px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Sparkles size={11} /> AI OPS HUB
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
              AI-Assisted Operations Dashboard for Relocations
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#1e293b',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid #334155'
        }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 600,
              color: activeTab === 'dashboard' ? '#ffffff' : '#94a3b8',
              background: activeTab === 'dashboard' ? '#334155' : 'transparent',
              transition: 'all 0.2s ease'
            }}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </button>

          <button
            onClick={onOpenAddModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: 600,
              color: activeTab === 'add' ? '#ffffff' : '#94a3b8',
              background: activeTab === 'add' ? '#334155' : 'transparent',
              transition: 'all 0.2s ease'
            }}
          >
            <Plus size={16} />
            Add Relocation
          </button>
        </div>

        {/* Right Status Pill & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.82rem'
          }}>
            <div>
              <span style={{ color: '#94a3b8' }}>Active Cases: </span>
              <strong style={{ color: '#ffffff' }}>{totalCases}</strong>
            </div>
            <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.15)' }} />
            <div>
              <span style={{ color: '#94a3b8' }}>High Priority: </span>
              <strong style={{ color: '#f87171' }}>{highPriorityCount}</strong>
            </div>
          </div>

          <button
            onClick={onOpenAddModal}
            className="btn-primary"
            style={{
              padding: '8px 14px',
              fontSize: '0.85rem'
            }}
          >
            <Plus size={16} />
            New Case
          </button>
        </div>
      </div>
    </header>
  );
}
