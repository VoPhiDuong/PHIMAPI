import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Collapse,
  IconButton,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

const EpisodeSelector = ({ episodes, currentEpisode, onEpisodeSelect }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expanded, setExpanded] = useState(true);
  const [currentServer, setCurrentServer] = useState(0);

  // Xử lý cấu trúc episodes mới (array) và cũ (object)
  let servers = [];
  let episodeArray = [];
  
  if (!episodes) {
    // Không có episodes
  } else if (Array.isArray(episodes)) {
    // Cấu trúc mới: episodes là array với server_name và server_data
    servers = episodes.map(server => server.server_name || `Server ${episodes.indexOf(server)}`);
    if (episodes[currentServer] && episodes[currentServer].server_data) {
      episodeArray = episodes[currentServer].server_data;
    }
  } else {
    // Cấu trúc cũ: episodes là object với server keys
    servers = Object.keys(episodes);
    const currentEpisodeList = episodes[servers[currentServer]] || [];
    episodeArray = Array.isArray(currentEpisodeList) ? currentEpisodeList : [];
  }

  // Xử lý khi không có tập nào
  if (!episodes || servers.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Typography variant="body1" align="center">
          Không có tập phim nào khả dụng.
        </Typography>
      </Paper>
    );
  }

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleServerChange = (event, newValue) => {
    setCurrentServer(newValue);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: { xs: 1, sm: 2 },
        mb: { xs: 2, sm: 4 },
        backgroundColor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: { xs: 1, sm: 2 } }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          Danh sách tập phim
        </Typography>
        <IconButton onClick={toggleExpanded} size="small">
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        {servers.length > 1 && (
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: { xs: 1, sm: 2 } }}>
            <Tabs
              value={currentServer}
              onChange={handleServerChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              aria-label="server tabs"
              sx={{
                minHeight: { xs: 32, sm: 48 },
                '& .MuiTabs-indicator': {
                  height: 2
                }
              }}
            >
              {servers.map((server, index) => (
                <Tab
                  key={index}
                  label={server}
                  sx={{
                    fontWeight: currentServer === index ? 'bold' : 'normal',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    minHeight: { xs: 32, sm: 48 },
                    px: { xs: 1, sm: 2 },
                    py: { xs: 0.3, sm: 1 },
                  }}
                />
              ))}
            </Tabs>
          </Box>
        )}

        <Grid container spacing={isMobile ? 0.75 : 1}>
          {episodeArray.map((episode) => {
            // Kiểm tra xem episode có phải là object hay string
            const episodeId = typeof episode === 'object' ? episode.slug || episode.id : episode;
            const episodeName = typeof episode === 'object' ? episode.name || `Tập ${episode.slug || episode.id}` : `Tập ${episode}`;
            const isActive = currentEpisode === episodeId;

            return (
              <Grid item xs={3} sm={2} md={2} lg={1} key={episodeId}>
                <Button
                  variant={isActive ? 'contained' : 'outlined'}
                  color={isActive ? 'primary' : 'inherit'}
                  onClick={() => onEpisodeSelect(episodeId, servers[currentServer])}
                  fullWidth
                  sx={{
                    borderRadius: 1.5,
                    fontWeight: isActive ? 'bold' : 'normal',
                    minHeight: { xs: 40, sm: 36 },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    p: { xs: '4px 2px', sm: '6px 8px' },
                    lineHeight: 1.1,
                    textTransform: 'none',
                    '&.MuiButton-contained': {
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  {episodeName}
                </Button>
              </Grid>
            );
          })}
        </Grid>
      </Collapse>
    </Paper>
  );
};

export default EpisodeSelector;