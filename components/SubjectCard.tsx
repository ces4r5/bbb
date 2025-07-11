import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Plus, Clock, Target, TrendingUp, ChevronRight, CreditCard as Edit } from 'lucide-react-native';

interface SubjectCardProps {
  subject: any;
  onAddPerformance: (subject: any, topic?: any) => void;
  onEdit: (subject: any) => void;
  getPerformanceColor: (percentage: number) => string;
}

export function SubjectCard({ subject, onAddPerformance, onEdit, getPerformanceColor }: SubjectCardProps) {
  const getSubjectAccuracy = () => {
    const totalCorrect = (subject.questionsCorrect || 0) + 
      subject.topics.reduce((total, topic) => total + (topic.questionsCorrect || 0), 0);
    const totalQuestions = (subject.questionsResolved || 0) + 
      subject.topics.reduce((total, topic) => total + (topic.questionsResolved || 0), 0);
    
    return totalQuestions > 0 ? (totalCorrect / totalQuestions * 100).toFixed(1) : 0;
  };

  const getTopicAccuracy = (topic: any) => {
    const totalCorrect = topic.questionsCorrect || 0;
    const totalQuestions = topic.questionsResolved || 0;
    
    return totalQuestions > 0 ? (totalCorrect / totalQuestions * 100).toFixed(1) : 0;
  };

  const getTotalHours = () => {
    const subjectHours = subject.hoursStudied || 0;
    const topicHours = subject.topics.reduce((total, topic) => total + (topic.hoursStudied || 0), 0);
    return subjectHours + topicHours;
  };

  const getPriorityColor = () => {
    switch (subject.priority) {
      case 'alta': return '#ef4444';
      case 'média': return '#f59e0b';
      case 'baixa': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const subjectAccuracy = parseFloat(getSubjectAccuracy());

  return (
    <BlurView intensity={20} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.subjectInfo}>
          <Text style={styles.subjectName}>{subject.name}</Text>
          <View style={styles.badges}>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
              <Text style={styles.priorityText}>{subject.priority}</Text>
            </View>
            <View style={[styles.accuracyBadge, { backgroundColor: getPerformanceColor(subjectAccuracy) }]}>
              <Text style={styles.accuracyText}>{subjectAccuracy}%</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onAddPerformance(subject)}
        >
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onEdit(subject)}
        >
          <Edit size={18} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Clock size={16} color="#3b82f6" />
          <Text style={styles.statText}>{getTotalHours()}h</Text>
        </View>
        <View style={styles.stat}>
          <Target size={16} color="#10b981" />
          <Text style={styles.statText}>
            {subject.topics.reduce((total, topic) => total + (topic.questionsResolved || 0), 0)} questões
          </Text>
        </View>
        <View style={styles.stat}>
          <TrendingUp size={16} color="#f59e0b" />
          <Text style={styles.statText}>{subject.topics.length} tópicos</Text>
        </View>
      </View>

      <View style={styles.topicsContainer}>
        <Text style={styles.topicsTitle}>Tópicos:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {subject.topics.map((topic, index) => {
            const topicAccuracy = parseFloat(getTopicAccuracy(topic));
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.topicChip,
                  { borderColor: getPerformanceColor(topicAccuracy) }
                ]}
                onPress={() => onAddPerformance(subject, topic)}
              >
                <Text style={styles.topicName}>{topic.name}</Text>
                <Text style={[styles.topicAccuracy, { color: getPerformanceColor(topicAccuracy) }]}>
                  {topicAccuracy}%
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
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
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  accuracyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  accuracyText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  topicsContainer: {
    marginTop: 5,
  },
  topicsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
  },
  topicChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 80,
  },
  topicName: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 2,
  },
  topicAccuracy: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});