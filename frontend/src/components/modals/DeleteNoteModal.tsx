'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface Note {
  id: number;
  title: string;
}

interface DeleteNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  note: Note | null;
}

export default function DeleteNoteModal({ isOpen, onClose, onSuccess, note }: DeleteNoteModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !note) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/notes/${note.id}`);
      toast.success('Note deleted successfully');
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error('Failed to delete note', error);
      const errorMessage = (error as any).response?.data?.message || 'Failed to delete note';
      toast.error(errorMessage);
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
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1rem 0' }}>
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
          
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Delete Note?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Are you sure you want to delete "{note.title}"? This action cannot be undone.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center' }}>
            <button 
              onClick={onClose}
              className="btn"
              style={{ background: 'transparent', border: '1px solid var(--card-border)' }}
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
      </div>
    </div>
  );
}
