import { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "./EJ.css";

function AddEvent() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [form, setForm] = useState({
    TitleGeo: "",
    TitleEng: "",
    DescriptionGeo: "",
    DescriptionEng: "",
    EventDate: new Date().toISOString(),
    PartnerId: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);

    const API_URL = "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api/events";

    // 1. Create FormData object
    const formData = new FormData();
    formData.append("TitleGeo", form.TitleGeo);
    formData.append("TitleEng", form.TitleEng);
    formData.append("DescriptionGeo", form.DescriptionGeo);
    formData.append("DescriptionEng", form.DescriptionEng);
    formData.append("EventDate", form.EventDate);
    formData.append("PartnerId", form.PartnerId);
    if (imageFile) {
      formData.append("Photo", imageFile);
    }

    try {
      await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "accept": "*/*"
        },
      });
      alert(t("Event added successfully!"));
    } catch (err) {
      console.error(err);
      alert(t("Failed to add event"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-page">
      <div className="add-box">
        <h2>{t("Add Event")}</h2>
        <form onSubmit={handleAdd} className="admin-form">
          <input name="TitleGeo" placeholder={t("Title (Geo)")} value={form.TitleGeo} onChange={handleChange} required />
          <input name="TitleEng" placeholder={t("Title (Eng)")} value={form.TitleEng} onChange={handleChange} required />
          <textarea name="DescriptionGeo" placeholder={t("Description (Geo)")} value={form.DescriptionGeo} onChange={handleChange} required />
          <textarea name="DescriptionEng" placeholder={t("Description (Eng)")} value={form.DescriptionEng} onChange={handleChange} required />
          
          <label>{t("Partner ID")}</label>
          <input type="number" name="PartnerId" value={form.PartnerId} onChange={handleChange} />

          <label>{t("Upload Photo")}</label>
          <input type="file" name="Photo" accept="image/*" onChange={handleFileChange} />

          <button type="submit" disabled={loading}>
            {loading ? t("Adding...") : t("Add Event")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddEvent;