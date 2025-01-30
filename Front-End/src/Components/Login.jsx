

import React, { useState } from "react";
import "./style.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true; 

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    console.log("Submitting:", values);

    try {
      const response = await axios.post("http://localhost:3000/auth/adminlogin", values, {
        withCredentials: true,
      });

      console.log("Server Response:", response.data);

      if (response.data.loginStatus) {
        localStorage.setItem("valid", "true");
        navigate("/dashboard");
      } else {
        setError(response.data.Error || "Login failed. Try again.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border loginForm">
        <div className="text-danger">{error && error}</div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email:</strong>
            </label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Enter Email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className="form-control rounded-0"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password:</strong>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              className="form-control rounded-0"
            />
          </div>
          <button className="btn  w-100 rounded-0 mb-2 btn-dark">Log in</button>
          <div className="mb-1">
            <input type="checkbox" name="tick" id="tick" className="me-2" />
            <label htmlFor="password">You agree with terms & conditions</label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
