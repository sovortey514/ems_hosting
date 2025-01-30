import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa"; 

useEffect;

const Start = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios
      .get("http://localhost:3000/verify")
      .then((result) => {
        if (result.data.Status) {
          if (result.data.role === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/employee_detail/" + result.data.id);
          }
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 loginPage"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div
        className="p-4 rounded shadow-lg bg-white loginForm text-center"
        style={{ width: "300px", borderRadius: "12px" }}
      >
        <h2 className="fw-bold mb-4 text-dark">Login As</h2>

        <button
          type="button"
          className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
          style={{
            padding: "10px",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "8px",
            transition: "all 0.3s ease-in-out",
          }}
          onClick={() => navigate("/adminlogin")}
        >
          <FaUserShield size={18} /> Admin
        </button>
      </div>
    </div>
  );
};

export default Start;
