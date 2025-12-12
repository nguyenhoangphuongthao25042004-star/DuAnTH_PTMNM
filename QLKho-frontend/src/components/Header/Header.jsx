import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

export default function HeaderBar({ title = "" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const loadUser = () => {
      try {
        const raw = localStorage.getItem("user");
        console.log("Header loadUser raw:", raw); // debug
        const user = raw ? JSON.parse(raw) : null;
        const resolvedName =
          (user?.TenNV || "")
            .toString()
            .trim();
        console.log("Header resolvedName:", resolvedName); // debug
        setName(resolvedName);
      } catch (err) {
        console.error("Header parse user error:", err);
        setName("");
      }
    };

    loadUser();
    window.addEventListener("storage", loadUser);
    window.addEventListener("userChanged", loadUser);
    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("userChanged", loadUser);
    };
  }, []);

  useEffect(() => {
    function onDocClick(e) {
      // close menu when clicking outside menu or toggle button
      if (menuRef.current && !menuRef.current.contains(e.target) && btnRef.current && !btnRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("click", onDocClick);
    else document.removeEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [menuOpen]);

  const handleLogout = () => {
    // xóa token và user — thêm các key nếu bạn lưu tên khác
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authToken");
    window.dispatchEvent(new Event("userChanged"));
    // về trang login
    navigate("/");
  };

  const handleChangePassword = () => {
    setMenuOpen(false);
    // phát hiện prefix từ pathname hiện tại
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const prefix = pathSegments[0];
    // navigate đến <prefix>/resetpass
    navigate(`/${prefix}/resetpass`);
  };

  return (
    <header className="page-header">
      <div className="page-header__title">{title}</div>

      <div className="page-header__right">
        <div className="page-header__greeting">Xin chào <span className="user-name">{name || "Khách"}</span></div>

        {/* settings dropdown */}
        <div className="user-settings">
          <button
            ref={btnRef}
            className="settings-btn"
            onClick={() => setMenuOpen((s) => !s)}
            aria-expanded={menuOpen}
            aria-haspopup="true"
            title="Cài đặt"
          >
            Cài đặt <span className="settings-caret">▾</span>
          </button>

          {menuOpen && (
            <div ref={menuRef} className="settings-menu" role="menu">
              <button className="settings-item change-pass" onClick={handleChangePassword} role="menuitem">
                Đổi mật khẩu
              </button>
              <button className="settings-item logout" onClick={handleLogout} role="menuitem">
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}