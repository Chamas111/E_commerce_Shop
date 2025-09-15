import React from "react";
import "./Admin.css";
import Sidebar from "../../Components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import AddProduct from "../../Components/AddProduct/AddProduct";
import ListProduct from "../../Components/ListProduct/ListProduct";

const Admin = () => {
  const role = localStorage.getItem("role");
  return (
    <div className="admin-container">
      {role === "admin" && <Sidebar />}
      <div className="admin-main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
