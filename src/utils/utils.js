/**
 * Định dạng thời lượng phim từ phút sang định dạng giờ:phút
 * @param {number} minutes - Thời lượng phim tính bằng phút
 * @returns {string} - Thời lượng định dạng giờ:phút
 */
export const formatDuration = (minutes) => {
  if (!minutes || isNaN(minutes)) return 'N/A';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} phút`;
  }
  
  return `${hours} giờ ${mins > 0 ? `${mins} phút` : ''}`;
};

/**
 * Định dạng số lượt xem
 * @param {number} views - Số lượt xem
 * @returns {string} - Số lượt xem đã định dạng
 */
export const formatViews = (views) => {
  if (!views || isNaN(views)) return '0';
  
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  }
  
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  
  return views.toString();
};

/**
 * Định dạng điểm đánh giá
 * @param {number} rating - Điểm đánh giá
 * @returns {string} - Điểm đánh giá đã định dạng
 */
export const formatRating = (rating) => {
  if (!rating || isNaN(rating)) return 'N/A';
  return rating.toFixed(1);
};

/**
 * Chuyển đổi tên quốc gia hoặc thể loại có dấu thành slug không dấu
 * @param {string} name - Tên quốc gia hoặc thể loại có dấu
 * @returns {string} - Slug không dấu
 */
export const convertToSlug = (name) => {
  if (!name) return '';
  
  // Bảng chuyển đổi các thể loại và quốc gia phổ biến
  const specialCases = {
    'Hành Động': 'hanh-dong',
    'Hài Hước': 'hai-huoc',
    'Tình Cảm': 'tinh-cam',
    'Kinh Dị': 'kinh-di',
    'Khoa Học Viễn Tưởng': 'khoa-hoc-vien-tuong',
    'Phiêu Lưu': 'phieu-luu',
    'Hoạt Hình': 'hoat-hinh',
    'Tài Liệu': 'tai-lieu',
    'Chiến Tranh': 'chien-tranh',
    'Âm Nhạc': 'am-nhac',
    'Thể Thao': 'the-thao',
    'Gia Đình': 'gia-dinh',
    'Bí Ẩn': 'bi-an',
    'Tâm Lý': 'tam-ly',
    'Học Đường': 'hoc-duong',
    'Cổ Trang': 'co-trang',
    'Võ Thuật': 'vo-thuat',
    'Chính Kịch': 'chinh-kich',
    'Hình Sự': 'hinh-su',
    'Thần Thoại': 'than-thoai',
    'Việt Nam': 'viet-nam',
    'Hàn Quốc': 'han-quoc',
    'Trung Quốc': 'trung-quoc',
    'Nhật Bản': 'nhat-ban',
    'Thái Lan': 'thai-lan',
    'Hồng Kông': 'hong-kong',
    'Đài Loan': 'dai-loan',
    'Ấn Độ': 'an-do',
    'Thổ Nhĩ Kỳ': 'tho-nhi-ky'
  };
  
  // Kiểm tra xem có trong danh sách đặc biệt không
  if (specialCases[name]) {
    return specialCases[name];
  }
  
  // Bảng chuyển đổi ký tự có dấu thành không dấu
  const vietnameseMap = {
    'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a', 'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
    'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
    'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
    'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o', 'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
    'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u', 'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
    'đ': 'd',
    'À': 'A', 'Á': 'A', 'Ạ': 'A', 'Ả': 'A', 'Ã': 'A', 'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',
    'È': 'E', 'É': 'E', 'Ẹ': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E',
    'Ì': 'I', 'Í': 'I', 'Ị': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
    'Ò': 'O', 'Ó': 'O', 'Ọ': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O', 'Ỡ': 'O',
    'Ù': 'U', 'Ú': 'U', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ử': 'U', 'Ữ': 'U',
    'Ỳ': 'Y', 'Ý': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
    'Đ': 'D'
  };
  
  let result = name;
  
  // Chuyển đổi ký tự có dấu thành không dấu
  for (const [accented, unaccented] of Object.entries(vietnameseMap)) {
    result = result.replace(new RegExp(accented, 'g'), unaccented);
  }
  
  // Chuyển thành chữ thường và thay thế khoảng trắng bằng dấu gạch ngang
  return result.toLowerCase().replace(/\s+/g, '-');
};

/**
 * Tạo URL an toàn cho hình ảnh
 * @param {string} url - URL hình ảnh
 * @param {string} fallback - URL dự phòng khi URL chính không hợp lệ
 * @returns {string} - URL hình ảnh an toàn
 */
export const getSafeImageUrl = (url, fallback = '') => {
  if (!url) return fallback;
  
  // Kiểm tra URL có hợp lệ không
  try {
    new URL(url);
    return url;
  } catch (e) {
    return fallback;
  }
};

/**
 * Tạo slug từ chuỗi
 * @param {string} text - Chuỗi cần tạo slug
 * @returns {string} - Slug đã tạo
 */
export const createSlug = (text) => {
  if (!text) return '';
  
  // Chuyển về chữ thường và thay thế các ký tự đặc biệt
  return text
    .toLowerCase()
    .trim()
    .replace(/[áàảãạâấầẩẫậăắằẳẵặ]/g, 'a')
    .replace(/[éèẻẽẹêếềểễệ]/g, 'e')
    .replace(/[íìỉĩị]/g, 'i')
    .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o')
    .replace(/[úùủũụưứừửữự]/g, 'u')
    .replace(/[ýỳỷỹỵ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * Tạo mảng các năm từ năm hiện tại đến năm quá khứ
 * @param {number} count - Số năm cần tạo
 * @returns {Array} - Mảng các năm
 */
export const generateYears = (count = 20) => {
  const currentYear = new Date().getFullYear();
  const years = [];
  
  for (let i = 0; i <= count; i++) {
    years.push(currentYear - i);
  }
  
  return years;
};

/**
 * Trì hoãn thực thi hàm (debounce)
 * @param {Function} func - Hàm cần trì hoãn
 * @param {number} wait - Thời gian trì hoãn (ms)
 * @returns {Function} - Hàm đã được trì hoãn
 */
export const debounce = (func, wait) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Lấy thông tin từ localStorage
 * @param {string} key - Khóa lưu trữ
 * @param {any} defaultValue - Giá trị mặc định khi không tìm thấy
 * @returns {any} - Giá trị đã lưu hoặc giá trị mặc định
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Lưu thông tin vào localStorage
 * @param {string} key - Khóa lưu trữ
 * @param {any} value - Giá trị cần lưu
 */
export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Xóa thông tin từ localStorage
 * @param {string} key - Khóa cần xóa
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};