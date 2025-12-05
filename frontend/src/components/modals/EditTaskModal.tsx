'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, Flag, BookOpen } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';



interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  priority: string;
  subject?: {
    id: number;
    name: string;
  };
}

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  task: Task | null;
}

interface Subject {
  id: number;
  name: string;
}

export default function EditTaskModal({ isOpen, onClose, onSuccess, task }: EditTaskModalProps) {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
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

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      setPriority(task.priority);
      setSubjectId(task.subject?.id || '');
    }
  }, [task]);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Failed to fetch subjects', error);
      toast.error('Failed to load subjects');
    }
  };

  if (!isOpen || !task) return null;
  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch(`/tasks/${task.id}`, {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        priority,
        subjectId: subjectId ? Number(subjectId) : undefined,
      });
      toast.success('Task updated successfully');
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error('Failed to update task', error);
      const errorMessage = (error as any).response?.data?.message || 'Failed to update task';
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
        
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Edit Task</h2>
        
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
              placeholder="What needs to be done?"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'hsl(var(--muted-foreground))' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
              placeholder="Add details..."
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'hsl(var(--muted-foreground))' }}>
                <Calendar size={14} style={{ display: 'inline', marginRight: '0.25rem' }} /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'hsl(var(--muted-foreground))' }}>
                <Flag size={14} style={{ display: 'inline', marginRight: '0.25rem' }} /> Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="input"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  appearance: 'none',
                  cursor: 'pointer',
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                  borderRadius: 'var(--radius)',
                }}
              >
                <option value="LOW" style={{ background: 'hsl(var(--card))' }}>Low</option>
                <option value="MEDIUM" style={{ background: 'hsl(var(--card))' }}>Medium</option>
                <option value="HIGH" style={{ background: 'hsl(var(--card))' }}>High</option>
              </select>
            </div>
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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
