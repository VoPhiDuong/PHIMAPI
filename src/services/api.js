import axios from 'axios';

const BASE_URL = 'https://phimapi.com';

// Tạo instance axios với cấu hình chung
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Xử lý lỗi chung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// API cho trang chủ
export const homeApi = {
  // Lấy phim mới cập nhật cho slider chính
  getFeaturedMovies: () => api.get('/danh-sach/phim-moi-cap-nhat-v3?page=1'),
  
  // Lấy phim mới cập nhật
  getNewMovies: () => api.get('/danh-sach/phim-moi-cap-nhat-v2?page=1'),
  
  // Lấy phim bộ
  getSeriesMovies: () => api.get('/v1/api/danh-sach/phim-bo?page=1&sort_field=modified.time&sort_type=desc&limit=12'),
  
  // Lấy phim lẻ
  getSingleMovies: () => api.get('/v1/api/danh-sach/phim-le?page=1&sort_field=modified.time&sort_type=desc&limit=12'),
  
  // Lấy phim hoạt hình
  getAnimationMovies: () => api.get('/v1/api/danh-sach/hoat-hinh?page=1&sort_field=modified.time&sort_type=desc&limit=12'),
};

// API cho chi tiết phim
export const movieApi = {
  // Lấy thông tin chi tiết phim
  getMovieDetail: (slug) => api.get(`/phim/${slug}`),
  
  // Lấy thông tin tập phim
  getEpisodeDetail: (movieId, episodeId) => api.get(`/xem-phim/${movieId}/${episodeId}`),
};

// API cho danh sách phim
export const listApi = {
  // Lấy danh sách phim theo loại
  getMoviesByType: (type, params) => {
    if (type === 'phim-moi-cap-nhat' || type === 'phim-hay') {
      // Thêm các tham số lọc vào URL nếu có
      let url = `/danh-sach/phim-moi-cap-nhat-v2?page=${params.page || 1}`;
      
      if (params.limit) url += `&limit=${params.limit}`;
      if (params.category) url += `&category=${params.category}`;
      if (params.country) url += `&country=${params.country}`;
      if (params.year) url += `&year=${params.year}`;
      if (params.sort_field) url += `&sort_field=${params.sort_field}`;
      if (params.sort_type) url += `&sort_type=${params.sort_type}`;
      
      return api.get(url);
    } else {
      return api.get(`/v1/api/danh-sach/${type}`, { params });
    }
  },
  
  // Lấy danh sách phim theo thể loại
  getMoviesByCategory: (slug, params) => api.get(`/v1/api/the-loai/${slug}`, { params }),
  
  // Lấy danh sách phim theo quốc gia
  getMoviesByCountry: (slug, params) => api.get(`/v1/api/quoc-gia/${slug}`, { params }),
  
  // Lấy danh sách phim theo năm
  getMoviesByYear: (year, params) => api.get(`/v1/api/nam/${year}`, { params }),
  
  // Tìm kiếm phim
  searchMovies: (params) => api.get('/v1/api/tim-kiem', { params }),
  
  // Lấy danh sách phim mới cập nhật với phân trang nâng cao
  getNewMoviesAdvanced: (params = {}) => {
    let url = `/danh-sach/phim-moi-cap-nhat-v2?page=${params.page || 1}`;
    
    if (params.limit) url += `&limit=${params.limit}`;
    if (params.category) url += `&category=${params.category}`;
    if (params.country) url += `&country=${params.country}`;
    if (params.year) url += `&year=${params.year}`;
    
    return api.get(url);
  },
  
  // Lấy danh sách phim lẻ với phân trang nâng cao
  getSingleMoviesAdvanced: (params = {}) => {
    return api.get('/v1/api/danh-sach/phim-le', { params });
  },
  
  // Lấy danh sách phim bộ với phân trang nâng cao
  getSeriesMoviesAdvanced: (params = {}) => {
    return api.get('/v1/api/danh-sach/phim-bo', { params });
  },
  
  // Lấy danh sách phim hoạt hình với phân trang nâng cao
  getAnimationMoviesAdvanced: (params = {}) => {
    return api.get('/v1/api/danh-sach/hoat-hinh', { params });
  },
};

// API cho metadata
export const metadataApi = {
  // Lấy danh sách thể loại
  getCategories: () => api.get('/the-loai'),
  
  // Lấy danh sách quốc gia
  getCountries: () => api.get('/quoc-gia'),
  
  // Lấy danh sách năm
  getYears: () => {
    // Tạo danh sách năm từ năm hiện tại trở về trước 20 năm
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i <= 20; i++) {
      years.push(currentYear - i);
    }
    return Promise.resolve({ data: years });
  },
};

// API cho tìm kiếm gợi ý
export const suggestApi = {
  // Lấy gợi ý tìm kiếm
  getSuggestions: (keyword) => api.get(`/v1/api/tim-kiem-goi-y?keyword=${encodeURIComponent(keyword)}`),
};

export default {
  homeApi,
  movieApi,
  listApi,
  metadataApi,
  suggestApi,
};