import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box, 
  CircularProgress,
  Button,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { imagesAPI } from '../services/api';

const demoImages = [
  {
    id: 1,
    title: 'Forest Adventure',
    description: 'A beautiful forest scene with animals',
    url: 'https://source.unsplash.com/random/300x400?forest,cartoon',
    created_at: '2023-08-28T10:30:00Z'
  },
  {
    id: 2,
    title: 'Ocean Friends',
    description: 'Underwater world with colorful fish',
    url: 'https://source.unsplash.com/random/300x400?ocean,cartoon',
    created_at: '2023-08-27T15:45:00Z'
  },
  {
    id: 3,
    title: 'Space Explorer',
    description: 'Journey through the stars and planets',
    url: 'https://source.unsplash.com/random/300x400?space,cartoon',
    created_at: '2023-08-26T09:15:00Z'
  },
  {
    id: 4,
    title: 'Dinosaur Land',
    description: 'Prehistoric world with friendly dinosaurs',
    url: 'https://source.unsplash.com/random/300x400?dinosaur,cartoon',
    created_at: '2023-08-25T14:20:00Z'
  },
  {
    id: 5,
    title: 'Fairy Tale Castle',
    description: 'Magical castle in the clouds',
    url: 'https://source.unsplash.com/random/300x400?castle,cartoon',
    created_at: '2023-08-24T11:10:00Z'
  },
  {
    id: 6,
    title: 'Jungle Safari',
    description: 'Wild animals in their natural habitat',
    url: 'https://source.unsplash.com/random/300x400?jungle,cartoon',
    created_at: '2023-08-23T16:30:00Z'
  },
];

const MyCreations = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch user's images like this:
        // const response = await imagesAPI.getImages();
        // setImages(response.data);
        
        // For demo purposes, we'll use the demo images
        setImages(demoImages);
      } catch (err) {
        console.error('Error fetching images:', err);
        setError('Failed to load images. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchImages();
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this creation?')) {
      try {
        // In a real app, you would call the API like this:
        // await imagesAPI.deleteImage(id);
        // setImages(images.filter(img => img.id !== id));
        
        // For demo, just filter out the deleted image
        setImages(images.filter(img => img.id !== id));
      } catch (err) {
        console.error('Error deleting image:', err);
        setError('Failed to delete the image. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box textAlign="center" color="error.main">
          <Typography variant="h6">{error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Creations
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => navigate('/upload')}
        >
          New Creation
        </Button>
      </Box>

      {images.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            You haven't created any images yet.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/upload')}
            sx={{ mt: 2 }}
          >
            Create Your First Image
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {images.map((image) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  },
                }}
              >
                <Box sx={{ position: 'relative', pt: '133.33%' }}>
                  <CardMedia
                    component="img"
                    image={image.url}
                    alt={image.title}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Typography gutterBottom variant="h6" component="h2" noWrap>
                      {image.title}
                    </Typography>
                    <Box>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => navigate(`/edit/${image.id}`)}
                        aria-label="edit"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDelete(image.id)}
                        aria-label="delete"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {image.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Created: {formatDate(image.created_at)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyCreations;
