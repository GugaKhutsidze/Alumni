import { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "./EJ.css";

const API_URL =
  "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api/jobs";

function AddJob() {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    advertisementTypeID: 0,
    isAlumniAd: true,
    partnerID: 0,
    titleGeo: "",
    titleEng: "",
    descriptionGeo: "",
    descriptionEng: "",
    startDate: "",
    endDate: "",
    salary: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    const jobData = {
      advertisementTypeID: formData.advertisementTypeID,
      isAlumniAd: formData.isAlumniAd,
      partnerID: formData.partnerID,
      titleGeo: formData.titleGeo,
      titleEng: formData.titleEng,
      descriptionGeo: formData.descriptionGeo,
      descriptionEng: formData.descriptionEng,
      startDate: formData.startDate
        ? new Date(formData.startDate).toISOString()
        : null,
      endDate: formData.endDate
        ? new Date(formData.endDate).toISOString()
        : null,
      salary: formData.salary,
    };

    try {
      await axios.post(API_URL, jobData, {
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      alert(t("job_added_successfully"));

      setFormData({
        advertisementTypeID: 0,
        isAlumniAd: true,
        partnerID: 0,
        titleGeo: "",
        titleEng: "",
        descriptionGeo: "",
        descriptionEng: "",
        startDate: "",
        endDate: "",
        salary: "",
      });
    } catch (err) {
      console.error(err.response?.data || err);

      alert(
        err.response?.data?.title ||
          err.response?.data?.message ||
          t("job_add_error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="job-form" onSubmit={handleSubmit}>
      <h2>{t("Add New Job")}</h2>

      <input
        type="number"
        name="advertisementTypeID"
        placeholder={t("advertisement_type_id")}
        value={formData.advertisementTypeID}
        onChange={handleChange}
        required
      />

      <label className="checkbox-label">
        <input
          type="checkbox"
          name="isAlumniAd"
          checked={formData.isAlumniAd}
          onChange={handleChange}
        />
        {t("is_alumni_advertisement")}
      </label>

      <input
        type="number"
        name="partnerID"
        placeholder={t("partner_id")}
        value={formData.partnerID}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="titleGeo"
        placeholder={t("title_geo")}
        value={formData.titleGeo}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="titleEng"
        placeholder={t("title_eng")}
        value={formData.titleEng}
        onChange={handleChange}
        required
      />

      <textarea
        name="descriptionGeo"
        placeholder={t("description_geo")}
        value={formData.descriptionGeo}
        onChange={handleChange}
        required
      />

      <textarea
        name="descriptionEng"
        placeholder={t("description_eng")}
        value={formData.descriptionEng}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="salary"
        placeholder={t("salary")}
        value={formData.salary}
        onChange={handleChange}
        required
      />

      <label>{t("start_date")}</label>
      <input
        type="datetime-local"
        name="startDate"
        value={formData.startDate}
        onChange={handleChange}
        required
      />

      <label>{t("end_date")}</label>
      <input
        type="datetime-local"
        name="endDate"
        value={formData.endDate}
        onChange={handleChange}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? t("sending") : t("Add Job")}
      </button>
    </form>
  );
}

export default AddJob;