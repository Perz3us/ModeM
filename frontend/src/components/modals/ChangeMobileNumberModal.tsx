'use client';

import { useState } from 'react';
import { X, Save, Phone } from 'lucide-react';
import api from '@/services/api';

interface ChangeMobileNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMobileNumberUpdated: () => void;
  currentMobileNumber?: string;
}

export default function ChangeMobileNumberModal({ isOpen, onClose, onMobileNumberUpdated, currentMobileNumber }: ChangeMobileNumberModalProps) {
  const [mobileNumber, setMobileNumber] = useState(currentMobileNumber || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber.trim()) return;

    setIsSubmitting(true);
    try {
      await api.patch('/users/mobile-number', { mobileNumber });
      onMobileNumberUpdated();
      onClose();
    } catch (error) {
      console.error('Failed to update mobile number', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Change Mobile Number</h2>
          <button 
            onClick={onClose}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: 'var(--text-muted)' 
            }}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>New Mobile Number</label>
            <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
                <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="e.g. +94 712345678"
                className="input"
                style={{ paddingLeft: '2.5rem' }}
                autoFocus
                required
                />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button 
              type="button" 
              onClick={onClose}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
