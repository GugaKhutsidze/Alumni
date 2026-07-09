import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./EmployDetail.css";
import { useTranslation } from "react-i18next";

const URL = "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api";

function EmployDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const token = localStorage.getItem("token");

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [sending, setSending] = useState(false);

  const currentLanguageId = i18n.language === "ka" ? 1 : 0;

  const fetchJobData = useCallback(async () => {
    try {
      setLoading(true);
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get(
        `${URL}/jobs/${id}?languageId=${currentLanguageId}`,
        config
      );
      setJob(response.data);
    } catch (error) {
      console.error("Job error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, [id, token, currentLanguageId]);

  const fetchFeedbacks = useCallback(async () => {
    try {
      const response = await axios.get(`${URL}/feedback`);
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Feedback error:", error.response?.data || error.message);
    }
  }, []);

  useEffect(() => {
    fetchJobData();
    fetchFeedbacks();
  }, [fetchJobData, fetchFeedbacks]);

  const sendFeedback = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    // ვალიდაცია გაგზავნამდე i18n მესიჯით
    if (content.length > 500) {
      alert(t("feedback_max_length_error", { count: 500 }));
      return;
    }

    try {
      setSending(true);
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.post(
        `${URL}/feedback`,
        {
          content: content,
          rating: Number(rating)
        },
        config
      );
      setContent("");
      setRating(5);
      fetchFeedbacks();
    } catch (error) {
      console.error("Send feedback error:", error.response?.data || error.message);
    } finally {
      setSending(false);
    }
  };

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
            <p><strong>{t("Description")}:</strong> {job.description}</p>
            <p><strong>{t("Salary")}:</strong> {job.salary} GEL</p>
            <p><strong>{t("Start Date")}:</strong> {new Date(job.startDate).toLocaleDateString()}</p>
            <p><strong>{t("End Date")}:</strong> {new Date(job.endDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="feedback-sidebar">
        <h2>{t("Feedback")}</h2>
        <div className="feedback-list">
          {feedbacks.length === 0 ? (
            <p className="no-comments">{t("No feedback yet")}</p>
          ) : (
            [...feedbacks].reverse().map((item) => (
              <div className="feedback-card" key={item.feedbackId}>
                <strong>{item.userName || "Anonymous"}</strong>
                {item.email && <small>{item.email}</small>}
                <p>{item.content}</p>
                <span>⭐ {item.rating}</span>
                <div>{new Date(item.addedAt).toLocaleDateString()}</div>
              </div>
            ))
          )}
        </div>

        <form className="feedback-form" onSubmit={sendFeedback}>
          <textarea
            value={content}
            maxLength={500} // ზღუდავს ჩაწერას ვიზუალურადაც
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("Write your feedback")}
          />
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
          <button type="submit" disabled={sending}>
            {sending ? t("Sending...") : t("Submit")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EmployDetail;