
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

const Employee = () => {
  const [employee, setEmployee] = useState([]);
  const [filteredEmployee, setFilteredEmployee] = useState([]);
  const [category, setCategory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
 
    axios.get("http://localhost:3000/auth/employee").then((result) => {
      if (result.data.Status) {
        setEmployee(result.data.Data);
        setFilteredEmployee(result.data.Data); 
      } else {
        alert(result.data.Error);
      }
    }).catch((err) => console.log(err));


    axios.get("http://localhost:3000/auth/category").then((result) => {
      if (result.data.Status) {
        setCategory(result.data.Result);
      } else {
        alert(result.data.Error);
      }
    }).catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios.delete("http://localhost:3000/auth/delete_employee/" + id).then((result) => {
      if (result.data.Status) {
        setEmployee(employee.filter(emp => emp.id !== id));
        setFilteredEmployee(filteredEmployee.filter(emp => emp.id !== id));
      } else {
        alert(result.data.Error);
      }
    });
  };


  useEffect(() => {
    let filtered = employee;

    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(e => e.category_id === selectedCategory);
    }

    setFilteredEmployee(filtered);
  }, [searchTerm, selectedCategory, employee]);

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-between align-items-center">
        <h3>Employee List</h3>
        <Link to="/dashboard/add_employee" className="btn btn-outline-success">
          + Add Employee
        </Link>
      </div>

      {/* Search and Filter Section */}
      <div className="row mt-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Filter by Position</option>
            {category.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3">
        <table className="table">
          <thead>
            <tr className="table-dark">
              <th>Name</th>
              <th>Image</th>
              <th>Email</th>
              <th>Address</th>
              <th>Salary</th>
              <th>Position</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployee.map((e) => (
              <tr key={e.id}>
                <td>{e.name}</td>
                <td>
                  <img
                    src={`http://localhost:3000/Images/` + e.profile_image}
                    className="employee_image"
                    alt="Employee"
                  />
                </td>
                <td>{e.email}</td>
                <td>{e.address}</td>
                <td>{e.salary}</td>
                <td>
  {category.find(cat => parseInt(cat.id) === parseInt(e.category_id))?.name || "N/A"}
</td>
                <td>
                  <Link
                    to={`/dashboard/edit_employee/${e.id}`}
                    className="btn btn-outline-success btn-sm me-2"
                  >
                    <i className="bi bi-pencil me-2"></i> Edit
                  </Link>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(e.id)}
                  >
                    <FaTrash className="me-2" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;
