import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  CardMedia,
  Container,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

// Sample coloring pages data - replace with actual data from your backend
const sampleColoringPages = [
  {
    id: 1,
    title: 'Cute Animals',
    description: 'Color your favorite animals',
    image: 'https://via.placeholder.com/300x200?text=Cute+Animals',
    difficulty: 'Easy'
  },
  {
    id: 2,
    title: 'Fantasy World',
    description: 'Magical creatures and enchanted forests',
    image: 'https://via.placeholder.com/300x200?text=Fantasy+World',
    difficulty: 'Medium'
  },
  {
    id: 3,
    title: 'Space Adventure',
    description: 'Rockets, planets, and aliens',
    image: 'https://via.placeholder.com/300x200?text=Space+Adventure',
    difficulty: 'Hard'
  },
];

const Dashboard = () => {
  const { user, loading, logout } = useAuth();
  const [coloringPages, setColoringPages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, you would fetch this data from your backend
    // For now, we'll use the sample data
    setColoringPages(sampleColoringPages);
  }, []);

  const handleStartColoring = (pageId) => {
    // Navigate to coloring page with the selected ID
    navigate(`/color/${pageId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome, {user?.username || 'Artist'}! 👋
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Choose a coloring page to get started or create your own!
        </Typography>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
          Featured Coloring Pages
        </Typography>
        <Grid container spacing={4}>
          {coloringPages.map((page) => (
            <Grid item key={page.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={page.image}
                  alt={page.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3">
                    {page.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {page.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Difficulty: {page.difficulty}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, justifyContent: 'center' }}>
                  <Button 
                    variant="contained" 
                    size="large" 
                    fullWidth
                    onClick={() => handleStartColoring(page.id)}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2 30%, #00B0FF 90%)',
                      },
                    }}
                  >
                    Start Coloring
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 6, mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Can't find what you're looking for?
        </Typography>
        <Button 
          variant="outlined" 
          size="large" 
          color="primary"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 'bold',
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            },
          }}
          onClick={() => navigate('/create')}
        >
          Create Your Own
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;
