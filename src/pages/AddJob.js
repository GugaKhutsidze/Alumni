import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddJob.css";

function AddJob() {
  const navigate = useNavigate();

  const API_URL = "https://warrior.ge/api/movies";

  // ➕ ADD STATE
  const [form, setForm] = useState({
    title: "",
    description: "",
    year: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loadingAdd, setLoadingAdd] = useState(false);

  // 🗑️ DELETE STATE
  const [deleteId, setDeleteId] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);

  // INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // IMAGE
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ➕ ADD JOB
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

  // 🗑️ DELETE JOB
  const handleDelete = async () => {
    if (!deleteId) {
      alert("Enter ID");
      return;
    }

    const ok = window.confirm("Delete this job?");
    if (!ok) return;

    setLoadingDelete(true);

    try {
      await axios.delete(`${API_URL}/${deleteId}`);

      alert("Deleted!");
      setDeleteId("");
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }

    setLoadingDelete(false);
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

        <hr />

        {/* 🗑️ DELETE SECTION */}
        <h2>Delete Job</h2>

        <input
          type="text"
          placeholder="Enter Job ID"
          value={deleteId}
          onChange={(e) => setDeleteId(e.target.value)}
        />

        <button
          className="delete-btn"
          onClick={handleDelete}
          disabled={loadingDelete}
        >
          {loadingDelete ? "Deleting..." : "Delete Job"}
        </button>

      </div>


    </div>
  );
}

export default AddJob;