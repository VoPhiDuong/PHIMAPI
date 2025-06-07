import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  Telegram,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const movieCategories = [
    { name: 'Phim Hành Động', path: '/the-loai/hanh-dong' },
    { name: 'Phim Hài Hước', path: '/the-loai/hai-huoc' },
    { name: 'Phim Tình Cảm', path: '/the-loai/tinh-cam' },
    { name: 'Phim Kinh Dị', path: '/the-loai/kinh-di' },
    { name: 'Phim Khoa Học Viễn Tưởng', path: '/the-loai/khoa-hoc-vien-tuong' },
  ];

  const countries = [
    { name: 'Phim Việt Nam', path: '/quoc-gia/viet-nam' },
    { name: 'Phim Hàn Quốc', path: '/quoc-gia/han-quoc' },
    { name: 'Phim Trung Quốc', path: '/quoc-gia/trung-quoc' },
    { name: 'Phim Nhật Bản', path: '/quoc-gia/nhat-ban' },
    { name: 'Phim Mỹ', path: '/quoc-gia/my' },
  ];

  const quickLinks = [
    { name: 'Trang Chủ', path: '/' },
    { name: 'Phim Mới', path: '/phim-moi' },
    { name: 'Phim Hay', path: '/phim-hay' },
    { name: 'Top IMDb', path: '/top-imdb' },
    { name: 'Lịch Chiếu', path: '/lich-chieu' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#0a0a1a',
        color: '#ffffff',
        pt: 6,
        pb: 3,
        mt: 8,
        borderTop: '1px solid rgba(255, 107, 53, 0.2)',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={3}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: '800',
                color: '#ff6b35',
                mb: 2,
                fontSize: '1.8rem',
              }}
            >
              🎬 PhimHay
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 3,
                lineHeight: 1.6,
              }}
            >
              Trang web xem phim online miễn phí chất lượng cao với kho phim đa dạng,
              cập nhật liên tục các bộ phim mới nhất từ Việt Nam và quốc tế.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                sx={{
                  color: '#ff6b35',
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  '&:hover': {
                    backgroundColor: '#ff6b35',
                    color: '#ffffff',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                sx={{
                  color: '#ff6b35',
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  '&:hover': {
                    backgroundColor: '#ff6b35',
                    color: '#ffffff',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <YouTube />
              </IconButton>
              <IconButton
                sx={{
                  color: '#ff6b35',
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  '&:hover': {
                    backgroundColor: '#ff6b35',
                    color: '#ffffff',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                sx={{
                  color: '#ff6b35',
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  '&:hover': {
                    backgroundColor: '#ff6b35',
                    color: '#ffffff',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Telegram />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: '700',
                color: '#ffffff',
                mb: 2,
                fontSize: '1.1rem',
              }}
            >
              Liên Kết Nhanh
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    '&:hover': {
                      color: '#ff6b35',
                    },
                    transition: 'color 0.3s ease',
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Movie Categories */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: '700',
                color: '#ffffff',
                mb: 2,
                fontSize: '1.1rem',
              }}
            >
              Thể Loại
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {movieCategories.map((category) => (
                <Link
                  key={category.path}
                  component={RouterLink}
                  to={category.path}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    '&:hover': {
                      color: '#ff6b35',
                    },
                    transition: 'color 0.3s ease',
                  }}
                >
                  {category.name}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Countries */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: '700',
                color: '#ffffff',
                mb: 2,
                fontSize: '1.1rem',
              }}
            >
              Quốc Gia
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {countries.map((country) => (
                <Link
                  key={country.path}
                  component={RouterLink}
                  to={country.path}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    '&:hover': {
                      color: '#ff6b35',
                    },
                    transition: 'color 0.3s ease',
                  }}
                >
                  {country.name}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: '700',
                color: '#ffffff',
                mb: 2,
                fontSize: '1.1rem',
              }}
            >
              Liên Hệ
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ color: '#ff6b35', fontSize: '1.2rem' }} />
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  contact@phimhay.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ color: '#ff6b35', fontSize: '1.2rem' }} />
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  +84 123 456 789
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ color: '#ff6b35', fontSize: '1.2rem' }} />
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  Hà Nội, Việt Nam
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider
          sx={{
            my: 4,
            borderColor: 'rgba(255, 107, 53, 0.2)',
          }}
        />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            © {currentYear} PhimHay. Tất cả quyền được bảo lưu.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', md: 'flex-end' },
            }}
          >
            <Link
              href="#"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                '&:hover': {
                  color: '#ff6b35',
                },
                transition: 'color 0.3s ease',
              }}
            >
              Chính Sách Bảo Mật
            </Link>
            <Link
              href="#"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                '&:hover': {
                  color: '#ff6b35',
                },
                transition: 'color 0.3s ease',
              }}
            >
              Điều Khoản Sử Dụng
            </Link>
            <Link
              href="#"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                '&:hover': {
                  color: '#ff6b35',
                },
                transition: 'color 0.3s ease',
              }}
            >
              DMCA
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;