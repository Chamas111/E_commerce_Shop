import React from "react";

import { Outlet } from "react-router-dom";
import NavbarAdmin from "../../Components/NavbarAmin/NavbarAdmin";
const AdminLayout = () => {
  return (
    <div>
      <NavbarAdmin />
      <div className="admin-content">
        <Outlet /> {/* Nested admin pages will render here */}
      </div>
    </div>
  );
};

export default AdminLayout;
