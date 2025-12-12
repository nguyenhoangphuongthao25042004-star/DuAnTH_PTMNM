import { useState } from "react";
import "./HomePage.css";
import { loginUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await loginUser(username, password);
      console.log("Login result:", response);

      if (response.success) {
        if (!response.role) {
          setError("Tài khoản chưa có trường PhanQuyen từ backend.");
          return;
        }
        if (!response.redirectPath) {
          setError(`Không tìm thấy route cho quyền: ${response.role}. Vui lòng cấu hình routes hoặc mapping role.`);
          return;
        }

        localStorage.setItem("user", JSON.stringify(response.user));
        if (response.token) localStorage.setItem("token", response.token);
        if (response.role) localStorage.setItem("role", response.role);

        navigate(response.redirectPath, { replace: true });
      } else {
        setError(response.message || "Đăng nhập thất bại.");
      }
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = () => navigate("/forgotpass");

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-image">
          <img
            src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952"
            alt="warehouse"
          />
        </div>

        <div className="login-form">
          <h2>ĐĂNG NHẬP VÀO TÀI KHOẢN</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label>Tên đăng nhập</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
            />

            <label>Mật khẩu</label>
            <div className="password-field">
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="toggle-pwd"
              >
              </button>
            </div>

            <div className="form-right-link">
              <button type="button" className="btn-link forgot-link" onClick={handleForgot}>
                Quên mật khẩu?
              </button>
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default HomePage;