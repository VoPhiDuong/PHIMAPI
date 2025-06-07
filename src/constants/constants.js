// Các hằng số cho localStorage
export const STORAGE_KEYS = {
  RECENT_MOVIES: 'recent_movies',
  FAVORITE_MOVIES: 'favorite_movies',
  WATCH_HISTORY: 'watch_history',
  USER_SETTINGS: 'user_settings',
  COMMENTS: 'comments',
};

// Số lượng phim hiển thị mặc định
export const DEFAULT_MOVIE_LIMIT = 24;

// Các tùy chọn sắp xếp phim
export const SORT_OPTIONS = {
  FIELDS: [
    { value: 'modified.time', label: 'Thời gian cập nhật' },
    { value: 'year', label: 'Năm sản xuất' },
    { value: 'name', label: 'Tên phim' },
    { value: 'view', label: 'Lượt xem' },
  ],
  TYPES: [
    { value: 'desc', label: 'Giảm dần' },
    { value: 'asc', label: 'Tăng dần' },
  ],
};

// Các tùy chọn ngôn ngữ phim
export const LANGUAGE_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'Tiếng Anh' },
  { value: 'cn', label: 'Tiếng Trung' },
  { value: 'kr', label: 'Tiếng Hàn' },
  { value: 'jp', label: 'Tiếng Nhật' },
  { value: 'th', label: 'Tiếng Thái' },
  { value: 'fr', label: 'Tiếng Pháp' },
];

// Các tùy chọn số lượng phim hiển thị
export const LIMIT_OPTIONS = [
  { value: 24, label: '24 phim' },
  { value: 36, label: '36 phim' },
  { value: 48, label: '48 phim' },
  { value: 60, label: '60 phim' },
];

// Các loại phim
export const MOVIE_TYPES = [
  { slug: 'phim-moi-cap-nhat', name: 'Phim mới cập nhật' },
  { slug: 'phim-bo', name: 'Phim bộ' },
  { slug: 'phim-le', name: 'Phim lẻ' },
  { slug: 'hoat-hinh', name: 'Phim hoạt hình' },
  { slug: 'tv-shows', name: 'TV Shows' },
  { slug: 'phim-vietsub', name: 'Phim Vietsub' },
  { slug: 'phim-thuyet-minh', name: 'Phim thuyết minh' },
  { slug: 'phim-long-tieng', name: 'Phim lồng tiếng' },
];

// Các chất lượng phim
export const MOVIE_QUALITIES = [
  { value: 'HD', label: 'HD' },
  { value: 'SD', label: 'SD' },
  { value: 'HDCam', label: 'HDCam' },
  { value: 'Cam', label: 'Cam' },
  { value: 'FullHD', label: 'FullHD' },
  { value: '4K', label: '4K' },
];

// Các trạng thái phim
export const MOVIE_STATUS = [
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'ongoing', label: 'Đang chiếu' },
  { value: 'trailer', label: 'Sắp chiếu' },
];

// URL hình ảnh mặc định khi không có hình
export const DEFAULT_IMAGE = 'https://via.placeholder.com/300x450?text=No+Image';

// Thời gian debounce cho tìm kiếm (ms)
export const SEARCH_DEBOUNCE_TIME = 500;

// Số lượng phim gần đây tối đa được lưu
export const MAX_RECENT_MOVIES = 10;

// Số lượng phim yêu thích tối đa được lưu
export const MAX_FAVORITE_MOVIES = 100;

// Số lượng bình luận hiển thị mỗi trang
export const COMMENTS_PER_PAGE = 10;