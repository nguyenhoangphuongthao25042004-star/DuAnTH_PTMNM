import React from "react";
import { NavLink, Link } from "react-router-dom";
import { MdOutlineStore } from "react-icons/md";
import { FaUserAlt, FaUserTie } from "react-icons/fa";
import { SiCloudflareworkers } from "react-icons/si";
import { GrStorage } from "react-icons/gr";
import "./SideBar.css";

const SideBar = () => {
  return (
    <aside className="admin-sidebar-inner">
      <div className="sidebar-header">
        Thực Tập Chuyên Ngành
      </div>

      <nav className="sidebar-menu">
        <NavLink to="ncc" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          <span className="sidebar-icon"><FaUserTie /></span>
          <span className="sidebar-label">Quản Lý Nhà Cung Cấp</span>
        </NavLink>

        <details className="sidebar-submenu">
          <summary>
            <span className="sidebar-icon"><FaUserAlt /></span>
            <span className="sidebar-label">Quản Lý Người Dùng</span>
            <span className="sidebar-caret">▾</span>
          </summary>
          <div className="sidebar-submenu__items">
            <Link to="nhanvien" className="sidebar-sublink">Nhân Viên</Link>
            <Link to="taikhoan" className="sidebar-sublink">Tài Khoản</Link>
          </div>
        </details>

        <NavLink to="vattu" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          <span className="sidebar-icon"><SiCloudflareworkers /></span>
          <span className="sidebar-label">Vật Tư</span>
        </NavLink>

        <details className="sidebar-submenu">
          <summary>
            <span className="sidebar-icon"><MdOutlineStore /></span>
            <span className="sidebar-label">Quản Lý Nhập - Xuất Kho</span>
            <span className="sidebar-caret">▾</span>
          </summary>
          <div className="sidebar-submenu__items">
            <Link to="phieu-nhap" className="sidebar-sublink">Quản Lý Phiếu Nhập Kho</Link>
            <Link to="phieu-xuat" className="sidebar-sublink">Quản Lý Phiếu Xuất Kho</Link>
          </div>
        </details>

        <details className="sidebar-submenu">
          <summary>
            <span className="sidebar-icon"><GrStorage /></span>
            <span className="sidebar-label">Quản Lý Sắp Xếp Kho</span>
            <span className="sidebar-caret">▾</span>
          </summary>
          <div className="sidebar-submenu__items">
            <Link to="cho-chua" className="sidebar-sublink">Chỗ Chứa</Link>
            <Link to="phan-loai" className="sidebar-sublink">Phân Loại</Link>
          </div>
        </details>
      </nav>

      <div className="sidebar-footer">
        <p>&copy; 2025 Thực Tập Chuyên Ngành</p>
        <p>Lâm Dũ Cường - DH52200423</p>
        <p>Nguyễn Thúy Hằng - DH52200627</p>
      </div>
    </aside>
  );
};

export default SideBar;
