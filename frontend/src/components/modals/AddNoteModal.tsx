'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, BookOpen } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Subject {
  id: number;
  name: string;
}

export default function AddNoteModal({ isOpen, onClose, onSuccess }: AddNoteModalProps) {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subjectId, setSubjectId] = useState<number | ''>('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchSubjects();
    }
  }, [isOpen]);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Failed to fetch subjects', error);
      toast.error('Failed to load subjects');
    }
  };

  if (!isOpen) return null;
  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/notes', {
        title,
        content,
        subjectId: subjectId ? Number(subjectId) : undefined,
      });
      toast.success('Note created successfully');
      setTitle('');
      setContent('');
      setSubjectId('');
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error('Failed to create note', error);
      const errorMessage = (error as any).response?.data?.message || 'Failed to create note';
      toast.error(errorMessage);
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
        
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>New Note</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'hsl(var(--muted-foreground))' }}>
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              required
              placeholder="Note title..."
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'hsl(var(--muted-foreground))' }}>
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input"
              placeholder="Write your note here..."
              rows={6}
              style={{ resize: 'vertical' }}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'hsl(var(--muted-foreground))' }}>
              <BookOpen size={14} style={{ display: 'inline', marginRight: '0.25rem' }} /> Subject
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value ? Number(e.target.value) : '')}
              className="input"
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                appearance: 'none',
                cursor: 'pointer',
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--foreground))',
                borderRadius: 'var(--radius)',
              }}
            >
              <option value="" style={{ color: 'hsl(var(--muted-foreground))' }}>No Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id} style={{ background: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}>
                  {subject.name}
                </option>
              ))}
            </select>
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
              {loading ? 'Creating...' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
