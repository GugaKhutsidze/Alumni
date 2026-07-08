import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./EmployDetail.css";
import { useTranslation } from "react-i18next";
import img3 from "../images/imag7.png";

const SERVER_DOMAIN =
  "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net";

const API_BASE_URL =
  "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api";

const parseImageSrc = (file) => {
  if (!file) return img3;

  if (file.startsWith("/9j/") || file.startsWith("data:image")) {
    return file.startsWith("data:image")
      ? file
      : `data:image/jpeg;base64,${file}`;
  }

  if (file.startsWith("http://") || file.startsWith("https://")) {
    return file;
  }

  return `${SERVER_DOMAIN}${file.startsWith("/") ? "" : "/"}${file}`;
};

function EmployDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const token = localStorage.getItem("token");

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentLanguageId = i18n.language === "ka" ? 1 : 2;

  const fetchJobData = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const jobRes = await axios.get(
        `${API_BASE_URL}/jobs/${id}?languageId=${currentLanguageId}`,
        config
      );

      if (jobRes.data) {
        setJob({
          ...jobRes.data,
          computedImage: parseImageSrc(
            jobRes.data.file || jobRes.data.imageUrl
          ),
        });
      }
    } catch (error) {
      console.error("Fetch error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, [id, token, currentLanguageId]);

  useEffect(() => {
    fetchJobData();
  }, [fetchJobData]);

  if (loading || !job) {
    return (
      <div className="page-loading">
        <span className="spinner"></span>
      </div>
    );
  }

  return (
    <div className="event-detail">
      <div className="event-main-content">
        <img src={job.computedImage} alt={job.title} className="event-image" />

        <div className="event-info-body">
          <h1>{job.title}</h1>

          <div className="event-meta">
            <p>
              <strong>{t("Description")}:</strong> {job.description}
            </p>

            <p>
              <strong>{t("Salary")}:</strong> {job.salary} GEL
            </p>

            <p>
              <strong>{t("Start Date")}:</strong>{" "}
              {new Date(job.startDate).toLocaleDateString("ka-GE")}
            </p>

            <p>
              <strong>{t("End Date")}:</strong>{" "}
              {new Date(job.endDate).toLocaleDateString("ka-GE")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployDetail;