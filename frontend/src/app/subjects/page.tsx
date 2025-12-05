'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, BookOpen, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import api from '@/services/api';
import AddSubjectModal from '@/components/modals/AddSubjectModal';
import EditSubjectModal from '@/components/modals/EditSubjectModal';
import DeleteSubjectModal from '@/components/modals/DeleteSubjectModal';
import toast from 'react-hot-toast';

interface Subject {
  id: number;
  name: string;
  _count?: {
    tasks: number;
    notes: number;
    studySessions: number;
  };
  // UI only
  color?: string;
  progress?: number;
  nextExam?: string;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  '#EC4899', // Pink
  '#8B5CF6', // Violet
  '#10B981', // Emerald
];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<Subject | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subjects');
      // Backend now returns progress and nextExam
      const fetchedSubjects = response.data.map((subject: Subject, index: number) => ({
        ...subject,
        color: COLORS[index % COLORS.length],
      }));
      setSubjects(fetchedSubjects);
    } catch (error) {
      console.error('Failed to fetch subjects', error);
      toast.error('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
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
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Subjects</h1>
          <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.1rem' }}>Manage your courses and track progress.</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={20} />
          Add Subject
        </button>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'hsl(var(--muted-foreground))' }}>Loading subjects...</div>
      ) : subjects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'hsl(var(--muted-foreground))' }}>
          <BookOpen size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p>No subjects found. Add your first subject to get started!</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          {subjects.map((subject) => (
            <div key={subject.id} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '1.5rem'
              }}>
                <div style={{ 
                  padding: '1rem', 
                  borderRadius: '1rem', 
                  background: `color-mix(in srgb, ${subject.color}, transparent 85%)`,
                  color: subject.color,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center'
                }}>
                  <BookOpen size={24} />
                </div>
                <div style={{ position: 'relative' }}>
                  <button 
                    onClick={(e) => toggleMenu(e, subject.id)}
                    style={{ 
                      background: 'transparent', 
                      border: 'none', 
                      color: 'hsl(var(--muted-foreground))', 
                      cursor: 'pointer',
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      transition: 'background 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(var(--accent))'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <MoreVertical size={20} />
                  </button>
                  
                  {openMenuId === subject.id && (
                    <div 
                      ref={menuRef}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.75rem',
                        padding: '0.5rem',
                        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
                        zIndex: 10,
                        minWidth: '160px',
                        backdropFilter: 'blur(12px)'
                      }}
                    >
                      <button 
                        onClick={() => { setEditingSubject(subject); setOpenMenuId(null); }}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.75rem', 
                          width: '100%', 
                          padding: '0.75rem 1rem', 
                          background: 'transparent', 
                          border: 'none', 
                          color: 'hsl(var(--foreground))', 
                          cursor: 'pointer', 
                          textAlign: 'left',
                          borderRadius: '0.5rem',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(var(--accent))'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <Edit2 size={16} />
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => { setDeletingSubject(subject); setOpenMenuId(null); }}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.75rem', 
                          width: '100%', 
                          padding: '0.75rem 1rem', 
                          background: 'transparent', 
                          border: 'none', 
                          color: 'hsl(var(--destructive))', 
                          cursor: 'pointer', 
                          textAlign: 'left',
                          borderRadius: '0.5rem',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'hsl(var(--destructive) / 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                {subject.name}
              </h3>
              <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                {subject.nextExam ? `Next Exam: ${subject.nextExam}` : 'No upcoming exams'}
              </p>

              <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '500' }}>
                <span>Progress</span>
                <span>{subject.progress || 0}%</span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '0.625rem', 
                background: 'hsl(var(--background))', 
                borderRadius: '9999px',
                overflow: 'hidden',
                border: '1px solid hsl(var(--border) / 0.5)'
              }}>
                <div style={{ 
                  width: `${subject.progress || 0}%`, 
                  height: '100%', 
                  background: subject.color,
                  borderRadius: '9999px',
                  transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <AddSubjectModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={fetchSubjects}
      />
      <EditSubjectModal
        isOpen={!!editingSubject}
        onClose={() => setEditingSubject(null)}
        onSuccess={fetchSubjects}
        subject={editingSubject}
      />
      <DeleteSubjectModal
        isOpen={!!deletingSubject}
        onClose={() => setDeletingSubject(null)}
        onSuccess={fetchSubjects}
        subject={deletingSubject}
      />
    </div>
  );
}
