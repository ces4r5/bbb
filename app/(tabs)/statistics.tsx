import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ChartBar as BarChart3, TrendingUp, Clock, Target, Award, Calendar } from 'lucide-react-native';
import { useStorage } from '@/hooks/useStorage';
import { PerformanceChart } from '@/components/PerformanceChart';
import { useTheme } from '@/hooks/useTheme';

const { width } = Dimensions.get('window');

export default function StatisticsScreen() {
  const { theme } = useTheme();
  const { data: subjects } = useStorage('subjects', []);
  const { data: goals } = useStorage('goals', []);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const getTotalHours = () => {
    return subjects.reduce((total, subject) => {
      const subjectHours = subject.hoursStudied || 0;
      const topicHours = subject.topics.reduce((topicTotal, topic) => {
        return topicTotal + (topic.hoursStudied || 0);
      }, 0);
      return total + subjectHours + topicHours;
    }, 0);
  };

  const getTotalQuestions = () => {
    return subjects.reduce((total, subject) => {
      const subjectQuestions = subject.questionsResolved || 0;
      const topicQuestions = subject.topics.reduce((topicTotal, topic) => {
        return topicTotal + (topic.questionsResolved || 0);
      }, 0);
      return total + subjectQuestions + topicQuestions;
    }, 0);
  };

  const getAverageAccuracy = () => {
    let totalCorrect = 0;
    let totalQuestions = 0;

    subjects.forEach(subject => {
      totalCorrect += subject.questionsCorrect || 0;
      totalQuestions += subject.questionsResolved || 0;
      
      subject.topics.forEach(topic => {
        totalCorrect += topic.questionsCorrect || 0;
        totalQuestions += topic.questionsResolved || 0;
      });
    });

    return totalQuestions > 0 ? (totalCorrect / totalQuestions * 100).toFixed(1) : 0;
  };

  const getSubjectPerformance = () => {
    return subjects.map(subject => {
      const totalCorrect = (subject.questionsCorrect || 0) + 
        subject.topics.reduce((total, topic) => total + (topic.questionsCorrect || 0), 0);
      const totalQuestions = (subject.questionsResolved || 0) + 
        subject.topics.reduce((total, topic) => total + (topic.questionsResolved || 0), 0);
      const totalHours = (subject.hoursStudied || 0) + 
        subject.topics.reduce((total, topic) => total + (topic.hoursStudied || 0), 0);

      return {
        name: subject.name,
        accuracy: totalQuestions > 0 ? (totalCorrect / totalQuestions * 100).toFixed(1) : 0,
        hours: totalHours,
        questions: totalQuestions,
        priority: subject.priority,
      };
    }).sort((a, b) => b.accuracy - a.accuracy);
  };

  const getWeeklyProgress = () => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days.map(day => ({
      day,
      hours: Math.random() * 4 + 1, // Mock data for demo
      questions: Math.floor(Math.random() * 50) + 10,
    }));
  };

  const subjectPerformance = getSubjectPerformance();
  const weeklyProgress = getWeeklyProgress();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.primary}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Estatísticas</Text>
          <BarChart3 size={24} color="#3b82f6" />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Period Selector */}
          <View style={styles.periodContainer}>
            <TouchableOpacity
              style={[styles.periodButton, selectedPeriod === 'week' && styles.periodButtonActive]}
              onPress={() => setSelectedPeriod('week')}
            >
              <Text style={[styles.periodText, selectedPeriod === 'week' && styles.periodTextActive]}>
                Semana
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodButton, selectedPeriod === 'month' && styles.periodButtonActive]}
              onPress={() => setSelectedPeriod('month')}
            >
              <Text style={[styles.periodText, selectedPeriod === 'month' && styles.periodTextActive]}>
                Mês
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodButton, selectedPeriod === 'all' && styles.periodButtonActive]}
              onPress={() => setSelectedPeriod('all')}
            >
              <Text style={[styles.periodText, selectedPeriod === 'all' && styles.periodTextActive]}>
                Geral
              </Text>
            </TouchableOpacity>
          </View>

          {/* Overview Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumo Geral</Text>
            <View style={styles.statsGrid}>
              <BlurView intensity={20} style={styles.statCard}>
                <Clock size={24} color="#3b82f6" />
                <Text style={styles.statValue}>{getTotalHours()}h</Text>
                <Text style={styles.statLabel}>Horas Estudadas</Text>
              </BlurView>
              <BlurView intensity={20} style={styles.statCard}>
                <Target size={24} color="#10b981" />
                <Text style={styles.statValue}>{getTotalQuestions()}</Text>
                <Text style={styles.statLabel}>Questões</Text>
              </BlurView>
              <BlurView intensity={20} style={styles.statCard}>
                <Award size={24} color="#f59e0b" />
                <Text style={styles.statValue}>{getAverageAccuracy()}%</Text>
                <Text style={styles.statLabel}>Acerto Médio</Text>
              </BlurView>
            </View>
          </View>

          {/* Performance Chart */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Progresso Semanal</Text>
            <BlurView intensity={20} style={styles.chartCard}>
              <PerformanceChart data={weeklyProgress} />
            </BlurView>
          </View>

          {/* Subject Performance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Desempenho por Matéria</Text>
            {subjectPerformance.map((subject, index) => (
              <BlurView key={index} intensity={20} style={styles.subjectCard}>
                <View style={styles.subjectHeader}>
                  <Text style={styles.subjectName}>{subject.name}</Text>
                  <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(subject.priority) }]}>
                    <Text style={styles.priorityText}>{subject.priority}</Text>
                  </View>
                </View>
                <View style={styles.subjectStats}>
                  <View style={styles.subjectStat}>
                    <Text style={styles.subjectStatValue}>{subject.accuracy}%</Text>
                    <Text style={styles.subjectStatLabel}>Acerto</Text>
                  </View>
                  <View style={styles.subjectStat}>
                    <Text style={styles.subjectStatValue}>{subject.hours}h</Text>
                    <Text style={styles.subjectStatLabel}>Horas</Text>
                  </View>
                  <View style={styles.subjectStat}>
                    <Text style={styles.subjectStatValue}>{subject.questions}</Text>
                    <Text style={styles.subjectStatLabel}>Questões</Text>
                  </View>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[styles.progressFill, { 
                      width: `${subject.accuracy}%`,
                      backgroundColor: getPerformanceColor(subject.accuracy)
                    }]} 
                  />
                </View>
              </BlurView>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'alta': return '#ef4444';
    case 'média': return '#f59e0b';
    case 'baixa': return '#3b82f6';
    default: return '#6b7280';
  }
};

const getPerformanceColor = (percentage) => {
  if (percentage >= 80) return '#10b981';
  if (percentage >= 60) return '#f59e0b';
  return '#ef4444';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1419',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  periodContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  periodButtonActive: {
    backgroundColor: '#3b82f6',
  },
  periodText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
  },
  periodTextActive: {
    color: '#ffffff',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 5,
  },
  chartCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  subjectCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
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
  subjectStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  subjectStat: {
    alignItems: 'center',
  },
  subjectStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subjectStatLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});