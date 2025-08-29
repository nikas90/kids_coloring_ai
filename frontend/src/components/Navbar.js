import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem, 
  Divider, 
  useTheme,
  useMediaQuery,
  Container
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brush as BrushIcon,
  Palette as PaletteIcon,
  Image as ImageIcon,
  AccountCircle as AccountCircleIcon,
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/');
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleDashboard = () => {
    handleMenuClose();
    navigate('/dashboard');
  };

  // Navigation items
  const navItems = [
    { text: 'Color', icon: <BrushIcon sx={{ mr: 1 }} />, path: '/color' },
    { text: 'Gallery', icon: <ImageIcon sx={{ mr: 1 }} />, path: '/gallery' },
    ...(isAuthenticated ? [{ text: 'My Creations', icon: <PaletteIcon sx={{ mr: 1 }} />, path: '/creations' }] : []),
  ];

  return (
    <AppBar position="static" elevation={1} sx={{ bgcolor: 'white', color: 'text.primary' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1 }}>
          {/* Logo / Brand */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                color: 'primary.dark',
              },
            }}
          >
            <BrushIcon sx={{ mr: 1, fontSize: 28 }} />
            ColorWish AI
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    color: 'text.primary',
                    mx: 1,
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'rgba(33, 150, 243, 0.08)',
                    },
                  }}
                >
                  {item.icon}
                  {item.text}
                </Button>
              ))}

              {isAuthenticated ? (
                <>
                  <IconButton
                    onClick={handleMenuOpen}
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    sx={{ ml: 1 }}
                  >
                    <Avatar 
                      alt={user?.username || 'User'} 
                      src={user?.avatar}
                      sx={{ 
                        width: 36, 
                        height: 36,
                        bgcolor: 'primary.main',
                        color: 'white'
                      }}
                    >
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.08))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                      },
                    }}
                  >
                    <Box sx={{ px: 2, py: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {user?.username || 'User'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user?.email || ''}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <MenuItem onClick={handleDashboard}>
                      <DashboardIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                      Dashboard
                    </MenuItem>
                    <MenuItem onClick={handleProfile}>
                      <AccountCircleIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                      Profile
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ExitToAppIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    sx={{
                      ml: 2,
                      borderRadius: 20,
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                      },
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    sx={{
                      ml: 2,
                      borderRadius: 20,
                      background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #388E3C 30%, #66BB6A 90%)',
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          )}

          {/* Mobile Navigation */}
          {isMobile && (
            <Box sx={{ display: 'flex' }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="mobile-menu"
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="mobile-menu"
                anchorEl={mobileMenuAnchor}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(mobileMenuAnchor)}
                onClose={handleMenuClose}
              >
                {navItems.map((item) => (
                  <MenuItem 
                    key={item.text} 
                    component={RouterLink} 
                    to={item.path}
                    onClick={handleMenuClose}
                  >
                    {item.icon}
                    {item.text}
                  </MenuItem>
                ))}
                
                {isAuthenticated ? (
                  <>
                    <Divider />
                    <MenuItem onClick={handleDashboard}>
                      <DashboardIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                      Dashboard
                    </MenuItem>
                    <MenuItem onClick={handleProfile}>
                      <AccountCircleIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                      Profile
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ExitToAppIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                      Logout
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <Divider />
                    <MenuItem 
                      component={RouterLink} 
                      to="/login"
                      onClick={handleMenuClose}
                    >
                      Login
                    </MenuItem>
                    <MenuItem 
                      component={RouterLink} 
                      to="/register"
                      onClick={handleMenuClose}
                      sx={{
                        color: 'primary.main',
                        fontWeight: 600,
                      }}
                    >
                      Sign Up
                    </MenuItem>
                  </>
                )}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;