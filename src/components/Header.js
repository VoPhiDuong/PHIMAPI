import React, { useState, useContext } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Collapse,
  InputBase,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Home as HomeIcon,
  Movie as MovieIcon,
  Tv as TvIcon,
  Star as StarIcon,
  Public as PublicIcon,
  Category as CategoryIcon,
  DateRange as DateRangeIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { AppContext } from '../context/AppContext';
import SearchBar from './SearchBar';
import { convertToSlug } from '../utils/utils';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [genreMenuAnchor, setGenreMenuAnchor] = useState(null);
  const [countryMenuAnchor, setCountryMenuAnchor] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const menuItems = [
    { label: 'Trang Chủ', path: '/', icon: <HomeIcon /> },
    { label: 'Phim Lẻ', path: '/phim-le', icon: <MovieIcon /> },
    { label: 'Phim Bộ', path: '/phim-bo', icon: <TvIcon /> },
    { label: 'Phim Hay', path: '/phim-hay', icon: <StarIcon /> },
  ];

  const genres = [
    'Hành Động', 'Hài Hước', 'Tình Cảm', 'Kinh Dị', 'Khoa Học Viễn Tưởng',
    'Phiêu Lưu', 'Hoạt Hình', 'Tài Liệu', 'Chiến Tranh', 'Âm Nhạc',
    'Thể Thao', 'Gia Đình', 'Bí Ẩn', 'Tâm Lý', 'Học Đường',
    'Cổ Trang', 'Võ Thuật', 'Chính Kịch', 'Hình Sự', 'Thần Thoại'
  ];

  const countries = [
    'Việt Nam', 'Hàn Quốc', 'Trung Quốc', 'Nhật Bản', 'Thái Lan',
    'Mỹ', 'Anh', 'Pháp', 'Đức', 'Ấn Độ',
    'Hồng Kông', 'Đài Loan', 'Singapore', 'Philippines', 'Indonesia',
    'Malaysia', 'Canada', 'Úc', 'Nga', 'Tây Ban Nha',
    'Ý', 'Brazil', 'Mexico', 'Thổ Nhĩ Kỳ', 'Iran'
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: '#0f0f23',
        boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
        borderBottom: '1px solid rgba(255, 107, 53, 0.1)',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
        {/* Logo */}
        <Typography
          variant="h5"
          component={RouterLink}
          to="/"
          sx={{
            fontWeight: '800',
            color: '#ff6b35',
            textDecoration: 'none',
            fontSize: { xs: '1.5rem', md: '1.8rem' },
            mr: 4,
            '&:hover': {
              color: '#e55a2b',
            },
            transition: 'color 0.3s ease',
          }}
        >
          🎬 PhimHay
        </Typography>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                component={RouterLink}
                to={item.path}
                startIcon={item.icon}
                sx={{
                  color: '#ffffff',
                  fontWeight: '600',
                  textTransform: 'none',
                  mx: 1,
                  px: 2,
                  py: 1,
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    color: '#ff6b35',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {item.label}
              </Button>
            ))}
            
            {/* Genre Dropdown */}
            <Button
              onClick={(e) => setGenreMenuAnchor(e.currentTarget)}
              sx={{
                color: '#ffffff',
                fontWeight: '600',
                textTransform: 'none',
                mx: 1,
                px: 2,
                py: 1,
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  color: '#ff6b35',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Thể Loại ▼
            </Button>
            <Menu
              anchorEl={genreMenuAnchor}
              open={Boolean(genreMenuAnchor)}
              onClose={() => setGenreMenuAnchor(null)}
              PaperProps={{
                sx: {
                  backgroundColor: '#1a1a2e',
                  border: '1px solid rgba(255, 107, 53, 0.2)',
                  borderRadius: '12px',
                  mt: 1,
                  maxHeight: 300,
                  width: 200,
                },
              }}
            >
              {genres.map((genre) => (
                <MenuItem
                  key={genre}
                  onClick={() => {
                    navigate(`/the-loai/${convertToSlug(genre)}`);
                    setGenreMenuAnchor(null);
                  }}
                  sx={{
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 107, 53, 0.1)',
                      color: '#ff6b35',
                    },
                  }}
                >
                  {genre}
                </MenuItem>
              ))}
            </Menu>

            {/* Country Dropdown */}
            <Button
              onClick={(e) => setCountryMenuAnchor(e.currentTarget)}
              sx={{
                color: '#ffffff',
                fontWeight: '600',
                textTransform: 'none',
                mx: 1,
                px: 2,
                py: 1,
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  color: '#ff6b35',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Quốc Gia ▼
            </Button>
            <Menu
              anchorEl={countryMenuAnchor}
              open={Boolean(countryMenuAnchor)}
              onClose={() => setCountryMenuAnchor(null)}
              PaperProps={{
                sx: {
                  backgroundColor: '#1a1a2e',
                  border: '1px solid rgba(255, 107, 53, 0.2)',
                  borderRadius: '12px',
                  mt: 1,
                  maxHeight: 300,
                  width: 200,
                },
              }}
            >
              {countries.map((country) => (
                <MenuItem
                  key={country}
                  onClick={() => {
                    navigate(`/quoc-gia/${convertToSlug(country)}`);
                    setCountryMenuAnchor(null);
                  }}
                  sx={{
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 107, 53, 0.1)',
                      color: '#ff6b35',
                    },
                  }}
                >
                  {country}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        )}

        {/* Search Bar */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            position: 'relative',
            borderRadius: '25px',
            backgroundColor: alpha('#ffffff', 0.1),
            border: '1px solid rgba(255, 107, 53, 0.3)',
            '&:hover': {
              backgroundColor: alpha('#ffffff', 0.15),
              borderColor: '#ff6b35',
            },
            '&:focus-within': {
              backgroundColor: alpha('#ffffff', 0.15),
              borderColor: '#ff6b35',
              boxShadow: '0 0 0 2px rgba(255, 107, 53, 0.2)',
            },
            ml: { xs: 1, md: 2 },
            width: { xs: '200px', md: '300px' },
            transition: 'all 0.3s ease',
          }}
        >
          <Box
            sx={{
              padding: theme.spacing(0, 2),
              height: '100%',
              position: 'absolute',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SearchIcon sx={{ color: '#ff6b35' }} />
          </Box>
          <InputBase
            placeholder="Tìm kiếm phim..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              color: '#ffffff',
              width: '100%',
              '& .MuiInputBase-input': {
                padding: theme.spacing(1, 1, 1, 0),
                paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                fontSize: '0.9rem',
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              },
            }}
          />
        </Box>

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setMobileMenuOpen(true)}
            sx={{ ml: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#0f0f23',
            width: 280,
            border: 'none',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{
              color: '#ff6b35',
              fontWeight: '700',
              mb: 3,
              textAlign: 'center',
            }}
          >
            🎬 PhimHay
          </Typography>
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.path}
                component={RouterLink}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                sx={{
                  borderRadius: '8px',
                  mb: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  },
                }}
              >
                <Box sx={{ mr: 2, color: '#ff6b35' }}>{item.icon}</Box>
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: '#ffffff',
                      fontWeight: '600',
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;