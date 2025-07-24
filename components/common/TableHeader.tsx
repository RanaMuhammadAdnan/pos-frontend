import React from 'react';
import { Box, Typography, Button, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';

interface TableHeaderProps {
  title: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  addButtonText?: string;
  searchPlaceholder?: string;
}

export const TableHeader = ({ 
  title, 
  searchTerm, 
  onSearchChange, 
  onAddClick, 
  addButtonText = 'Add New',
  searchPlaceholder = 'Search...'
}: TableHeaderProps) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      mb: 3,
      flexDirection: { xs: 'column', sm: 'row' },
      gap: 2
    }}>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        width: { xs: '100%', sm: 'auto' },
        flexDirection: { xs: 'column', sm: 'row' }
      }}>
        <TextField
          size="small"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ 
            minWidth: { xs: '100%', sm: '250px' },
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddClick}
          sx={{ 
            borderRadius: 2,
            minWidth: { xs: '100%', sm: 'auto' }
          }}
        >
          {addButtonText}
        </Button>
      </Box>
    </Box>
  );
}; 