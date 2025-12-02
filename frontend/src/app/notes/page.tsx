'use client';

'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, MoreHorizontal, Pencil, Trash2, BookOpen } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import AddNoteModal from '@/components/modals/AddNoteModal';
import EditNoteModal from '@/components/modals/EditNoteModal';
import DeleteNoteModal from '@/components/modals/DeleteNoteModal';

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  subject?: {
    id: number;
    name: string;
  };
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    fetchNotes();
  }, [search]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notes', {
        params: { search }
      });
      setNotes(response.data);
    } catch (error) {
      console.error('Failed to fetch notes', error);
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (e: React.MouseEvent, note: Note) => {
    e.stopPropagation();
    setSelectedNote(note);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, note: Note) => {
    e.stopPropagation();
    setSelectedNote(note);
    setIsDeleteModalOpen(true);
  };

  // Function to generate a consistent color based on note ID or Subject ID
  const getNoteColor = (note: Note) => {
    const colors = [
      'var(--primary)', 
      'var(--secondary)', 
      'var(--accent)', 
      'var(--success)', 
      'var(--warning)',
      '#EC4899', // Pink
      '#8B5CF6', // Violet
      '#06B6D4', // Cyan
    ];
    const index = (note.subject?.id || note.id) % colors.length;
    return colors[index];
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
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Notes</h1>
          <p style={{ color: 'var(--text-muted)' }}>Capture your ideas and study notes.</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={20} style={{ marginRight: '0.5rem' }} />
          New Note
        </button>
      </header>

      <div style={{ marginBottom: '2rem', position: 'relative' }}>
        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder="Search notes..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '1rem 1rem 1rem 3rem',
            borderRadius: '0.75rem',
            border: '1px solid var(--card-border)',
            background: 'var(--card-bg)',
            color: 'var(--foreground)',
            outline: 'none',
            fontSize: '1rem'
          }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          Loading notes...
        </div>
      ) : notes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', border: '1px dashed var(--card-border)' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No notes found.</p>
          <button 
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            Create your first note
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {notes.map((note) => (
            <div 
              key={note.id} 
              className="card" 
              onClick={() => handleEditClick({ stopPropagation: () => {} } as any, note)}
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '220px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '4px', 
                height: '100%', 
                background: getNoteColor(note) 
              }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                  {note.title}
                </h3>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button 
                    onClick={(e) => handleEditClick(e, note)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    onClick={(e) => handleDeleteClick(e, note)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                    className="hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {note.subject && (
                <div style={{ paddingLeft: '0.5rem', marginBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <BookOpen size={12} /> {note.subject.name}
                </div>
              )}
              
              <p style={{ 
                color: 'var(--text-muted)', 
                fontSize: '0.9rem', 
                lineHeight: '1.5', 
                flex: 1, 
                overflow: 'hidden',
                paddingLeft: '0.5rem',
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical'
              }}>
                {note.content}
              </p>
              
              <div style={{ 
                marginTop: 'auto', 
                fontSize: '0.75rem', 
                color: 'var(--text-muted)',
                paddingLeft: '0.5rem',
                paddingTop: '0.5rem'
              }}>
                {new Date(note.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddNoteModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchNotes}
      />

      <EditNoteModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedNote(null);
        }}
        onSuccess={fetchNotes}
        note={selectedNote}
      />

      <DeleteNoteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedNote(null);
        }}
        onSuccess={fetchNotes}
        note={selectedNote}
      />
    </div>
  );
}
