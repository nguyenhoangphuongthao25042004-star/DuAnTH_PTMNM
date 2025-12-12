import React from "react";
import { NavLink, Link } from "react-router-dom";
import { MdOutlineStore } from "react-icons/md";
import { FaUserAlt, FaUserTie } from "react-icons/fa";
import { SiCloudflareworkers } from "react-icons/si";
import "./Sidebar.css";

const QLSidebar = () => {
  return (
    <aside className="ql-sidebar">
      <div className="ql-sidebar__header">
        Thực Tập Chuyên Ngành
      </div>

      <nav className="ql-sidebar__menu">
        <NavLink to="ncc" className={({ isActive }) => `ql-link ${isActive ? "active" : ""}`}>
          <span className="ql-icon"><FaUserTie /></span>
          <span className="ql-label">Danh Sách Nhà Cung Cấp</span>
        </NavLink>

        <NavLink to="vattu" className={({ isActive }) => `ql-link ${isActive ? "active" : ""}`}>
          <span className="ql-icon"><SiCloudflareworkers /></span>
          <span className="ql-label">Danh Sách Vật Tư</span>
        </NavLink>

        <NavLink to="nhanvien" className={({ isActive }) => `ql-link ${isActive ? "active" : ""}`}>
          <span className="ql-icon"><FaUserAlt /></span>
          <span className="ql-label">Quản Lý Nhân Viên</span>
        </NavLink>

        <details className="ql-submenu">
          <summary>
            <span className="ql-icon"><MdOutlineStore /></span>
            <span className="ql-label">Quản Lý Nhập - Xuất Kho</span>
            <span className="ql-caret">▾</span>
          </summary>
          <div className="ql-submenu__items">
            <Link to="phieu-nhap" className="ql-sublink">Quản Lý Phiếu Nhập Kho</Link>
            <Link to="phieu-xuat" className="ql-sublink">Quản Lý Phiếu Xuất Kho</Link>
          </div>
        </details>
      </nav>

      <div className="ql-sidebar__footer">
        <p>© 2025 Thực Tập Chuyên Ngành</p>
        <p>Lâm Dũ Cường - DH52200423</p>
        <p>Nguyễn Thúy Hằng - DH52200627</p>
      </div>
    </aside>
  );
};

export default QLSidebar;
