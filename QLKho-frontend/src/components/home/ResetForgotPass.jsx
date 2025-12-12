import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ResetForgotPass.css";

const API_BASE = "http://localhost:4000/api/auth";

function ResetForgotPass() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    // username: "",
    // email: "",
    token: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Lấy username, email, token từ URL query params
    // const usernameFromUrl = searchParams.get("username");
    // const emailFromUrl = searchParams.get("email");
    const tokenFromUrl = searchParams.get("token");
    
    if (tokenFromUrl) {       // nếu xài cái cũ thì thêm usernameFromUrl && emailFromUrl && 
      setFormData(prev => ({
        ...prev,
        // username: usernameFromUrl,
        // email: emailFromUrl,
        token: tokenFromUrl
      }));
    } else {
      // Nếu thiếu params, quay về trang forgot
      setError("Link không hợp lệ. Vui lòng yêu cầu link mới.");
      setTimeout(() => navigate("/forgotpass"), 3000);
    }
  }, [searchParams, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Chỉ cho phép thay đổi mật khẩu
    if (name === "newPassword") {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.newPassword) {
      setError("Vui lòng nhập mật khẩu mới");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (formData.newPassword.length > 30) {
      setError("Mật khẩu phải có ít hơn 30 ký tự");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        // username: formData.username,
        // email: formData.email,
        token: formData.token,
        password: formData.newPassword // Đổi tên trường ở đây
      };

      console.log("Reset password payload:", payload);

      const res = await fetch(`${API_BASE}/resetpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Không thể đặt lại mật khẩu");
      }

      alert("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
      navigate("/");
    } catch (err) {
      console.error("Reset password error:", err);
      setError(err.message || "Đặt lại mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/forgotpass");
  };

  return (
    <div className="resetforgotpass-wrap">
      <div className="resetforgotpass-card">
        <div className="resetforgotpass-header">
          <h2>Đặt lại mật khẩu</h2>
        </div>

        {error && <div className="resetforgotpass-error">{error}</div>}

        <form className="resetforgotpass-form" onSubmit={handleSubmit}>
          {/* <label>
            Tên đăng nhập
            <input
              type="text"
              name="username"
              value={formData.username}
              disabled
              className="input-disabled"
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="input-disabled"
            />
          </label> */}

          <label>
            Mật khẩu mới
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              minLength={6}
              maxLength={30}
              disabled={loading}
              placeholder="Nhập mật khẩu mới"
            />
          </label>

          <div className="resetforgotpass-actions">
            <button 
              type="button" 
              className="btn btn-cancel" 
              onClick={handleCancel}
              disabled={loading}
            >
              Hủy
            </button>
            <button className="btn btn-red" type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetForgotPass;