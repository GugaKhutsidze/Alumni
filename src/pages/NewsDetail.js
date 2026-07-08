import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./NewsDetail.css";

const URL =
  "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net";

function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${URL}/api/news/${id}`);
        setNews(response.data);
      } catch (error) {
        console.error("News Detail Error:", error);
      }
    };

    fetchNews();
  }, [id]);

  if (!news) {
    return (
      <div className="news-loading">
        Loading...
      </div>
    );
  }

  return (
    <div className="news-detail">
      <div className="news-main-content">
        <div className="news-info-body">

          <h1>{news.title}</h1>

          <div className="news-meta">
            <p>
              <strong>Date:</strong>{" "}
              {news.newsDate &&
                new Date(news.newsDate).toLocaleDateString()}
            </p>
          </div>

          <div className="news-content">
            <p>{news.body}</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default NewsDetail;