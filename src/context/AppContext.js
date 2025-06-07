import React, { createContext, useContext, useState, useEffect } from 'react';
import { metadataApi } from '../services/api';
import { getFromStorage, saveToStorage } from '../utils/utils';
import { STORAGE_KEYS, MAX_RECENT_MOVIES, MAX_FAVORITE_MOVIES } from '../constants/constants';

// Tạo context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  // State cho metadata
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State cho user preferences
  const [recentMovies, setRecentMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [watchHistory, setWatchHistory] = useState({});
  
  // Lấy metadata khi component mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        
        // Lấy danh sách thể loại
        const categoriesResponse = await metadataApi.getCategories();
        if (categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }
        
        // Lấy danh sách quốc gia
        const countriesResponse = await metadataApi.getCountries();
        if (countriesResponse.data) {
          setCountries(countriesResponse.data);
        }
        
        // Lấy danh sách năm
        const yearsResponse = await metadataApi.getYears();
        if (yearsResponse.data) {
          setYears(yearsResponse.data);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching metadata:', error);
        setLoading(false);
      }
    };
    
    fetchMetadata();
  }, []);
  
  // Lấy dữ liệu từ localStorage khi component mount
  useEffect(() => {
    const storedRecentMovies = getFromStorage(STORAGE_KEYS.RECENT_MOVIES, []);
    const storedFavoriteMovies = getFromStorage(STORAGE_KEYS.FAVORITE_MOVIES, []);
    const storedWatchHistory = getFromStorage(STORAGE_KEYS.WATCH_HISTORY, {});
    
    setRecentMovies(storedRecentMovies);
    setFavoriteMovies(storedFavoriteMovies);
    setWatchHistory(storedWatchHistory);
  }, []);
  
  // Thêm phim vào danh sách xem gần đây
  const addRecentMovie = (movie) => {
    if (!movie || !movie._id) return;
    
    setRecentMovies(prevMovies => {
      // Lọc bỏ phim hiện tại nếu đã tồn tại trong danh sách
      const filteredMovies = prevMovies.filter(m => m._id !== movie._id);
      
      // Thêm phim mới vào đầu danh sách
      const updatedMovies = [movie, ...filteredMovies].slice(0, MAX_RECENT_MOVIES);
      
      // Lưu vào localStorage
      saveToStorage(STORAGE_KEYS.RECENT_MOVIES, updatedMovies);
      
      return updatedMovies;
    });
  };
  
  // Thêm/xóa phim khỏi danh sách yêu thích
  const toggleFavoriteMovie = (movie) => {
    if (!movie || !movie._id) return;
    
    setFavoriteMovies(prevMovies => {
      // Kiểm tra xem phim đã có trong danh sách yêu thích chưa
      const isExisting = prevMovies.some(m => m._id === movie._id);
      
      let updatedMovies;
      
      if (isExisting) {
        // Nếu đã có, xóa khỏi danh sách
        updatedMovies = prevMovies.filter(m => m._id !== movie._id);
      } else {
        // Nếu chưa có, thêm vào danh sách
        updatedMovies = [...prevMovies, movie].slice(0, MAX_FAVORITE_MOVIES);
      }
      
      // Lưu vào localStorage
      saveToStorage(STORAGE_KEYS.FAVORITE_MOVIES, updatedMovies);
      
      return updatedMovies;
    });
  };
  
  // Kiểm tra phim có trong danh sách yêu thích không
  const isFavorite = (movieId) => {
    return favoriteMovies.some(movie => movie._id === movieId);
  };
  
  // Cập nhật lịch sử xem phim
  const updateWatchHistory = (movieId, episodeId, timestamp) => {
    if (!movieId || !episodeId) return;
    
    setWatchHistory(prevHistory => {
      const updatedHistory = {
        ...prevHistory,
        [movieId]: {
          ...prevHistory[movieId],
          [episodeId]: timestamp,
          lastWatched: Date.now(),
        },
      };
      
      // Lưu vào localStorage
      saveToStorage(STORAGE_KEYS.WATCH_HISTORY, updatedHistory);
      
      return updatedHistory;
    });
  };
  
  // Lấy thời điểm xem cuối cùng của một tập phim
  const getWatchedTime = (movieId, episodeId) => {
    if (!movieId || !episodeId || !watchHistory[movieId]) return 0;
    return watchHistory[movieId][episodeId] || 0;
  };
  
  // Giá trị context
  const value = {
    // Metadata
    categories,
    countries,
    years,
    loading,
    
    // User preferences
    recentMovies,
    favoriteMovies,
    watchHistory,
    
    // Functions
    addRecentMovie,
    toggleFavoriteMovie,
    isFavorite,
    updateWatchHistory,
    getWatchedTime,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook để sử dụng context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};