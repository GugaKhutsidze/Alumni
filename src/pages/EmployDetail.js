import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./EmployDetail.css";
import { useTranslation } from "react-i18next";

const API_BASE_URL = "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api";

function EmployDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const token = localStorage.getItem("token");

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1 = ქართული, 0 = ინგლისური
  const currentLanguageId = i18n.language === "ka" ? 1 : 0;

  const fetchJobData = useCallback(async () => {
    try {
      setLoading(true);
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const jobRes = await axios.get(
        `${API_BASE_URL}/jobs/${id}?languageId=${currentLanguageId}`,
        config
      );

      if (jobRes.data) {
        setJob(jobRes.data);
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
              {new Date(job.startDate).toLocaleDateString()}
            </p>

            <p>
              <strong>{t("End Date")}:</strong>{" "}
              {new Date(job.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployDetail;