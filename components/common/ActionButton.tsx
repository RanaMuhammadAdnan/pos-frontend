"use client";
import React from 'react';
import { IconButton, Tooltip, IconButtonProps } from '@mui/material';

interface ActionButtonProps extends Omit<IconButtonProps, 'onClick'> {
  icon: React.ReactNode;
  tooltip: string;
  onClick: () => void;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  size?: 'small' | 'medium' | 'large';
}

export const ActionButton = ({ 
  icon, 
  tooltip, 
  onClick, 
  color = 'primary',
  size = 'small',
  ...props 
}: ActionButtonProps) => {
  return (
    <Tooltip title={tooltip}>
      <IconButton
        onClick={onClick}
        color={color}
        size={size}
        {...props}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
}; 