'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface DeleteTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  task: { id: number; title: string } | null;
}

export default function DeleteTaskModal({ isOpen, onClose, onSuccess, task }: DeleteTaskModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !task) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/tasks/${task.id}`);
      toast.success('Task deleted successfully');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Failed to delete task', error);
      toast.error(error.response?.data?.message || 'Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

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
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '1.5rem' }}>
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Delete Task</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Are you sure you want to delete <strong>{task.title}</strong>? This action cannot be undone.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            type="button" 
            onClick={onClose}
            className="btn"
            style={{ background: 'transparent', border: '1px solid var(--card-border)' }}
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleDelete}
            className="btn"
            style={{ background: 'var(--error)', color: 'white', border: 'none' }}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Task'}
          </button>
        </div>
      </div>
    </div>
  );
}
