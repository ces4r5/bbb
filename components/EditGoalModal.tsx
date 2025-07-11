import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { BlurView } from 'expo-blur';
import { X, Save, Calendar, Clock, Target } from 'lucide-react-native';

interface EditGoalModalProps {
  visible: boolean;
  onClose: () => void;
  goal: any;
  subjects: any[];
  onSave: (goal: any) => void;
}

export function EditGoalModal({ visible, onClose, goal, subjects, onSave }: EditGoalModalProps) {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [totalHours, setTotalHours] = useState('');
  const [distributionType, setDistributionType] = useState('uniform');
  const [schedule, setSchedule] = useState({
    sunday: { enabled: false, hours: 0 },
    monday: { enabled: true, hours: 0 },
    tuesday: { enabled: true, hours: 0 },
    wednesday: { enabled: true, hours: 0 },
    thursday: { enabled: true, hours: 0 },
    friday: { enabled: true, hours: 0 },
    saturday: { enabled: false, hours: 0 },
  });

  const dayNames = {
    sunday: 'Domingo',
    monday: 'Segunda',
    tuesday: 'Terça',
    wednesday: 'Quarta',
    thursday: 'Quinta',
    friday: 'Sexta',
    saturday: 'Sábado',
  };

  useEffect(() => {
    if (goal) {
      setSelectedSubject(goal.subject);
      setTotalHours(goal.totalHours.toString());
      setDistributionType(goal.distributionType);
      setSchedule(goal.schedule);
    }
  }, [goal]);

  const toggleDay = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
        hours: !prev[day].enabled ? 0 : prev[day].hours
      }
    }));
  };

  const updateDayHours = (day: string, hours: string) => {
    const hoursNum = parseFloat(hours) || 0;
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        hours: hoursNum
      }
    }));
  };

  const handleSave = () => {
    if (!selectedSubject) {
      Alert.alert('Erro', 'Selecione uma matéria');
      return;
    }

    const totalHoursNum = parseFloat(totalHours);
    if (!totalHoursNum || totalHoursNum <= 0) {
      Alert.alert('Erro', 'Digite um valor válido para as horas totais');
      return;
    }

    const enabledDays = Object.keys(schedule).filter(day => schedule[day].enabled);
    if (enabledDays.length === 0) {
      Alert.alert('Erro', 'Selecione pelo menos um dia da semana');
      return;
    }

    let finalSchedule = { ...schedule };
    if (distributionType === 'uniform') {
      const hoursPerDay = totalHoursNum / enabledDays.length;
      enabledDays.forEach(day => {
        finalSchedule[day].hours = hoursPerDay;
      });
    }

    const updatedGoal = {
      ...goal,
      subject: selectedSubject,
      totalHours: totalHoursNum,
      distributionType,
      schedule: finalSchedule,
    };

    onSave(updatedGoal);
    handleClose();
  };

  const handleClose = () => {
    setSelectedSubject('');
    setTotalHours('');
    setDistributionType('uniform');
    setSchedule({
      sunday: { enabled: false, hours: 0 },
      monday: { enabled: true, hours: 0 },
      tuesday: { enabled: true, hours: 0 },
      wednesday: { enabled: true, hours: 0 },
      thursday: { enabled: true, hours: 0 },
      friday: { enabled: true, hours: 0 },
      saturday: { enabled: false, hours: 0 },
    });
    onClose();
  };

  if (!goal) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <BlurView intensity={20} style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Editar Meta</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.label}>
                <Target size={16} color="#3b82f6" /> Matéria
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {subjects.map((subject, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.subjectChip,
                      selectedSubject === subject.name && styles.subjectChipSelected
                    ]}
                    onPress={() => setSelectedSubject(subject.name)}
                  >
                    <Text style={[
                      styles.subjectChipText,
                      selectedSubject === subject.name && styles.subjectChipTextSelected
                    ]}>
                      {subject.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>
                <Clock size={16} color="#10b981" /> Carga Horária Semanal
              </Text>
              <TextInput
                style={styles.input}
                value={totalHours}
                onChangeText={setTotalHours}
                placeholder="Ex: 15"
                placeholderTextColor="#6b7280"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>
                <Calendar size={16} color="#f59e0b" /> Distribuição
              </Text>
              <View style={styles.distributionButtons}>
                <TouchableOpacity
                  style={[
                    styles.distributionButton,
                    distributionType === 'uniform' && styles.distributionButtonActive
                  ]}
                  onPress={() => setDistributionType('uniform')}
                >
                  <Text style={[
                    styles.distributionButtonText,
                    distributionType === 'uniform' && styles.distributionButtonTextActive
                  ]}>
                    Uniforme
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.distributionButton,
                    distributionType === 'custom' && styles.distributionButtonActive
                  ]}
                  onPress={() => setDistributionType('custom')}
                >
                  <Text style={[
                    styles.distributionButtonText,
                    distributionType === 'custom' && styles.distributionButtonTextActive
                  ]}>
                    Personalizada
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Cronograma Semanal</Text>
              {Object.keys(schedule).map(day => (
                <View key={day} style={styles.dayRow}>
                  <View style={styles.dayInfo}>
                    <Switch
                      value={schedule[day].enabled}
                      onValueChange={() => toggleDay(day)}
                      trackColor={{ false: '#3e3e3e', true: '#3b82f6' }}
                      thumbColor={schedule[day].enabled ? '#ffffff' : '#f4f3f4'}
                    />
                    <Text style={styles.dayName}>{dayNames[day]}</Text>
                  </View>
                  {schedule[day].enabled && distributionType === 'custom' && (
                    <TextInput
                      style={styles.dayInput}
                      value={schedule[day].hours.toString()}
                      onChangeText={(hours) => updateDayHours(day, hours)}
                      placeholder="0"
                      placeholderTextColor="#6b7280"
                      keyboardType="numeric"
                    />
                  )}
                  {schedule[day].enabled && distributionType === 'uniform' && (
                    <Text style={styles.dayHours}>
                      {totalHours ? (parseFloat(totalHours) / Object.keys(schedule).filter(d => schedule[d].enabled).length).toFixed(1) : '0'}h
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>

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
    maxHeight: '90%',
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
    flex: 1,
    padding: 20,
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
  subjectChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  subjectChipSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  subjectChipText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
  },
  subjectChipTextSelected: {
    color: '#ffffff',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  distributionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  distributionButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  distributionButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  distributionButtonText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
  },
  distributionButtonTextActive: {
    color: '#ffffff',
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dayName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
  },
  dayInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 8,
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
    minWidth: 60,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dayHours: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
    minWidth: 60,
    textAlign: 'center',
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