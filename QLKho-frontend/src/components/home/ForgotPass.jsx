import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPass.css";

const API_BASE = "http://localhost:4000/api/auth";

function ForgotPass() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.username || !formData.email) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);
    try {
      const origin = window.location.origin;

      const payload = {
        username: formData.username,
        email: formData.email,
        origin: origin
      };

      console.log("Forgot password payload:", payload);

      const res = await fetch(`${API_BASE}/forgotpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Không thể gửi yêu cầu");
      }

      setSuccess(true);
      setFormData({ username: "", email: "" });
    } catch (err) {
      console.error("Forgot password error:", err);
      setError(err.message || "Gửi yêu cầu thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate("/");

  return (
    <div className="forgotpass-wrap">
      <div className="forgotpass-card">
        <div className="forgotpass-header">
          <h2>Quên mật khẩu</h2>
        </div>

        {error && <div className="forgotpass-error">{error}</div>}
        {success && (
          <div className="forgotpass-success">
            Link đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.
          </div>
        )}

        <form className="forgotpass-form" onSubmit={handleSubmit}>
          <label>
            Tên đăng nhập
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Nhập tên đăng nhập"
            />
          </label>

          <label>
            Email đăng ký
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Nhập email của bạn"
            />
          </label>

          <div className="forgotpass-actions">
            <button 
              type="button" 
              className="btn btn-cancel" 
              onClick={handleBack}
              disabled={loading}
            >
              Quay lại
            </button>
            <button className="btn btn-red" type="submit" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPass;