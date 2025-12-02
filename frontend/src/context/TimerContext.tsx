'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/services/api';

type TimerMode = 'focus' | 'short' | 'long' | 'custom';

interface TimerContextType {
  timeLeft: number;
  isActive: boolean;
  mode: TimerMode;
  totalTime: number;
  customMinutes: number;
  toggleTimer: () => void;
  resetTimer: () => void;
  changeMode: (newMode: TimerMode) => void;
  setCustomMinutes: (minutes: number) => void;
  applyCustomTime: () => void;
  formatTime: (seconds: number) => string;
  progress: number;
  selectedSubjectId: number | null;
  setSelectedSubjectId: (id: number | null) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [customMinutes, setCustomMinutes] = useState(45);
  const [totalTime, setTotalTime] = useState(25 * 60);

  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Play alarm sound
      new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')
        .play()
        .catch((e) => console.error('Audio play failed', e));

      // Save study session
      const saveSession = async () => {
        try {
          await api.post('/study-sessions', {
            startTime: new Date(Date.now() - totalTime * 1000).toISOString(),
            duration: totalTime,
            isPomodoro: mode === 'focus',
            ...(selectedSubjectId ? { subjectId: selectedSubjectId } : {}),
          });
          // toast.success('Session recorded!'); // Need to import toast if we want this
        } catch (error) {
          console.error('Failed to save study session', error);
        }
      };
      saveSession();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, selectedSubjectId, totalTime, mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'focus') setTimeLeft(25 * 60);
    if (mode === 'short') setTimeLeft(5 * 60);
    if (mode === 'long') setTimeLeft(15 * 60);
    if (mode === 'custom') setTimeLeft(customMinutes * 60);
  };

  const changeMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    if (newMode === 'focus') {
      setTimeLeft(25 * 60);
      setTotalTime(25 * 60);
    }
    if (newMode === 'short') {
      setTimeLeft(5 * 60);
      setTotalTime(5 * 60);
    }
    if (newMode === 'long') {
      setTimeLeft(15 * 60);
      setTotalTime(15 * 60);
    }
    if (newMode === 'custom') {
      setTimeLeft(customMinutes * 60);
      setTotalTime(customMinutes * 60);
    }
  };

  const applyCustomTime = () => {
    setTimeLeft(customMinutes * 60);
    setTotalTime(customMinutes * 60);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;

  return (
    <TimerContext.Provider value={{
      timeLeft,
      isActive,
      mode,
      totalTime,
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
    }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
