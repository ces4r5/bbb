import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { X, Plus, BookOpen } from 'lucide-react-native';

interface AddSubjectModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (subjects: any[]) => void;
}

export function AddSubjectModal({ visible, onClose, onSave }: AddSubjectModalProps) {
  const [inputText, setInputText] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('média');

  const parseSubjectsText = (text: string) => {
    const subjects = [];
    const parts = text.split(';').filter(part => part.trim());
    
    for (const part of parts) {
      const [subjectName, topicsStr] = part.split(':');
      if (subjectName && topicsStr) {
        const topics = topicsStr.split(',').map(topic => ({
          name: topic.trim(),
          hoursStudied: 0,
          questionsResolved: 0,
          questionsCorrect: 0,
          lastStudied: null,
        })).filter(topic => topic.name);
        
        if (topics.length > 0) {
          subjects.push({
            name: subjectName.trim(),
            priority: selectedPriority,
            topics,
            hoursStudied: 0,
            questionsResolved: 0,
            questionsCorrect: 0,
            lastStudied: null,
          });
        }
      }
    }
    
    return subjects;
  };

  const handleSave = () => {
    if (!inputText.trim()) {
      Alert.alert('Erro', 'Digite as matérias e tópicos');
      return;
    }

    try {
      const subjects = parseSubjectsText(inputText);
      if (subjects.length === 0) {
        Alert.alert('Erro', 'Formato inválido. Use o formato: Matéria:tópico1,tópico2;Matéria2:tópico3,tópico4;');
        return;
      }
      
      onSave(subjects);
      setInputText('');
      setSelectedPriority('média');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao processar as matérias. Verifique o formato.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <BlurView intensity={20} style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Adicionar Matérias</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.label}>Formato:</Text>
              <View style={styles.formatExample}>
                <Text style={styles.formatText}>
                  Matéria:tópico1,tópico2;Matéria2:tópico3,tópico4;
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Prioridade:</Text>
              <View style={styles.priorityButtons}>
                {['baixa', 'média', 'alta'].map(priority => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityButton,
                      selectedPriority === priority && styles.priorityButtonActive,
                      { backgroundColor: selectedPriority === priority ? getPriorityColor(priority) : 'rgba(255, 255, 255, 0.1)' }
                    ]}
                    onPress={() => setSelectedPriority(priority)}
                  >
                    <Text style={[
                      styles.priorityButtonText,
                      selectedPriority === priority && styles.priorityButtonTextActive
                    ]}>
                      {priority}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Matérias e Tópicos:</Text>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ex: Matemática:álgebra,geometria;Português:gramática,interpretação;"
                placeholderTextColor="#6b7280"
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.previewSection}>
              <Text style={styles.label}>Prévia:</Text>
              {inputText.trim() && (
                <View style={styles.preview}>
                  {parseSubjectsText(inputText).map((subject, index) => (
                    <View key={index} style={styles.previewSubject}>
                      <View style={styles.previewHeader}>
                        <BookOpen size={16} color="#3b82f6" />
                        <Text style={styles.previewSubjectName}>{subject.name}</Text>
                        <View style={[styles.previewPriority, { backgroundColor: getPriorityColor(subject.priority) }]}>
                          <Text style={styles.previewPriorityText}>{subject.priority}</Text>
                        </View>
                      </View>
                      <View style={styles.previewTopics}>
                        {subject.topics.map((topic, topicIndex) => (
                          <View key={topicIndex} style={styles.previewTopic}>
                            <Text style={styles.previewTopicText}>{topic.name}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Plus size={20} color="#ffffff" />
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'alta': return '#ef4444';
    case 'média': return '#f59e0b';
    case 'baixa': return '#3b82f6';
    default: return '#6b7280';
  }
};

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
    fontSize: 24,
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
  },
  formatExample: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  formatText: {
    color: '#9ca3af',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  priorityButtonActive: {
    borderColor: 'transparent',
  },
  priorityButtonText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  priorityButtonTextActive: {
    color: '#ffffff',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minHeight: 120,
  },
  previewSection: {
    marginBottom: 20,
  },
  preview: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  previewSubject: {
    marginBottom: 15,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewSubjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
    flex: 1,
  },
  previewPriority: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  previewPriorityText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  previewTopics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginLeft: 24,
  },
  previewTopic: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  previewTopicText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '500',
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