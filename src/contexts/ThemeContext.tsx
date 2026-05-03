import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { createTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    return savedMode || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#2563EB',
        dark: '#1D4ED8',
        light: '#3B82F6',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#F59E0B',
        dark: '#D97706',
        light: '#FCD34D',
        contrastText: '#ffffff',
      },
      success: { main: '#10B981', dark: '#059669', light: '#34D399' },
      error:   { main: '#EF4444', dark: '#DC2626', light: '#F87171' },
      warning: { main: '#F59E0B', dark: '#D97706', light: '#FCD34D' },
      info:    { main: '#3B82F6', dark: '#2563EB', light: '#60A5FA' },
      ...(mode === 'dark'
        ? {
            background: { default: '#0F172A', paper: '#1E293B' },
            divider: 'rgba(148,163,184,0.12)',
          }
        : {
            background: { default: '#F8FAFC', paper: '#FFFFFF' },
            divider: 'rgba(15,23,42,0.08)',
          }),
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      h1: { fontWeight: 800 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 500 },
      subtitle2: { fontWeight: 600 },
      button: { fontWeight: 600, textTransform: 'none' as const },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: ({ theme: t }) => ({
            borderRadius: t.shape.borderRadius,
            backgroundImage: 'none',
            border: `1px solid ${t.palette.divider}`,
            boxShadow:
              t.palette.mode === 'dark'
                ? 'none'
                : '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.05)',
            transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
            '&:hover': {
              borderColor:
                t.palette.mode === 'dark'
                  ? 'rgba(59,130,246,0.35)'
                  : t.palette.primary.main + '30',
              boxShadow:
                t.palette.mode === 'dark'
                  ? 'none'
                  : '0 4px 14px 0 rgba(0,0,0,0.09)',
            },
          }),
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            minHeight: 40,
            borderRadius: 8,
            fontWeight: 600,
            textTransform: 'none',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': { boxShadow: '0 4px 12px rgba(37,99,235,0.25)' },
          },
          outlined: { borderWidth: '1.5px', '&:hover': { borderWidth: '1.5px' } },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, borderRadius: 6 },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined' },
        styleOverrides: {
          root: { '& .MuiOutlinedInput-root': { borderRadius: 10 } },
        },
      },
      MuiDialog: {
        styleOverrides: { paper: { borderRadius: 20 } },
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: ({ theme: t }) => ({
            borderTop: `1px solid ${t.palette.divider}`,
            backdropFilter: 'blur(12px)',
            backgroundColor:
              t.palette.mode === 'dark'
                ? 'rgba(30,41,59,0.9)'
                : 'rgba(255,255,255,0.9)',
          }),
        },
      },
      MuiListItemButton: {
        styleOverrides: { root: { borderRadius: 8 } },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
    },
  });

  const value: ThemeContextType = { mode, toggleTheme, theme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};
