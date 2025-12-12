import React from "react";
import "./QuanLy.css";
import HeaderBar from "../Header/Header.jsx";
import SideBar from "./Sidebar.jsx";
import { Outlet } from "react-router-dom";

const QuanLy = () => {
  return (
    <div className="quanly-container">
      <div className="quanly-sidebar">
        <SideBar />
      </div>
      <div className="quanly-main">
        <HeaderBar />
        <main className="quanly-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default QuanLy;