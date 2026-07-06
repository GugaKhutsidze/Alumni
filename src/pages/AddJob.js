import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./JobAdd.css";

function AddJob() {
  const navigate = useNavigate();

  const API_URL = "https://localhost:8000/api/jobs";

  const [form, setForm] = useState({
    title: "",
    description: "",
    year: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loadingAdd, setLoadingAdd] = useState(false);

  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.year) {
      alert("Fill all fields");
      return;
    }

    setLoadingAdd(true);

    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("year", form.year);
      data.append("image", image);

      await axios.post(API_URL, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Job added!");

      setForm({ title: "", description: "", year: "" });
      setImage(null);
      setPreview("");

      navigate("/employment");
    } catch (err) {
      console.log(err);
      alert("Add failed");
    }

    setLoadingAdd(false);
  };

  

  return (
    <div className="add-job-page">

      <div className="add-job-box">

        <h1>Add Job</h1>

        {/* ➕ ADD FORM */}
        <form onSubmit={handleAdd}>

          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={form.title}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Job Description"
            value={form.description}
            onChange={handleChange}
          />

          <input
            type="number"
            name="year"
            placeholder="Year"
            value={form.year}
            onChange={handleChange}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
          />

          {preview && (
            <img className="preview" src={preview} alt="preview" />
          )}

          <button disabled={loadingAdd}>
            {loadingAdd ? "Adding..." : "Add Job"}
          </button>

        </form>


      </div>


    </div>
  );
}

export default AddJob;