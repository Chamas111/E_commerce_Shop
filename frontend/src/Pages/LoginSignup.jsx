import React, { useState } from "react";
import "./CSS/LoginSignup.css";
import axios from "../Components/axiosInstance";

const LoginSignup = () => {
  const [state, setState] = useState("Login"); // "Login" or "Sign Up"
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user", // default role
  });

  // Handle input changes
  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Login function
  const login = async () => {
    try {
      const response = await axios.post("/login", formData, {
        headers: {
          Accept: "application/form-data",
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        localStorage.setItem("auth-token", response.data.token);
        localStorage.setItem("role", response.data.role);

        // Redirect based on role
        if (response.data.role === "admin") {
          window.location.replace("/admin");
        } else {
          window.location.replace("/");
        }
      } else {
        alert(response.data.errors);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred while logging in");
    }
  };

  // Signup function
  const signup = async () => {
    try {
      const response = await axios.post("/signup", formData, {
        headers: {
          Accept: "application/form-data",
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        localStorage.setItem("auth-token", response.data.token);
        localStorage.setItem("role", formData.role);

        // Redirect based on role
        if (formData.role === "admin") {
          window.location.replace("/admin");
        } else {
          window.location.replace("/");
        }
      } else {
        alert(response.data.errors);
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert("An error occurred while signing up");
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {/* Username only for Sign Up */}
          {state === "Sign Up" && (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={changeHandler}
              placeholder="Your Name"
            />
          )}

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={changeHandler}
            placeholder="Your Email"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={changeHandler}
            placeholder="Password"
          />

          {/* Role selector only for Sign Up */}
          {state === "Sign Up" && (
            <select name="role" value={formData.role} onChange={changeHandler}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          )}

          <button
            onClick={() => {
              state === "Login" ? login() : signup();
            }}
          >
            Continue
          </button>
        </div>

        {/* Switch between Login and Sign Up */}
        {state === "Sign Up" ? (
          <p className="loginsignup-login">
            Already have an account?{" "}
            <span onClick={() => setState("Login")}>Login here</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account?{" "}
            <span onClick={() => setState("Sign Up")}>Click here</span>
          </p>
        )}

        <div className="loginsignup-agree">
          <input type="checkbox" id="agree" />
          <p>By continuing, I agree to the terms of use and privacy policy.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
