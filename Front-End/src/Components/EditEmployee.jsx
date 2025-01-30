import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    salary: "",
    address: "",
    category_id: "",
  });

  const [category, setCategory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/auth/category`)
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));

    axios
      .get(`http://localhost:3000/auth/employee/${id}`)
      .then((result) => {
        console.log("Employee API Response:", result.data);
        if (result.data.Status) {
          const emp = result.data.Result;
          console.log("Extracted Employee Data:", emp);
          setEmployee({
            name: emp.name || "", // Ensure no undefined values
            email: emp.email || "",
            salary: emp.salary || "",
            address: emp.address || "",
            category_id: emp.category_id || "",
          });
        }
      })
      .catch((err) => console.log(err));
  }, [id]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create form-data instead of JSON
    const formData = new FormData();
    formData.append("name", employee.name);
    formData.append("email", employee.email);
    formData.append("salary", employee.salary);
    formData.append("address", employee.address);
    formData.append("category_id", employee.category_id);

    axios
      .put(`http://localhost:3000/auth/edit_employee/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/employee");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

//   return (
//     <div className="d-flex justify-content-center align-items-center mt-3">
//       <div className="p-3 rounded w-50 border">
//         <h3 className="text-center">Edit Employee</h3>
//         <form className="row g-1" onSubmit={handleSubmit}>
//           <div className="col-12">
//             <label className="form-label">Name</label>
//             <input
//               type="text"
//               className="form-control"
//               value={employee.name}
//               onChange={(e) =>
//                 setEmployee({ ...employee, name: e.target.value })
//               }
//             />
//           </div>
//           <div className="col-12">
//             <label className="form-label">Email</label>
//             <input
//               type="email"
//               className="form-control"
//               value={employee.email}
//               onChange={(e) =>
//                 setEmployee({ ...employee, email: e.target.value })
//               }
//             />
//           </div>
//           <div className="col-12">
//             <label className="form-label">Salary</label>
//             <input
//               type="text"
//               className="form-control"
//               value={employee.salary}
//               onChange={(e) =>
//                 setEmployee({ ...employee, salary: e.target.value })
//               }
//             />
//           </div>
//           <div className="col-12">
//             <label className="form-label">Address</label>
//             <input
//               type="text"
//               className="form-control"
//               value={employee.address}
//               onChange={(e) =>
//                 setEmployee({ ...employee, address: e.target.value })
//               }
//             />
//           </div>
//           <div className="col-12">
//             <label className="form-label">Category</label>
//             <select
//               className="form-select"
//               value={employee.category_id}
//               onChange={(e) =>
//                 setEmployee({ ...employee, category_id: e.target.value })
//               }
//             >
//               {category.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="col-12 pt-2">
//             <div className="d-flex gap-2">
//               <button type="submit" className="btn btn-primary w-50">
//                 Update Employee
//               </button>
//               <button
//                 type="button"
//                 className="btn btn-outline-secondary w-50"
//                 onClick={() => navigate(-1)} // Goes back to the previous page
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="p-4 rounded shadow-lg bg-white" style={{ width: "400px", borderRadius: "12px" }}>
        
        {/* Title */}
        <h3 className="text-center fw-bold text-dark mb-4">Edit Employee</h3>

        {/* Form */}
        <form className="row g-3" onSubmit={handleSubmit}>

          {/* Name */}
          <div className="col-12">
            <label className="form-label fw-semibold">Name</label>
            <input
              type="text"
              className="form-control rounded-3"
              value={employee.name}
              onChange={(e) =>
                setEmployee({ ...employee, name: e.target.value })
              }
            />
          </div>

          {/* Email */}
          <div className="col-12">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control rounded-3"
              value={employee.email}
              onChange={(e) =>
                setEmployee({ ...employee, email: e.target.value })
              }
            />
          </div>

          {/* Salary */}
          <div className="col-12">
            <label className="form-label fw-semibold">Salary</label>
            <input
              type="text"
              className="form-control rounded-3"
              value={employee.salary}
              onChange={(e) =>
                setEmployee({ ...employee, salary: e.target.value })
              }
            />
          </div>

          {/* Address */}
          <div className="col-12">
            <label className="form-label fw-semibold">Address</label>
            <input
              type="text"
              className="form-control rounded-3"
              value={employee.address}
              onChange={(e) =>
                setEmployee({ ...employee, address: e.target.value })
              }
            />
          </div>

          <div className="col-12">
            <label className="form-label fw-semibold">Category</label>
            <select
              className="form-select rounded-3"
              value={employee.category_id}
              onChange={(e) =>
                setEmployee({ ...employee, category_id: e.target.value })
              }
            >
              {category.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="col-12 pt-2">
            <div className="d-flex gap-3">
              
              {/* Update Employee Button */}
              <button type="submit" className="btn btn-primary w-50 rounded-3 fw-bold">
                Update
              </button>

              {/* Cancel Button */}
              <button
                type="button"
                className="btn btn-outline-secondary w-50 rounded-3 fw-bold"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
