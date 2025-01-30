import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    password: "",
    salary: "",
    address: "",
    category_id: "",
    image: null,
  });

  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/category")
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log("Error fetching categories:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !employee.name ||
      !employee.email ||
      !employee.password ||
      !employee.salary ||
      !employee.address ||
      !employee.category_id
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (!employee.image) {
      alert("Please select an image.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", employee.name);
    formData.append("email", employee.email);
    formData.append("password", employee.password);
    formData.append("address", employee.address);
    formData.append("salary", employee.salary);
    formData.append("image", employee.image);
    formData.append("category_id", employee.category_id);

    axios
      .post("http://localhost:3000/auth/add_employee", formData)
      .then((result) => {
        setLoading(false);
        if (result.data.Status) {
          navigate("/dashboard/employee");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("Error adding employee:", err);
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-4">
      <div
        className="card shadow-sm p-4 bg-white rounded"
        style={{ width: "600px" }}
      >
        <h4 className="text-center mb-3">Add Employee</h4>
        <hr />
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="inputName" className="form-label fw-bold">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="inputName"
              placeholder="Enter Name"
              onChange={(e) =>
                setEmployee({ ...employee, name: e.target.value })
              }
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="inputEmail" className="form-label fw-bold">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="inputEmail"
              placeholder="Enter Email"
              autoComplete="off"
              onChange={(e) =>
                setEmployee({ ...employee, email: e.target.value })
              }
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="inputPassword" className="form-label fw-bold">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="inputPassword"
              placeholder="Enter Password"
              onChange={(e) =>
                setEmployee({ ...employee, password: e.target.value })
              }
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="inputSalary" className="form-label fw-bold">
              Salary
            </label>
            <input
              type="number"
              className="form-control"
              id="inputSalary"
              placeholder="Enter Salary"
              onChange={(e) =>
                setEmployee({ ...employee, salary: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label fw-bold">
              Address
            </label>
            <input
              type="text"
              className="form-control"
              id="inputAddress"
              placeholder="1234 Main St"
              onChange={(e) =>
                setEmployee({ ...employee, address: e.target.value })
              }
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="category" className="form-label fw-bold">
            Position
            </label>
            <select
              className="form-select"
              id="category"
              onChange={(e) =>
                setEmployee({ ...employee, category_id: e.target.value })
              }
            >
              <option value="">Select a Position</option>
              {category.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold" htmlFor="inputImage">
              Upload Image
            </label>
            <input
              type="file"
              className="form-control"
              id="inputImage"
              name="image"
              accept="image/*"
              onChange={(e) =>
                setEmployee({ ...employee, image: e.target.files[0] })
              }
            />
          </div>

          <div className="col-12 d-flex justify-content-between">
            <button
              type="submit"
              className="btn btn-outline-success w-50"
              disabled={loading}
            >
              {loading ? "Adding Employee..." : "Add Employee"}
            </button>
            <button
              type="button"
              className="btn btn-danger w-50 ms-2"
              onClick={() => navigate("/dashboard/employee")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
