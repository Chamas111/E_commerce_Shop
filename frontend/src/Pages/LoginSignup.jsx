import React, { useState } from "react";
import "./CSS/LoginSignup.css";
import axios from "../Components/axiosInstance";
const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    console.log("Login", formData);

    try {
      const response = await axios.post("/login", formData, {
        headers: {
          Accept: "application/form-data",
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        localStorage.setItem("auth-token", response.data.token);
        window.location.replace("/");
      } else {
        alert(response.data.errors);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred while logging in");
    }
  };

  const signup = async () => {
    console.log("Signup", formData);

    try {
      const response = await axios.post("/signup", formData, {
        headers: {
          Accept: "application/form-data",
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        localStorage.setItem("auth-token", response.data.token);
        window.location.replace("/");
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
          {state === "Sign Up" ? (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={changeHandler}
              placeholder="Your Name"
            />
          ) : (
            <></>
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
            placeholder="password"
          />

          <button
            onClick={() => {
              state === "Login" ? login() : signup();
            }}
          >
            Continue
          </button>
        </div>
        {state === "Sign Up" ? (
          <p className="loginsignup-login">
            Already have an account?{" "}
            <span
              onClick={() => {
                setState("Login");
              }}
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account?{" "}
            <span
              onClick={() => {
                setState("Sign Up");
              }}
            >
              Click here
            </span>
          </p>
        )}

        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing, i agree to the terms of use privacy policy.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
