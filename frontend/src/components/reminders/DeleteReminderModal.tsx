'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface DeleteReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReminderDeleted: () => void;
  reminderId: number | null;
}

export default function DeleteReminderModal({ isOpen, onClose, onReminderDeleted, reminderId }: DeleteReminderModalProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleDelete = async () => {
    if (!reminderId) return;

    setLoading(true);
    try {
      await api.delete(`/reminders/${reminderId}`);
      toast.success('Reminder deleted successfully');
      onReminderDeleted();
      onClose();
    } catch (error) {
      console.error('Failed to delete reminder', error);
      toast.error('Failed to delete reminder');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  if (!mounted) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-card">
        <button 
          onClick={onClose} 
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            color: 'hsl(var(--muted-foreground))',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ 
            width: '3rem', 
            height: '3rem', 
            borderRadius: '50%', 
            background: 'rgba(239, 68, 68, 0.1)', 
            color: 'var(--error)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <AlertTriangle size={24} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Delete Reminder</h2>
          <p style={{ color: 'hsl(var(--muted-foreground))' }}>
            Are you sure you want to delete this reminder? This action cannot be undone.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button 
            onClick={onClose} 
            className="btn" 
            style={{ 
              background: 'transparent', 
              border: '1px solid hsl(var(--border))',
              color: 'hsl(var(--foreground))'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleDelete} 
            className="btn" 
            style={{ background: 'var(--error)', color: 'white', border: 'none' }}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
