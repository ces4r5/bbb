import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Settings, Bell, Palette, Clock, Target, Trash2, Download, Upload } from 'lucide-react-native';
import { useStorage } from '@/hooks/useStorage';
import { useTheme, themes } from '@/hooks/useTheme';

export default function SettingsScreen() {
  const { theme, currentTheme, updateTheme } = useTheme();
  const { data: settings, updateData: setSettings } = useStorage('settings', {
    performanceColors: {
      red: { min: 0, max: 60 },
      yellow: { min: 60, max: 80 },
      green: { min: 80, max: 100 }
    },
    pomodoroSettings: {
      workTime: 25,
      shortBreak: 5,
      longBreak: 15,
      longBreakInterval: 4,
      autoStart: false,
      soundEnabled: true
    },
    notifications: {
      enabled: true,
      studyReminders: true,
      goalReminders: true,
      breakReminders: true
    }
  });

  const [redMax, setRedMax] = useState(settings.performanceColors.red.max.toString());
  const [yellowMax, setYellowMax] = useState(settings.performanceColors.yellow.max.toString());
  const [workTime, setWorkTime] = useState(settings.pomodoroSettings.workTime.toString());
  const [shortBreak, setShortBreak] = useState(settings.pomodoroSettings.shortBreak.toString());
  const [longBreak, setLongBreak] = useState(settings.pomodoroSettings.longBreak.toString());
  const [longBreakInterval, setLongBreakInterval] = useState(settings.pomodoroSettings.longBreakInterval.toString());

  const updatePerformanceColors = () => {
    const red = parseInt(redMax);
    const yellow = parseInt(yellowMax);
    
    if (red >= yellow || yellow >= 100) {
      Alert.alert('Erro', 'Os valores devem ser crescentes e menores que 100');
      return;
    }

    setSettings({
      ...settings,
      performanceColors: {
        red: { min: 0, max: red },
        yellow: { min: red, max: yellow },
        green: { min: yellow, max: 100 }
      }
    });
  };

  const updatePomodoroSettings = () => {
    const work = parseInt(workTime);
    const short = parseInt(shortBreak);
    const long = parseInt(longBreak);
    const interval = parseInt(longBreakInterval);

    if (work <= 0 || short <= 0 || long <= 0 || interval <= 0) {
      Alert.alert('Erro', 'Todos os valores devem ser maiores que zero');
      return;
    }

    setSettings({
      ...settings,
      pomodoroSettings: {
        ...settings.pomodoroSettings,
        workTime: work,
        shortBreak: short,
        longBreak: long,
        longBreakInterval: interval
      }
    });
  };

  const updateNotificationSetting = (key, value) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value
      }
    });
  };

  const updatePomodoroSetting = (key, value) => {
    setSettings({
      ...settings,
      pomodoroSettings: {
        ...settings.pomodoroSettings,
        [key]: value
      }
    });
  };

  const resetSettings = () => {
    Alert.alert(
      'Resetar Configurações',
      'Tem certeza que deseja resetar todas as configurações?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Resetar', 
          style: 'destructive',
          onPress: () => {
            setSettings({
              performanceColors: {
                red: { min: 0, max: 60 },
                yellow: { min: 60, max: 80 },
                green: { min: 80, max: 100 }
              },
              pomodoroSettings: {
                workTime: 25,
                shortBreak: 5,
                longBreak: 15,
                longBreakInterval: 4,
                autoStart: false,
                soundEnabled: true
              },
              notifications: {
                enabled: true,
                studyReminders: true,
                goalReminders: true,
                breakReminders: true
              }
            });
            // Reset form values
            setRedMax('60');
            setYellowMax('80');
            setWorkTime('25');
            setShortBreak('5');
            setLongBreak('15');
            setLongBreakInterval('4');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.primary}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Configurações</Text>
          <Settings size={24} color="#3b82f6" />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Theme Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Palette size={20} color="#3b82f6" /> Tema do Aplicativo
            </Text>
            <BlurView intensity={20} style={styles.card}>
              <Text style={styles.cardSubtitle}>
                Escolha o tema de cores do aplicativo
              </Text>
              
              <View style={styles.themeGrid}>
                {Object.keys(themes).map(themeName => (
                  <TouchableOpacity
                    key={themeName}
                    style={[
                      styles.themeOption,
                      currentTheme === themeName && styles.themeOptionActive
                    ]}
                    onPress={() => updateTheme(themeName)}
                  >
                    <LinearGradient
                      colors={themes[themeName].primary}
                      style={styles.themePreview}
                    />
                    <Text style={[
                      styles.themeLabel,
                      currentTheme === themeName && styles.themeLabelActive
                    ]}>
                      {getThemeDisplayName(themeName)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </BlurView>
          </View>

          {/* Performance Colors */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Palette size={20} color="#3b82f6" /> Cores de Desempenho
            </Text>
            <BlurView intensity={20} style={styles.card}>
              <Text style={styles.cardSubtitle}>
                Configure os intervalos de porcentagem para cada cor
              </Text>
              
              <View style={styles.colorRow}>
                <View style={[styles.colorBox, { backgroundColor: '#ef4444' }]} />
                <Text style={styles.colorLabel}>Vermelho (0% - </Text>
                <TextInput
                  style={styles.colorInput}
                  value={redMax}
                  onChangeText={setRedMax}
                  keyboardType="numeric"
                  placeholder="60"
                />
                <Text style={styles.colorLabel}>%)</Text>
              </View>

              <View style={styles.colorRow}>
                <View style={[styles.colorBox, { backgroundColor: '#f59e0b' }]} />
                <Text style={styles.colorLabel}>Amarelo ({redMax}% - </Text>
                <TextInput
                  style={styles.colorInput}
                  value={yellowMax}
                  onChangeText={setYellowMax}
                  keyboardType="numeric"
                  placeholder="80"
                />
                <Text style={styles.colorLabel}>%)</Text>
              </View>

              <View style={styles.colorRow}>
                <View style={[styles.colorBox, { backgroundColor: '#10b981' }]} />
                <Text style={styles.colorLabel}>Verde ({yellowMax}% - 100%)</Text>
              </View>

              <TouchableOpacity style={styles.updateButton} onPress={updatePerformanceColors}>
                <Text style={styles.updateButtonText}>Atualizar Cores</Text>
              </TouchableOpacity>
            </BlurView>
          </View>

          {/* Pomodoro Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Clock size={20} color="#3b82f6" /> Cronômetro Pomodoro
            </Text>
            <BlurView intensity={20} style={styles.card}>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Tempo de Trabalho (min):</Text>
                <TextInput
                  style={styles.input}
                  value={workTime}
                  onChangeText={setWorkTime}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Pausa Curta (min):</Text>
                <TextInput
                  style={styles.input}
                  value={shortBreak}
                  onChangeText={setShortBreak}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Pausa Longa (min):</Text>
                <TextInput
                  style={styles.input}
                  value={longBreak}
                  onChangeText={setLongBreak}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Intervalo Pausa Longa:</Text>
                <TextInput
                  style={styles.input}
                  value={longBreakInterval}
                  onChangeText={setLongBreakInterval}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Iniciar Automaticamente</Text>
                <Switch
                  value={settings.pomodoroSettings.autoStart}
                  onValueChange={(value) => updatePomodoroSetting('autoStart', value)}
                  trackColor={{ false: '#3e3e3e', true: '#3b82f6' }}
                  thumbColor={settings.pomodoroSettings.autoStart ? '#ffffff' : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Som Habilitado</Text>
                <Switch
                  value={settings.pomodoroSettings.soundEnabled}
                  onValueChange={(value) => updatePomodoroSetting('soundEnabled', value)}
                  trackColor={{ false: '#3e3e3e', true: '#3b82f6' }}
                  thumbColor={settings.pomodoroSettings.soundEnabled ? '#ffffff' : '#f4f3f4'}
                />
              </View>

              <TouchableOpacity style={styles.updateButton} onPress={updatePomodoroSettings}>
                <Text style={styles.updateButtonText}>Atualizar Configurações</Text>
              </TouchableOpacity>
            </BlurView>
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Bell size={20} color="#3b82f6" /> Notificações
            </Text>
            <BlurView intensity={20} style={styles.card}>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Notificações Habilitadas</Text>
                <Switch
                  value={settings.notifications.enabled}
                  onValueChange={(value) => updateNotificationSetting('enabled', value)}
                  trackColor={{ false: '#3e3e3e', true: '#3b82f6' }}
                  thumbColor={settings.notifications.enabled ? '#ffffff' : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Lembretes de Estudo</Text>
                <Switch
                  value={settings.notifications.studyReminders}
                  onValueChange={(value) => updateNotificationSetting('studyReminders', value)}
                  trackColor={{ false: '#3e3e3e', true: '#3b82f6' }}
                  thumbColor={settings.notifications.studyReminders ? '#ffffff' : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Lembretes de Metas</Text>
                <Switch
                  value={settings.notifications.goalReminders}
                  onValueChange={(value) => updateNotificationSetting('goalReminders', value)}
                  trackColor={{ false: '#3e3e3e', true: '#3b82f6' }}
                  thumbColor={settings.notifications.goalReminders ? '#ffffff' : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Lembretes de Pausa</Text>
                <Switch
                  value={settings.notifications.breakReminders}
                  onValueChange={(value) => updateNotificationSetting('breakReminders', value)}
                  trackColor={{ false: '#3e3e3e', true: '#3b82f6' }}
                  thumbColor={settings.notifications.breakReminders ? '#ffffff' : '#f4f3f4'}
                />
              </View>
            </BlurView>
          </View>

          {/* Reset Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Trash2 size={20} color="#ef4444" /> Zona de Perigo
            </Text>
            <BlurView intensity={20} style={styles.card}>
              <Text style={styles.cardSubtitle}>
                Resetar todas as configurações para os valores padrão
              </Text>
              <TouchableOpacity style={styles.resetButton} onPress={resetSettings}>
                <Trash2 size={18} color="#ffffff" />
                <Text style={styles.resetButtonText}>Resetar Configurações</Text>
              </TouchableOpacity>
            </BlurView>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const getThemeDisplayName = (themeName: string) => {
  const names = {
    default: 'Padrão',
    dark: 'Escuro',
    blue: 'Azul',
    purple: 'Roxo',
    green: 'Verde'
  };
  return names[themeName] || themeName;
};

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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 20,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  colorLabel: {
    color: '#ffffff',
    fontSize: 14,
  },
  colorInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 8,
    color: '#ffffff',
    fontSize: 14,
    minWidth: 50,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  inputLabel: {
    color: '#ffffff',
    fontSize: 14,
    flex: 1,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
    color: '#ffffff',
    fontSize: 14,
    minWidth: 80,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  switchLabel: {
    color: '#ffffff',
    fontSize: 14,
    flex: 1,
  },
  updateButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  updateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginTop: 10,
  },
  themeOption: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 80,
  },
  themeOptionActive: {
    borderColor: '#3b82f6',
  },
  themePreview: {
    width: 50,
    height: 30,
    borderRadius: 8,
    marginBottom: 8,
  },
  themeLabel: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  themeLabelActive: {
    color: '#3b82f6',
  },
});