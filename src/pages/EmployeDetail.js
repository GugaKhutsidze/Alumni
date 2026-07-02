import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./EmployDetail.css"; 
import { useTranslation } from "react-i18next";
import img3 from "../images/imag7.png";

function EmployDetail() {
  const [employee, setEmployee] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const { t } = useTranslation();

  const fetchEmployeeData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [employeeRes, commentsRes] = await Promise.all([
        axios.get(`https://warrior.ge/api/employees/${id}`, config),
        axios.get(`https://warrior.ge/api/employees/${id}/comments`, config)
      ]);

      setEmployee(employeeRes.data.data);
      
      const commentData = commentsRes.data.data || commentsRes.data || [];
      setComments(Array.isArray(commentData) ? commentData : []);
    } catch (e) {
      console.error("Error fetching employee:", e);
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchEmployeeData();
  }, [fetchEmployeeData]);

 async function addComment(e) {
  e.preventDefault();
  if (!newComment.trim()) return;

  try {
    await axios.post(
      `https://warrior.ge/api/employees/${id}/comments`,
      { content: newComment },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setNewComment("");

    fetchEmployeeData();

  } catch (e) {
    console.error("Error posting comment:", e);
  }
}
  if (loading) {
    return <h2>{t("loading")}</h2>;
  }

  return (
    <div className="employ-detail">
      <div className="employ-main-content">
        <img src={employee?.image || img3} alt={employee?.firstname} className="employ-image" />
        <div className="employ-info-body">
          <h1>{employee?.firstname}</h1>
          <div className="employ-meta">
            <p><strong>{t("position")}:</strong> {employee?.position}</p>
            <p><strong>{t("department")}:</strong> {employee?.department}</p>
            <p><strong>{t("description")}:</strong> {employee?.description}</p>
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
                  <img src={c.user?.image || img3} alt={c.user?.firstname || "avatar"} />
                  {c.user?.firstname || "მომხმარებელი"}{c.user?.lastname || "მომხმარებელი"}
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

export default EmployDetail;