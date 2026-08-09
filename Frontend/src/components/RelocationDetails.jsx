import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  FileText, 
  Copy, 
  Check, 
  UserCheck, 
  TrendingUp, 
  Send,
  Building,
  Truck,
  ShieldCheck,
  Zap,
  ChevronDown
} from 'lucide-react';
import { STAGES } from '../data/mockData';

const API_BASE_URL = import.meta.env.DEV
  ? (import.meta.env.VITE_API_BASE_URL || '')
  : 'https://ai-relocation-operations-hub.onrender.com';

export default function RelocationDetails({ 
  relocation, 
  onBack, 
  onUpdateStage, 
  onToggleTask, 
  onAddTask, 
  onAddActivity 
}) {
  const [aiSummary, setAiSummary] = useState(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const [aiNextAction, setAiNextAction] = useState(null);
  const [isGeneratingNextAction, setIsGeneratingNextAction] = useState(false);
  const [nextActionError, setNextActionError] = useState(null);

  // New task form state
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Operations Exec');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('High');

  // New activity form state
  const [newActivityDesc, setNewActivityDesc] = useState('');

  if (!relocation) return null;

  const currentStageIndex = STAGES.indexOf(relocation.currentStage);

  const buildFallbackSummary = () => {
    const completedTasksCount = relocation.tasks.filter(t => t.completed).length;
    const totalTasksCount = relocation.tasks.length;
    const pendingCritical = relocation.tasks.filter(t => !t.completed && (t.priority === 'Critical' || t.priority === 'High'));
    let text = `[Status Report - ${relocation.customerName}]\n`;
    text += `Current Stage: ${relocation.currentStage} (${currentStageIndex + 1}/${STAGES.length})\n`;
    text += `Move Route: ${relocation.sourceCity} → ${relocation.destinationCity} (Scheduled: ${relocation.moveDate})\n`;
    text += `Task Progress: ${completedTasksCount}/${totalTasksCount} tasks completed (${Math.round((completedTasksCount / totalTasksCount) * 100)}%).\n\n`;
    text += pendingCritical.length > 0
      ? `⚠️ Key Focus: ${pendingCritical.map(t => t.title).join(', ')} require immediate follow-up prior to move date.`
      : `✅ Everything is on track. All critical prerequisites for ${relocation.currentStage} are satisfied.`;
    return text;
  };

  const buildFallbackNextAction = () => {
    const uncompletedTasks = relocation.tasks.filter(t => !t.completed);
    if (uncompletedTasks.length > 0) {
      const topTask = uncompletedTasks.find(t => t.priority === 'Critical') ||
        uncompletedTasks.find(t => t.priority === 'High') || uncompletedTasks[0];
      return {
        title: `Follow Up: ${topTask.title}`,
        assignee: topTask.assignedTo,
        dueDate: topTask.dueDate,
        priority: topTask.priority,
        rationale: `This task is assigned to ${topTask.assignedTo} and is currently marked as ${topTask.priority} priority. Completing this unlocks progression to the next stage.`,
        actionableTaskId: topTask.id
      };
    }
    const nextStage = STAGES[currentStageIndex + 1];
    return nextStage ? {
      title: `Advance Stage to '${nextStage}'`,
      assignee: 'Operations Exec',
      dueDate: 'Today',
      priority: 'High',
      rationale: `All pending tasks for ${relocation.currentStage} are complete. You can safely transition ${relocation.customerName}'s case to ${nextStage}.`,
      advanceStage: nextStage
    } : {
      title: 'Send Final Service Survey',
      assignee: 'Operations Exec',
      dueDate: 'Today',
      priority: 'Low',
      rationale: 'Relocation lifecycle is complete. Collect customer review to officially close this case file.'
    };
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    setSummaryError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ relocation })
      });
      if (!response.ok) throw new Error('AI service unavailable');
      const data = await response.json();
      setAiSummary({ timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), content: data.content });
    } catch (error) {
      setSummaryError('Live AI unavailable. Showing the rule-based summary instead.');
      setAiSummary({ timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), content: buildFallbackSummary() });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleCopySummary = () => {
    if (aiSummary) {
      navigator.clipboard.writeText(aiSummary.content);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    }
  };

  const handleSuggestNextAction = async () => {
    setIsGeneratingNextAction(true);
    setNextActionError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/next-action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ relocation })
      });
      if (!response.ok) throw new Error('AI service unavailable');
      const data = await response.json();
      setAiNextAction(data.recommendation);
    } catch (error) {
      setNextActionError('Live AI unavailable. Showing the rule-based recommendation instead.');
      setAiNextAction(buildFallbackNextAction());
    } finally {
      setIsGeneratingNextAction(false);
    }
  };

  // Submit new task
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    onAddTask(relocation.id, {
      id: 't_' + Date.now(),
      title: newTaskTitle,
      assignedTo: newTaskAssignee,
      dueDate: newTaskDueDate || relocation.moveDate,
      priority: newTaskPriority,
      completed: false
    });

    setNewTaskTitle('');
    setShowAddTaskForm(false);
  };

  // Submit activity log
  const handleCreateActivity = (e) => {
    e.preventDefault();
    if (!newActivityDesc.trim()) return;

    const timeString = new Date().toISOString().replace('T', ' ').substring(0, 16);

    onAddActivity(relocation.id, {
      id: 'a_' + Date.now(),
      time: timeString,
      type: 'system',
      title: 'Operations Note',
      desc: newActivityDesc
    });

    setNewActivityDesc('');
  };

  return (
    <div style={{ padding: '24px 0 60px' }} className="animate-fade-in">
      {/* Back Button Navigation */}
      <div style={{ marginBottom: '18px' }}>
        <button 
          onClick={onBack}
          className="btn-secondary"
          style={{ gap: '6px', fontSize: '0.88rem' }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>

      {/* 1. Customer Overview Banner Card */}
      <div className="card" style={{ marginBottom: '24px', background: '#ffffff', position: 'relative' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '18px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
                {relocation.customerName}
              </h1>
              <span className={`badge badge-${relocation.priority.toLowerCase()}`} style={{ fontSize: '0.82rem' }}>
                {relocation.priority} Priority
              </span>
              <span className="badge badge-stage" style={{ fontSize: '0.82rem' }}>
                {relocation.currentStage}
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              flexWrap: 'wrap',
              marginTop: '10px',
              fontSize: '0.88rem',
              color: 'var(--text-muted)'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Phone size={14} color="#3b82f6" /> {relocation.phone}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Mail size={14} color="#3b82f6" /> {relocation.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, color: '#0f172a' }}>
                <MapPin size={14} color="#ef4444" /> {relocation.sourceCity} → {relocation.destinationCity}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={14} color="#f59e0b" /> Target Move: <strong>{relocation.moveDate}</strong>
              </span>
            </div>
          </div>

          {/* Quick Stage Change Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Change Stage:
            </span>
            <select
              value={relocation.currentStage}
              onChange={e => onUpdateStage(relocation.id, e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: '#f8fafc',
                fontWeight: 600,
                fontSize: '0.88rem',
                color: 'var(--primary)',
                outline: 'none'
              }}
            >
              {STAGES.map(stg => (
                <option key={stg} value={stg}>{stg}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Requirements & Preferences Pill Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
          marginTop: '16px',
          fontSize: '0.85rem'
        }}>
          <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Budget: </span>
            <span style={{ fontWeight: 700, color: '#0f172a' }}>{relocation.budget}</span>
          </div>
          <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Preference: </span>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>{relocation.propertyPreference}</span>
          </div>
          <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Special Notes: </span>
            <span style={{ color: '#334155' }}>{relocation.notes}</span>
          </div>
        </div>
      </div>

      {/* 2. Timeline Card / Stepper */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
              Relocation Progress Stepper
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Stage {currentStageIndex + 1} of {STAGES.length} • {relocation.currentStage}
            </p>
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
            {Math.round(((currentStageIndex + 1) / STAGES.length) * 100)}% Lifecycle Progress
          </div>
        </div>

        {/* Stepper horizontal track */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${STAGES.length}, 1fr)`,
          gap: '8px',
          alignItems: 'center',
          overflowX: 'auto',
          paddingBottom: '10px'
        }}>
          {STAGES.map((stageName, index) => {
            const isDone = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;

            return (
              <div 
                key={stageName}
                onClick={() => onUpdateStage(relocation.id, stageName)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  textAlign: 'center',
                  minWidth: '100px'
                }}
              >
                {/* Stage Step Indicator Circle */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  marginBottom: '8px',
                  transition: 'all 0.2s ease',
                  background: isDone ? 'var(--success)' : isCurrent ? 'var(--primary)' : '#e2e8f0',
                  color: isDone || isCurrent ? '#ffffff' : '#64748b',
                  boxShadow: isCurrent ? '0 0 0 4px rgba(37, 99, 235, 0.2)' : 'none'
                }}>
                  {isDone ? <Check size={16} /> : index + 1}
                </div>

                {/* Stage Label */}
                <span style={{
                  fontSize: '0.74rem',
                  fontWeight: isCurrent ? 700 : isDone ? 600 : 500,
                  color: isCurrent ? 'var(--primary)' : isDone ? 'var(--success-text)' : 'var(--text-muted)',
                  lineHeight: 1.2
                }}>
                  {stageName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid Layout for Details Components */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '24px'
      }}>
        {/* 3. Pending Tasks Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                Pending Tasks & Checklist
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Track action items required to unblock progress
              </p>
            </div>

            <button
              onClick={() => setShowAddTaskForm(!showAddTaskForm)}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              <Plus size={14} /> Add Task
            </button>
          </div>

          {/* Add Task Collapsible Form */}
          {showAddTaskForm && (
            <form 
              onSubmit={handleCreateTask}
              style={{
                background: '#f8fafc',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                marginBottom: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <input
                type="text"
                placeholder="Task description (e.g. Schedule LPG Connection)..."
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                required
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  width: '100%'
                }}
              />
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <select
                  value={newTaskAssignee}
                  onChange={e => setNewTaskAssignee(e.target.value)}
                  style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                >
                  <option value="Operations Exec">Assigned: Operations Exec</option>
                  <option value="Customer">Assigned: Customer</option>
                  <option value="Property Partner">Assigned: Property Partner</option>
                  <option value="Logistics Team">Assigned: Logistics Team</option>
                </select>

                <select
                  value={newTaskPriority}
                  onChange={e => setNewTaskPriority(e.target.value)}
                  style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowAddTaskForm(false)}
                  style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  Save Task
                </button>
              </div>
            </form>
          )}

          {/* Task Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {relocation.tasks.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px' }}>
                No tasks created yet for this relocation.
              </p>
            ) : (
              relocation.tasks.map(task => (
                <div 
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: task.completed ? '#f8fafc' : '#ffffff',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <button
                    onClick={() => onToggleTask(relocation.id, task.id)}
                    style={{ marginTop: '2px', color: task.completed ? 'var(--success)' : '#cbd5e1' }}
                  >
                    {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  </button>

                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: task.completed ? 'var(--text-muted)' : '#0f172a',
                      textDecoration: task.completed ? 'line-through' : 'none'
                    }}>
                      {task.title}
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginTop: '4px',
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)'
                    }}>
                      <span>👤 {task.assignedTo}</span>
                      <span>📅 Due: {task.dueDate}</span>
                      <span className={`badge badge-${task.priority.toLowerCase()}`} style={{ fontSize: '0.7rem', padding: '1px 6px' }}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4. Activity Timeline Card */}
        <div className="card">
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
              Activity History & Log
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Chronological log of case updates and touchpoints
            </p>
          </div>

          {/* Quick Note Add */}
          <form onSubmit={handleCreateActivity} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Add activity note or updates..."
              value={newActivityDesc}
              onChange={e => setNewActivityDesc(e.target.value)}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem'
              }}
            />
            <button type="submit" className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
              <Send size={14} /> Log
            </button>
          </form>

          {/* Activity Feed */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            maxHeight: '320px',
            overflowY: 'auto',
            paddingRight: '4px'
          }}>
            {relocation.activities.map(act => (
              <div 
                key={act.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  borderLeft: '2px solid #e2e8f0',
                  paddingLeft: '14px',
                  position: 'relative'
                }}
              >
                <div style={{
                  position: 'absolute',
                  left: '-6px',
                  top: '0',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'var(--primary)'
                }} />

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                      {act.title}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {act.time}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '2px' }}>
                    {act.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. AI Summary Card */}
        <div className="card" style={{
          border: '1px solid #c084fc',
          background: 'linear-gradient(180deg, #ffffff 0%, #faf5ff 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#7c3aed" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#4c1d95' }}>
                AI Relocation Summary
              </h3>
            </div>

            <button 
              onClick={handleGenerateSummary}
              className="btn-ai"
              disabled={isGeneratingSummary}
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            >
              {isGeneratingSummary ? (
                <>Generating...</>
              ) : (
                <>Generate AI Summary</>
              )}
            </button>
          </div>

          <p style={{ fontSize: '0.82rem', color: '#6b21a8', marginBottom: '14px' }}>
            Generates a concise status report suitable for sharing with managers or customers.
          </p>

          {summaryError && (
            <p role="status" style={{ fontSize: '0.82rem', color: '#b45309', marginBottom: '14px' }}>
              {summaryError}
            </p>
          )}

          {aiSummary ? (
            <div style={{
              background: '#ffffff',
              border: '1px solid #e9d5ff',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              fontSize: '0.88rem',
              color: '#1e1b4b',
              whiteSpace: 'pre-line',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#7c3aed' }}>
                  Generated at {aiSummary.timestamp}
                </span>
                <button 
                  onClick={handleCopySummary}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.78rem',
                    color: '#6d28d9',
                    fontWeight: 600
                  }}
                >
                  {copiedSummary ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  {copiedSummary ? 'Copied!' : 'Copy'}
                </button>
              </div>
              {aiSummary.content}
            </div>
          ) : (
            <div style={{
              border: '1px dashed #d8b4fe',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              textAlign: 'center',
              color: '#7e22ce',
              fontSize: '0.85rem'
            }}>
              Click "Generate AI Summary" to generate real-time case status updates.
            </div>
          )}
        </div>

        {/* 6. AI Next Action Card */}
        <div className="card" style={{
          border: '1px solid #60a5fa',
          background: 'linear-gradient(180deg, #ffffff 0%, #eff6ff 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="#2563eb" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e3a8a' }}>
                AI Recommended Next Action
              </h3>
            </div>

            <button 
              onClick={handleSuggestNextAction}
              className="btn-primary"
              disabled={isGeneratingNextAction}
              style={{ padding: '6px 14px', fontSize: '0.82rem', background: '#2563eb' }}
            >
              {isGeneratingNextAction ? 'Analyzing...' : 'Suggest Next Action'}
            </button>
          </div>

          <p style={{ fontSize: '0.82rem', color: '#1e40af', marginBottom: '14px' }}>
            Analyzes stage, open tasks, move proximity, and missing prerequisites to prescribe the top priority operational action.
          </p>

          {nextActionError && (
            <p role="status" style={{ fontSize: '0.82rem', color: '#b45309', marginBottom: '14px' }}>
              {nextActionError}
            </p>
          )}

          {aiNextAction ? (
            <div style={{
              background: '#ffffff',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius-md)',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className={`badge badge-${aiNextAction.priority.toLowerCase()}`}>
                  {aiNextAction.priority} Priority
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Target: {aiNextAction.dueDate}
                </span>
              </div>

              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                {aiNextAction.title}
              </h4>

              <p style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '12px', lineHeight: 1.4 }}>
                {aiNextAction.rationale}
              </p>

              {aiNextAction.actionableTaskId && (
                <button
                  onClick={() => {
                    onToggleTask(relocation.id, aiNextAction.actionableTaskId);
                    handleSuggestNextAction();
                  }}
                  className="btn-primary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#16a34a' }}
                >
                  <CheckCircle2 size={14} /> Mark Task Complete
                </button>
              )}

              {aiNextAction.advanceStage && (
                <button
                  onClick={() => {
                    onUpdateStage(relocation.id, aiNextAction.advanceStage);
                    handleSuggestNextAction();
                  }}
                  className="btn-primary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#2563eb' }}
                >
                  Advance to {aiNextAction.advanceStage}
                </button>
              )}
            </div>
          ) : (
            <div style={{
              border: '1px dashed #93c5fd',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
              textAlign: 'center',
              color: '#1d4ed8',
              fontSize: '0.85rem'
            }}>
              Click "Suggest Next Action" to calculate the single highest-leverage task for today.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
