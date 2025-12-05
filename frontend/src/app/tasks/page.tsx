'use client';

import { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Circle, Calendar, Flag, BookOpen, Pencil, Trash2, ListTodo } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import AddTaskModal from '@/components/modals/AddTaskModal';
import EditTaskModal from '@/components/modals/EditTaskModal';
import DeleteTaskModal from '@/components/modals/DeleteTaskModal';

interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  isCompleted: boolean;
  subject?: {
    id: number;
    name: string;
  };
}

export default function TasksPage() {
  const [filter, setFilter] = useState('all');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      // Optimistic update
      const updatedTasks = tasks.map(t => 
        t.id === task.id ? { ...t, isCompleted: !t.isCompleted } : t
      );
      setTasks(updatedTasks);

      await api.patch(`/tasks/${task.id}/toggle`);
    } catch (error) {
      console.error('Failed to update task status', error);
      toast.error('Failed to update task');
      // Revert on error
      fetchTasks();
    }
  };

  const handleEditClick = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.isCompleted;
    if (filter === 'completed') return task.isCompleted;
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'hsl(var(--destructive))';
      case 'MEDIUM': return 'hsl(var(--warning))';
      case 'LOW': return 'hsl(var(--success))';
      default: return 'hsl(var(--muted-foreground))';
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'hsl(var(--destructive) / 0.15)';
      case 'MEDIUM': return 'hsl(var(--warning) / 0.15)';
      case 'LOW': return 'hsl(var(--success) / 0.15)';
      default: return 'hsl(var(--muted-foreground) / 0.1)';
    }
  };

  const getPriorityBorder = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'hsl(var(--destructive) / 0.3)';
      case 'MEDIUM': return 'hsl(var(--warning) / 0.3)';
      case 'LOW': return 'hsl(var(--success) / 0.3)';
      default: return 'hsl(var(--border) / 0.5)';
    }
  };

  return (
    <div className="container animate-fade-in">
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '3rem' 
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Tasks</h1>
          <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.1rem' }}>Stay organized and get things done.</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={20} />
          New Task
        </button>
      </header>

      <div style={{ marginBottom: '2.5rem', display: 'flex', gap: '0.75rem' }}>
        {['all', 'pending', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '9999px',
              border: `1px solid ${filter === f ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
              background: filter === f ? 'hsl(var(--primary))' : 'transparent',
              color: filter === f ? 'white' : 'hsl(var(--muted-foreground))',
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontWeight: filter === f ? '600' : '500',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: filter === f ? '0 4px 12px -4px hsl(var(--primary) / 0.4)' : 'none'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'hsl(var(--muted-foreground))' }}>
          Loading tasks...
        </div>
      ) : filteredTasks.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '6rem 2rem', 
          background: 'hsl(var(--card) / 0.3)', 
          borderRadius: '1.5rem', 
          border: '1px dashed hsl(var(--border))',
          backdropFilter: 'blur(10px)'
        }}>
          <ListTodo size={48} style={{ marginBottom: '1.5rem', opacity: 0.3, color: 'hsl(var(--foreground))' }} />
          <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
            {filter === 'all' ? 'No tasks found. Start by creating one!' : `No ${filter} tasks found.`}
          </p>
          {filter === 'all' && (
            <button 
              className="btn btn-primary"
              onClick={() => setIsAddModalOpen(true)}
            >
              Create your first task
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredTasks.map((task) => (
            <div key={task.id} className="card" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1.25rem',
              padding: '1.25rem',
              opacity: task.isCompleted ? 0.6 : 1,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              borderColor: task.isCompleted ? 'hsl(var(--border) / 0.5)' : 'hsl(var(--border))',
              background: task.isCompleted ? 'hsl(var(--card) / 0.4)' : 'hsl(var(--card) / 0.6)'
            }}>
              <button 
                onClick={() => handleToggleComplete(task)}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: task.isCompleted ? 'hsl(var(--success))' : 'hsl(var(--muted-foreground))',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'transform 0.2s',
                  transform: task.isCompleted ? 'scale(1.1)' : 'scale(1)'
                }}
              >
                {task.isCompleted ? <CheckCircle2 size={26} fill="hsl(var(--success) / 0.2)" /> : <Circle size={26} />}
              </button>
              
              <div style={{ flex: 1 }}>
                <h4 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: '600', 
                  textDecoration: task.isCompleted ? 'line-through' : 'none',
                  marginBottom: '0.35rem',
                  color: task.isCompleted ? 'hsl(var(--muted-foreground))' : 'hsl(var(--foreground))',
                  transition: 'color 0.2s'
                }}>
                  {task.title}
                </h4>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))', flexWrap: 'wrap', alignItems: 'center' }}>
                  {task.subject && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <BookOpen size={14} /> {task.subject.name}
                    </span>
                  )}
                  {task.subject && task.dueDate && <span style={{ opacity: 0.3 }}>|</span>}
                  {task.dueDate && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={14} /> {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  padding: '0.35rem 0.85rem', 
                  borderRadius: '9999px', 
                  fontSize: '0.75rem',
                  background: getPriorityBg(task.priority),
                  color: getPriorityColor(task.priority),
                  border: `1px solid ${getPriorityBorder(task.priority)}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontWeight: '700',
                  letterSpacing: '0.02em'
                }}>
                  <Flag size={12} fill="currentColor" />
                  {task.priority}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEditClick(task)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'hsl(var(--muted-foreground))',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'background 0.2s'
                    }}
                    title="Edit Task"
                    onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(var(--accent))'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(task)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'hsl(var(--destructive))',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'background 0.2s'
                    }}
                    title="Delete Task"
                    onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(var(--destructive) / 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddTaskModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchTasks}
      />

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        }}
        onSuccess={fetchTasks}
        task={selectedTask}
      />

      <DeleteTaskModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTask(null);
        }}
        onSuccess={fetchTasks}
        task={selectedTask}
      />
    </div>
  );
}
