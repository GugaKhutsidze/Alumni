import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./EventsDetail.css";
import { useTranslation } from "react-i18next";
import img3 from "../images/imag7.png";

const SERVER_DOMAIN = "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net";

const parseImageSrc = (file) => {
  if (!file) return img3; 
  if (file.startsWith("/9j/") || file.startsWith("data:image")) {
    return file.startsWith("data:image") ? file : `data:image/jpeg;base64,${file}`;
  }
  if (file.startsWith("http://") || file.startsWith("https://")) {
    return file; 
  }
  return `${SERVER_DOMAIN}${file.startsWith("/") ? "" : "/"}${file}`;
};

function EventsDetail() {
  const [events, setEvents] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const { t, i18n } = useTranslation();

  const currentLanguageId = i18n.language === "ka" ? 1 : 2;
  const API_BASE_URL = "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api";

  const fetchEventData = useCallback(async () => {
    if (!token) return;
    
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      try {
        const eventRes = await axios.get(`${API_BASE_URL}/events/${id}?languageId=${currentLanguageId}`, config);
        if (eventRes.data) {
          eventRes.data.computedImage = parseImageSrc(eventRes.data.file);
        }
        setEvents(eventRes.data);
      } catch (eventError) {
        console.error("Error fetching event details:", eventError);
        setEvents(null);
      }

      try {
        const commentsRes = await axios.get(`${API_BASE_URL}/events/${id}/comments?languageId=${currentLanguageId}`, config);
        const commentData = commentsRes.data || [];
        const processedComments = (Array.isArray(commentData) ? commentData : []).map(c => ({
          ...c,
          user: {
            ...c.user,
            computedUserImage: parseImageSrc(c.user?.image)
          }
        }));
        setComments(processedComments);
      } catch (commentsError) {
        console.warn("Comments endpoint error:", commentsError);
        setComments([]);
      }

    } catch (e) {
      console.error("General fetch error:", e);
    }
  }, [id, token, currentLanguageId]);

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

<<<<<<< HEAD
  if (!events ) {
=======
  // const getEventImage = () => {
  //   if (!events?.file) return img3; 

  //   if (events.file.startsWith("/9j/") || events.file.startsWith("data:image")) {
  //     return events.file.startsWith("data:image") 
  //       ? events.file 
  //       : `data:image/jpeg;base64,${events.file}`;
  //   }

  //   if (events.file.startsWith("http://") || events.file.startsWith("https://")) {
  //     return events.file; 
  //   }

  //   return `${SERVER_DOMAIN}${events.file.startsWith("/") ? "" : "/"}${events.file}`;
  // };

  const getEventImage = () => {
    if (!events?.imageUrl) return img3;

    return `${SERVER_DOMAIN}/${events.imageUrl}`;
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
>>>>>>> 83de581dda8fd0e9f3e6e24064e1b0505d995e2b
    return (
      <p className="no-data">{t("Not found")}</p>
    );
  }

  return (
    <div className="event-detail">
      <div className="event-main-content">
        <img src={events?.computedImage || img3} alt={events?.title} className="event-image" />
        <div className="event-info-body">
          <h1>{events?.title || t("Loading...")}</h1>
          <div className="event-meta">
            <p><strong>{t("Description")}:</strong> {events?.description}</p>
            <p>
              <strong>{t("Date")}:</strong>{" "}
              {events?.eventDate ? new Date(events.eventDate).toLocaleDateString("ka-GE") : ""}
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
                    src={c.user?.computedUserImage} 
                    alt="User avatar" 
                  />
                  {c.user?.firstname || ""} {c.user?.lastname || ""}
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