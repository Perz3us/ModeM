'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import api from '@/services/api';
import { useAuth } from '../AuthWrapper';
import toast from 'react-hot-toast';

interface ChangeNicknameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangeNicknameModal({ isOpen, onClose }: ChangeNicknameModalProps) {
  const [mounted, setMounted] = useState(false);
  const { user, refreshUser } = useAuth();
  const [newNickname, setNewNickname] = useState(user?.nickName || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen) return null;
  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch('/users/nickname', { nickName: newNickname });
      toast.success('Nickname updated successfully');
      await refreshUser();
      onClose();
    } catch (error) {
      console.error('Failed to update nickname', error);
      toast.error('Failed to update nickname');
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
        
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Change Nickname</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'hsl(var(--muted-foreground))' }}>
              New Nickname
            </label>
            <input
              type="text"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              className="input"
              required
              minLength={2}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '0.5rem', 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid hsl(var(--border))', 
                color: 'hsl(var(--foreground))' 
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
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
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
