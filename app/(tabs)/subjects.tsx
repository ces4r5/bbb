import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Plus, Book, Target, Clock, CircleCheck as CheckCircle, Circle, Filter } from 'lucide-react-native';
import { useStorage } from '@/hooks/useStorage';
import { SubjectCard } from '@/components/SubjectCard';
import { AddSubjectModal } from '@/components/AddSubjectModal';
import { PerformanceModal } from '@/components/PerformanceModal';
import { EditSubjectModal } from '@/components/EditSubjectModal';
import { useTheme } from '@/hooks/useTheme';

export default function SubjectsScreen() {
  const { theme } = useTheme();
  const { data: subjects, updateData: setSubjects } = useStorage('subjects', []);
  const { data: settings } = useStorage('settings', {
    performanceColors: {
      red: { min: 0, max: 60 },
      yellow: { min: 60, max: 80 },
      green: { min: 80, max: 100 }
    }
  });
  
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [performanceModalVisible, setPerformanceModalVisible] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [filterPriority, setFilterPriority] = useState('all');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const getPerformanceColor = (percentage) => {
    const colors = settings.performanceColors;
    if (percentage >= colors.green.min) return '#10b981';
    if (percentage >= colors.yellow.min) return '#f59e0b';
    return '#ef4444';
  };

  const filteredSubjects = subjects.filter(subject => {
    if (filterPriority === 'all') return true;
    return subject.priority === filterPriority;
  });

  const handleAddPerformance = (subject, topic = null) => {
    setSelectedSubject(subject);
    setSelectedTopic(topic);
    setPerformanceModalVisible(true);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setEditModalVisible(true);
  };

  const handleUpdateSubject = (updatedSubject) => {
    const updatedSubjects = subjects.map(subject => 
      subject.name === editingSubject.name ? updatedSubject : subject
    );
    setSubjects(updatedSubjects);
    setEditModalVisible(false);
    setEditingSubject(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.primary}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Matérias</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setAddModalVisible(true)}
          >
            <Plus size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Priority Filter */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.filterButton, filterPriority === 'all' && styles.filterButtonActive]}
              onPress={() => setFilterPriority('all')}
            >
              <Text style={[styles.filterText, filterPriority === 'all' && styles.filterTextActive]}>
                Todas
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterPriority === 'alta' && styles.filterButtonActive]}
              onPress={() => setFilterPriority('alta')}
            >
              <Text style={[styles.filterText, filterPriority === 'alta' && styles.filterTextActive]}>
                Alta
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterPriority === 'média' && styles.filterButtonActive]}
              onPress={() => setFilterPriority('média')}
            >
              <Text style={[styles.filterText, filterPriority === 'média' && styles.filterTextActive]}>
                Média
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterPriority === 'baixa' && styles.filterButtonActive]}
              onPress={() => setFilterPriority('baixa')}
            >
              <Text style={[styles.filterText, filterPriority === 'baixa' && styles.filterTextActive]}>
                Baixa
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {filteredSubjects.length === 0 ? (
            <BlurView intensity={20} style={styles.emptyCard}>
              <Book size={48} color="#6b7280" />
              <Text style={styles.emptyText}>Nenhuma matéria encontrada</Text>
              <Text style={styles.emptySubtext}>
                {filterPriority === 'all' 
                  ? 'Adicione suas primeiras matérias'
                  : `Nenhuma matéria com prioridade ${filterPriority}`
                }
              </Text>
            </BlurView>
          ) : (
            filteredSubjects.map((subject, index) => (
              <SubjectCard
                key={index}
                subject={subject}
                onAddPerformance={handleAddPerformance}
                onEdit={handleEditSubject}
                getPerformanceColor={getPerformanceColor}
              />
            ))
          )}
        </ScrollView>

        <AddSubjectModal
          visible={addModalVisible}
          onClose={() => setAddModalVisible(false)}
          onSave={(newSubjects) => {
            setSubjects([...subjects, ...newSubjects]);
            setAddModalVisible(false);
          }}
        />

        <PerformanceModal
          visible={performanceModalVisible}
          onClose={() => setPerformanceModalVisible(false)}
          subject={selectedSubject}
          topic={selectedTopic}
          onSave={(performance) => {
            const updatedSubjects = subjects.map(subject => {
              if (subject.name === selectedSubject.name) {
                const updatedSubject = { ...subject };
                if (selectedTopic) {
                  updatedSubject.topics = updatedSubject.topics.map(topic => {
                    if (topic.name === selectedTopic.name) {
                      return {
                        ...topic,
                        hoursStudied: (topic.hoursStudied || 0) + performance.hours,
                        questionsResolved: (topic.questionsResolved || 0) + performance.questionsResolved,
                        questionsCorrect: (topic.questionsCorrect || 0) + performance.questionsCorrect,
                        lastStudied: new Date().toISOString(),
                      };
                    }
                    return topic;
                  });
                } else {
                  updatedSubject.hoursStudied = (updatedSubject.hoursStudied || 0) + performance.hours;
                  updatedSubject.questionsResolved = (updatedSubject.questionsResolved || 0) + performance.questionsResolved;
                  updatedSubject.questionsCorrect = (updatedSubject.questionsCorrect || 0) + performance.questionsCorrect;
                  updatedSubject.lastStudied = new Date().toISOString();
                }
                return updatedSubject;
              }
              return subject;
            });
            setSubjects(updatedSubjects);
            setPerformanceModalVisible(false);
          }}
        />

        <EditSubjectModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          subject={editingSubject}
          onSave={handleUpdateSubject}
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
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#ffffff',
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