import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./EventsDetail.css";
import { useTranslation } from "react-i18next";
import img3 from "../images/imag7.png";

function EventsDetail() {
  const [events, setEvents] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const { t, i18n } = useTranslation();

  // 1. ენის ID-ის განსაზღვრა
  const currentLanguageId = i18n.language === "ka" ? 1 : 2;

  // 2. ბაზისური URL-ები (API_BASE_URL უნდა დასრულდეს სუფთად /api-ით)
  const API_BASE_URL = "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api";
  const SERVER_DOMAIN = "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net";

  const fetchEventData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // ივენთის დეტალების წამოღება სწორი მისამართით
      try {
        const eventRes = await axios.get(`${API_BASE_URL}/events/${id}?languageId=${currentLanguageId}`, config);
        setEvents(eventRes.data);
      } catch (eventError) {
        console.error("Error fetching event details:", eventError);
        setEvents(null);
      }

      // კომენტარების წამოღება სწორი მისამართით
      try {
        const commentsRes = await axios.get(`${API_BASE_URL}/events/${id}/comments?languageId=${currentLanguageId}`, config);
        const commentData = commentsRes.data || [];
        setComments(Array.isArray(commentData) ? commentData : []);
      } catch (commentsError) {
        console.warn("Comments endpoint error:", commentsError);
        setComments([]);
      }

    } catch (e) {
      console.error("General fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, [id, token, currentLanguageId]); // ენის ცვლილებაზეც რომ თავიდან წამოიღოს მონაცემები

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  async function addComment(e) {
    e.preventDefault();
    if (!newComment.trim() || !token) return;

    try {
      await axios.post(
        `${API_BASE_URL}/events/${id}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewComment("");
      fetchEventData();
    } catch (e) {
      console.error("Error posting comment:", e);
      alert("კომენტარის გაგზავნა ვერ მოხერხდა.");
    }
  }

  const getEventImage = () => {
    if (!events?.file) return img3; 

    if (events.file.startsWith("/9j/") || events.file.startsWith("data:image")) {
      return events.file.startsWith("data:image") 
        ? events.file 
        : `data:image/jpeg;base64,${events.file}`;
    }

    if (events.file.startsWith("http://") || events.file.startsWith("https://")) {
      return events.file; 
    }

    return `${SERVER_DOMAIN}${events.file.startsWith("/") ? "" : "/"}${events.file}`;
  };

  const getUserImage = (userImage) => {
    if (!userImage) return img3;

    if (userImage.startsWith("/9j/") || userImage.startsWith("data:image")) {
      return userImage.startsWith("data:image") ? userImage : `data:image/jpeg;base64,${userImage}`;
    }

    if (userImage.startsWith("http://") || userImage.startsWith("https://")) {
      return userImage;
    }
    return `${SERVER_DOMAIN}${userImage.startsWith("/") ? "" : "/"}${userImage}`;
  };

  if (loading) {
    return (
      <div className="event-detail-loading" style={{ textAlign: "center", padding: "100px", fontSize: "20px" }}>
        <h2>იტვირთება...</h2>
      </div>
    );
  }

  if (!events) {
    return (
      <div className="event-detail-error" style={{ textAlign: "center", padding: "100px", color: "red" }}>
        <h2>ღონისძიება ვერ მოიძებნა </h2>
      </div>
    );
  }

  return (
    <div className="event-detail">
      <div className="event-main-content">
        <img src={getEventImage()} alt={events?.title} className="event-image" />
        <div className="event-info-body">
          <h1>{events?.title}</h1>
          <div className="event-meta">
            <p><strong>{t("Description")}:</strong> {events?.description}</p>
            <p>
              <strong>{t("Date")}:</strong>{" "}
              {events?.eventDate ? new Date(events.eventDate).toLocaleDateString("ka-GE") : "თარიღი არ არის"}
            </p>
          </div>
        </div>
      </div>

      <aside className="comments-sidebar">
        <h2>{t("Comments")}</h2>
        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">კომენტარები ჯერ არ არის</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="comment">
                <strong>
                  <img 
                    src={getUserImage(c.user?.image)} 
                    alt="User avatar" 
                    style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "10px", objectFit: "cover" }} 
                  />
                  {c.user?.firstname || "სახელი"} {c.user?.lastname || "გვარი"}
                </strong>
                <p>{c.content}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={addComment} className="comment-form">
          <input
            type="text"
            placeholder="დაწერე კომენტარი..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="comment-input"
          />
          <button type="submit" className="comment-button">გაგზავნა</button>
        </form>
      </aside>
    </div>
  );
}

export default EventsDetail;