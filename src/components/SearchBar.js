import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Popper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import axios from 'axios';

const SearchBar = ({ variant = 'standard', size = 'medium', fullWidth = false, sx = {} }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    setAnchorEl(event.currentTarget);

    // Clear previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set new timeout
    if (value.trim().length > 1) {
      setLoading(true);
      const timeout = setTimeout(() => {
        fetchSearchResults(value);
      }, 500);
      setTypingTimeout(timeout);
    } else {
      setSearchResults([]);
      setLoading(false);
    }
  };

  const fetchSearchResults = async (keyword) => {
    if (!keyword || keyword.trim().length < 2) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://phimapi.com/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&limit=5`
      );
      if (response.data && response.data.data && response.data.data.items) {
        setSearchResults(response.data.data.items);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setLoading(false);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/tim-kiem?keyword=${encodeURIComponent(searchTerm.trim())}`);
      setSearchResults([]);
      if (isMobile) {
        setSearchTerm('');
      }
    }
  };

  const handleResultClick = (slug) => {
    navigate(`/phim/${slug}`);
    setSearchResults([]);
    setSearchTerm('');
  };

  const open = Boolean(anchorEl) && searchResults.length > 0;
  const id = open ? 'search-popper' : undefined;

  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <form onSubmit={handleSearchSubmit}>
        <TextField
          variant={variant}
          size={size}
          fullWidth={fullWidth}
          placeholder="Tìm kiếm phim..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {loading ? (
                  <CircularProgress size={20} />
                ) : (
                  searchTerm && (
                    <IconButton size="small" onClick={handleClearSearch} edge="end">
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  )
                )}
              </InputAdornment>
            ),
            sx: {
              borderRadius: 4,
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              },
            },
          }}
          sx={{
            minWidth: { xs: '100%', sm: 200, md: 300 },
          }}
        />
      </form>

      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ width: anchorEl ? anchorEl.clientWidth : undefined, zIndex: 1300 }}
      >
        <Paper elevation={3} sx={{ mt: 1, maxHeight: 400, overflow: 'auto' }}>
          <List sx={{ p: 0 }}>
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <React.Fragment key={result._id}>
                  <ListItem
                    button
                    onClick={() => handleResultClick(result.slug)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        variant="rounded"
                        src={
                          result.poster_url && result.poster_url.startsWith('http')
                            ? result.poster_url
                            : result.poster_url
                              ? `https://img.phimapi.com/${result.poster_url}`
                              : 'https://via.placeholder.com/50x75?text=No+Image'
                        }
                        alt={result.name}
                        sx={{ width: 50, height: 75 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1" component="div" noWrap>
                          {result.name}
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2" color="text.secondary" component="div" noWrap>
                            {result.origin_name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            {result.year && (
                              <Typography variant="caption" sx={{ backgroundColor: 'primary.main', color: 'white', px: 0.5, borderRadius: 0.5 }}>
                                {result.year}
                              </Typography>
                            )}
                            {result.episode_current && (
                              <Typography variant="caption" sx={{ backgroundColor: 'secondary.main', color: 'white', px: 0.5, borderRadius: 0.5 }}>
                                {result.episode_current}
                              </Typography>
                            )}
                          </Box>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  {index < searchResults.length - 1 && <Divider />}
                </React.Fragment>
              ))
            ) : (
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="body2" align="center">
                      {loading ? 'Đang tìm kiếm...' : 'Không tìm thấy kết quả'}
                    </Typography>
                  }
                />
              </ListItem>
            )}
          </List>
        </Paper>
      </Popper>
    </Box>
  );
};

export default SearchBar;