import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Plus, Target, Calendar, Clock, TrendingUp } from 'lucide-react-native';
import { useStorage } from '@/hooks/useStorage';
import { GoalCard } from '@/components/GoalCard';
import { AddGoalModal } from '@/components/AddGoalModal';
import { EditGoalModal } from '@/components/EditGoalModal';
import { useTheme } from '@/hooks/useTheme';

export default function GoalsScreen() {
  const { theme } = useTheme();
  const { data: goals, updateData: setGoals } = useStorage('goals', []);
  const { data: subjects } = useStorage('subjects', []);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [editingGoalIndex, setEditingGoalIndex] = useState(null);

  const handleDeleteGoal = (goalIndex) => {
    const updatedGoals = goals.filter((_, index) => index !== goalIndex);
    setGoals(updatedGoals);
  };

  const handleEditGoal = (goal, index) => {
    setEditingGoal(goal);
    setEditingGoalIndex(index);
    setEditModalVisible(true);
  };

  const handleUpdateGoal = (updatedGoal) => {
    const updatedGoals = [...goals];
    updatedGoals[editingGoalIndex] = updatedGoal;
    setGoals(updatedGoals);
    setEditModalVisible(false);
    setEditingGoal(null);
    setEditingGoalIndex(null);
  };

  const getCurrentWeekGoals = () => {
    return goals.filter(goal => {
      const goalDate = new Date(goal.startDate);
      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      return goalDate >= weekStart && goalDate <= weekEnd;
    });
  };

  const currentWeekGoals = getCurrentWeekGoals();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.primary}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Metas Semanais</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setAddModalVisible(true)}
          >
            <Plus size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <BlurView intensity={20} style={styles.statCard}>
            <Target size={24} color="#3b82f6" />
            <Text style={styles.statValue}>{goals.length}</Text>
            <Text style={styles.statLabel}>Metas Criadas</Text>
          </BlurView>
          <BlurView intensity={20} style={styles.statCard}>
            <Calendar size={24} color="#10b981" />
            <Text style={styles.statValue}>{currentWeekGoals.length}</Text>
            <Text style={styles.statLabel}>Desta Semana</Text>
          </BlurView>
          <BlurView intensity={20} style={styles.statCard}>
            <TrendingUp size={24} color="#f59e0b" />
            <Text style={styles.statValue}>
              {goals.reduce((total, goal) => total + goal.totalHours, 0)}h
            </Text>
            <Text style={styles.statLabel}>Horas Totais</Text>
          </BlurView>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {goals.length === 0 ? (
            <BlurView intensity={20} style={styles.emptyCard}>
              <Target size={48} color="#6b7280" />
              <Text style={styles.emptyText}>Nenhuma meta criada</Text>
              <Text style={styles.emptySubtext}>
                Crie sua primeira meta semanal para organizar seus estudos
              </Text>
            </BlurView>
          ) : (
            goals.map((goal, index) => (
              <GoalCard
                key={index}
                goal={goal}
                subjects={subjects}
                onDelete={() => handleDeleteGoal(index)}
                onEdit={() => handleEditGoal(goal, index)}
              />
            ))
          )}
        </ScrollView>

        <AddGoalModal
          visible={addModalVisible}
          onClose={() => setAddModalVisible(false)}
          subjects={subjects}
          onSave={(newGoal) => {
            setGoals([...goals, newGoal]);
            setAddModalVisible(false);
          }}
        />

        <EditGoalModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          goal={editingGoal}
          subjects={subjects}
          onSave={handleUpdateGoal}
        />
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
  addButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    marginTop: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  emptyText: {
    fontSize: 18,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 15,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 5,
  },
});