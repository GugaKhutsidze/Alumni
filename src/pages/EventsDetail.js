import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./EventsDetail.css";
import { useTranslation } from "react-i18next";
import img3 from "../images/imag7.png"

function EventsDetail() {
  const [events, setEvents] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const { t, i18n } = useTranslation();

  const fetchEventData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [eventRes, commentsRes] = await Promise.all([
        axios.get(`https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api/events/1?languageId=1'${id}`, config),
        axios.get(`https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api/events/1?languageId=1'/${id}/comments`, config)
      ]);

      setEvents(eventRes.data.data);
      
      const commentData = commentsRes.data.data || commentsRes.data || [];
      setComments(Array.isArray(commentData) ? commentData : []);
    } catch (e) {
      console.error("Error fetching event:", e);
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

 async function addComment(e) {
  e.preventDefault();
  if (!newComment.trim()) return;

  try {
    await axios.post(
      `${id}/comments`,
      { content: newComment },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setNewComment("");

    // 🔥 refresh comments immediately
    fetchEventData();

  } catch (e) {
    console.error("Error posting comment:", e);
  }
}
  return (
    <div className="event-detail">
      <div className="event-main-content">
        <img src={events?.image || img3} alt={events?.title} className="event-image" />
        <div className="event-info-body">
          <h1>{events?.title}</h1>
          <div className="event-meta">
            <p><strong>{t("Description")}:</strong> {events?.description}</p>
            <p><strong>{t("Date")}:</strong> {events?.date}</p>
          </div>
        </div>
      </div>

      <aside className="comments-sidebar">
        <h2>კომენტარები</h2>
        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">კომენტარები ჯერ არ არის</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="comment">
                
                <strong>
                  <img
                  src={c.user?.image || img3} 
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