'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, Clock, Repeat, BookOpen } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface Subject {
  id: number;
  name: string;
  color: string;
}

interface AddReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReminderAdded: () => void;
}

export default function AddReminderModal({ isOpen, onClose, onReminderAdded }: AddReminderModalProps) {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState('DAILY');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchSubjects();
      // Reset form
      setTitle('');
      setDate('');
      setTime('');
      setSubjectId(null);
      setIsRecurring(false);
      setRecurrencePattern('DAILY');
    }
  }, [isOpen]);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Failed to fetch subjects', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const reminderTime = new Date(`${date}T${time}`).toISOString();
      await api.post('/reminders', {
        title,
        reminderTime,
        subjectId,
        isRecurring,
        recurrencePattern: isRecurring ? recurrencePattern : null,
        type: 'ONCE' // Default type
      });
      toast.success('Reminder set successfully');
      onReminderAdded();
      onClose();
    } catch (error) {
      console.error('Failed to add reminder', error);
      toast.error('Failed to add reminder');
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

        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Set Reminder</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
              What do you need to remember?
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Math Homework, Physics Exam"
              className="input"
              style={{ width: '100%' }}
              autoFocus
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
                Date
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
                <Calendar size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
                Time
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="input"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                />
                <Clock size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))' }} />
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
              Subject (Optional)
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={subjectId || ''}
                onChange={(e) => setSubjectId(e.target.value ? Number(e.target.value) : null)}
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
              <BookOpen size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))', pointerEvents: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="recurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
            />
            <label htmlFor="recurring" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>Repeat this reminder</label>
          </div>

          {isRecurring && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
                Frequency
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={recurrencePattern}
                  onChange={(e) => setRecurrencePattern(e.target.value)}
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
                  <option value="DAILY" style={{ background: 'hsl(var(--card))' }}>Daily</option>
                  <option value="WEEKLY" style={{ background: 'hsl(var(--card))' }}>Weekly</option>
                </select>
                <Repeat size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'hsl(var(--muted-foreground))', pointerEvents: 'none' }} />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
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
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Setting...' : 'Set Reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
