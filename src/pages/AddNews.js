import { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "./EJ.css";

const URL = "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api/news";

function AddNews() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    TitleGeo: "",
    TitleEng: "",
    BodyGeo: "",
    BodyEng: "",
    UserId: 0,
    NewsDate: new Date().toISOString(),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("TitleGeo", form.TitleGeo);
    formData.append("TitleEng", form.TitleEng);
    formData.append("BodyGeo", form.BodyGeo);
    formData.append("BodyEng", form.BodyEng);
    formData.append("UserId", form.UserId);
    formData.append("NewsDate", form.NewsDate);

    try {
      await axios.post(URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      });

      alert(t("News added successfully!"));
      
      setForm({
        TitleGeo: "",
        TitleEng: "",
        BodyGeo: "",
        BodyEng: "",
        UserId: 0,
        NewsDate: new Date().toISOString(),
      });
    } catch (err) {
      console.error(err);
      alert(t("Failed to add news"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-page">
      <div className="job-form">
        <h2>{t("Add News")}</h2>
        <form onSubmit={handleAdd} className="admin-form">
          <input type="text" name="TitleGeo" placeholder={t("Title (Geo)")} value={form.TitleGeo} onChange={handleChange} required />
          <input type="text" name="TitleEng" placeholder={t("Title (Eng)")} value={form.TitleEng} onChange={handleChange} required />
          <textarea name="BodyGeo" placeholder={t("Body (Geo)")} value={form.BodyGeo} onChange={handleChange} required />
          <textarea name="BodyEng" placeholder={t("Body (Eng)")} value={form.BodyEng} onChange={handleChange} required />
          <input type="number" name="UserId" placeholder={t("User ID")} value={form.UserId} onChange={handleChange} required />
          
          <label>{t("News Date")}</label>
          <input 
            type="datetime-local" 
            name="NewsDate" 
            value={form.NewsDate.slice(0, 16)} 
            onChange={(e) => setForm({...form, NewsDate: new Date(e.target.value).toISOString()})} 
            required 
          />

          <button type="submit" disabled={loading}>
            {loading ? t("Adding...") : t("Add News")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddNews;