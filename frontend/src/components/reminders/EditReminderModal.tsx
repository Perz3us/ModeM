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

interface Reminder {
  id: number;
  title: string;
  reminderTime: string;
  subjectId: number | null;
  isRecurring: boolean;
  recurrencePattern: string | null;
}

interface EditReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReminderUpdated: () => void;
  reminder: Reminder | null;
}

export default function EditReminderModal({ isOpen, onClose, onReminderUpdated, reminder }: EditReminderModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState('DAILY');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && reminder) {
      fetchSubjects();
      setTitle(reminder.title);
      const reminderDate = new Date(reminder.reminderTime);
      setDate(reminderDate.toISOString().split('T')[0]);
      // Format time as HH:mm
      const hours = reminderDate.getHours().toString().padStart(2, '0');
      const minutes = reminderDate.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
      
      setSubjectId(reminder.subjectId);
      setIsRecurring(reminder.isRecurring);
      setRecurrencePattern(reminder.recurrencePattern || 'DAILY');
    }
  }, [isOpen, reminder]);

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
    if (!reminder || !title || !date || !time) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const reminderTime = new Date(`${date}T${time}`).toISOString();
      await api.patch(`/reminders/${reminder.id}`, {
        title,
        reminderTime,
        subjectId,
        isRecurring,
        recurrencePattern: isRecurring ? recurrencePattern : null,
      });
      toast.success('Reminder updated successfully');
      onReminderUpdated();
      onClose();
    } catch (error) {
      console.error('Failed to update reminder', error);
      toast.error('Failed to update reminder');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !reminder) return null;

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
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Edit Reminder</h2>
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
              id="edit-recurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
            />
            <label htmlFor="edit-recurring" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>Repeat this reminder</label>
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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
