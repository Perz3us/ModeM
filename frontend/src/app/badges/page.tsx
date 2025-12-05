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
    <div className="container animate-fade-in">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Achievements</h1>
        <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.1rem' }}>Track your progress and earn badges.</p>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'hsl(var(--muted-foreground))' }}>Loading badges...</div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '2rem' 
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
                  opacity: earned ? 1 : 0.6,
                  borderColor: earned ? 'hsl(var(--primary) / 0.5)' : undefined,
                  background: earned ? 'hsl(var(--card) / 0.8)' : undefined,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {earned && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))'
                  }} />
                )}

                <div style={{ 
                  fontSize: '3.5rem', 
                  marginBottom: '1.5rem',
                  filter: earned ? 'none' : 'grayscale(100%) opacity(0.5)',
                  position: 'relative',
                  marginTop: '1rem'
                }}>
                  {badge.icon}
                  {!earned && (
                    <div style={{ 
                      position: 'absolute', 
                      bottom: -5, 
                      right: -5, 
                      background: 'hsl(var(--background))', 
                      borderRadius: '50%', 
                      padding: '0.35rem',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                      border: '1px solid hsl(var(--border))'
                    }}>
                      <Lock size={16} color="hsl(var(--muted-foreground))" />
                    </div>
                  )}
                </div>
                
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  {badge.name}
                </h3>
                
                <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                  {badge.description}
                </p>

                {earned ? (
                  <div style={{ 
                    marginTop: 'auto', 
                    padding: '0.35rem 1rem', 
                    borderRadius: '9999px', 
                    background: 'hsl(var(--primary) / 0.1)', 
                    color: 'hsl(var(--primary))',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    border: '1px solid hsl(var(--primary) / 0.2)'
                  }}>
                    <Award size={14} />
                    Earned {getEarnedDate(badge.name)}
                  </div>
                ) : (
                  <div style={{ 
                    marginTop: 'auto', 
                    fontSize: '0.8rem', 
                    color: 'hsl(var(--muted-foreground))',
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
