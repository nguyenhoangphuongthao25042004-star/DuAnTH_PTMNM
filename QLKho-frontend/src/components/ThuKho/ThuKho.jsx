import React from "react";
import "./ThuKho.css";
import HeaderBar from "../Header/Header.jsx";
import SideBar from "./Sidebar.jsx";
import { Outlet } from "react-router-dom";

const ThuKho = () => {
  return (
    <div className="thukho-container">
      <div className="thukho-sidebar">
        <SideBar />
      </div>
      <div className="thukho-main">
        <HeaderBar />
        <main className="thukho-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ThuKho;