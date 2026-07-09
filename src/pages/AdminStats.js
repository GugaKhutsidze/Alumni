import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "./AdminStats.css";

const URL = "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api/admin/stats";

function AdminStats() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError(t("unauthorized_no_token"));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(URL, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(response.data);
    } catch (err) {
      console.error("Stats error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        setError(t("unauthorized_invalid_token"));
      } else {
        setError(err.response?.data?.message || t("stats_load_error"));
      }
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="page-loading">
        <span className="spinner"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-error-container">
        <p className="error-text">{error}</p>
        <button onClick={fetchStats} className="retry-btn">
          {t("retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="admin-stats-container">
      <h2>{t("Statistics")}</h2>
      {stats ? (
        <div className="stats-grid">
          {Object.entries(stats).map(([key, value]) => (
            <div className="stats-card" key={key}>
              <h3>{t(key)}</h3>
              <p className="stats-number">{value}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-data">{t("No data available")}</p>
      )}
    </div>
  );
}

export default AdminStats;