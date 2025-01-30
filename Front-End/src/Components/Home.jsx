import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaUsers, FaUserShield } from "react-icons/fa";

const Home = () => {
  const [adminTotal, setAdminTotal] = useState(0);
  const [employeeTotal, setemployeeTotal] = useState(0);

  useEffect(() => {
    employeeCount();
  }, []);

  const employeeCount = () => {
    axios.get("http://localhost:3000/auth/employee_count").then((result) => {
      if (result.data.Status) {
        setemployeeTotal(result.data.data[0].employee);
      }
    });
  };
  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-center gap-4 flex-wrap">
        <div
          className="card text-center shadow-sm p-4 rounded-lg"
          style={{ width: "280px" }}
        >
          <div className="text-center pb-2">
            <FaUsers size={30} className="text-primary mb-2" />{" "}
            <h4 className="text-primary">Employee</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5 className="text-muted">Total:</h5>
            <h5 className="fw-bold">{employeeTotal}</h5>
          </div>
        </div>
        <div
          className="card text-center shadow-sm p-4 rounded-lg"
          style={{ width: "280px" }}
        >
          <div className="text-center pb-2">
            <FaUserShield size={30} className="text-success mb-2" />{" "}
            <h4 className="text-success">Admin</h4>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <h5 className="text-muted">Total:</h5>
            <h5 className="fw-bold">{adminTotal}</h5>
          </div>
        </div>
      </div>
      <div className="mt-4 px-5 pt-3"></div>
    </div>
  );
};

export default Home;
