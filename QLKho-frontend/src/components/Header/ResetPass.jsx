import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "../../services/axiosConfig";
import "./ResetPass.css";

const API_BASE = "http://localhost:4000/api/taikhoan";

function ResetPass() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmNewPassword) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }

    if (formData.newPassword.length > 30) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setError("Mật khẩu mới phải khác mật khẩu cũ");
      return;
    }

    // Lấy username từ localStorage
    let username = "";
    try {
      const raw = localStorage.getItem("user");
      const user = raw ? JSON.parse(raw) : null;
      username = user?.UserName || user?.username || "";
      
      if (!username) {
        setError("Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.");
        return;
      }
    } catch (err) {
      console.error("Parse user error:", err);
      setError("Lỗi đọc thông tin tài khoản");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        UserName: username,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword,
      };

      console.log("Change password payload:", payload);

      const res = await fetchWithAuth(`${API_BASE}/changepassword/${encodeURIComponent(username)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({oldPassword: formData.oldPassword, newPassword: formData.newPassword, confirmNewPassword: formData.confirmNewPassword}),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Không thể đổi mật khẩu");
      }

      alert("Đổi mật khẩu thành công!");
      
      // Clear form
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      // Đăng xuất và quay về trang login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      navigate("/");
    } catch (err) {
      console.error("Change password error:", err);
      setError(err.message || "Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // Lấy username từ localStorage để hiển thị

  return (
    <div className="resetpass-wrap">
      <div className="resetpass-card">
        <div className="resetpass-header">
          <h2>Đổi mật khẩu</h2>
        </div>

        {error && <div className="resetpass-error">{error}</div>}

        <form className="resetpass-form" onSubmit={handleSubmit}>
          <label>
            Mật khẩu cũ
            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>
          <label>
            Mật khẩu mới
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>
          <label>
            Xác nhận mật khẩu mới
            <input
              type="password"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>

          <div className="resetpass-actions">
            <button 
              type="button" 
              className="btn btn-cancel" 
              onClick={handleCancel}
              disabled={loading}
            >
              Hủy
            </button>
            <button className="btn btn-red" type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPass;