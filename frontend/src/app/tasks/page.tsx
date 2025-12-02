'use client';

import { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Circle, Calendar, Flag, BookOpen, Pencil, Trash2 } from 'lucide-react';
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
      case 'HIGH': return 'var(--error)';
      case 'MEDIUM': return 'var(--warning)';
      case 'LOW': return 'var(--success)';
      default: return 'var(--text-muted)';
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'rgba(239, 68, 68, 0.1)';
      case 'MEDIUM': return 'rgba(245, 158, 11, 0.1)';
      case 'LOW': return 'rgba(16, 185, 129, 0.1)';
      default: return 'rgba(255, 255, 255, 0.05)';
    }
  };

  return (
    <div className="container">
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem' 
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Tasks</h1>
          <p style={{ color: 'var(--text-muted)' }}>Stay organized and get things done.</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={20} style={{ marginRight: '0.5rem' }} />
          New Task
        </button>
      </header>

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        {['all', 'pending', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '2rem',
              border: '1px solid var(--card-border)',
              background: filter === f ? 'var(--primary)' : 'transparent',
              color: filter === f ? 'white' : 'var(--text-muted)',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          Loading tasks...
        </div>
      ) : filteredTasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', border: '1px dashed var(--card-border)' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No tasks found.</p>
          <button 
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            Create your first task
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredTasks.map((task) => (
            <div key={task.id} className="card" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              padding: '1rem',
              opacity: task.isCompleted ? 0.6 : 1,
              transition: 'opacity 0.2s'
            }}>
              <button 
                onClick={() => handleToggleComplete(task)}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: task.isCompleted ? 'var(--success)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {task.isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </button>
              
              <div style={{ flex: 1 }}>
                <h4 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: '500', 
                  textDecoration: task.isCompleted ? 'line-through' : 'none',
                  marginBottom: '0.25rem',
                  color: 'var(--foreground)'
                }}>
                  {task.title}
                </h4>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                  {task.subject && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <BookOpen size={14} /> {task.subject.name}
                    </span>
                  )}
                  {task.dueDate && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} /> {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '1rem', 
                  fontSize: '0.75rem',
                  background: getPriorityBg(task.priority),
                  color: getPriorityColor(task.priority),
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontWeight: '500'
                }}>
                  <Flag size={12} />
                  {task.priority}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleEditClick(task)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      borderRadius: '0.25rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Edit Task"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(task)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--error)',
                      cursor: 'pointer',
                      padding: '0.5rem',
                      borderRadius: '0.25rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Delete Task"
                  >
                    <Trash2 size={16} />
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
