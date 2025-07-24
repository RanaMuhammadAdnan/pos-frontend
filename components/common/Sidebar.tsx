"use client";
import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Receipt as ReceiptIcon,
  LocationCity as LocationCityIcon,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant?: 'permanent' | 'temporary';
  drawerWidth?: number;
}

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Vendors', icon: <PeopleIcon />, path: '/vendors' },
  { text: 'Items', icon: <ShoppingCartIcon />, path: '/items' },
  { text: 'Purchase Invoices', icon: <ReceiptIcon />, path: '/purchase-invoices' },
  { text: 'Cities', icon: <LocationCityIcon />, path: '/cities' },
  { text: 'Customers', icon: <PersonIcon />, path: '/customers' },
  { text: 'Sale Invoices', icon: <ReceiptIcon />, path: '/sale-invoices' },
  { text: 'Expenses', icon: <AssessmentIcon />, path: '/expenses' },
];

export const Sidebar = ({ 
  open, 
  onClose, 
  variant = 'temporary',
  drawerWidth = 280 
}: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleNavigation = (path: string) => {
    router.push(path);
    if (variant === 'temporary') {
      onClose();
    }
  };

  const sidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {session?.user?.username || 'User'}
        </Typography>
      </Box>

      <Divider />

      <List sx={{ flexGrow: 1, pt: 1 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  minHeight: 48,
                  backgroundColor: isActive 
                    ? 'primary.main' 
                    : 'transparent',
                  color: isActive 
                    ? 'primary.contrastText' 
                    : 'text.primary',
                  '&:hover': {
                    backgroundColor: isActive 
                      ? 'primary.dark' 
                      : 'action.hover',
                    transform: 'translateX(4px)',
                    transition: 'all 0.2s ease-in-out',
                  },
                  '& .MuiListItemIcon-root': {
                    color: isActive 
                      ? 'primary.contrastText' 
                      : 'text.secondary',
                  },
                  '& .MuiListItemText-primary': {
                    fontWeight: isActive ? 600 : 400,
                  },
                  transition: 'all 0.2s ease-in-out',
                  position: 'relative',
                  '&::before': isActive ? {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    backgroundColor: 'primary.main',
                    borderRadius: '0 2px 2px 0',
                  } : {},
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 40,
                  color: 'inherit',
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  if (variant === 'permanent') {
    return (
      <Box
        sx={{
          width: drawerWidth,
          height: '100%',
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
          overflow: 'auto',
        }}
      >
        {sidebarContent}
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant={variant}
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
}; 