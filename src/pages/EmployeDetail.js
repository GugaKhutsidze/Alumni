import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./EmployDetail.css";
import { useTranslation } from "react-i18next";

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
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [employeeRes, commentsRes] = await Promise.all([
        axios.get(`https://warrior.ge/api/employees/${id}`, config),
        axios.get(`https://warrior.ge/api/employees/${id}/comments`, config),
      ]);

      setEmployee(employeeRes.data.data);

      const commentData = commentsRes.data.data || commentsRes.data || [];
      setComments(Array.isArray(commentData) ? commentData : []);
    } catch (error) {
      console.error("Error fetching employee:", error);
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
      const res = await axios.post(
        `https://warrior.ge/api/employees/${id}/comments`,
        {
          content: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const addedComment =
        res.data.data || {
          id: Date.now(),
          content: newComment,
          user: { name: "Me" },
        };

      setComments((prev) => [...prev, addedComment]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  }

  if (loading) {
    return <h2>{t("loading")}</h2>;
  }

  return (
    <div className="employ-detail">
      <div className="employ-main-content">
        <img
          src={employee?.image}
          alt={employee?.name}
          className="employ-image"
        />

        <div className="employ-info-body">
          <h1>{employee?.name}</h1>

          <div className="employ-meta">
            <p>
              <strong>{t("position")}:</strong> {employee?.position}
            </p>

            <p>
              <strong>{t("department")}:</strong> {employee?.department}
            </p>

            <p>
              <strong>{t("email")}:</strong> {employee?.email}
            </p>

            <p>
              <strong>{t("phone")}:</strong> {employee?.phone}
            </p>

            <p>
              <strong>{t("description")}:</strong> {employee?.description}
            </p>
          </div>
        </div>
      </div>

      <aside className="comments-sidebar">
        <h2>{t("comments")}</h2>

        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">{t("noComments")}</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment">
                <strong><img>{comment.user?.image}</img>{comment.user?.name || "მომხმარებელი"}</strong>
                <p>{comment.content}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={addComment} className="comment-form">
          <input
            type="text"
            placeholder={t("writeComment")}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="comment-input"
          />

          <button type="submit" className="comment-button">
            {t("send")}
          </button>
        </form>
      </aside>
    </div>
  );
}

export default EmployDetail;