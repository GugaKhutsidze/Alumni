import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddEvent.css";
import { useTranslation } from "react-i18next";

function AddEvent() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const API_URL = "https://warrior.ge/api/movies";

  const [form, setForm] = useState({
    title: "",
    description: "",
    year: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [deleteId, setDeleteId] = useState("");
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
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
      data.append("image", imageFile);

      await axios.post(API_URL, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Event added!");

      setForm({ title: "", description: "", year: "" });
      setImageFile(null);
      setPreview("");

      navigate("/event");
    } catch (err) {
      console.log(err);
      alert("Failed to add event");
    }

    setLoadingAdd(false);
  };

  const handleDelete = async () => {
    if (!deleteId) {
      alert("Enter ID to delete");
      return;
    }

    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;

    setLoadingDelete(true);

    try {
      await axios.delete(`${API_URL}/${deleteId}`);

      alert("Event deleted!");
      setDeleteId("");
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }

    setLoadingDelete(false);
  };

  return (
    <div className="add-page">

      <div className="add-box">

        <h1>{t("Add Event")}</h1>

        {/* ➕ ADD FORM */}
        <form onSubmit={handleAdd}>

          <input
            type="text"
            name="title"
            placeholder={t("Title")}
            value={form.title}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder={t("Description")}
            value={form.description}
            onChange={handleChange}
          />

          <input
            type="number"
            name="year"
            placeholder={t("Year")}
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
            {loadingAdd ? t("Adding...") : t("Add Event")}
          </button>
        </form>

        <hr style={{ margin: "20px 0" }} />

        {/* 🗑️ DELETE SECTION */}
        <h2>{t("Delete Event")}</h2>

        <input
          type="text"
          placeholder={t("Enter Event ID")}
          value={deleteId}
          onChange={(e) => setDeleteId(e.target.value)}
        />

        <button
          onClick={handleDelete}
          disabled={loadingDelete}
          style={{
            background: "red",
            color: "white",
            width: "100%",
            marginTop: "10px",
          }}
        >
          {loadingDelete ? "Deleting..." : t("Delete Event")}
        </button>

      </div>


    </div>
  );
}

export default AddEvent;