import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./EventAdd.css";

function AddEvent() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const API_URL =
    "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api/events";

  const [form, setForm] = useState({
    titleGeo: "",
    titleEng: "",
    descriptionGeo: "",
    descriptionEng: "",
    eventDate: "",
    partnerId: 0,
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loadingAdd, setLoadingAdd] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (
      !form.titleGeo ||
      !form.titleEng ||
      !form.descriptionGeo ||
      !form.descriptionEng ||
      !form.eventDate
    ) {
      alert("Fill all fields");
      return;
    }

    try {
      setLoadingAdd(true);

      const formData = new FormData();

      // Names must match API
      formData.append("TitleGeo", form.titleGeo);
      formData.append("TitleEng", form.titleEng);
      formData.append("DescriptionGeo", form.descriptionGeo);
      formData.append("DescriptionEng", form.descriptionEng);
      formData.append("EventDate", form.eventDate);
      formData.append("PartnerId", Number(form.partnerId));

      // API expects Photo
      if (imageFile) {
        formData.append("Photo", imageFile);
      }

      // Debug
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      await axios.post(API_URL, formData);

      alert("Event added!");

      setForm({
        titleGeo: "",
        titleEng: "",
        descriptionGeo: "",
        descriptionEng: "",
        eventDate: "",
        partnerId: 0,
      });

      setImageFile(null);
      setPreview("");

      navigate("/event");

    } catch (err) {
      console.error("ERROR:", err);
      console.error("DATA:", err.response?.data);
      console.error("STATUS:", err.response?.status);

      alert(
        err.response?.data?.message ||
        err.message ||
        "Failed to add event"
      );

    } finally {
      setLoadingAdd(false);
    }
  };

  return (
    <div className="add-page">
      <div className="add-box">

        <h1>{t("Add Event")}</h1>

        <form onSubmit={handleAdd}>

          <input
            name="titleGeo"
            placeholder="Title Geo"
            value={form.titleGeo}
            onChange={handleChange}
          />

          <input
            name="titleEng"
            placeholder="Title Eng"
            value={form.titleEng}
            onChange={handleChange}
          />

          <textarea
            name="descriptionGeo"
            placeholder="Description Geo"
            value={form.descriptionGeo}
            onChange={handleChange}
          />

          <textarea
            name="descriptionEng"
            placeholder="Description Eng"
            value={form.descriptionEng}
            onChange={handleChange}
          />

          <input
            type="datetime-local"
            name="eventDate"
            value={form.eventDate}
            onChange={handleChange}
          />

          <input
            type="number"
            name="partnerId"
            value={form.partnerId}
            onChange={handleChange}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
          />

          {preview && (
            <img
              className="preview"
              src={preview}
              alt="preview"
            />
          )}

          <button type="submit" disabled={loadingAdd}>
            {loadingAdd ? "Adding..." : "Add Event"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default AddEvent;