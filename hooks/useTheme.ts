import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ThemeColors {
  primary: string[];
  secondary: string[];
  accent: string[];
}

export const themes = {
  default: {
    primary: ['#0f1419', '#1a1a2e', '#16213e'],
    secondary: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.2)'],
    accent: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
  },
  dark: {
    primary: ['#000000', '#111111', '#1a1a1a'],
    secondary: ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.1)'],
    accent: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
  },
  blue: {
    primary: ['#0c1426', '#1e3a8a', '#1d4ed8'],
    secondary: ['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.2)'],
    accent: ['#60a5fa', '#34d399', '#fbbf24', '#f87171']
  },
  purple: {
    primary: ['#1e1b4b', '#4c1d95', '#6d28d9'],
    secondary: ['rgba(139, 92, 246, 0.1)', 'rgba(139, 92, 246, 0.2)'],
    accent: ['#a78bfa', '#34d399', '#fbbf24', '#f87171']
  },
  green: {
    primary: ['#064e3b', '#065f46', '#047857'],
    secondary: ['rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.2)'],
    accent: ['#34d399', '#60a5fa', '#fbbf24', '#f87171']
  }
};

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const stored = await AsyncStorage.getItem('app_theme');
      if (stored && themes[stored]) {
        setCurrentTheme(stored);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTheme = async (themeName: string) => {
    try {
      if (themes[themeName]) {
        await AsyncStorage.setItem('app_theme', themeName);
        setCurrentTheme(themeName);
      }
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return {
    currentTheme,
    theme: themes[currentTheme],
    updateTheme,
    loading,
    availableThemes: Object.keys(themes)
  };
}