import { useEffect, useState } from "react";
import axios from "axios";
import "./News.css";

const API_URL =
  "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api/news";

function News() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setNews(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (!news.length) {
    return <h2>Loading...</h2>;
  }


  return (
    <section className="news-container">

      <h1 className="news-heading">
        სიახლეები
      </h1>


      <div className="news-layout">

        {/* BIG NEWS */}
        <article className="main-news">

          <div className="news-image big">
          </div>

          <span>
            {new Date(news[0].newsDate).toLocaleDateString()}
          </span>

          <h2>
            {news[0].title}
          </h2>

          <p>
            {news[0].body}
          </p>

        </article>



        {/* SMALL NEWS */}
        <div className="side-news">

          {news.slice(1,5).map((item)=>(
            <article 
              className="small-news"
              key={item.newsId}
            >

              <div className="news-image">
                TSU
              </div>

              <div>
                <small>
                  {new Date(item.newsDate)
                  .toLocaleDateString()}
                </small>

                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.body.substring(0,80)}...
                </p>
              </div>

            </article>
          ))}

        </div>


      </div>

    </section>
  );
}

export default News;