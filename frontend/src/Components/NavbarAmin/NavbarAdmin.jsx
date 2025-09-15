import React, { useRef } from "react";
import "./Navbar.css";
import logo from "../Assets/logo.png";
import nav_dropdown from "../Assets/nav_dropdown.png";
import add_product_icon from "../../assets/Product_Cart.svg";
import list_product_icon from "../../assets/Product_list_icon.svg";
import { Link } from "react-router-dom";

const NavbarAdmin = () => {
  const menuRef = useRef();

  const dropdown_toggle = () => {
    menuRef.current.classList.toggle("nav-menu-visible");
  };

  return (
    <div className="navbar">
      {/* Logo */}
      <div className="nav-logo">
        <img src={logo} alt="Logo" />
        <p>SHOPPER</p>
      </div>

      {/* Burger-Icon (nur auf Mobile sichtbar) */}
      <img
        className="nav-dropdown"
        onClick={dropdown_toggle}
        src={nav_dropdown}
        alt="menu"
      />

      {/* Menü-Links */}
      <div ref={menuRef} className="nav-links">
        <Link to="/admin/add-product" className="sidebar-item-link">
          <div className="sidebar-item">
            <img src={add_product_icon} alt="Add Product" />
            <p>Add Product</p>
          </div>
        </Link>
        <Link to="/admin/list-product" className="sidebar-item-link">
          <div className="sidebar-item">
            <img src={list_product_icon} alt="Product List" />
            <p>Product List</p>
          </div>
        </Link>
        <div className="nav-login-cart">
          {localStorage.getItem("auth-token") ? (
            <button
              onClick={() => {
                localStorage.removeItem("auth-token");
                localStorage.removeItem("role");
                window.location.replace("/");
              }}
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button>Login</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavbarAdmin;
