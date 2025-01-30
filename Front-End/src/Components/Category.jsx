import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const Category = () => {
  const [category, setCategory] = useState([]);

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
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Position List</h3>
      </div>
      <Link to="/dashboard/add_category" className="btn btn-outline-success">
        +Add Position
      </Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {category.map((c) => (
              <tr>
                <td>{c.name}</td>
                <td className="align-middle">
                  <div className="d-flex justify-content-center gap-2">
                    <Link
                      to={`/dashboard/edit_category/${c.id}`}
                      className="btn btn-outline-success btn-sm d-flex align-items-center"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "6px 10px",
                      }}
                    >
                      <FaEdit size={12} /> Edit
                    </Link>
                    <button
                      className="btn btn-outline-danger btn-sm d-flex align-items-center"
                      onClick={() => handleDelete(c.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "6px 10px",
                      }}
                    >
                      <FaTrash size={12} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Category;
