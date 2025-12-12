const API_BASE = "http://localhost:4000/api";

// Biến để tránh redirect nhiều lần
let isRedirecting = false;

// Hàm xử lý logout khi token hết hạn
const handleUnauthorized = () => {
  if (isRedirecting) return;

  isRedirecting = true;

  // Xóa toàn bộ thông tin đăng nhập
  localStorage.removeItem("token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");

  // Hiển thị thông báo
  alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");

  // Redirect về homepage
  window.location.href = "/";
};

// Hàm kiểm tra và xử lý response
const handleResponse = async (response) => {
  // Kiểm tra status code 401 (Unauthorized) hoặc 403 (Forbidden)
  if (response.status === 401 || response.status === 403) {
    handleUnauthorized();
    throw new Error("Lỗi khi đăng nhập");
  }

  return response;
};

// Wrapper cho fetch với xử lý token tự động
export const fetchWithAuth = async (url, options = {}) => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("accessToken");

  const config = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  try {
    const response = await fetch(url, config);
    await handleResponse(response);
    return response;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Hàm kiểm tra xem có đang đăng nhập không
export const isAuthenticated = () => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("accessToken");
  return !!token;
};

// Hàm logout thủ công
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  window.location.href = "/";
};

export default fetchWithAuth;
