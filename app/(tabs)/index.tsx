import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Play, Pause, Plus, Timer, Eye, EyeOff } from 'lucide-react-native';
import { useStorage } from '@/hooks/useStorage';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { GoalBubble } from '@/components/GoalBubble';
import { QuickPerformanceModal } from '@/components/QuickPerformanceModal';
import { useTheme } from '@/hooks/useTheme';

export default function HomeScreen() {
  const { theme } = useTheme();
  const { data: subjects } = useStorage('subjects', []);
  const { data: goals } = useStorage('goals', []);
  const [showIndependentTimer, setShowIndependentTimer] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [quickPerformanceVisible, setQuickPerformanceVisible] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const getTodaysGoals = () => {
    const today = new Date().toISOString().split('T')[0];
    const dayOfWeek = new Date().getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    return goals.filter(goal => {
      if (!goal.schedule || !goal.schedule[dayNames[dayOfWeek]]) return false;
      return goal.schedule[dayNames[dayOfWeek]].enabled;
    });
  };

  const todaysGoals = getTodaysGoals();

  const handleQuickPerformance = (subject) => {
    setSelectedSubject(subject);
    setQuickPerformanceVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.primary}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>StudyHighway</Text>
            <Text style={styles.subtitle}>Seus estudos, seu sucesso</Text>
          </View>

          {/* Independent Timer */}
          {showIndependentTimer && (
            <BlurView intensity={20} style={styles.timerCard}>
              <View style={styles.timerHeader}>
                <Timer size={20} color="#3b82f6" />
                <Text style={styles.timerTitle}>Cronômetro Independente</Text>
                <TouchableOpacity
                  onPress={() => setShowIndependentTimer(false)}
                  style={styles.hideButton}
                >
                  <EyeOff size={18} color="#6b7280" />
                </TouchableOpacity>
              </View>
              <PomodoroTimer 
                independent={true}
                onTimeUpdate={() => {}}
              />
            </BlurView>
          )}

          {!showIndependentTimer && (
            <TouchableOpacity
              style={styles.showTimerButton}
              onPress={() => setShowIndependentTimer(true)}
            >
              <Eye size={18} color="#3b82f6" />
              <Text style={styles.showTimerText}>Mostrar Cronômetro</Text>
            </TouchableOpacity>
          )}

          {/* Today's Goals */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Metas de Hoje</Text>
            {todaysGoals.length === 0 ? (
              <BlurView intensity={20} style={styles.emptyCard}>
                <Text style={styles.emptyText}>Nenhuma meta para hoje</Text>
                <Text style={styles.emptySubtext}>Configure suas metas semanais na aba Metas</Text>
              </BlurView>
            ) : (
              <View style={styles.goalsContainer}>
                {todaysGoals.map((goal, index) => (
                  <GoalBubble
                    key={index}
                    goal={goal}
                    subjects={subjects}
                    onQuickPerformance={handleQuickPerformance}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Quick Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumo Rápido</Text>
            <View style={styles.statsGrid}>
              <BlurView intensity={20} style={styles.statCard}>
                <Text style={styles.statValue}>{subjects.length}</Text>
                <Text style={styles.statLabel}>Matérias</Text>
              </BlurView>
              <BlurView intensity={20} style={styles.statCard}>
                <Text style={styles.statValue}>{goals.length}</Text>
                <Text style={styles.statLabel}>Metas</Text>
              </BlurView>
              <BlurView intensity={20} style={styles.statCard}>
                <Text style={styles.statValue}>
                  {subjects.reduce((total, subject) => total + subject.topics.length, 0)}
                </Text>
                <Text style={styles.statLabel}>Tópicos</Text>
              </BlurView>
            </View>
          </View>
        </ScrollView>

        {quickPerformanceVisible && (
          <QuickPerformanceModal
            visible={quickPerformanceVisible}
            onClose={() => setQuickPerformanceVisible(false)}
            subject={selectedSubject}
          />
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1419',
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  timerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  timerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 10,
    flex: 1,
  },
  hideButton: {
    padding: 5,
  },
  showTimerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  showTimerText: {
    color: '#3b82f6',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  emptyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 5,
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
    color: '#3b82f6',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});