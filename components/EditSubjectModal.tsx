import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { X, Save, BookOpen, Plus, Trash2 } from 'lucide-react-native';

interface EditSubjectModalProps {
  visible: boolean;
  onClose: () => void;
  subject: any;
  onSave: (subject: any) => void;
}

export function EditSubjectModal({ visible, onClose, subject, onSave }: EditSubjectModalProps) {
  const [subjectName, setSubjectName] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('média');
  const [topics, setTopics] = useState([]);
  const [newTopicName, setNewTopicName] = useState('');

  useEffect(() => {
    if (subject) {
      setSubjectName(subject.name);
      setSelectedPriority(subject.priority);
      setTopics([...subject.topics]);
    }
  }, [subject]);

  const addTopic = () => {
    if (!newTopicName.trim()) {
      Alert.alert('Erro', 'Digite o nome do tópico');
      return;
    }

    const newTopic = {
      name: newTopicName.trim(),
      hoursStudied: 0,
      questionsResolved: 0,
      questionsCorrect: 0,
      lastStudied: null,
    };

    setTopics([...topics, newTopic]);
    setNewTopicName('');
  };

  const removeTopic = (index) => {
    const updatedTopics = topics.filter((_, i) => i !== index);
    setTopics(updatedTopics);
  };

  const handleSave = () => {
    if (!subjectName.trim()) {
      Alert.alert('Erro', 'Digite o nome da matéria');
      return;
    }

    if (topics.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos um tópico');
      return;
    }

    const updatedSubject = {
      ...subject,
      name: subjectName.trim(),
      priority: selectedPriority,
      topics: topics,
    };

    onSave(updatedSubject);
    handleClose();
  };

  const handleClose = () => {
    setSubjectName('');
    setSelectedPriority('média');
    setTopics([]);
    setNewTopicName('');
    onClose();
  };

  if (!subject) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <BlurView intensity={20} style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Editar Matéria</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.label}>Nome da Matéria:</Text>
              <TextInput
                style={styles.input}
                value={subjectName}
                onChangeText={setSubjectName}
                placeholder="Ex: Matemática"
                placeholderTextColor="#6b7280"
              />
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
              <Text style={styles.label}>Tópicos:</Text>
              <View style={styles.addTopicContainer}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={newTopicName}
                  onChangeText={setNewTopicName}
                  placeholder="Nome do novo tópico"
                  placeholderTextColor="#6b7280"
                />
                <TouchableOpacity style={styles.addTopicButton} onPress={addTopic}>
                  <Plus size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.topicsList} showsVerticalScrollIndicator={false}>
                {topics.map((topic, index) => (
                  <View key={index} style={styles.topicItem}>
                    <Text style={styles.topicName}>{topic.name}</Text>
                    <TouchableOpacity
                      style={styles.removeTopicButton}
                      onPress={() => removeTopic(index)}
                    >
                      <Trash2 size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
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
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 15,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
  addTopicContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  addTopicButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topicsList: {
    maxHeight: 200,
  },
  topicItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  topicName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  removeTopicButton: {
    padding: 5,
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