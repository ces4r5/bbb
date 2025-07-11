import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react-native';
import { useStorage } from '@/hooks/useStorage';

interface PomodoroTimerProps {
  independent?: boolean;
  onTimeUpdate: (minutes: number) => void;
  goalSubject?: string;
}

export function PomodoroTimer({ independent = false, onTimeUpdate, goalSubject }: PomodoroTimerProps) {
  const { data: settings } = useStorage('settings', {
    pomodoroSettings: {
      workTime: 25,
      shortBreak: 5,
      longBreak: 15,
      longBreakInterval: 4,
      autoStart: false,
      soundEnabled: true
    }
  });

  const [timeLeft, setTimeLeft] = useState(settings.pomodoroSettings.workTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [totalStudyTime, setTotalStudyTime] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const initialTimeRef = useRef(settings.pomodoroSettings.workTime * 60);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          if (newTime === 0) {
            handleTimerComplete();
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    // Reset timer when settings change
    if (!isRunning) {
      const newTime = settings.pomodoroSettings.workTime * 60;
      setTimeLeft(newTime);
      initialTimeRef.current = newTime;
    }
  }, [settings.pomodoroSettings.workTime, isRunning]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (!isBreak) {
      // Work session completed
      const studyMinutes = settings.pomodoroSettings.workTime;
      setTotalStudyTime(prev => prev + studyMinutes);
      onTimeUpdate(studyMinutes);
      setCompletedPomodoros(prev => prev + 1);
      
      // Determine break type
      const isLongBreak = (completedPomodoros + 1) % settings.pomodoroSettings.longBreakInterval === 0;
      const breakTime = isLongBreak ? settings.pomodoroSettings.longBreak : settings.pomodoroSettings.shortBreak;
      
      Alert.alert(
        'Pomodoro Completo!',
        `Tempo para uma pausa ${isLongBreak ? 'longa' : 'curta'} de ${breakTime} minutos`,
        [
          { text: 'Pular Pausa', onPress: () => startNewPomodoro() },
          { text: 'Iniciar Pausa', onPress: () => startBreak(breakTime) }
        ]
      );
    } else {
      // Break completed
      Alert.alert(
        'Pausa Completa!',
        'Hora de voltar ao trabalho!',
        [
          { text: 'OK', onPress: () => startNewPomodoro() }
        ]
      );
    }
  };

  const startBreak = (breakTime: number) => {
    setIsBreak(true);
    setTimeLeft(breakTime * 60);
    initialTimeRef.current = breakTime * 60;
    if (settings.pomodoroSettings.autoStart) {
      setIsRunning(true);
    }
  };

  const startNewPomodoro = () => {
    setIsBreak(false);
    const workTime = settings.pomodoroSettings.workTime * 60;
    setTimeLeft(workTime);
    initialTimeRef.current = workTime;
    if (settings.pomodoroSettings.autoStart) {
      setIsRunning(true);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    const workTime = settings.pomodoroSettings.workTime * 60;
    setTimeLeft(workTime);
    initialTimeRef.current = workTime;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((initialTimeRef.current - timeLeft) / initialTimeRef.current) * 100;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        <Text style={styles.statusText}>
          {isBreak ? 'Pausa' : goalSubject ? `Estudando ${goalSubject}` : 'Foco'}
        </Text>
        
        {/* Progress Ring */}
        <View style={styles.progressRing}>
          <View 
            style={[
              styles.progressFill,
              { 
                transform: [{ rotate: `${(getProgressPercentage() * 3.6)}deg` }],
                backgroundColor: isBreak ? '#f59e0b' : '#3b82f6'
              }
            ]}
          />
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleTimer}
        >
          {isRunning ? (
            <Pause size={24} color="#ffffff" />
          ) : (
            <Play size={24} color="#ffffff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.secondaryButton]}
          onPress={resetTimer}
        >
          <RotateCcw size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      {independent && (
        <View style={styles.stats}>
          <Text style={styles.statText}>
            Pomodoros: {completedPomodoros}
          </Text>
          <Text style={styles.statText}>
            Tempo Total: {Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'monospace',
  },
  statusText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 5,
    textAlign: 'center',
  },
  progressRing: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressFill: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#3b82f6',
    transformOrigin: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  controlButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  stats: {
    marginTop: 15,
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
});