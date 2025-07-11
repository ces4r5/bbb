import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Plus, Target, Clock } from 'lucide-react-native';
import { PomodoroTimer } from './PomodoroTimer';

interface GoalBubbleProps {
  goal: any;
  subjects: any[];
  onQuickPerformance: (subject: any) => void;
}

export function GoalBubble({ goal, subjects, onQuickPerformance }: GoalBubbleProps) {
  const subject = subjects.find(s => s.name === goal.subject);
  
  if (!subject) return null;

  const today = new Date();
  const dayOfWeek = today.getDay();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todaySchedule = goal.schedule[dayNames[dayOfWeek]];

  if (!todaySchedule || !todaySchedule.enabled) return null;

  const targetHours = todaySchedule.hours;
  const completedHours = 0; // This would be calculated from actual study data
  const remainingHours = Math.max(0, targetHours - completedHours);

  const getProgressPercentage = () => {
    return (completedHours / targetHours) * 100;
  };

  const getProgressColor = () => {
    const percentage = getProgressPercentage();
    if (percentage >= 100) return '#10b981';
    if (percentage >= 75) return '#3b82f6';
    if (percentage >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <BlurView intensity={20} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.subjectInfo}>
          <Text style={styles.subjectName}>{subject.name}</Text>
          <View style={styles.timeInfo}>
            <Clock size={12} color="#9ca3af" />
            <Text style={styles.timeText}>
              {remainingHours.toFixed(1)}h restantes
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onQuickPerformance(subject)}
        >
          <Plus size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${getProgressPercentage()}%`,
                backgroundColor: getProgressColor()
              }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {completedHours.toFixed(1)}h / {targetHours}h
        </Text>
      </View>

      <View style={styles.timerContainer}>
        <PomodoroTimer
          independent={false}
          onTimeUpdate={(minutes) => {
            // Update goal progress
            console.log(`Added ${minutes} minutes to ${subject.name}`);
          }}
          goalSubject={subject.name}
        />
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 5,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
  },
});