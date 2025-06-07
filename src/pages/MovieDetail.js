import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Tabs, Tab, Typography } from '@mui/material';
import axios from 'axios';

import MovieInfo from '../components/MovieInfo';
import VideoPlayer from '../components/VideoPlayer';
import EpisodeSelector from '../components/EpisodeSelector';
import RelatedMovies from '../components/RelatedMovies';
import CommentSection from '../components/CommentSection';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorDisplay from '../components/ErrorDisplay';

const MovieDetail = () => {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [currentServer, setCurrentServer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedMovies, setRelatedMovies] = useState([]);

  // Lấy phim liên quan
  const fetchRelatedMovies = useCallback(async (category) => {
    try {
      const response = await axios.get(
        `https://phimapi.com/v1/api/the-loai/${category}?page=1&sort_field=modified.time&sort_type=desc&limit=6`
      );
      if (response.data && response.data.data && response.data.data.items) {
        // Lọc bỏ phim hiện tại khỏi danh sách phim liên quan
        const filtered = response.data.data.items.filter(item => item.slug !== slug);
        setRelatedMovies(filtered.slice(0, 6));
      }
    } catch (err) {
      console.error('Error fetching related movies:', err);
    }
  }, [slug]);

  // Lấy thông tin phim từ API
  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`https://phimapi.com/phim/${slug}`);
        console.log('API Response:', response.data);
        if (response.data && response.data.movie) {
          // Kết hợp movie data với episodes từ response
          const movieData = {
            ...response.data.movie,
            episodes: response.data.episodes || [],
            medias: response.data.medias || []
          };
          
          setMovie(movieData);
          console.log('Movie data:', movieData);
          console.log('Episodes structure:', movieData.episodes);
          console.log('Medias structure:', movieData.medias);
          
          // Expose movie data globally for debugging
          window.movieDebugData = movieData;

          // Lấy phim liên quan
          if (movieData.category && movieData.category.length > 0) {
            const category = movieData.category[0].slug;
            fetchRelatedMovies(category);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Đã xảy ra lỗi khi tải thông tin phim. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    if (slug) {
      fetchMovieDetail();
    }
  }, [slug, fetchRelatedMovies]);

  // Thiết lập tập phim mặc định
  useEffect(() => {
    if (movie && (!currentEpisode || !currentServer)) {
      console.log('=== Setting default episode and server ===');
      console.log('Movie episodes:', movie.episodes);
      console.log('Movie medias:', movie.medias);
      console.log('Current episode:', currentEpisode);
      console.log('Current server:', currentServer);
      
      // Kiểm tra nếu episodes là array với cấu trúc server_name và server_data
      if (Array.isArray(movie.episodes) && movie.episodes.length > 0) {
        console.log('Episodes is array with servers:', movie.episodes);
        const firstServerData = movie.episodes[0];
        console.log('First server data:', firstServerData);
        
        if (firstServerData && firstServerData.server_data && Array.isArray(firstServerData.server_data) && firstServerData.server_data.length > 0) {
          const firstEpisode = firstServerData.server_data[0];
          console.log('First episode:', firstEpisode);
          
          const episodeId = firstEpisode.slug || firstEpisode.id || firstEpisode.filename;
          const serverName = firstServerData.server_name || '0';
          
          console.log('Setting currentEpisode to:', episodeId);
          console.log('Setting currentServer to:', serverName);
          
          setCurrentEpisode(episodeId);
          setCurrentServer(serverName);
        } else {
          console.error('No server_data found in first server');
        }
      }
      // Kiểm tra nếu episodes là object với server keys (fallback)
      else if (movie.episodes && typeof movie.episodes === 'object' && Object.keys(movie.episodes).length > 0) {
        console.log('Episodes is object with servers');
        const firstServer = Object.keys(movie.episodes)[0];
        console.log('First server:', firstServer);
        console.log('Episodes for first server:', movie.episodes[firstServer]);
        
        if (movie.episodes[firstServer] && movie.episodes[firstServer].length > 0) {
          const firstEpisode = movie.episodes[firstServer][0];
          console.log('First episode:', firstEpisode);
          
          // Xác định ID của tập phim
          let episodeId;
          if (typeof firstEpisode === 'object') {
            episodeId = firstEpisode.slug || firstEpisode.id || firstEpisode.filename;
            console.log('Episode is object, ID:', episodeId);
          } else {
            episodeId = firstEpisode;
            console.log('Episode is not object, ID:', episodeId);
          }
          
          if (episodeId) {
            console.log('Setting current server to:', firstServer);
            console.log('Setting current episode to:', episodeId);
            setCurrentServer(firstServer);
            setCurrentEpisode(episodeId);
          } else {
            console.error('Could not determine episode ID');
          }
        } else {
          console.error('No episodes found for server:', firstServer);
        }
      }
      // Fallback to medias if no episodes
      else if (movie.medias && Array.isArray(movie.medias) && movie.medias.length > 0) {
        console.log('No episodes but found medias, using first media as default');
        setCurrentEpisode('0');
        setCurrentServer('0');
        console.log('Setting currentEpisode and currentServer to 0');
      }
      else {
        console.log('No episodes or medias found');
      }
    }
  }, [movie, currentEpisode, currentServer]);

  // Xử lý khi chọn tập phim
  const handleEpisodeSelect = (episodeId, server) => {
    console.log('Episode selected:', { episodeId, server });
    setCurrentEpisode(episodeId);
    setCurrentServer(server);
    
    // Scroll lên đầu phần video player
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Xử lý khi chuyển tab
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  if (loading) {
    return <LoadingIndicator message="Đang tải thông tin phim..." />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={() => window.location.reload()} />;
  }

  if (!movie) {
    return <ErrorDisplay message="Không tìm thấy thông tin phim." />;
  }

  // Xác định URL video và tên tập phim
  let videoUrl = null;
  let currentEpisodeName = '';
  let episodeTitle = '';
  let finalVideoUrl = null;

  if (movie && movie.episodes && currentServer && currentEpisode) {
    console.log('Determining video URL with:', { currentServer, currentEpisode });
    console.log('Available episodes:', movie.episodes);
    
    // Tìm server episodes dựa trên cấu trúc mới
    let serverEpisodes = null;
    if (Array.isArray(movie.episodes)) {
      const serverData = movie.episodes.find(server => server.server_name === currentServer);
      serverEpisodes = serverData ? serverData.server_data : null;
    } else {
      // Fallback cho cấu trúc cũ
      serverEpisodes = movie.episodes[currentServer];
    }
    console.log('Server episodes:', serverEpisodes);
    
    if (serverEpisodes) {
      const episode = serverEpisodes.find(ep => {
        if (typeof ep === 'object') {
          return (ep.slug === currentEpisode || ep.id === currentEpisode);
        }
        return ep === currentEpisode;
      });
      
      console.log('Found episode:', episode);
      
      if (episode) {
        if (typeof episode === 'object') {
          videoUrl = episode;
          currentEpisodeName = episode.name || `Tập ${episode.slug || episode.id}`;
        } else {
          // Nếu episode là string, thử tìm trong movie.medias
          console.log('Episode is string, checking movie.medias');
          if (movie.medias && Array.isArray(movie.medias)) {
            console.log('Available medias:', movie.medias);
            const media = movie.medias.find(m => m.filename === episode || m.slug === episode || m.id === episode);
            console.log('Found media:', media);
            if (media) {
              videoUrl = media;
              currentEpisodeName = `Tập ${episode}`;
            } else {
              // Nếu không tìm thấy trong medias, thử tìm theo index
              const index = parseInt(episode, 10);
              if (!isNaN(index) && index >= 0 && index < movie.medias.length) {
                console.log(`Using media at index ${index}:`, movie.medias[index]);
                videoUrl = movie.medias[index];
                currentEpisodeName = `Tập ${episode}`;
              } else {
                console.error('Could not find media for episode:', episode);
              }
            }
          } else {
            console.error('No medias array found in movie data');
          }
        }
      } else {
        console.error('Episode not found in server episodes');
        
        // Nếu không tìm thấy episode trong serverEpisodes, thử tìm trong movie.medias
        if (movie.medias && Array.isArray(movie.medias)) {
          console.log('Trying to find episode in movie.medias directly');
          const index = parseInt(currentEpisode, 10);
          if (!isNaN(index) && index >= 0 && index < movie.medias.length) {
            console.log(`Using media at index ${index}:`, movie.medias[index]);
            videoUrl = movie.medias[index];
            currentEpisodeName = `Tập ${currentEpisode}`;
          }
        }
      }
    } else {
      console.error('No episodes found for server:', currentServer);
      
      // Nếu không có serverEpisodes, thử tìm trong movie.medias
      if (movie.medias && Array.isArray(movie.medias)) {
        console.log('No server episodes, trying movie.medias directly');
        const index = parseInt(currentEpisode, 10);
        if (!isNaN(index) && index >= 0 && index < movie.medias.length) {
          console.log(`Using media at index ${index}:`, movie.medias[index]);
          videoUrl = movie.medias[index];
          currentEpisodeName = `Tập ${currentEpisode}`;
        }
      }
    }
    
    // Thiết lập finalVideoUrl ưu tiên link_m3u8 cho phát video trực tiếp
    if (videoUrl) {
      console.log('Raw videoUrl:', videoUrl);
      if (videoUrl.link_m3u8) {
        finalVideoUrl = videoUrl.link_m3u8;
        console.log('Using link_m3u8:', finalVideoUrl);
      } else if (videoUrl.link_embed) {
        finalVideoUrl = videoUrl.link_embed;
        console.log('Using link_embed:', finalVideoUrl);
      } else if (videoUrl.link) {
        finalVideoUrl = videoUrl.link;
        console.log('Using link:', finalVideoUrl);
      } else {
        console.error('No valid video URL found in:', videoUrl);
      }
    } else {
      console.error('No video URL found for episode:', currentEpisode);
    }
  } else {
    console.log('Missing data for video URL:', { 
      hasMovie: !!movie, 
      hasEpisodes: !!(movie && movie.episodes), 
      currentServer, 
      currentEpisode 
    });
    
    // Nếu không có episodes nhưng có medias, thử sử dụng medias trực tiếp
    if (movie && movie.medias && Array.isArray(movie.medias) && movie.medias.length > 0) {
      console.log('No episodes but found medias, using first media');
      if (!currentEpisode) {
        setCurrentEpisode('0');
        console.log('Setting currentEpisode to 0');
      }
      
      const index = parseInt(currentEpisode || '0', 10);
      if (!isNaN(index) && index >= 0 && index < movie.medias.length) {
        videoUrl = movie.medias[index];
        console.log(`Using media at index ${index}:`, videoUrl);
        currentEpisodeName = `Tập ${index}`;
        
        if (videoUrl.link_embed) {
          finalVideoUrl = videoUrl.link_embed;
          console.log('Using link_embed from media:', finalVideoUrl);
        } else if (videoUrl.link_m3u8) {
          finalVideoUrl = videoUrl.link_m3u8;
          console.log('Using link_m3u8 from media:', finalVideoUrl);
        } else if (videoUrl.link) {
          finalVideoUrl = videoUrl.link;
          console.log('Using link from media:', finalVideoUrl);
        }
      }
    }
  }

  episodeTitle = currentEpisodeName || (currentEpisode ? `Tập ${currentEpisode}` : '');

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
      {/* Debug Info - Hidden on mobile */}
      <Box sx={{ 
        mb: 2, 
        p: 2, 
        bgcolor: 'background.paper', 
        borderRadius: 1,
        display: { xs: 'none', md: 'block' }
      }}>
        <Typography variant="h6">Debug Info:</Typography>
        <Typography variant="body2">Movie: {movie ? 'Loaded' : 'Not loaded'}</Typography>
        <Typography variant="body2">Episodes: {movie && movie.episodes ? 'Available' : 'Not available'}</Typography>
        <Typography variant="body2">Episodes Structure: {movie && movie.episodes ? JSON.stringify(Object.keys(movie.episodes)) : 'N/A'}</Typography>
        <Typography variant="body2">Current Episode: {currentEpisode || 'None'}</Typography>
        <Typography variant="body2">Current Server: {currentServer || 'None'}</Typography>
        <Typography variant="body2">Video URL: {videoUrl ? (typeof videoUrl === 'object' ? JSON.stringify(videoUrl) : videoUrl) : 'None'}</Typography>
        <Typography variant="body2">Final Video URL: {finalVideoUrl || 'None'}</Typography>
      </Box>

      {/* Video Player */}
      {finalVideoUrl && movie && (
        <Box sx={{ 
          mb: { xs: 1, sm: 4 },
          mx: { xs: -2, sm: 0 }, // Full width on mobile
          borderRadius: { xs: 0, sm: 2 }
        }}>
          <VideoPlayer
            src={finalVideoUrl}
            title={movie && movie.name ? `${movie.name} - ${episodeTitle}` : episodeTitle}
          />
        </Box>
      )}

      {/* Episode Selector */}
      {movie && movie.episodes && Object.keys(movie.episodes).length > 0 && (
        <Box sx={{ mb: { xs: 1, sm: 3 } }}>
          <EpisodeSelector
            episodes={movie.episodes}
            currentEpisode={currentEpisode}
            onEpisodeSelect={handleEpisodeSelect}
          />
        </Box>
      )}

      {/* Tabs */}
      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'divider', 
        mb: { xs: 2, sm: 3 },
        mx: { xs: -1, sm: 0 }
      }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="movie detail tabs"
          sx={{
            '& .MuiTab-root': {
              fontSize: { xs: '0.875rem', sm: '1rem' },
              minHeight: { xs: 40, sm: 48 },
              px: { xs: 2, sm: 3 }
            }
          }}
        >
          <Tab label="Thông tin phim" />
          <Tab label="Bình luận" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box role="tabpanel" hidden={currentTab !== 0}>
        {currentTab === 0 && (
          <>
            <MovieInfo movie={movie} />
            <RelatedMovies movies={relatedMovies} />
          </>
        )}
      </Box>

      <Box role="tabpanel" hidden={currentTab !== 1}>
        {currentTab === 1 && movie && movie._id && <CommentSection movieId={movie._id} />}
      </Box>
    </Container>
  );
};

export default MovieDetail;