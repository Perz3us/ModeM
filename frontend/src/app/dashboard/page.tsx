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
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const AddTaskModal = dynamic(() => import('@/components/modals/AddTaskModal'), {
  loading: () => <p>Loading...</p>,
});

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
    <div className="container animate-fade-in">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Welcome back, <span className="text-gradient">{user?.nickName || 'User'}</span>! 👋
        </h1>
        <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.1rem' }}>
          Here's what's happening with your studies today.
        </p>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'hsl(var(--muted-foreground))' }}>
          Loading dashboard...
        </div>
      ) : (
        <>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            {/* Stats Cards */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  padding: '1rem', 
                  borderRadius: '1rem', 
                  background: 'hsl(var(--primary) / 0.1)',
                  color: 'hsl(var(--primary))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Clock size={28} />
                </div>
                <div>
                  <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Focus Time</p>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{formatTime(data?.focusTime || 0)}</h3>
                </div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  padding: '1rem', 
                  borderRadius: '1rem', 
                  background: 'hsl(var(--secondary) / 0.1)',
                  color: 'hsl(var(--secondary))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Tasks Done</p>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{data?.tasksDone || 0}</h3>
                </div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  padding: '1rem', 
                  borderRadius: '1rem', 
                  background: 'hsl(var(--primary) / 0.1)',
                  color: 'hsl(var(--primary))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <CalendarDays size={28} />
                </div>
                <div>
                  <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Upcoming</p>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{data?.upcomingReminders.length || 0} Events</h3>
                </div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  padding: '1rem', 
                  borderRadius: '1rem', 
                  background: 'hsl(var(--accent))',
                  color: 'hsl(var(--foreground))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <TrendingUp size={28} />
                </div>
                <div>
                  <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Streak</p>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{data?.streak || 0} Days</h3>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {/* Recent Activity / Tasks */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Today's Tasks</h3>
                <button 
                  onClick={() => router.push('/tasks')}
                  className="btn btn-ghost" 
                  style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                >
                  View All
                </button>
              </div>
              
              {data?.todaysTasks.length === 0 ? (
                <div style={{ 
                  flex: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'hsl(var(--muted-foreground))',
                  fontStyle: 'italic',
                  minHeight: '150px'
                }}>
                  No tasks due today. Great job!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {data?.todaysTasks.map((task) => (
                    <div key={task.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem',
                      padding: '1rem',
                      background: 'hsl(var(--background) / 0.3)',
                      borderRadius: '0.75rem',
                      border: '1px solid hsl(var(--border) / 0.5)',
                      transition: 'transform 0.2s'
                    }}>
                      <div style={{ 
                        width: '1.25rem', 
                        height: '1.25rem', 
                        border: '2px solid hsl(var(--muted-foreground))', 
                        borderRadius: '0.35rem' 
                      }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: '500' }}>{task.title}</p>
                        <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', marginTop: '0.25rem' }}>
                          {task.subject?.name ? `${task.subject.name} • ` : ''}
                          {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '9999px', 
                        background: task.priority === 'HIGH' ? 'hsl(var(--destructive) / 0.2)' : 'hsl(var(--primary) / 0.2)', 
                        color: task.priority === 'HIGH' ? 'hsl(var(--destructive))' : 'hsl(var(--primary))',
                        fontWeight: '600',
                        border: `1px solid ${task.priority === 'HIGH' ? 'hsl(var(--destructive) / 0.3)' : 'hsl(var(--primary) / 0.3)'}`
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
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '700' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button 
                  onClick={() => setShowAddTaskModal(true)}
                  className="btn btn-primary" 
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Plus size={20} />
                  Create New Task
                </button>
                <button 
                  onClick={() => router.push('/timer')}
                  className="btn" 
                  style={{ 
                    width: '100%', 
                    background: 'hsl(var(--accent))', 
                    color: 'hsl(var(--foreground))',
                    justifyContent: 'center',
                    border: '1px solid hsl(var(--border))'
                  }}
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
