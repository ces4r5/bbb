import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { Target, Calendar, Clock, Trash2, Play, CreditCard as Edit } from 'lucide-react-native';

interface GoalCardProps {
  goal: any;
  subjects: any[];
  onDelete: () => void;
  onEdit: () => void;
}

export function GoalCard({ goal, subjects, onDelete, onEdit }: GoalCardProps) {
  const subject = subjects.find(s => s.name === goal.subject);
  
  const getDaysOfWeek = () => {
    const dayNames = {
      sunday: 'Dom',
      monday: 'Seg',
      tuesday: 'Ter',
      wednesday: 'Qua',
      thursday: 'Qui',
      friday: 'Sex',
      saturday: 'Sáb',
    };
    
    return Object.keys(goal.schedule)
      .filter(day => goal.schedule[day].enabled)
      .map(day => dayNames[day]);
  };

  const getAverageHoursPerDay = () => {
    const enabledDays = Object.keys(goal.schedule).filter(day => goal.schedule[day].enabled);
    return enabledDays.length > 0 ? (goal.totalHours / enabledDays.length).toFixed(1) : 0;
  };

  const getProgress = () => {
    // This would be calculated from actual study data
    return Math.random() * 100; // Mock progress for demo
  };

  const getProgressColor = () => {
    const progress = getProgress();
    if (progress >= 80) return '#10b981';
    if (progress >= 60) return '#3b82f6';
    if (progress >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const handleDelete = () => {
    Alert.alert(
      'Excluir Meta',
      'Tem certeza que deseja excluir esta meta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: onDelete }
      ]
    );
  };

  return (
    <BlurView intensity={20} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.subjectInfo}>
          <Text style={styles.subjectName}>{goal.subject}</Text>
          <Text style={styles.totalHours}>{goal.totalHours}h semanais</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={onEdit} style={styles.editButton}>
            <Edit size={16} color="#9ca3af" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Trash2 size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Calendar size={16} color="#3b82f6" />
          <Text style={styles.detailText}>
            {getDaysOfWeek().join(', ')}
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Clock size={16} color="#10b981" />
          <Text style={styles.detailText}>
            {getAverageHoursPerDay()}h por dia
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Target size={16} color="#f59e0b" />
          <Text style={styles.detailText}>
            {goal.distributionType === 'uniform' ? 'Uniforme' : 'Personalizada'}
          </Text>
        </View>
      </View>

      <View style={styles.progress}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Progresso desta semana</Text>
          <Text style={styles.progressPercentage}>
            {getProgress().toFixed(0)}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${getProgress()}%`,
                backgroundColor: getProgressColor()
              }
            ]}
          />
        </View>
      </View>

      <View style={styles.schedule}>
        <Text style={styles.scheduleTitle}>Cronograma:</Text>
        <View style={styles.scheduleGrid}>
          {Object.keys(goal.schedule).map(day => {
            const dayData = goal.schedule[day];
            const dayNames = {
              sunday: 'Dom',
              monday: 'Seg',
              tuesday: 'Ter',
              wednesday: 'Qua',
              thursday: 'Qui',
              friday: 'Sex',
              saturday: 'Sáb',
            };
            
            return (
              <View 
                key={day} 
                style={[
                  styles.scheduleDay,
                  dayData.enabled && styles.scheduleDayEnabled
                ]}
              >
                <Text style={[
                  styles.scheduleDayName,
                  dayData.enabled && styles.scheduleDayNameEnabled
                ]}>
                  {dayNames[day]}
                </Text>
                {dayData.enabled && (
                  <Text style={styles.scheduleDayHours}>
                    {dayData.hours.toFixed(1)}h
                  </Text>
                )}
              </View>
            );
          })}
        </View>
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
  totalHours: {
    fontSize: 14,
    color: '#9ca3af',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 5,
  },
  deleteButton: {
    padding: 5,
  },
  details: {
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#9ca3af',
    marginLeft: 8,
  },
  progress: {
    marginBottom: 15,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  schedule: {
    marginTop: 10,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
  },
  scheduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  scheduleDay: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    minWidth: 45,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  scheduleDayEnabled: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3b82f6',
  },
  scheduleDayName: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  scheduleDayNameEnabled: {
    color: '#3b82f6',
  },
  scheduleDayHours: {
    fontSize: 10,
    color: '#3b82f6',
    fontWeight: 'bold',
    marginTop: 2,
  },
});