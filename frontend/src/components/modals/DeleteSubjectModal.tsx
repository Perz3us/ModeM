'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface DeleteSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  subject: { id: number; name: string } | null;
}

export default function DeleteSubjectModal({ isOpen, onClose, onSuccess, subject }: DeleteSubjectModalProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !subject) return null;
  if (!mounted) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/subjects/${subject.id}?deleteAll=true`);
      toast.success('Subject deleted successfully');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Failed to delete subject', error);
      toast.error(error.response?.data?.message || 'Failed to delete subject');
    } finally {
      setLoading(false);
    }
  };

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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Delete Subject</h2>
          <p style={{ color: 'hsl(var(--muted-foreground))' }}>
            Are you sure you want to delete <strong>{subject.name}</strong>? This action cannot be undone and will delete all associated tasks and notes.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            type="button" 
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
            type="button" 
            onClick={handleDelete}
            className="btn"
            style={{ background: 'var(--error)', color: 'white', border: 'none' }}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Subject'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
