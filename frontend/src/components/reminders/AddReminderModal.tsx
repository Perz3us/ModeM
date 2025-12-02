'use client';

import { useState, useEffect } from 'react';
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
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState('DAILY');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);

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
      <div className="card" style={{ width: '100%', maxWidth: '500px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Set Reminder</h2>
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
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
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
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
                <Calendar size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
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
                <Clock size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Subject (Optional)
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={subjectId || ''}
                onChange={(e) => setSubjectId(e.target.value ? Number(e.target.value) : null)}
                className="input"
                style={{ width: '100%', paddingLeft: '2.5rem', appearance: 'none' }}
              >
                <option value="">No Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              <BookOpen size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
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
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Frequency
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={recurrencePattern}
                  onChange={(e) => setRecurrencePattern(e.target.value)}
                  className="input"
                  style={{ width: '100%', paddingLeft: '2.5rem', appearance: 'none' }}
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                </select>
                <Repeat size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn" style={{ background: 'transparent', border: '1px solid var(--card-border)' }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Setting...' : 'Set Reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
