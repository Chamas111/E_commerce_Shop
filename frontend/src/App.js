import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Shop from "./Pages/ShopPage";
import ShopCategory from "./Pages/ShopCategory";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import LoginSignup from "./Pages/LoginSignup";
import AddProduct from "./Components/AddProduct/AddProduct";
import ListProduct from "./Components/ListProduct/ListProduct";
import NavbarAdmin from "./Components/NavbarAmin/NavbarAdmin";
import AdminLayout from "./Pages/aminLayout/AdminLayout";
function App() {
  // Get role from localStorage
  const role = localStorage.getItem("role"); // "admin" or "user"
  const isAdmin = role === "admin";

  return (
    <div className="App">
      {/* Navbar changes based on role */}
      {!isAdmin && <Navbar />}

      <div className="page-content">
        <Routes>
          {/* User pages */}
          <Route path="/" element={<Shop />} />
          <Route path="/mens" element={<ShopCategory category="men" />} />
          <Route path="/womens" element={<ShopCategory category="women" />} />
          <Route path="/kids" element={<ShopCategory category="kid" />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignup />} />

          {/* Admin-only pages */}
          {isAdmin && (
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<ListProduct />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="list-product" element={<ListProduct />} />
            </Route>
          )}
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
