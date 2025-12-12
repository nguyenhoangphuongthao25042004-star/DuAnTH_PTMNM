const API_BASE = "http://localhost:4000/api/auth";

const roleRedirectMap = {
  admin: "/admin",
  nhanvien: "/nhanvien",
  quanly: "/quanly",
  thukho: "/thukho",
};

export const getRedirectByRole = (role) => {
  const key = (role || "").toLowerCase();
  return roleRedirectMap[key] || "/";
};

export const loginUser = async (username, password) => {
  try {
    if (!username || !password) {
      return { success: false, message: "Vui lòng nhập đầy đủ thông tin" };
    }

    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Đăng nhập thất bại",
      };
    }

    const user = data.user || {};
    const rawRole = user.PhanQuyen;
    const redirectPath = getRedirectByRole(rawRole);

    return {
      success: true,
      message: data.message || "Đăng nhập thành công",
      user,
      role: rawRole,
      token: data.token,
      redirectPath,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.message || "Đã có lỗi xảy ra khi đăng nhập",
    };
  }
};
