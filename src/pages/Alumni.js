import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Alumni.css";
import { useTranslation } from "react-i18next";

export default function Alumni() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const res = await axios.get("http://localhost:5053/api/auth/users");
      setAlumni(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load alumni.");
    } finally {
      setLoading(false);
    }
  };

  const filteredAlumni = alumni.filter((user) => {
    const query = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(query) ||
      user.surname?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.tel?.toLowerCase().includes(query) ||
      user.id?.toString().includes(query)
    );
  });

  if (loading) {
    return <h2 className="loading">Loading...</h2>;
  }

  return (
    <div className="alumni-container">
      <h1 className="title">{t("Alumni members")}</h1>

      <div className="search-box">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <p className="results">
        {filteredAlumni.length} Alumni Found
      </p>

      <div className="alumni-grid">
        {filteredAlumni.map((user) => (
          <div className="alumni-card" key={user._id}>
            <div className="avatar">
              {user.name?.charAt(0)}
              {user.surname?.charAt(0)}
            </div>

            <h2>
              {user.name} {user.surname}
            </h2>

            <div className="info">
              <p>
                <span>Email</span>
                {user.email}
              </p>

              <p>
                <span>Phone</span>
                {user.tel}
              </p>

              <p>
                <span>ID</span>
                {user.id}
              </p>
            </div>
          </div>
        ))}
      </div>

      {!filteredAlumni.length && (
        <h3 className="no-results">No alumni found.</h3>
      )}
    </div>
  );
}