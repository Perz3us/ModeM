'use client';

import { useState } from 'react';
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
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={24} />
            Delete Reminder
          </h2>
          <button 
            onClick={onClose} 
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          Are you sure you want to delete this reminder? This action cannot be undone.
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button onClick={onClose} className="btn" style={{ background: 'transparent', border: '1px solid var(--card-border)' }}>
            Cancel
          </button>
          <button 
            onClick={handleDelete} 
            className="btn" 
            style={{ background: 'var(--danger)', color: 'white', border: 'none' }}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
