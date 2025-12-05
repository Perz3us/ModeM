'use client';

import { useState, useEffect } from 'react';
import { Plus, Bell, Calendar, Clock, Edit2, Trash2, Repeat } from 'lucide-react';
import api from '@/services/api';
import AddReminderModal from '@/components/reminders/AddReminderModal';
import EditReminderModal from '@/components/reminders/EditReminderModal';
import DeleteReminderModal from '@/components/reminders/DeleteReminderModal';

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
  subject?: Subject;
  isRecurring: boolean;
  recurrencePattern: string | null;
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const response = await api.get('/reminders');
      setReminders(response.data);
    } catch (error) {
      console.error('Failed to fetch reminders', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setIsDeleteModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Reminders</h1>
          <p style={{ color: 'var(--text-muted)' }}>Never miss a deadline or study session.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={20} />
          New Reminder
        </button>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading reminders...</div>
      ) : reminders.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem', 
          background: 'var(--card-bg)', 
          borderRadius: '1rem',
          border: '1px solid var(--card-border)'
        }}>
          <Bell size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>No reminders yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Set a reminder to stay on track with your studies.</p>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary"
          >
            Set Reminder
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {reminders.map((reminder) => (
            <div key={reminder.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                padding: '0.75rem', 
                borderRadius: '0.5rem', 
                background: 'rgba(99, 102, 241, 0.1)',
                color: 'var(--primary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '60px'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {new Date(reminder.reminderTime).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                </span>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', lineHeight: 1 }}>
                  {new Date(reminder.reminderTime).getDate()}
                </span>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{reminder.title}</h3>
                  {reminder.subject && (
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '0.1rem 0.5rem', 
                      borderRadius: '1rem', 
                      background: reminder.subject.color + '20', 
                      color: reminder.subject.color 
                    }}>
                      {reminder.subject.name}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={14} />
                    {formatTime(reminder.reminderTime)}
                  </span>
                  {reminder.isRecurring && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Repeat size={14} />
                      {reminder.recurrencePattern?.toLowerCase()}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => handleEditClick(reminder)}
                  className="btn-icon"
                  title="Edit"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDeleteClick(reminder)}
                  className="btn-icon"
                  style={{ color: 'hsl(var(--destructive))' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'hsl(var(--destructive) / 0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddReminderModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onReminderAdded={fetchReminders} 
      />

      <EditReminderModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onReminderUpdated={fetchReminders} 
        reminder={selectedReminder}
      />

      <DeleteReminderModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onReminderDeleted={fetchReminders} 
        reminderId={selectedReminder?.id || null}
      />
    </div>
  );
}
