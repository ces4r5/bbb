import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Plus, FileText, Clock, Target, TrendingUp, Calendar, CreditCard as Edit } from 'lucide-react-native';
import { useStorage } from '@/hooks/useStorage';
import { useTheme } from '@/hooks/useTheme';
import { SimuladoCard } from '@/components/SimuladoCard';
import { AddSimuladoModal } from '@/components/AddSimuladoModal';
import { EditSimuladoModal } from '@/components/EditSimuladoModal';

export default function SimuladosScreen() {
  const { theme } = useTheme();
  const { data: simulados, updateData: setSimulados } = useStorage('simulados', []);
  const { data: subjects } = useStorage('subjects', []);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingSimulado, setEditingSimulado] = useState(null);
  const [editingSimuladoIndex, setEditingSimuladoIndex] = useState(null);

  const handleDeleteSimulado = (simuladoIndex) => {
    const updatedSimulados = simulados.filter((_, index) => index !== simuladoIndex);
    setSimulados(updatedSimulados);
  };

  const handleEditSimulado = (simulado, index) => {
    setEditingSimulado(simulado);
    setEditingSimuladoIndex(index);
    setEditModalVisible(true);
  };

  const handleUpdateSimulado = (updatedSimulado) => {
    const updatedSimulados = [...simulados];
    updatedSimulados[editingSimuladoIndex] = updatedSimulado;
    setSimulados(updatedSimulados);
    setEditModalVisible(false);
    setEditingSimulado(null);
    setEditingSimuladoIndex(null);
  };

  const getTotalSimulados = () => simulados.length;

  const getAverageScore = () => {
    if (simulados.length === 0) return 0;
    const totalScore = simulados.reduce((sum, simulado) => {
      const subjectScores = Object.values(simulado.subjects);
      const simuladoAverage = subjectScores.reduce((subSum, subject) => {
        const accuracy = subject.questionsResolved > 0 ? 
          (subject.questionsCorrect / subject.questionsResolved * 100) : 0;
        return subSum + accuracy;
      }, 0) / subjectScores.length;
      return sum + simuladoAverage;
    }, 0);
    return (totalScore / simulados.length).toFixed(1);
  };

  const getTotalHours = () => {
    return simulados.reduce((total, simulado) => {
      const subjectHours = Object.values(simulado.subjects).reduce((sum, subject) => {
        return sum + (subject.timeSpent || 0);
      }, 0);
      return total + subjectHours;
    }, 0).toFixed(1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.primary}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Simulados</Text>
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
            <FileText size={24} color="#3b82f6" />
            <Text style={styles.statValue}>{getTotalSimulados()}</Text>
            <Text style={styles.statLabel}>Simulados</Text>
          </BlurView>
          <BlurView intensity={20} style={styles.statCard}>
            <Target size={24} color="#10b981" />
            <Text style={styles.statValue}>{getAverageScore()}%</Text>
            <Text style={styles.statLabel}>Média Geral</Text>
          </BlurView>
          <BlurView intensity={20} style={styles.statCard}>
            <Clock size={24} color="#f59e0b" />
            <Text style={styles.statValue}>{getTotalHours()}h</Text>
            <Text style={styles.statLabel}>Tempo Total</Text>
          </BlurView>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {simulados.length === 0 ? (
            <BlurView intensity={20} style={styles.emptyCard}>
              <FileText size={48} color="#6b7280" />
              <Text style={styles.emptyText}>Nenhum simulado registrado</Text>
              <Text style={styles.emptySubtext}>
                Adicione seu primeiro simulado para acompanhar seu progresso
              </Text>
            </BlurView>
          ) : (
            simulados.map((simulado, index) => (
              <SimuladoCard
                key={index}
                simulado={simulado}
                subjects={subjects}
                onDelete={() => handleDeleteSimulado(index)}
                onEdit={() => handleEditSimulado(simulado, index)}
              />
            ))
          )}
        </ScrollView>

        <AddSimuladoModal
          visible={addModalVisible}
          onClose={() => setAddModalVisible(false)}
          subjects={subjects}
          onSave={(newSimulado) => {
            setSimulados([...simulados, newSimulado]);
            setAddModalVisible(false);
          }}
        />

        <EditSimuladoModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          simulado={editingSimulado}
          subjects={subjects}
          onSave={handleUpdateSimulado}
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