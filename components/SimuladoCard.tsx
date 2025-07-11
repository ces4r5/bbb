import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { FileText, Calendar, Clock, Trash2, CreditCard as Edit, Target } from 'lucide-react-native';

interface SimuladoCardProps {
  simulado: any;
  subjects: any[];
  onDelete: () => void;
  onEdit: () => void;
}

export function SimuladoCard({ simulado, subjects, onDelete, onEdit }: SimuladoCardProps) {
  const getOverallAccuracy = () => {
    const subjectEntries = Object.entries(simulado.subjects);
    if (subjectEntries.length === 0) return 0;

    const totalAccuracy = subjectEntries.reduce((sum, [_, subject]) => {
      const accuracy = subject.questionsResolved > 0 ? 
        (subject.questionsCorrect / subject.questionsResolved * 100) : 0;
      return sum + accuracy;
    }, 0);

    return (totalAccuracy / subjectEntries.length).toFixed(1);
  };

  const getTotalTime = () => {
    return Object.values(simulado.subjects).reduce((total, subject) => {
      return total + (subject.timeSpent || 0);
    }, 0).toFixed(1);
  };

  const getTotalQuestions = () => {
    return Object.values(simulado.subjects).reduce((total, subject) => {
      return total + (subject.questionsResolved || 0);
    }, 0);
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 80) return '#10b981';
    if (accuracy >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const handleDelete = () => {
    Alert.alert(
      'Excluir Simulado',
      'Tem certeza que deseja excluir este simulado?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: onDelete }
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const overallAccuracy = parseFloat(getOverallAccuracy());

  return (
    <BlurView intensity={20} style={styles.container}>
      <View style={styles.header}>
        <View style={styles.simuladoInfo}>
          <Text style={styles.simuladoName}>{simulado.name}</Text>
          <View style={styles.dateContainer}>
            <Calendar size={12} color="#9ca3af" />
            <Text style={styles.dateText}>{formatDate(simulado.date)}</Text>
          </View>
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

      <View style={styles.overallStats}>
        <View style={styles.overallStat}>
          <Target size={16} color={getAccuracyColor(overallAccuracy)} />
          <Text style={[styles.overallStatValue, { color: getAccuracyColor(overallAccuracy) }]}>
            {overallAccuracy}%
          </Text>
          <Text style={styles.overallStatLabel}>Acerto Geral</Text>
        </View>
        <View style={styles.overallStat}>
          <Clock size={16} color="#3b82f6" />
          <Text style={styles.overallStatValue}>{getTotalTime()}h</Text>
          <Text style={styles.overallStatLabel}>Tempo Total</Text>
        </View>
        <View style={styles.overallStat}>
          <FileText size={16} color="#10b981" />
          <Text style={styles.overallStatValue}>{getTotalQuestions()}</Text>
          <Text style={styles.overallStatLabel}>Questões</Text>
        </View>
      </View>

      <View style={styles.subjectsContainer}>
        <Text style={styles.subjectsTitle}>Desempenho por Matéria:</Text>
        {Object.entries(simulado.subjects).map(([subjectName, subjectData], index) => {
          const accuracy = subjectData.questionsResolved > 0 ? 
            (subjectData.questionsCorrect / subjectData.questionsResolved * 100) : 0;
          
          return (
            <View key={index} style={styles.subjectRow}>
              <Text style={styles.subjectName}>{subjectName}</Text>
              <View style={styles.subjectStats}>
                <Text style={styles.subjectStat}>
                  {subjectData.timeSpent || 0}h
                </Text>
                <Text style={styles.subjectStat}>
                  {subjectData.questionsCorrect || 0}/{subjectData.questionsResolved || 0}
                </Text>
                <Text style={[
                  styles.subjectAccuracy,
                  { color: getAccuracyColor(accuracy) }
                ]}>
                  {accuracy.toFixed(1)}%
                </Text>
              </View>
            </View>
          );
        })}
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
  simuladoInfo: {
    flex: 1,
  },
  simuladoName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 5,
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
  overallStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  overallStat: {
    alignItems: 'center',
    flex: 1,
  },
  overallStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 5,
  },
  overallStatLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
    textAlign: 'center',
  },
  subjectsContainer: {
    marginTop: 5,
  },
  subjectsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
  },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  subjectName: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
    flex: 1,
  },
  subjectStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  subjectStat: {
    fontSize: 12,
    color: '#9ca3af',
    minWidth: 30,
    textAlign: 'center',
  },
  subjectAccuracy: {
    fontSize: 12,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'center',
  },
});