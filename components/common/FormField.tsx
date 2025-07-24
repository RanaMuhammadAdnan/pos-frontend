"use client";
import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface FormFieldProps extends Omit<TextFieldProps, 'onChange'> {
  name: string;
  value: string;
  onChange: (field: string, value: string) => void;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
}

export const FormField = ({ 
  name, 
  value, 
  onChange, 
  required = false, 
  multiline = false, 
  rows = 1,
  ...props 
}: FormFieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(name, e.target.value);
  };

  return (
    <TextField
      name={name}
      value={value}
      onChange={handleChange}
      fullWidth
      required={required}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      disabled={props.disabled}
      {...props}
    />
  );
}; 