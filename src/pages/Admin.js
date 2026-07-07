import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './AdminPanel.css';

const AdminPanel = ({ token: propsToken }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const token = propsToken || localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("dashboard");
  const [alumnis, setAlumnis] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [eventForm, setEventForm] = useState({
    titleGeo: "",
    titleEng: "",
    descriptionGeo: "",
    descriptionEng: "",
    eventDate: "",
    partnerId: 0,
  });
  const [eventImage, setEventImage] = useState(null);
  const [eventPreview, setEventPreview] = useState("");

  const [jobForm, setJobForm] = useState({
    titleGeo: "",
    titleEng: "",
    descriptionGeo: "",
    descriptionEng: "",
    year: "",
  });
  const [jobImage, setJobImage] = useState(null);
  const [jobPreview, setJobPreview] = useState("");
  const [loadingAdd, setLoadingAdd] = useState(false);

  useEffect(() => {
    axios.get("https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api/alumni", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => setAlumnis(res.data || []))
    .catch((err) => console.error(err));
  }, [token]);

  useEffect(() => {
    if (activeTab === "statistics") {
      setLoadingUsers(true);
      axios.get("https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api/alumni", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setUsers(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoadingUsers(false));
    }
  }, [activeTab, token]);

  const handleEventChange = (e) => {
    setEventForm({ ...eventForm, [e.target.name]: e.target.value });
  };

  const handleJobChange = (e) => {
    setJobForm({ ...jobForm, [e.target.name]: e.target.value });
  };

  const handleEventImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEventImage(file);
    setEventPreview(URL.createObjectURL(file));
  };

  const handleJobImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setJobImage(file);
    setJobPreview(URL.createObjectURL(file));
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();

    if (
      !eventForm.titleGeo ||
      !eventForm.titleEng ||
      !eventForm.descriptionGeo ||
      !eventForm.descriptionEng ||
      !eventForm.eventDate
    ) {
      alert(t("Fill all fields"));
      return;
    }

    try {
      setLoadingAdd(true);
      const formData = new FormData();
      formData.append("TitleGeo", eventForm.titleGeo);
      formData.append("TitleEng", eventForm.titleEng);
      formData.append("DescriptionGeo", eventForm.descriptionGeo);
      formData.append("DescriptionEng", eventForm.descriptionEng);
      formData.append("EventDate", eventForm.eventDate);
      formData.append("PartnerId", Number(eventForm.partnerId));

      if (eventImage) {
        formData.append("Photo", eventImage);
      }

      await axios.post(
        "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api/events", 
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(t("Event added"));
      setEventForm({ titleGeo: "", titleEng: "", descriptionGeo: "", descriptionEng: "", eventDate: "", partnerId: 0 });
      setEventImage(null);
      setEventPreview("");
      navigate("/event");
    } catch (err) {
      alert(err.response?.data?.message || err.message || t("Failed to add event"));
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();

    if (
      !jobForm.titleGeo ||
      !jobForm.titleEng ||
      !jobForm.descriptionGeo ||
      !jobForm.descriptionEng ||
      !jobForm.year
    ) {
      alert(t("Fill all fields"));
      return;
    }

    try {
      setLoadingAdd(true);
      const formData = new FormData();
      formData.append("TitleGeo", jobForm.titleGeo);
      formData.append("TitleEng", jobForm.titleEng);
      formData.append("DescriptionGeo", jobForm.descriptionGeo);
      formData.append("DescriptionEng", jobForm.descriptionEng);
      formData.append("Year", jobForm.year);

      if (jobImage) {
        formData.append("Photo", jobImage);
      }

      await axios.post(
        "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api/jobs", 
        formData, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(t("Job added"));
      setJobForm({ titleGeo: "", titleEng: "", descriptionGeo: "", descriptionEng: "", year: "" });
      setJobImage(null);
      setJobPreview("");
      navigate("/employment");
    } catch (err) {
      alert(err.response?.data?.message || err.message || t("Failed to add job"));
    } finally {
      setLoadingAdd(false);
    }
  };

  const filteredAlumni = alumnis.filter(alumni => {
    const fName = alumni.firstName || alumni.Firstname || '';
    const lName = alumni.lastName || alumni.LastName || '';
    const uEmail = alumni.email || alumni.Email || '';
    const sId = alumni.studentId || alumni.StudentId || alumni.id || '';

    const fullName = `${fName} ${lName}`.toLowerCase();
    const email = String(uEmail).toLowerCase();
    const studentIdStr = String(sId);
    
    return fullName.includes(searchQuery.toLowerCase()) || 
           email.includes(searchQuery.toLowerCase()) || 
           studentIdStr.includes(searchQuery);
  });

  const sortedAlumni = [...filteredAlumni].sort((a, b) => {
    const nameA = a.firstName || a.Firstname || "";
    const nameB = b.firstName || b.Firstname || "";
    const idA = a.studentId || a.id || 0;
    const idB = b.studentId || b.id || 0;

    if (sortBy === "name") {
      return nameA.localeCompare(nameB);
    } else if (sortBy === "id") {
      return idA - idB;
    }
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAlumni.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedAlumni.length / itemsPerPage);

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="admin-sidebar-title">{t("TSU Admin")}</h2>
        <nav className="admin-sidebar-nav">
          <button 
            onClick={() => { setActiveTab("dashboard"); setCurrentPage(1); }} 
            className={`admin-sidebar-btn ${activeTab === "dashboard" ? "admin-active" : ""}`}
          >
            {t("Alumni")}
          </button>
          <button 
            onClick={() => setActiveTab("addJob")} 
            className={`admin-sidebar-btn ${activeTab === "addJob" ? "admin-active" : ""}`}
          >
            {t("Add Job")}
          </button>
          <button 
            onClick={() => setActiveTab("addEvent")} 
            className={`admin-sidebar-btn ${activeTab === "addEvent" ? "admin-active" : ""}`}
          >
            {t("Add Event")}
          </button>
          <button 
            onClick={() => setActiveTab("statistics")} 
            className={`admin-sidebar-btn ${activeTab === "statistics" ? "admin-active" : ""}`}
          >
            {t("Statistics Overview")}
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        {activeTab === "dashboard" && (
          <div className="admin-tab-content">
            <div className="admin-controls-container">
              <input 
                type="text" 
                className="admin-search-bar" 
                placeholder={t("Search by name, email, or ID")} 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
              <select 
                className="admin-sort-dropdown" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">{t("Sort by Name")}</option>
                <option value="id">{t("Sort by Student ID")}</option>
              </select>
            </div>

            {currentItems.length > 0 ? (
              <div className="admin-alumni-grid">
                {currentItems.map((alumni) => {
                  const displayFirstName = alumni.firstName || alumni.Firstname || t("Unknown");
                  const displayLastName = alumni.lastName || alumni.LastName || "";
                  const displayEmail = alumni.email || alumni.Email || t("No Email Provided");
                  const displayId = alumni.studentId || alumni.StudentId || alumni.id || "N/A";

                  return (
                    <div key={displayId + displayEmail} className="admin-alumni-card">
                      <div className="admin-card-content">
                        <div style={{ marginBottom: "0.75rem" }}>
                          <span style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "#64748b", display: "block" }}>{t("Full Name")}</span>
                          <h3 style={{ margin: "0", fontSize: "1.15rem" }}>
                            {displayFirstName} {displayLastName !== "-" ? displayLastName : ""}
                          </h3>
                        </div>
                        <div style={{ marginBottom: "0.75rem" }}>
                          <span style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "#64748b", display: "block" }}>{t("Student ID")}</span>
                          <span style={{ fontSize: "0.95rem", fontWeight: "600", color: "#1a2e40" }}>
                            #{displayId}
                          </span>
                        </div>
                        <div style={{ marginBottom: "0.5rem" }}>
                          <span style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "#64748b", display: "block" }}>{t("Institutional Email")}</span>
                          <span style={{ fontSize: "0.9rem", color: "#1a2e40", wordBreak: "break-all" }}>
                            {displayEmail}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => alert(`${t("Viewing records for")} #${displayId}`)} 
                        className="admin-action-btn"
                      >
                        {t("View Profile")}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="admin-no-data">{t("No matching records found in the directory")}</p>
            )}

            {totalPages > 1 && (
              <div className="admin-pagination-controls">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>{t("Previous")}</button>
                <span>{t("Page")} {currentPage} {t("of")} {totalPages}</span>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>{t("Next")}</button>
              </div>
            )}
          </div>
        )}

        {activeTab === "addJob" && (
          <div className="admin-add-page">
            <div className="admin-add-box">
              <h1>{t("Add Job")}</h1>
              <form onSubmit={handleAddJob}>
                <input 
                  name="titleGeo" 
                  placeholder={t("Title Geo")} 
                  value={jobForm.titleGeo} 
                  onChange={handleJobChange} 
                />
                <input 
                  name="titleEng" 
                  placeholder={t("Title Eng")} 
                  value={jobForm.titleEng} 
                  onChange={handleJobChange} 
                />
                <textarea 
                  name="descriptionGeo" 
                  placeholder={t("Description Geo")} 
                  value={jobForm.descriptionGeo} 
                  onChange={handleJobChange} 
                />
                <textarea 
                  name="descriptionEng" 
                  placeholder={t("Description Eng")} 
                  value={jobForm.descriptionEng} 
                  onChange={handleJobChange} 
                />
                <input 
                  type="text" 
                  name="year" 
                  placeholder={t("Year")} 
                  value={jobForm.year} 
                  onChange={handleJobChange} 
                />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleJobImage} 
                />
                {jobPreview && (
                  <img className="admin-preview" src={jobPreview} alt="preview" />
                )}
                <button type="submit" className="admin-submit-btn" disabled={loadingAdd}>
                  {loadingAdd ? t("Adding") : t("Add Job")}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "addEvent" && (
          <div className="admin-add-page">
            <div className="admin-add-box">
              <h1>{t("Add Event")}</h1>
              <form onSubmit={handleAddEvent}>
                <input 
                  name="titleGeo" 
                  placeholder={t("Title Geo")} 
                  value={eventForm.titleGeo} 
                  onChange={handleEventChange} 
                />
                <input 
                  name="titleEng" 
                  placeholder={t("Title Eng")} 
                  value={eventForm.titleEng} 
                  onChange={handleEventChange} 
                />
                <textarea 
                  name="descriptionGeo" 
                  placeholder={t("Description Geo")} 
                  value={eventForm.descriptionGeo} 
                  onChange={handleEventChange} 
                />
                <textarea 
                  name="descriptionEng" 
                  placeholder={t("Description Eng")} 
                  value={eventForm.descriptionEng} 
                  onChange={handleEventChange} 
                />
                <input 
                  type="datetime-local" 
                  name="eventDate" 
                  value={eventForm.eventDate} 
                  onChange={handleEventChange} 
                />
                <input 
                  type="number" 
                  name="partnerId" 
                  value={eventForm.partnerId} 
                  onChange={handleEventChange} 
                />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleEventImage} 
                />
                {eventPreview && (
                  <img className="admin-preview" src={eventPreview} alt="preview" />
                )}
                <button type="submit" className="admin-submit-btn" disabled={loadingAdd}>
                  {loadingAdd ? t("Adding") : t("Add Event")}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === "statistics" && (
          <div className="admin-stats-container">
            <h1 className="admin-stats-title">{t("Platform Insights")}</h1>
            <div className="admin-stats-grid">
              <div className="admin-stats-card">
                <h4>{t("Total Active Records")}</h4>
                <p className="admin-stats-number">{users.length}</p>
              </div>
            </div>
     
            </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;