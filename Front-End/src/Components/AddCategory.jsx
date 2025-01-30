
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
    const [category, setCategory] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/auth/add_category', { category })
            .then(result => {
                if (result.data.Status) {
                    navigate('/dashboard/category');
                } else {
                    alert(result.data.Error);
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="d-flex justify-content-center align-items-center mt-4">
            <div className="card shadow-sm p-4 bg-white rounded" style={{ width: "600px" }}>
                <h4 className="text-center mb-3">Add Position</h4>
                <hr />
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-12">
                        <label htmlFor="category" className="form-label fw-bold">
                        Position
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="category"
                            placeholder="Enter Position"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </div>
                    <div className="col-12 d-flex justify-content-between">
                        <button
                            type="submit"
                            className="btn btn-outline-success w-50"
                        >
                            Add Position
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger w-50 ms-2"
                            onClick={() => navigate("/dashboard/category")}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCategory;
