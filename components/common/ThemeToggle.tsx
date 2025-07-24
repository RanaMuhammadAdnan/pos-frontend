"use client";
import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';
import { useAtomValue, useSetAtom } from 'jotai';
import { themeAtom, toggleThemeAtom } from '../../atoms/themeAtom';

export const ThemeToggle = () => {
  const themeMode = useAtomValue(themeAtom);
  const toggleTheme = useSetAtom(toggleThemeAtom);

  const handleToggle = () => {
    toggleTheme();
  };

  return (
    <Tooltip title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton
        onClick={handleToggle}
        color="inherit"
        size="large"
        sx={{
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        {themeMode === 'light' ? <DarkMode /> : <LightMode />}
      </IconButton>
    </Tooltip>
  );
}; 