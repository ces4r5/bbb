import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { X, Save, FileText, Clock, Target } from 'lucide-react-native';

interface EditSimuladoModalProps {
  visible: boolean;
  onClose: () => void;
  simulado: any;
  subjects: any[];
  onSave: (simulado: any) => void;
}

export function EditSimuladoModal({ visible, onClose, simulado, subjects, onSave }: EditSimuladoModalProps) {
  const [simuladoName, setSimuladoName] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState({});

  useEffect(() => {
    if (simulado) {
      setSimuladoName(simulado.name);
      setSelectedSubjects(simulado.subjects);
    }
  }, [simulado]);

  const toggleSubject = (subjectName) => {
    setSelectedSubjects(prev => {
      const newSelected = { ...prev };
      if (newSelected[subjectName]) {
        delete newSelected[subjectName];
      } else {
        newSelected[subjectName] = {
          timeSpent: 0,
          questionsResolved: 0,
          questionsCorrect: 0,
        };
      }
      return newSelected;
    });
  };

  const updateSubjectData = (subjectName, field, value) => {
    setSelectedSubjects(prev => ({
      ...prev,
      [subjectName]: {
        ...prev[subjectName],
        [field]: parseFloat(value) || 0,
      }
    }));
  };

  const handleSave = () => {
    if (!simuladoName.trim()) {
      Alert.alert('Erro', 'Digite o nome do simulado');
      return;
    }

    const selectedSubjectNames = Object.keys(selectedSubjects);
    if (selectedSubjectNames.length === 0) {
      Alert.alert('Erro', 'Selecione pelo menos uma matéria');
      return;
    }

    // Validate data
    for (const subjectName of selectedSubjectNames) {
      const subjectData = selectedSubjects[subjectName];
      if (subjectData.questionsCorrect > subjectData.questionsResolved) {
        Alert.alert('Erro', `Questões corretas não pode ser maior que questões resolvidas em ${subjectName}`);
        return;
      }
    }

    const updatedSimulado = {
      ...simulado,
      name: simuladoName.trim(),
      subjects: selectedSubjects,
    };

    onSave(updatedSimulado);
    handleClose();
  };

  const handleClose = () => {
    setSimuladoName('');
    setSelectedSubjects({});
    onClose();
  };

  if (!simulado) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <BlurView intensity={20} style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Editar Simulado</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.label}>
                <FileText size={16} color="#3b82f6" /> Nome do Simulado
              </Text>
              <TextInput
                style={styles.input}
                value={simuladoName}
                onChangeText={setSimuladoName}
                placeholder="Ex: Simulado ENEM 2024"
                placeholderTextColor="#6b7280"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Matérias e Desempenho</Text>
              {subjects.map((subject, index) => (
                <View key={index} style={styles.subjectContainer}>
                  <TouchableOpacity
                    style={[
                      styles.subjectHeader,
                      selectedSubjects[subject.name] && styles.subjectHeaderSelected
                    ]}
                    onPress={() => toggleSubject(subject.name)}
                  >
                    <Text style={[
                      styles.subjectName,
                      selectedSubjects[subject.name] && styles.subjectNameSelected
                    ]}>
                      {subject.name}
                    </Text>
                    <View style={[
                      styles.checkbox,
                      selectedSubjects[subject.name] && styles.checkboxSelected
                    ]}>
                      {selectedSubjects[subject.name] && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </View>
                  </TouchableOpacity>

                  {selectedSubjects[subject.name] && (
                    <View style={styles.subjectInputs}>
                      <View style={styles.inputRow}>
                        <Text style={styles.inputLabel}>
                          <Clock size={14} color="#3b82f6" /> Tempo (horas):
                        </Text>
                        <TextInput
                          style={styles.smallInput}
                          value={selectedSubjects[subject.name].timeSpent.toString()}
                          onChangeText={(value) => updateSubjectData(subject.name, 'timeSpent', value)}
                          placeholder="0"
                          placeholderTextColor="#6b7280"
                          keyboardType="numeric"
                        />
                      </View>

                      <View style={styles.inputRow}>
                        <Text style={styles.inputLabel}>
                          <Target size={14} color="#10b981" /> Questões resolvidas:
                        </Text>
                        <TextInput
                          style={styles.smallInput}
                          value={selectedSubjects[subject.name].questionsResolved.toString()}
                          onChangeText={(value) => updateSubjectData(subject.name, 'questionsResolved', value)}
                          placeholder="0"
                          placeholderTextColor="#6b7280"
                          keyboardType="numeric"
                        />
                      </View>

                      <View style={styles.inputRow}>
                        <Text style={styles.inputLabel}>
                          <Target size={14} color="#f59e0b" /> Questões corretas:
                        </Text>
                        <TextInput
                          style={styles.smallInput}
                          value={selectedSubjects[subject.name].questionsCorrect.toString()}
                          onChangeText={(value) => updateSubjectData(subject.name, 'questionsCorrect', value)}
                          placeholder="0"
                          placeholderTextColor="#6b7280"
                          keyboardType="numeric"
                        />
                      </View>

                      {selectedSubjects[subject.name].questionsResolved > 0 && (
                        <View style={styles.accuracyDisplay}>
                          <Text style={styles.accuracyText}>
                            Acerto: {((selectedSubjects[subject.name].questionsCorrect / selectedSubjects[subject.name].questionsResolved) * 100).toFixed(1)}%
                          </Text>
                        </View>
                      )}
                    </View>
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
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  subjectContainer: {
    marginBottom: 15,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  subjectHeaderSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderColor: '#3b82f6',
  },
  subjectName: {
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: '500',
    flex: 1,
  },
  subjectNameSelected: {
    color: '#3b82f6',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#6b7280',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  subjectInputs: {
    marginTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 10,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    color: '#ffffff',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 8,
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  accuracyDisplay: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  accuracyText: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
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