import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Divider, 
  IconButton,
  Link as MuiLink,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Brush as BrushIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Pinterest as PinterestIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const footerLinks = [
    { title: 'Features', links: ['Coloring Tools', 'Gallery', 'Premium'] },
    { title: 'Company', links: ['About Us', 'Contact', 'Careers'] },
    { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, url: '#' },
    { icon: <TwitterIcon />, url: '#' },
    { icon: <InstagramIcon />, url: '#' },
    { icon: <PinterestIcon />, url: '#' },
  ];

  return (
    <Box component="footer" sx={{ 
      bgcolor: theme.palette.grey[100],
      pt: 8,
      pb: 4,
      mt: 'auto',
      borderTop: `1px solid ${theme.palette.divider}`
    }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ 
          mb: 6, 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '800px',
          mx: 'auto'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'left', mb: 2 }}>
            <BrushIcon sx={{ color: 'primary.main', fontSize: 32, mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
              ColorWish AI
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Unleash your child's creativity with our interactive coloring platform. 
            Fun, safe, and educational for kids of all ages.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'left' }}>
            {socialLinks.map((social, index) => (
              <IconButton 
                key={index} 
                component="a" 
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: 'white',
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                {social.icon}
              </IconButton>
            ))}
          </Box>
        </Box>

        {/* Links Section - Four Columns */}
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Grid container spacing={4} sx={{ maxWidth: '1200px' }}>
            {/* Features Column */}
            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {footerLinks[0].title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {footerLinks[0].links.map((link, linkIndex) => (
                  <li key={linkIndex} style={{ marginBottom: '8px' }}>
                    <MuiLink 
                      href="#" 
                      color="text.secondary" 
                      sx={{ 
                        textDecoration: 'none',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {link}
                    </MuiLink>
                  </li>
                ))}
              </Box>
            </Grid>

            {/* Company Column */}
            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {footerLinks[1].title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {footerLinks[1].links.map((link, linkIndex) => (
                  <li key={linkIndex} style={{ marginBottom: '8px' }}>
                    <MuiLink 
                      href="#" 
                      color="text.secondary" 
                      sx={{ 
                        textDecoration: 'none',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {link}
                    </MuiLink>
                  </li>
                ))}
              </Box>
            </Grid>

            {/* Legal Column */}
            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {footerLinks[2].title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {footerLinks[2].links.map((link, linkIndex) => (
                  <li key={linkIndex} style={{ marginBottom: '8px' }}>
                    <MuiLink 
                      href="#" 
                      color="text.secondary" 
                      sx={{ 
                        textDecoration: 'none',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {link}
                    </MuiLink>
                  </li>
                ))}
              </Box>
            </Grid>

            {/* Contact Column */}
            <Grid item xs={6} sm={3}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Contact Us
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmailIcon sx={{ color: 'primary.main', mr: 1, minWidth: 24 }} />
                <Typography variant="body2" color="text.secondary">
                  contact@kidscoloringai.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneIcon sx={{ color: 'primary.main', mr: 1, minWidth: 24 }} />
                <Typography variant="body2" color="text.secondary">
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <LocationIcon sx={{ color: 'primary.main', mr: 1, mt: 0.5, minWidth: 24 }} />
                <Typography variant="body2" color="text.secondary">
                  123 Creative St.<br />
                  San Francisco, CA 94107
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        {/* Copyright section */}
        <Box sx={{ 
          width: '100%',
          mt: 6,
          pt: 3,
          borderTop: `1px solid ${theme.palette.divider}`
        }}>
          <Typography variant="body2" color="text.secondary" align="center">
            &copy; {new Date().getFullYear()} ColorWish AI. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
