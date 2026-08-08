import React, { useState } from 'react';
import { X, Plus, User, Phone, Mail, MapPin, Calendar, DollarSign, Home, FileText, AlertTriangle } from 'lucide-react';

export default function AddRelocationModal({ isOpen, onClose, onAddRelocation }) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [sourceCity, setSourceCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [moveDate, setMoveDate] = useState('');
  const [budget, setBudget] = useState('₹45,000 / month');
  const [propertyPreference, setPropertyPreference] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState('High');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!customerName || !phone || !sourceCity || !destinationCity || !moveDate) {
      alert("Please fill in all required fields.");
      return;
    }

    const newId = `RELO-${1000 + Math.floor(Math.random() * 8999)}`;

    const newRelocation = {
      id: newId,
      customerName,
      phone,
      email: email || `${customerName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      sourceCity,
      destinationCity,
      moveDate,
      currentStage: "Customer Registered",
      priority,
      budget: budget || "₹40,000 / month",
      propertyPreference: propertyPreference || "2 BHK Gated Community",
      notes: notes || "Initial onboarding case.",
      tasks: [
        { id: `t_${Date.now()}_1`, title: "Collect KYC & Address Proof Documents", assignedTo: "Operations Exec", dueDate: moveDate, priority: "High", completed: false },
        { id: `t_${Date.now()}_2`, title: "Schedule Initial Requirements Call", assignedTo: "Operations Exec", dueDate: moveDate, priority: "Medium", completed: false },
        { id: `t_${Date.now()}_3`, title: "Shortlist 3 Initial Properties", assignedTo: "Property Executive", dueDate: moveDate, priority: "High", completed: false }
      ],
      activities: [
        { 
          id: `a_${Date.now()}`, 
          time: new Date().toISOString().replace('T', ' ').substring(0, 16), 
          type: "system", 
          title: "Relocation Created", 
          desc: `New case registered for ${customerName} (${sourceCity} to ${destinationCity}).` 
        }
      ]
    };

    onAddRelocation(newRelocation);
    onClose();

    // Reset form
    setCustomerName('');
    setPhone('');
    setEmail('');
    setSourceCity('');
    setDestinationCity('');
    setMoveDate('');
    setPropertyPreference('');
    setNotes('');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }} className="animate-fade-in">
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '620px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
        border: '1px solid var(--border-color)'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              Add New Relocation Case
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Enter customer parameters to begin tracking relocation lifecycle
            </p>
          </div>
          <button 
            onClick={onClose}
            style={{
              color: '#64748b',
              padding: '6px',
              borderRadius: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Customer Name & Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                Customer Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Aditi Rao"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: '#f8fafc'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                Phone Number *
              </label>
              <input
                type="text"
                placeholder="e.g. +91 98765 12345"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: '#f8fafc'
                }}
              />
            </div>
          </div>

          {/* Email & Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="customer@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: '#f8fafc'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                Priority Level
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: '#f8fafc',
                  fontWeight: 600
                }}
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Route: Source City & Destination City */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                Source City *
              </label>
              <input
                type="text"
                placeholder="e.g. Bengaluru"
                value={sourceCity}
                onChange={e => setSourceCity(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: '#f8fafc'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                Destination City *
              </label>
              <input
                type="text"
                placeholder="e.g. Mumbai"
                value={destinationCity}
                onChange={e => setDestinationCity(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: '#f8fafc'
                }}
              />
            </div>
          </div>

          {/* Move Date & Budget */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                Target Move Date *
              </label>
              <input
                type="date"
                value={moveDate}
                onChange={e => setMoveDate(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: '#f8fafc'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
                Monthly Budget
              </label>
              <input
                type="text"
                placeholder="e.g. ₹45,000 / month"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: '#f8fafc'
                }}
              />
            </div>
          </div>

          {/* Property Preference */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
              Property Preference & Requirements
            </label>
            <input
              type="text"
              placeholder="e.g. 2 BHK Gated Society near Hiranandani Powai with balcony"
              value={propertyPreference}
              onChange={e => setPropertyPreference(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: '#f8fafc'
              }}
            />
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', color: '#334155' }}>
              Operational Notes / Special Instructions
            </label>
            <textarea
              rows={3}
              placeholder="Add any specific pet preferences, corporate sponsorship codes, or logistics constraints..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: '#f8fafc',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Action Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '10px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-color)'
          }}>
            <button 
              type="button" 
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>

            <button 
              type="submit"
              className="btn-primary"
            >
              <Plus size={16} /> Save Relocation Case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
