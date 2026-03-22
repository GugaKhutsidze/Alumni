import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./EventsDetail.css";

function EventsDetail() {
  const [events, setEvents] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const token = localStorage.getItem("token");

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
      await axios.post(
        `https://warrior.ge/api/movies/${id}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment("");
      fetchEventData(); // Refresh list to show the new comment
    } catch (e) {
      console.error("Error posting comment:", e);
    }
  }

  if (!token) return <div className="error">გთხოვთ გაიაროთ ავტორიზაცია</div>;
  if (loading) return <div className="loading">იტვირთება...</div>;
  if (!events) return <div className="error">ღონისძიება ვერ მოიძებნა</div>;

  return (
    <div className="event-detail">
      <h1>{events?.title}</h1>
      <div className="event-meta">
        <p><strong>აღწერა:</strong> {events?.description}</p>
        <p><strong>თარიღი:</strong> {events?.date}</p>
        <p><strong>მდებარეობა:</strong> {events?.location}</p>
      </div>

      <hr />

      <section className="comments-section">
        <h2>კომენტარები</h2>
        <div className="comments-list">
          {comments.length === 0 ? (
            <p>კომენტარები არ არის</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="comment">
                <strong>{c.user?.name || "მომხმარებელი"}:</strong> {c.content}
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
      </section>
    </div>
  );
}

export default EventsDetail;