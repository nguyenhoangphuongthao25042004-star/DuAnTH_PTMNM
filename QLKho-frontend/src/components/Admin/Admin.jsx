import React from "react";
import "./Admin.css";
import HeaderBar from "../Header/Header.jsx";
import SideBar from "./SideBar.jsx";
import { Outlet } from "react-router-dom";

const Admin = () => {
  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <SideBar />
      </div>
      <div className="admin-main">
        <HeaderBar />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Admin;