import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, Slider, Paper, Grid } from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  SettingsOutlined as Settings,
  Forward10,
  Replay10,
} from '@mui/icons-material';

const VideoPlayer = ({ src, title }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const controlsTimeoutRef = useRef(null);
  
  // Kiểm tra xem src có phải là link_embed không
  const isEmbedLink = src && (src.includes('iframe') || src.includes('embed') || src.includes('player.phimapi.com/player'));
  
  // Kiểm tra xem src có phải là link m3u8 không
  const isM3u8Link = src && src.includes('.m3u8');

  // Xử lý HLS cho link m3u8
  useEffect(() => {
    if (!isM3u8Link || isEmbedLink) return;
    
    const video = videoRef.current;
    if (!video) return;

    // Kiểm tra hỗ trợ HLS native
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else {
      // Sử dụng HLS.js cho các trình duyệt không hỗ trợ HLS native
      import('hls.js').then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('HLS manifest loaded');
          });
        } else {
          console.error('HLS is not supported');
        }
      }).catch(err => {
        console.error('Failed to load HLS.js:', err);
        // Fallback: thử phát trực tiếp
        video.src = src;
      });
    }
  }, [src, isM3u8Link, isEmbedLink]);

  // Xử lý khi video được tải
  useEffect(() => {
    // Nếu là link embed, không cần xử lý các sự kiện video
    if (isEmbedLink) return;
    
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [isEmbedLink]);

  // Xử lý hiển thị/ẩn controls
  useEffect(() => {
    // Nếu là link embed, không cần xử lý hiển thị controls
    if (isEmbedLink) return;
    
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', handleMouseMove);
      container.addEventListener('mouseleave', () => {
        if (isPlaying) {
          setShowControls(false);
        }
      });
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseenter', handleMouseMove);
        container.removeEventListener('mouseleave', () => {});
      }
      clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying, isEmbedLink]);

  // Xử lý phát/dừng video
  const togglePlay = () => {
    // Nếu là link embed, không thể điều khiển play/pause
    if (isEmbedLink) return;
    
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      const playPromise = video.play();
      
      // Modern browsers return a promise from play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
            setIsPlaying(true);
          })
          .catch(error => {
            // Auto-play was prevented or another error occurred
            console.log('Playback error:', error);
            setIsPlaying(false);
          });
      } else {
        // Older browsers don't return a promise
        setIsPlaying(true);
      }
    }
  };

  // Xử lý thay đổi thời gian video
  const handleTimeChange = (_, newValue) => {
    const video = videoRef.current;
    if (!video) return;

    // Save the current playing state
    const wasPlaying = !video.paused;
    
    // If video is playing, pause it before changing time
    if (wasPlaying) {
      video.pause();
    }
    
    // Change the current time
    video.currentTime = newValue;
    setCurrentTime(newValue);
    
    // If video was playing, resume playback
    if (wasPlaying) {
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Playback error after time change:', error);
        });
      }
    }
  };

  // Xử lý thay đổi âm lượng
  const handleVolumeChange = (_, newValue) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = newValue;
    setVolume(newValue);
    setIsMuted(newValue === 0);
  };

  // Xử lý tắt/bật âm thanh
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const newMutedState = !isMuted;
    video.muted = newMutedState;
    setIsMuted(newMutedState);
    if (newMutedState) {
      video.volume = 0;
      setVolume(0);
    } else {
      video.volume = volume > 0 ? volume : 0.5;
      setVolume(volume > 0 ? volume : 0.5);
    }
  };

  // Xử lý chế độ toàn màn hình
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Xử lý sự kiện fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Xử lý tua nhanh/lùi 10 giây
  const handleForward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    // Save the current playing state
    const wasPlaying = !video.paused;
    
    // If video is playing, pause it before changing time
    if (wasPlaying) {
      video.pause();
    }
    
    // Change the current time
    video.currentTime = Math.min(video.currentTime + 10, video.duration);
    
    // If video was playing, resume playback
    if (wasPlaying) {
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Playback error after forward:', error);
        });
      }
    }
  };

  const handleRewind = () => {
    const video = videoRef.current;
    if (!video) return;
    
    // Save the current playing state
    const wasPlaying = !video.paused;
    
    // If video is playing, pause it before changing time
    if (wasPlaying) {
      video.pause();
    }
    
    // Change the current time
    video.currentTime = Math.max(video.currentTime - 10, 0);
    
    // If video was playing, resume playback
    if (wasPlaying) {
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Playback error after rewind:', error);
        });
      }
    }
  };

  // Add the missing toggleSettings function
  const toggleSettings = () => {
    // For now, just log that settings was clicked
    console.log('Settings clicked');
    // You can implement actual settings functionality here later
  };

  // Format thời gian
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        width: '100%',
        height: 0,
        paddingBottom: '56.25%', // 16:9 aspect ratio
        backgroundColor: '#000',
        borderRadius: 0, // Bỏ bo góc trên mobile
        overflow: 'hidden',
        boxShadow: { xs: 'none', sm: '0 4px 10px rgba(0,0,0,0.2)' },
        '&:fullscreen': {
          borderRadius: 0,
          boxShadow: 'none',
        },
        '&:hover': {
          '& .video-controls': {
            opacity: 1,
          },
        },
      }}
      className={isFullscreen ? 'fullscreen' : ''}
    >
      {isEmbedLink ? (
        // Render iframe for embed links
        <iframe
          src={src}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          allowFullScreen
          title={title || 'Video Player'}
        />
      ) : (
        // Render video element for regular links
        <video
          ref={videoRef}
          src={src}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
          onClick={togglePlay}
        />
      )}

      {/* Video Title - Only show for regular videos */}
      {title && showControls && !isEmbedLink && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: { xs: 0.5, sm: 2 },
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
            color: 'white',
            transition: 'opacity 0.3s',
            opacity: showControls ? 1 : 0,
          }}
        >
          <Typography variant="h6" sx={{ fontSize: { xs: '0.8rem', sm: '1.25rem' } }}>{title}</Typography>
        </Box>
      )}

      {/* Video Controls - Only show for regular videos */}
      {!isEmbedLink && (
        <Box
          className="video-controls"
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: { xs: 0.3, sm: 2 },
            paddingTop: { xs: 1, sm: 4 },
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)',
            color: 'white',
            transition: 'opacity 0.3s',
            opacity: showControls ? 1 : 0,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10,
          }}
        >
          {/* Progress Bar */}
          <Slider
            value={currentTime}
            max={duration || 100}
            onChange={handleTimeChange}
            sx={{
              color: 'primary.main',
              height: { xs: 2, sm: 4 },
              mb: { xs: 0.3, sm: 1 },
              padding: { xs: '1px 0', sm: '4px 0' },
              '& .MuiSlider-thumb': {
                width: { xs: 6, sm: 12 },
                height: { xs: 6, sm: 12 },
                transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0px 0px 0px 8px rgba(25, 118, 210, 0.16)',
                },
                '&.Mui-active': {
                  width: { xs: 10, sm: 16 },
                  height: { xs: 10, sm: 16 },
                },
              },
              '& .MuiSlider-rail': {
                opacity: 0.28,
              },
              '& .MuiSlider-track': {
                height: { xs: 2, sm: 4 },
              },
            }}
          />

          {/* Controls */}
          <Grid container spacing={{ xs: 0.2, sm: 2 }} alignItems="center" sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            {/* Left Controls */}
            <Grid item xs={5} sm="auto" sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-start' } }}>
              <IconButton onClick={togglePlay} size="small" sx={{ p: { xs: 0.2, sm: 1 } }}>
                {isPlaying ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
              </IconButton>
              <IconButton onClick={handleRewind} size="small" sx={{ p: { xs: 0.2, sm: 1 } }}>
                <Replay10 fontSize="small" />
              </IconButton>
              <IconButton onClick={handleForward} size="small" sx={{ p: { xs: 0.2, sm: 1 } }}>
                <Forward10 fontSize="small" />
              </IconButton>
            </Grid>

            {/* Time Display - Above volume on mobile, center on desktop */}
            <Grid item xs={2} sm="auto" order={{ xs: 3, sm: 2 }} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography variant="body2" sx={{ fontSize: { xs: '0.6rem', sm: '0.875rem' } }}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Typography>
            </Grid>

            {/* Volume Control - Full width on mobile */}
            <Grid item xs={12} sm order={{ xs: 2, sm: 3 }} sx={{ mt: { xs: 0.3, sm: 0 }, display: { xs: 'none', sm: 'block' } }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: { xs: 'center', sm: 'flex-start' },
                width: '100%'
              }}>
                <IconButton onClick={toggleMute} size="small" sx={{ p: { xs: 0.2, sm: 1 } }}>
                  {isMuted ? <VolumeOff fontSize="small" /> : <VolumeUp fontSize="small" />}
                </IconButton>
                <Slider
                  value={volume}
                  onChange={handleVolumeChange}
                  min={0}
                  max={1}
                  step={0.01}
                  sx={{ 
                    width: { xs: '70%', sm: 100 }, 
                    ml: 1,
                    height: { xs: 2, sm: 4 },
                    padding: { xs: '2px 0', sm: '4px 0' },
                    '& .MuiSlider-thumb': {
                      width: { xs: 8, sm: 12 },
                      height: { xs: 8, sm: 12 },
                    }
                  }}
                  size="small"
                />
              </Box>
            </Grid>

            {/* Right Controls - Centered on mobile */}
            <Grid item xs={5} sm="auto" order={{ xs: 4, sm: 4 }} sx={{ 
              display: 'flex', 
              justifyContent: { xs: 'flex-end', sm: 'flex-end' },
              mt: { xs: 0, sm: 0 }
            }}>
              <IconButton onClick={toggleSettings} size="small" sx={{ p: { xs: 0.2, sm: 1 } }}>
                <Settings fontSize="small" />
              </IconButton>
              <IconButton onClick={toggleFullscreen} size="small" sx={{ p: { xs: 0.2, sm: 1 } }}>
                <Fullscreen fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Play/Pause Overlay - Only show for regular videos */}
      {!isPlaying && !isEmbedLink && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '50%',
            width: { xs: 40, sm: 80 },
            height: { xs: 40, sm: 80 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 5,
            boxShadow: '0 0 15px rgba(0,0,0,0.7)',
          }}
          onClick={togglePlay}
        >
          <PlayArrow sx={{ fontSize: { xs: 24, sm: 50 }, color: 'white' }} />
        </Box>
      )}
    </Box>
  );
};

export default VideoPlayer;