"use client";
import React, { useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useAtomValue } from 'jotai';
import { themeAtom } from '../../atoms/themeAtom';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const themeMode = useAtomValue(themeAtom);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
          primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#dc004e',
            light: '#ff5983',
            dark: '#9a0036',
            contrastText: '#ffffff',
          },
          background: {
            default: themeMode === 'light' ? '#f8f9fa' : '#0a0a0a',
            paper: themeMode === 'light' ? '#ffffff' : '#1e1e1e',
          },
          text: {
            primary: themeMode === 'light' ? '#1a1a1a' : '#ffffff',
            secondary: themeMode === 'light' ? '#666666' : '#b0b0b0',
          },
          divider: themeMode === 'light' ? '#e0e0e0' : '#333333',
          // Custom colors for POS system
          success: {
            main: '#2e7d32',
            light: '#4caf50',
            dark: '#1b5e20',
          },
          warning: {
            main: '#ed6c02',
            light: '#ff9800',
            dark: '#e65100',
          },
          error: {
            main: '#d32f2f',
            light: '#f44336',
            dark: '#c62828',
          },
          info: {
            main: '#0288d1',
            light: '#03a9f4',
            dark: '#01579b',
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 600,
          },
          h2: {
            fontWeight: 600,
          },
          h3: {
            fontWeight: 600,
          },
          h4: {
            fontWeight: 600,
          },
          h5: {
            fontWeight: 600,
          },
          h6: {
            fontWeight: 600,
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: themeMode === 'light' 
                  ? '0 2px 8px rgba(0,0,0,0.08)' 
                  : '0 2px 8px rgba(0,0,0,0.4)',
                border: themeMode === 'light' 
                  ? '1px solid rgba(0,0,0,0.06)' 
                  : '1px solid rgba(255,255,255,0.08)',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 500,
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                backgroundColor: themeMode === 'light' ? '#ffffff' : '#1e1e1e',
                color: themeMode === 'light' ? '#1a1a1a' : '#ffffff',
                borderBottom: themeMode === 'light' 
                  ? '1px solid rgba(0,0,0,0.08)' 
                  : '1px solid rgba(255,255,255,0.08)',
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundImage: 'none',
                backgroundColor: themeMode === 'light' ? '#ffffff' : '#1e1e1e',
                borderRight: themeMode === 'light' 
                  ? '1px solid rgba(0,0,0,0.08)' 
                  : '1px solid rgba(255,255,255,0.08)',
              },
            },
          },
          MuiTableHead: {
            styleOverrides: {
              root: {
                backgroundColor: themeMode === 'light' 
                  ? 'rgba(25, 118, 210, 0.04)' 
                  : 'rgba(25, 118, 210, 0.08)',
                '& .MuiTableCell-head': {
                  backgroundColor: 'transparent',
                  fontWeight: 600,
                  color: themeMode === 'light' ? '#1976d2' : '#42a5f5',
                  borderBottom: themeMode === 'light' 
                    ? '2px solid rgba(25, 118, 210, 0.12)' 
                    : '2px solid rgba(66, 165, 245, 0.2)',
                },
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                borderBottom: themeMode === 'light' 
                  ? '1px solid rgba(0,0,0,0.06)' 
                  : '1px solid rgba(255,255,255,0.08)',
              },
            },
          },
          MuiTableRow: {
            styleOverrides: {
              root: {
                '&:hover': {
                  backgroundColor: themeMode === 'light' 
                    ? 'rgba(25, 118, 210, 0.02)' 
                    : 'rgba(66, 165, 245, 0.04)',
                },
              },
            },
          },
        },
      }),
    [themeMode]
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}; 