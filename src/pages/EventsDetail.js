import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./EventsDetail.css";
import { useTranslation } from "react-i18next";

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
        axios.get(`https://warrior.ge/api/movies/${id}`, config),
        axios.get(`https://warrior.ge/api/movies/${id}/comments`, config)
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
      const res = await axios.post(
        `https://warrior.ge/api/movies/${id}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Optimistic update: ვამატებთ ახალ კომენტარს სიაში ხელახალი fetch-ის გარეშე
      const addedComment = res.data.data || { id: Date.now(), content: newComment, user: { name: "მე" } };
      setComments((prev) => [...prev, addedComment]);
      setNewComment("");
    } catch (e) {
      console.error("Error posting comment:", e);
    }
  }

  return (
    <div className="event-detail">
      <div className="event-main-content">
        <img src={events?.image} alt={events?.title} className="event-image" />
        <div className="event-info-body">
          <h1>{events?.title}</h1>
          <div className="event-meta">
            <p><strong>{t("Description")}:</strong> {events?.description}</p>
            <p><strong>{t("Date")}:</strong> {events?.date}</p>
            <p><strong>{t("Location")}:</strong> {events?.location}</p>
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
                
                <strong><img>{c.user?.image}</img>{c.user?.name || "მომხმარებელი"}</strong>
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