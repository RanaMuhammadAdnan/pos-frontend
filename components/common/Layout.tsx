"use client";
import React, { useState } from 'react';
import { Box, CssBaseline, useTheme, useMediaQuery, Drawer } from '@mui/material';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const DRAWER_WIDTH = 280;

export const Layout = ({ children, title }: LayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <CssBaseline />
      
      {/* Navbar */}
      <Navbar onMenuClick={handleDrawerToggle} title={title} />
      
      {/* Desktop Sidebar - Always visible on large screens */}
      {!isMobile && (
        <Box
          component="nav"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            position: 'fixed',
            top: 64, // Navbar height
            left: 0,
            height: 'calc(100vh - 64px)',
            zIndex: 1,
          }}
        >
          <Sidebar 
            open={true} 
            onClose={() => {}} 
            variant="permanent"
            drawerWidth={DRAWER_WIDTH}
          />
        </Box>
      )}
      
      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              top: 64, // Navbar height
              height: 'calc(100vh - 64px)',
            },
          }}
        >
          <Sidebar 
            open={mobileOpen} 
            onClose={handleDrawerClose}
            variant="temporary"
            drawerWidth={DRAWER_WIDTH}
          />
        </Drawer>
      )}
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 }, // Responsive padding
          backgroundColor: 'background.default',
          minHeight: 'calc(100vh - 64px)', // Subtract navbar height
          width: { 
            xs: '100%', 
            md: `calc(100% - ${DRAWER_WIDTH}px)` 
          },
          ml: { 
            xs: 0, 
            md: `${DRAWER_WIDTH}px` 
          },
          mt: '64px', // Push content below navbar
        }}
      >
        {children}
      </Box>
    </Box>
  );
}; 