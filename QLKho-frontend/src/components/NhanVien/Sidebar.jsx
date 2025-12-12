import React from "react";
import { NavLink } from "react-router-dom";
import { MdOutlineStore } from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import { SiCloudflareworkers } from "react-icons/si";
import "./Sidebar.css";

const SideBar = () => {
  return (
    <aside className="nv-sidebar">
      <div className="nv-sidebar-inner">
        <div className="sidebar-header">
          Thực Tập Chuyên Ngành
        </div>

        <nav className="sidebar-menu">
          <NavLink to="ncc" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
            <span className="sidebar-icon"><FaUserTie /></span>
            <span className="sidebar-label">Danh Sách Nhà Cung Cấp</span>
          </NavLink>

          <NavLink to="vattu" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
            <span className="sidebar-icon"><SiCloudflareworkers /></span>
            <span className="sidebar-label">Danh Sách Vật Tư</span>
          </NavLink>

          <details className="sidebar-submenu">
            <summary>
              <span className="sidebar-icon"><MdOutlineStore /></span>
              <span className="sidebar-label">Quản Lý Nhập - Xuất Kho</span>
              <span className="sidebar-caret">▾</span>
            </summary>
            <div className="sidebar-submenu__items">
              <NavLink to="phieu-nhap" className="sidebar-sublink">Quản Lý Phiếu Nhập Kho</NavLink>
              <NavLink to="phieu-xuat" className="sidebar-sublink">Quản Lý Phiếu Xuất Kho</NavLink>
            </div>
          </details>
        </nav>

        <div className="sidebar-footer">
          <p>&copy; 2025 Thực Tập Chuyên Ngành</p>
          <p>Lâm Dũ Cường - DH52200423</p>
          <p>Nguyễn Thúy Hằng - DH52200627</p>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
