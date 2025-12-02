'use client';

import { useState, useEffect } from 'react';
import { Award, Lock } from 'lucide-react';
import api from '@/services/api';

interface Badge {
  id: number;
  name: string;
  description: string;
  earnedAt: string;
}

const ALL_BADGES = [
  {
    name: 'First Steps',
    description: 'Completed your first study session',
    icon: '🚀',
    color: '#6366f1'
  },
  {
    name: 'Focus Master',
    description: 'Completed 10 study sessions',
    icon: '🧠',
    color: '#8b5cf6'
  },
  {
    name: 'Task Crusher',
    description: 'Completed 5 tasks',
    icon: '✅',
    color: '#10b981'
  },
  {
    name: 'Night Owl',
    description: 'Completed a study session late at night',
    icon: '🦉',
    color: '#f59e0b'
  }
];

export default function BadgesPage() {
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const response = await api.get('/badges');
      setEarnedBadges(response.data);
    } catch (error) {
      console.error('Failed to fetch badges', error);
    } finally {
      setLoading(false);
    }
  };

  const isEarned = (badgeName: string) => {
    return earnedBadges.some(b => b.name === badgeName);
  };

  const getEarnedDate = (badgeName: string) => {
    const badge = earnedBadges.find(b => b.name === badgeName);
    if (!badge) return null;
    return new Date(badge.earnedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Achievements</h1>
        <p style={{ color: 'var(--text-muted)' }}>Track your progress and earn badges.</p>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading badges...</div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {ALL_BADGES.map((badge) => {
            const earned = isEarned(badge.name);
            return (
              <div 
                key={badge.name} 
                className="card"
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textAlign: 'center',
                  opacity: earned ? 1 : 0.7,
                  border: earned ? '1px solid var(--card-border)' : '1px dashed var(--card-border)',
                  background: earned ? 'var(--card-bg)' : 'transparent'
                }}
              >
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: '1rem',
                  filter: earned ? 'none' : 'grayscale(100%)',
                  position: 'relative'
                }}>
                  {badge.icon}
                  {!earned && (
                    <div style={{ 
                      position: 'absolute', 
                      bottom: -5, 
                      right: -5, 
                      background: 'var(--bg-color)', 
                      borderRadius: '50%', 
                      padding: '0.25rem',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                      <Lock size={16} color="var(--text-muted)" />
                    </div>
                  )}
                </div>
                
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {badge.name}
                </h3>
                
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  {badge.description}
                </p>

                {earned ? (
                  <div style={{ 
                    marginTop: 'auto', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '1rem', 
                    background: 'rgba(16, 185, 129, 0.1)', 
                    color: 'var(--success)',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <Award size={14} />
                    Earned {getEarnedDate(badge.name)}
                  </div>
                ) : (
                  <div style={{ 
                    marginTop: 'auto', 
                    fontSize: '0.75rem', 
                    color: 'var(--text-muted)',
                    fontStyle: 'italic'
                  }}>
                    Locked
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
