import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import RelocationDetails from './components/RelocationDetails';
import AddRelocationModal from './components/AddRelocationModal';
import { INITIAL_RELOCATIONS } from './data/mockData';

export default function App() {
  const [relocations, setRelocations] = useState(INITIAL_RELOCATIONS);
  const [selectedReloId, setSelectedReloId] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Selected Relocation Object
  const selectedReloc = relocations.find(r => r.id === selectedReloId) || null;

  // Handlers for state updates
  const handleUpdateStage = (reloId, newStage) => {
    setRelocations(prev => prev.map(r => {
      if (r.id === reloId) {
        const timeString = new Date().toISOString().replace('T', ' ').substring(0, 16);
        return {
          ...r,
          currentStage: newStage,
          activities: [
            {
              id: `a_${Date.now()}`,
              time: timeString,
              type: 'system',
              title: 'Stage Updated',
              desc: `Stage advanced to '${newStage}'`
            },
            ...r.activities
          ]
        };
      }
      return r;
    }));
  };

  const handleToggleTask = (reloId, taskId) => {
    setRelocations(prev => prev.map(r => {
      if (r.id === reloId) {
        return {
          ...r,
          tasks: r.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
        };
      }
      return r;
    }));
  };

  const handleAddTask = (reloId, newTask) => {
    setRelocations(prev => prev.map(r => {
      if (r.id === reloId) {
        return {
          ...r,
          tasks: [newTask, ...r.tasks]
        };
      }
      return r;
    }));
  };

  const handleAddActivity = (reloId, newActivity) => {
    setRelocations(prev => prev.map(r => {
      if (r.id === reloId) {
        return {
          ...r,
          activities: [newActivity, ...r.activities]
        };
      }
      return r;
    }));
  };

  const handleAddRelocation = (newRelo) => {
    setRelocations(prev => [newRelo, ...prev]);
    setSelectedReloId(newRelo.id);
    setActiveTab('dashboard');
  };

  const highPriorityCount = relocations.filter(r => r.priority === 'High' || r.priority === 'Critical').length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)' }}>
      {/* Top Application Header */}
      <Header 
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'dashboard') setSelectedReloId(null);
        }}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        totalCases={relocations.length}
        highPriorityCount={highPriorityCount}
      />

      {/* Main Container Workspace */}
      <main className="container">
        {selectedReloc ? (
          <RelocationDetails 
            relocation={selectedReloc}
            onBack={() => setSelectedReloId(null)}
            onUpdateStage={handleUpdateStage}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onAddActivity={handleAddActivity}
          />
        ) : (
          <Dashboard 
            relocations={relocations}
            onSelectRelocation={(id) => setSelectedReloId(id)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}
      </main>

      {/* Add Relocation Modal */}
      <AddRelocationModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddRelocation={handleAddRelocation}
      />
    </div>
  );
}
