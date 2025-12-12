import React from "react";
import "./NhanVien.css";
import HeaderBar from "../Header/Header.jsx";
import SideBar from "./Sidebar.jsx";
import { Outlet } from "react-router-dom";

const NhanVien = () => {
  return (
    <div className="nhanvien-container">
      <div className="nhanvien-sidebar">
        <SideBar />
      </div>
      <div className="nhanvien-main">
        <HeaderBar />
        <main className="nhanvien-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default NhanVien;