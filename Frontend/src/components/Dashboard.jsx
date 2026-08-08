import React, { useState, useMemo } from 'react';
import { 
  Users, 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  Search, 
  Filter, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  Clock, 
  MapPin, 
  ChevronRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { STAGES } from '../data/mockData';

export default function Dashboard({ 
  relocations, 
  onSelectRelocation, 
  onOpenAddModal 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [showAiInsights, setShowAiInsights] = useState(true);

  // Calculated Summary Stats
  const stats = useMemo(() => {
    const totalActive = relocations.length;
    const highPriority = relocations.filter(r => r.priority === 'High' || r.priority === 'Critical').length;
    
    // Upcoming move dates (next 14 days)
    const today = new Date('2026-08-07');
    const fourteenDaysFromNow = new Date('2026-08-21');
    const upcomingMoves = relocations.filter(r => {
      const moveDate = new Date(r.moveDate);
      return moveDate >= today && moveDate <= fourteenDaysFromNow;
    }).length;

    // Total pending follow-up tasks
    const pendingFollowups = relocations.reduce((acc, r) => {
      const pendingInRelo = r.tasks.filter(t => !t.completed).length;
      return acc + pendingInRelo;
    }, 0);

    return { totalActive, highPriority, upcomingMoves, pendingFollowups };
  }, [relocations]);

  // AI Insights Generation
  const aiInsights = useMemo(() => {
    const criticalCases = relocations.filter(r => r.priority === 'Critical' || r.priority === 'High');
    const casesAtRisk = relocations.filter(r => {
      const pendingCriticalTasks = r.tasks.some(t => !t.completed && (t.priority === 'Critical' || t.priority === 'High'));
      return pendingCriticalTasks;
    });

    return [
      {
        id: 'i1',
        title: "Critical Move Imminent",
        desc: `${relocations.find(r => r.id === 'RELO-1002')?.customerName || 'Ananya Verma'} is moving in 5 days with pending virtual apartment walkthrough.`,
        actionText: "View Ananya's Case",
        reloId: 'RELO-1002',
        tag: 'Critical Bottleneck',
        type: 'critical'
      },
      {
        id: 'i2',
        title: "Internet Setup Required",
        desc: `${relocations.find(r => r.id === 'RELO-1001')?.customerName || 'Rahul Sharma'} move is scheduled for Aug 15. Fiber installation requires 48hr lead time.`,
        actionText: "Check Rahul's Tasks",
        reloId: 'RELO-1001',
        tag: 'Upcoming Deadline',
        type: 'warning'
      },
      {
        id: 'i3',
        title: "Post-Move Closure Ready",
        desc: `${relocations.find(r => r.id === 'RELO-1004')?.customerName || 'Priya Nair'} has completed move setup. Final survey ready to send.`,
        actionText: "Review Feedback",
        reloId: 'RELO-1004',
        tag: 'Operational Efficiency',
        type: 'success'
      }
    ];
  }, [relocations]);

  // Filtered Relocations
  const filteredRelocations = useMemo(() => {
    return relocations.filter(r => {
      const matchesSearch = 
        r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.sourceCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.destinationCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStage = stageFilter === 'ALL' || r.currentStage === stageFilter;
      const matchesPriority = priorityFilter === 'ALL' || r.priority === priorityFilter;

      return matchesSearch && matchesStage && matchesPriority;
    });
  }, [relocations, searchTerm, stageFilter, priorityFilter]);

  return (
    <div style={{ padding: '24px 0 40px' }} className="animate-fade-in">
      {/* Welcome Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
            Operations Executive Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
            Real-time status tracking, task execution, and AI next-action recommendations.
          </p>
        </div>

        <button 
          onClick={onOpenAddModal}
          className="btn-primary"
          style={{ padding: '10px 20px', fontSize: '0.95rem' }}
        >
          <Plus size={18} /> Add New Relocation
        </button>
      </div>

      {/* Summary Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Card 1 */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '14px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Active Relocations
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              {stats.totalActive}
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'var(--critical-bg)',
            color: 'var(--critical-text)',
            padding: '14px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              High Priority Cases
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--critical-text)', lineHeight: 1.2 }}>
              {stats.highPriority}
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'var(--warning-bg)',
            color: 'var(--warning-text)',
            padding: '14px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calendar size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Moves in Next 14 Days
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              {stats.upcomingMoves}
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'var(--success-bg)',
            color: 'var(--success-text)',
            padding: '14px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Pending Follow-ups
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              {stats.pendingFollowups}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Bar / Section */}
      {showAiInsights && (
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          color: 'white',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Sparkle background element */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '180px',
            height: '180px',
            background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'var(--ai-gradient)',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={18} color="white" />
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                AI Operations Intelligence
              </h2>
              <span style={{
                background: 'rgba(255, 255, 255, 0.15)',
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: '99px',
                color: '#c084fc'
              }}>
                Real-time recommendations
              </span>
            </div>

            <button 
              onClick={() => setShowAiInsights(false)}
              style={{ color: '#94a3b8', fontSize: '0.8rem' }}
            >
              Dismiss
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '14px'
          }}>
            {aiInsights.map(insight => (
              <div 
                key={insight.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>
                      {insight.title}
                    </span>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '99px',
                      background: insight.type === 'critical' ? 'rgba(239, 68, 68, 0.25)' : insight.type === 'warning' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(16, 185, 129, 0.25)',
                      color: insight.type === 'critical' ? '#fca5a5' : insight.type === 'warning' ? '#fde68a' : '#6ee7b7'
                    }}>
                      {insight.tag}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
                    {insight.desc}
                  </p>
                </div>

                <button
                  onClick={() => onSelectRelocation(insight.reloId)}
                  style={{
                    color: '#818cf8',
                    fontSize: '0.83rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    alignSelf: 'flex-start',
                    marginTop: '4px'
                  }}
                >
                  {insight.actionText} <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Relocations Table Section Header & Filters */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          background: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
              Active Relocation Cases
            </h3>
            <span className="badge badge-stage" style={{ fontSize: '0.8rem' }}>
              {filteredRelocations.length} Cases
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            width: '100%',
            maxWidth: '680px'
          }}>
            {/* Search input */}
            <div style={{
              position: 'relative',
              flex: '1 1 220px'
            }}>
              <Search 
                size={16} 
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} 
              />
              <input
                type="text"
                placeholder="Search customer, city, or ID..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: '#f8fafc',
                  outline: 'none'
                }}
              />
            </div>

            {/* Filter by Stage */}
            <select
              value={stageFilter}
              onChange={e => setStageFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: '#f8fafc',
                color: 'var(--text-main)',
                fontWeight: 500,
                outline: 'none'
              }}
            >
              <option value="ALL">All Stages</option>
              {STAGES.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>

            {/* Filter by Priority */}
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: '#f8fafc',
                color: 'var(--text-main)',
                fontWeight: 500,
                outline: 'none'
              }}
            >
              <option value="ALL">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Customer</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Route</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Current Stage</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Priority</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Move Date</th>
                <th style={{ padding: '14px 20px', fontWeight: 600 }}>Pending Tasks</th>
                <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRelocations.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No relocations match your filters. Try clearing search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRelocations.map(relo => {
                  const pendingCount = relo.tasks.filter(t => !t.completed).length;
                  const isStageCompleted = relo.currentStage === 'Move Completed' || relo.currentStage === 'Post-Move Support';

                  return (
                    <tr 
                      key={relo.id}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Customer Name & Phone */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>
                          {relo.customerName}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {relo.id} • {relo.phone}
                        </div>
                      </td>

                      {/* Route */}
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                          <span>{relo.sourceCity}</span>
                          <ArrowRight size={14} color="#94a3b8" />
                          <span>{relo.destinationCity}</span>
                        </div>
                      </td>

                      {/* Stage Badge */}
                      <td style={{ padding: '16px 20px' }}>
                        <span className={`badge ${isStageCompleted ? 'badge-completed' : 'badge-stage'}`}>
                          {relo.currentStage}
                        </span>
                      </td>

                      {/* Priority Badge */}
                      <td style={{ padding: '16px 20px' }}>
                        <span className={`badge badge-${relo.priority.toLowerCase()}`}>
                          {relo.priority}
                        </span>
                      </td>

                      {/* Move Date */}
                      <td style={{ padding: '16px 20px', fontWeight: 500 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={14} color="#64748b" />
                          {relo.moveDate}
                        </div>
                      </td>

                      {/* Pending Tasks */}
                      <td style={{ padding: '16px 20px' }}>
                        {pendingCount > 0 ? (
                          <span style={{
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: pendingCount > 2 ? 'var(--critical-text)' : 'var(--warning-text)',
                            background: pendingCount > 2 ? 'var(--critical-bg)' : 'var(--warning-bg)',
                            padding: '3px 8px',
                            borderRadius: '6px'
                          }}>
                            {pendingCount} Pending
                          </span>
                        ) : (
                          <span style={{
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: 'var(--success-text)',
                            background: 'var(--success-bg)',
                            padding: '3px 8px',
                            borderRadius: '6px'
                          }}>
                            All Done ✓
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <button
                          onClick={() => onSelectRelocation(relo.id)}
                          className="btn-secondary"
                          style={{
                            padding: '6px 12px',
                            fontSize: '0.83rem'
                          }}
                        >
                          View Details <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
