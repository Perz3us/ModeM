'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, BookOpen } from 'lucide-react';
import { useTimer } from '@/context/TimerContext';
import api from '@/services/api';

interface Subject {
  id: number;
  name: string;
  color: string;
}

export default function TimerPage() {
  const { 
    timeLeft, 
    isActive, 
    mode, 
    customMinutes, 
    toggleTimer, 
    resetTimer, 
    changeMode, 
    setCustomMinutes, 
    applyCustomTime, 
    formatTime, 
    progress,
    selectedSubjectId,
    setSelectedSubjectId
  } = useTimer();

  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.get('/subjects');
        setSubjects(response.data);
      } catch (error) {
        console.error('Failed to fetch subjects', error);
      }
    };
    fetchSubjects();
  }, []);

  const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0) {
      setCustomMinutes(val);
    }
  };

  return (
    <div className="container" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '80vh'
    }}>
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button 
          onClick={() => changeMode('focus')}
          className={`btn ${mode === 'focus' ? 'btn-primary' : ''}`}
          style={{ background: mode !== 'focus' ? 'var(--card-bg)' : undefined }}
        >
          <Brain size={18} style={{ marginRight: '0.5rem' }} />
          Focus
        </button>
        <button 
          onClick={() => changeMode('short')}
          className={`btn ${mode === 'short' ? 'btn-primary' : ''}`}
          style={{ background: mode !== 'short' ? 'var(--card-bg)' : undefined }}
        >
          <Coffee size={18} style={{ marginRight: '0.5rem' }} />
          Short Break
        </button>
        <button 
          onClick={() => changeMode('long')}
          className={`btn ${mode === 'long' ? 'btn-primary' : ''}`}
          style={{ background: mode !== 'long' ? 'var(--card-bg)' : undefined }}
        >
          <Coffee size={18} style={{ marginRight: '0.5rem' }} />
          Long Break
        </button>
        <button 
          onClick={() => changeMode('custom')}
          className={`btn ${mode === 'custom' ? 'btn-primary' : ''}`}
          style={{ background: mode !== 'custom' ? 'var(--card-bg)' : undefined }}
        >
          <Brain size={18} style={{ marginRight: '0.5rem' }} />
          Custom
        </button>
      </div>

      {/* Subject Selector */}
      <div style={{ marginBottom: '2rem', width: '300px' }}>
        <div style={{ position: 'relative' }}>
          <select
            value={selectedSubjectId || ''}
            onChange={(e) => setSelectedSubjectId(e.target.value ? Number(e.target.value) : null)}
            className="input"
            style={{ 
              width: '100%', 
              paddingLeft: '2.5rem',
              appearance: 'none',
              cursor: 'pointer'
            }}
            disabled={isActive}
          >
            <option value="">No Subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          <BookOpen 
            size={18} 
            style={{ 
              position: 'absolute', 
              left: '0.75rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none'
            }} 
          />
        </div>
      </div>

      <div style={{ 
        position: 'relative', 
        width: '300px', 
        height: '300px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '3rem'
      }}>
        {/* Circular Progress SVG */}
        <svg width="300" height="300" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="150"
            cy="150"
            r="140"
            stroke="var(--card-border)"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="150"
            cy="150"
            r="140"
            stroke="var(--primary)"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 140}
            strokeDashoffset={2 * Math.PI * 140 * (1 - progress / 100)}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        
        <div style={{ position: 'absolute', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {mode === 'custom' && !isActive ? (
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
              <input
                type="number"
                value={customMinutes}
                onChange={handleCustomTimeChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    applyCustomTime();
                  }
                }}
                autoFocus
                style={{
                  fontSize: '4rem',
                  fontWeight: 'bold',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '2px solid var(--primary)',
                  color: 'var(--foreground)',
                  width: '120px',
                  textAlign: 'center',
                  outline: 'none',
                  fontVariantNumeric: 'tabular-nums',
                  padding: 0
                }}
              />
              <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>min</span>
            </div>
          ) : (
            <div style={{ fontSize: '4rem', fontWeight: 'bold', fontVariantNumeric: 'tabular-nums' }}>
              {formatTime(timeLeft)}
            </div>
          )}
          
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {isActive ? 'Stay focused!' : mode === 'custom' ? 'Press Enter to set' : 'Ready to start?'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <button 
          onClick={toggleTimer}
          className="btn btn-primary"
          style={{ width: '120px', height: '50px', fontSize: '1.1rem' }}
        >
          {isActive ? <Pause size={24} /> : <Play size={24} />}
          <span style={{ marginLeft: '0.5rem' }}>{isActive ? 'Pause' : 'Start'}</span>
        </button>
        <button 
          onClick={resetTimer}
          className="btn"
          style={{ width: '50px', height: '50px', background: 'var(--card-bg)', padding: 0 }}
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
}
