import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardMedia,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  IconButton,
  Divider,
  Link as MuiLink
} from '@mui/material';
import { 
  Brush as BrushIcon, 
  Palette as PaletteIcon, 
  Image as ImageIcon,
  AutoAwesome as AutoAwesomeIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// Header Component
const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <AppBar 
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'white',
        borderBottom: `1px solid ${theme.palette.divider}`,
        py: 1,
        position: 'sticky',
        top: 0,
        zIndex: theme.zIndex.appBar,
        width: '100%'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BrushIcon sx={{ 
              color: theme.palette.primary.main, 
              fontSize: 32, 
              mr: 1 
            }} />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontWeight: 800,
                color: theme.palette.primary.main,
                textDecoration: 'none',
                '&:hover': {
                  opacity: 0.9,
                },
              }}
            >
              ColorWish AI
            </Typography>
          </Box>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button 
                component={Link} 
                to="/gallery"
                sx={{ color: 'text.primary', fontWeight: 600 }}
              >
                Gallery
              </Button>
              <Button 
                component={Link} 
                to="/about"
                sx={{ color: 'text.primary', fontWeight: 600 }}
              >
                About Us
              </Button>
              {isAuthenticated ? (
                <Button 
                  variant="contained"
                  component={Link}
                  to="/dashboard"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  My Account
                </Button>
              ) : (
                <Button 
                  variant="contained"
                  component={Link}
                  to="/login"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  Sign In
                </Button>
              )}
            </Box>
          )}

          {isMobile && (
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              sx={{ color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const features = [
  {
    icon: <BrushIcon fontSize="large" color="primary" />,
    title: 'Color Anywhere',
    description: 'Color beautiful designs on any device with our easy-to-use coloring tools.'
  },
  {
    icon: <PaletteIcon fontSize="large" color="primary" />,
    title: 'Endless Colors',
    description: 'Choose from millions of colors and create your perfect palette.'
  },
  {
    icon: <ImageIcon fontSize="large" color="primary" />,
    title: 'Save & Share',
    description: 'Save your artwork and share it with friends and family.'
  }
];

const sampleDesigns = [
  {
    id: 1,
    title: 'Jungle Adventure',
    image: 'https://via.placeholder.com/300x200?text=Jungle+Adventure',
    difficulty: 'Easy'
  },
  {
    id: 2,
    title: 'Under the Sea',
    image: 'https://via.placeholder.com/300x200?text=Under+the+Sea',
    difficulty: 'Medium'
  },
  {
    id: 3,
    title: 'Space Explorer',
    image: 'https://via.placeholder.com/300x200?text=Space+Explorer',
    difficulty: 'Hard'
  },
  {
    id: 4,
    title: 'Dinosaur World',
    image: 'https://via.placeholder.com/300x200?text=Dinosaur+World',
    difficulty: 'Medium'
  },
];

const Welcome = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <Header />
      
      <Box sx={{ flex: 1 }}>
        {/* Hero Section */}
        <Box 
          sx={{
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            py: { xs: 8, md: 12 },
            mb: 6,
            borderRadius: { xs: 0, md: 4 },
            mx: { xs: -2, md: 0 },
            px: { xs: 2, md: 0 },
          }}
        >
          <Container maxWidth="lg">
            <Grid container alignItems="center" spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography 
                  variant="h2" 
                  component="h1" 
                  gutterBottom
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2,
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                  }}
                >
                  Unleash Your Child's Creativity
                </Typography>
                <Typography 
                  variant="h5" 
                  color="text.secondary" 
                  paragraph
                  sx={{ mb: 4, fontSize: { xs: '1.1rem', md: '1.25rem' } }}
                >
                  A fun and interactive coloring app designed for kids of all ages. 
                  Create amazing artwork with just a few taps!
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleGetStarted}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #388E3C 30%, #66BB6A 90%)',
                      },
                    }}
                  >
                    {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/gallery')}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                      },
                    }}
                  >
                    View Gallery
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box 
                  component="img"
                  src="/images/hero-illustration.png"
                  alt="Kids coloring illustration"
                  sx={{
                    width: '100%',
                    maxWidth: '600px',
                    height: 'auto',
                    display: 'block',
                    mx: 'auto',
                    borderRadius: 2,
                    boxShadow: 6,
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x400?text=Kids+Coloring+Fun';
                  }}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Features Section */}
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              mb: 6,
              color: 'primary.main'
            }}
          >
            Why Choose Our Coloring App?
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 4, 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    borderRadius: 3,
                    position: 'relative',
                    top: 0,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6,
                      top: '-5px',
                      marginBottom: '-5px',
                    },
                  }}
                >
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Popular Designs Section */}
        <Box sx={{ bgcolor: 'grey.50', py: 8, mt: 4 }}>
          <Container maxWidth="lg">
            <Typography 
              variant="h3" 
              component="h2" 
              align="center" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                mb: 6,
                color: 'primary.main'
              }}
            >
              Popular Designs
            </Typography>
            
            <Grid container spacing={3}>
              {sampleDesigns.map((design) => (
                <Grid item xs={12} sm={6} md={3} key={design.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: 3,
                      overflow: 'hidden',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={design.image}
                      alt={design.title}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" component="h3">
                          {design.title}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            px: 1.5, 
                            py: 0.5, 
                            bgcolor: 'primary.light', 
                            color: 'primary.contrastText',
                            borderRadius: 4,
                            fontWeight: 'bold',
                            fontSize: '0.7rem',
                          }}
                        >
                          {design.difficulty}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
                        <Button 
                          size="small" 
                          startIcon={<AutoAwesomeIcon />}
                          onClick={() => navigate(`/color/${design.id}`)}
                          sx={{ flex: 1 }}
                        >
                          Color
                        </Button>
                        <Button 
                          size="small" 
                          startIcon={<ShareIcon />}
                          sx={{ minWidth: 'auto' }}
                        >
                          {!isMobile && 'Share'}
                        </Button>
                        <Button 
                          size="small" 
                          startIcon={<DownloadIcon />}
                          sx={{ minWidth: 'auto' }}
                        >
                          {!isMobile && 'Save'}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/gallery')}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #00B0FF 90%)',
                  },
                }}
              >
                View All Designs
              </Button>
            </Box>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Container maxWidth="md">
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
              Ready to Start Creating?
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
              Join thousands of kids who are already enjoying our coloring app. It's free, fun, and easy to use!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleGetStarted}
              sx={{
                px: 6,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #FF9800 30%, #FFC107 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #F57C00 30%, #FFA000 90%)',
                },
              }}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started for Free'}
            </Button>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Welcome;