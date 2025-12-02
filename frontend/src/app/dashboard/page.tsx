'use client';

import { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  CalendarDays, 
  TrendingUp,
  Plus,
  Play
} from 'lucide-react';
import { useAuth } from '@/components/AuthWrapper';
import api from '@/services/api';
import AddTaskModal from '@/components/modals/AddTaskModal';
import { useRouter } from 'next/navigation';

interface DashboardData {
  focusTime: number;
  tasksDone: number;
  streak: number;
  todaysTasks: any[];
  upcomingReminders: any[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Welcome back, {user?.nickName || 'User'}! 👋
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Here's what's happening with your studies today.
        </p>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading dashboard...</div>
      ) : (
        <>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {/* Stats Cards */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <div style={{ 
                  padding: '0.75rem', 
                  borderRadius: '0.5rem', 
                  background: 'rgba(99, 102, 241, 0.1)',
                  color: 'var(--primary)'
                }}>
                  <Clock size={24} />
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Focus Time</p>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatTime(data?.focusTime || 0)}</h3>
                </div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <div style={{ 
                  padding: '0.75rem', 
                  borderRadius: '0.5rem', 
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: 'var(--success)'
                }}>
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Tasks Done</p>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data?.tasksDone || 0}</h3>
                </div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <div style={{ 
                  padding: '0.75rem', 
                  borderRadius: '0.5rem', 
                  background: 'rgba(236, 72, 153, 0.1)',
                  color: 'var(--secondary)'
                }}>
                  <CalendarDays size={24} />
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Upcoming</p>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data?.upcomingReminders.length || 0} Events</h3>
                </div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <div style={{ 
                  padding: '0.75rem', 
                  borderRadius: '0.5rem', 
                  background: 'rgba(245, 158, 11, 0.1)',
                  color: 'var(--warning)'
                }}>
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Streak</p>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data?.streak || 0} Days</h3>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Recent Activity / Tasks */}
            <div className="card">
              <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>Today's Tasks</h3>
              {data?.todaysTasks.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No tasks due today. Great job!</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {data?.todaysTasks.map((task) => (
                    <div key={task.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem',
                      padding: '0.75rem',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '0.5rem'
                    }}>
                      <div style={{ 
                        width: '1.25rem', 
                        height: '1.25rem', 
                        border: '2px solid var(--text-muted)', 
                        borderRadius: '0.25rem' 
                      }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: '500' }}>{task.title}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {task.subject?.name ? `${task.subject.name} • ` : ''}
                          {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '1rem', 
                        background: task.priority === 'HIGH' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)', 
                        color: task.priority === 'HIGH' ? 'var(--error)' : 'var(--primary)' 
                      }}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button 
                  onClick={() => setShowAddTaskModal(true)}
                  className="btn btn-primary" 
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Plus size={20} />
                  New Task
                </button>
                <button 
                  onClick={() => router.push('/timer')}
                  className="btn" 
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Play size={20} />
                  Start Focus Session
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <AddTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onSuccess={() => {
          fetchDashboardData();
          setShowAddTaskModal(false);
        }}
      />
    </div>
  );
}
