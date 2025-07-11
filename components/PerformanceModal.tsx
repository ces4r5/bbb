import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { X, Save, Clock, Target, CircleCheck as CheckCircle } from 'lucide-react-native';

interface PerformanceModalProps {
  visible: boolean;
  onClose: () => void;
  subject: any;
  topic?: any;
  onSave: (performance: any) => void;
}

export function PerformanceModal({ visible, onClose, subject, topic, onSave }: PerformanceModalProps) {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [questionsResolved, setQuestionsResolved] = useState('');
  const [questionsCorrect, setQuestionsCorrect] = useState('');

  const handleSave = () => {
    const hoursNum = parseFloat(hours) || 0;
    const minutesNum = parseFloat(minutes) || 0;
    const questionsResolvedNum = parseInt(questionsResolved) || 0;
    const questionsCorrectNum = parseInt(questionsCorrect) || 0;

    if (hoursNum < 0 || minutesNum < 0 || minutesNum >= 60) {
      Alert.alert('Erro', 'Verifique os valores de tempo');
      return;
    }

    if (questionsResolvedNum < 0 || questionsCorrectNum < 0) {
      Alert.alert('Erro', 'Número de questões não pode ser negativo');
      return;
    }

    if (questionsCorrectNum > questionsResolvedNum) {
      Alert.alert('Erro', 'Questões corretas não pode ser maior que questões resolvidas');
      return;
    }

    const totalHours = hoursNum + (minutesNum / 60);

    const performance = {
      hours: totalHours,
      questionsResolved: questionsResolvedNum,
      questionsCorrect: questionsCorrectNum,
    };

    onSave(performance);
    
    // Reset form
    setHours('');
    setMinutes('');
    setQuestionsResolved('');
    setQuestionsCorrect('');
  };

  const handleClose = () => {
    setHours('');
    setMinutes('');
    setQuestionsResolved('');
    setQuestionsCorrect('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <BlurView intensity={20} style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Registrar Desempenho</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.subjectInfo}>
              <Text style={styles.subjectName}>{subject?.name}</Text>
              {topic && (
                <Text style={styles.topicName}>Tópico: {topic.name}</Text>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>
                <Clock size={16} color="#3b82f6" /> Tempo Estudado
              </Text>
              <View style={styles.timeInputs}>
                <View style={styles.timeInput}>
                  <TextInput
                    style={styles.input}
                    value={hours}
                    onChangeText={setHours}
                    placeholder="0"
                    placeholderTextColor="#6b7280"
                    keyboardType="numeric"
                  />
                  <Text style={styles.timeUnit}>horas</Text>
                </View>
                <View style={styles.timeInput}>
                  <TextInput
                    style={styles.input}
                    value={minutes}
                    onChangeText={setMinutes}
                    placeholder="0"
                    placeholderTextColor="#6b7280"
                    keyboardType="numeric"
                  />
                  <Text style={styles.timeUnit}>minutos</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>
                <Target size={16} color="#10b981" /> Questões
              </Text>
              <View style={styles.questionInputs}>
                <View style={styles.questionInput}>
                  <Text style={styles.questionLabel}>Resolvidas:</Text>
                  <TextInput
                    style={styles.input}
                    value={questionsResolved}
                    onChangeText={setQuestionsResolved}
                    placeholder="0"
                    placeholderTextColor="#6b7280"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.questionInput}>
                  <Text style={styles.questionLabel}>Corretas:</Text>
                  <TextInput
                    style={styles.input}
                    value={questionsCorrect}
                    onChangeText={setQuestionsCorrect}
                    placeholder="0"
                    placeholderTextColor="#6b7280"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            {questionsResolved && questionsCorrect && (
              <View style={styles.accuracyDisplay}>
                <CheckCircle size={16} color="#f59e0b" />
                <Text style={styles.accuracyText}>
                  Acerto: {((parseInt(questionsCorrect) / parseInt(questionsResolved)) * 100).toFixed(1)}%
                </Text>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Save size={20} color="#ffffff" />
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'rgba(15, 20, 25, 0.95)',
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 5,
  },
  content: {
    padding: 20,
  },
  subjectInfo: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  subjectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  topicName: {
    fontSize: 14,
    color: '#9ca3af',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInputs: {
    flexDirection: 'row',
    gap: 15,
  },
  timeInput: {
    flex: 1,
  },
  timeUnit: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 5,
  },
  questionInputs: {
    gap: 15,
  },
  questionInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questionLabel: {
    fontSize: 14,
    color: '#ffffff',
    flex: 1,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    textAlign: 'center',
    minWidth: 80,
  },
  accuracyDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  accuracyText: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: '#9ca3af',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});