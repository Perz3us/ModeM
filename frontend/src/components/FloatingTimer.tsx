'use client';

import { useTimer } from '@/context/TimerContext';
import { usePathname, useRouter } from 'next/navigation';
import { Play, Pause } from 'lucide-react';

export default function FloatingTimer() {
  const { timeLeft, isActive, toggleTimer, formatTime, progress } = useTimer();
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/timer') return null;
  if (!isActive && timeLeft === 25 * 60) return null;

  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <div 
      onClick={() => router.push('/timer')}
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '2rem',
        padding: '0.5rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        zIndex: 100,
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{ position: 'relative', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="24" height="24" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="12"
            cy="12"
            r={radius}
            stroke="var(--card-border)"
            strokeWidth="2"
            fill="transparent"
          />
          <circle
            cx="12"
            cy="12"
            r={radius}
            stroke={isActive ? 'var(--success)' : 'var(--warning)'}
            strokeWidth="2"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
      </div>
      
      <span style={{ fontWeight: 'bold', fontVariantNumeric: 'tabular-nums' }}>
        {formatTime(timeLeft)}
      </span>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          toggleTimer();
        }}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--foreground)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {isActive ? <Pause size={16} /> : <Play size={16} />}
      </button>
    </div>
  );
}
