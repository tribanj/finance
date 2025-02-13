import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Drawer, Box, List, ListItem, ListItemIcon, ListItemText, useTheme, CssBaseline } from '@mui/material';
import { Menu, Brightness4, Brightness7, Dashboard, People, Payment, Notifications, SupportAgent } from '@mui/icons-material';

const drawerWidth = 240;

export default function DashboardLayout({ darkMode, toggleDarkMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Loan Products', icon: <Payment />, path: '/loans' },
    { text: 'Applications', icon: <People />, path: '/applications' },
    { text: 'Notifications', icon: <Notifications />, path: '/notifications' },
    { text: 'Support Tickets', icon: <SupportAgent />, path: '/tickets' }
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: theme.palette.background.default }}>
      <CssBaseline />
     
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={toggleDarkMode} color="inherit">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRight: 'none',
            backdropFilter: 'blur(10px)'
          },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItem button key={item.text} component={Link} to={item.path}>
              <ListItemIcon sx={{ color: theme.palette.text.primary }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}