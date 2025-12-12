import React from "react";
import { NavLink } from "react-router-dom";
import { MdOutlineStore, MdInventory } from "react-icons/md";
import { FaBoxOpen, FaClipboardList } from "react-icons/fa";
import { SiCloudflareworkers } from "react-icons/si";
import "./SideBar.css";

const SideBar = () => {
  return (
    <aside className="tk-sidebar">
      <div className="tk-sidebar-inner">
        <div className="sidebar-header">
          Thực Tập Chuyên Ngành
        </div>

        <nav className="sidebar-menu">
          <NavLink to="vattu" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
            <span className="sidebar-icon"><SiCloudflareworkers /></span>
            <span className="sidebar-label">Danh Sách Vật Tư</span>
          </NavLink>

          <NavLink to="ton-kho" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
            <span className="sidebar-icon"><MdInventory /></span>
            <span className="sidebar-label">Tồn Kho</span>
          </NavLink>

          <details className="sidebar-submenu">
            <summary>
              <span className="sidebar-icon"><MdOutlineStore /></span>
              <span className="sidebar-label">Quản Lý Nhập - Xuất Kho</span>
              <span className="sidebar-caret">▾</span>
            </summary>
            <div className="sidebar-submenu__items">
              <NavLink to="phieu-nhap" className="sidebar-sublink">Phiếu Nhập Kho</NavLink>
              <NavLink to="phieu-xuat" className="sidebar-sublink">Phiếu Xuất Kho</NavLink>
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
