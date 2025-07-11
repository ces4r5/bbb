import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PerformanceChartProps {
  data: any[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const maxHours = Math.max(...data.map(d => d.hours));
  const maxQuestions = Math.max(...data.map(d => d.questions));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Horas Estudadas por Dia</Text>
      <View style={styles.chart}>
        {data.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barWrapper}>
              <View 
                style={[
                  styles.bar,
                  { 
                    height: `${(item.hours / maxHours) * 100}%`,
                    backgroundColor: '#3b82f6'
                  }
                ]}
              />
            </View>
            <Text style={styles.barLabel}>{item.day}</Text>
            <Text style={styles.barValue}>{item.hours.toFixed(1)}h</Text>
          </View>
        ))}
      </View>
      
      <Text style={styles.title}>Questões Resolvidas</Text>
      <View style={styles.chart}>
        {data.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barWrapper}>
              <View 
                style={[
                  styles.bar,
                  { 
                    height: `${(item.questions / maxQuestions) * 100}%`,
                    backgroundColor: '#10b981'
                  }
                ]}
              />
            </View>
            <Text style={styles.barLabel}>{item.day}</Text>
            <Text style={styles.barValue}>{item.questions}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 30,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    height: 80,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: 20,
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  barValue: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '500',
  },
});