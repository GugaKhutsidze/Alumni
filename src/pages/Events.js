import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Footer from "../components/Footer";
import "./EE.css";
import { useTranslation } from "react-i18next";

const URL = "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net";

function Event() {
    const [searchTerm, setSearchTerm] = useState("");
    const [events, setEvents] = useState([]);
    const [sortBy, setSortBy] = useState("default");
    const [currentPage, setCurrentPage] = useState(1);
    const [isDeleting, setIsDeleting] = useState(false);
    const { t, i18n } = useTranslation();
    const itemsPerPage = 20;
    const token = localStorage.getItem("token");
    const currentLanguageId = i18n.language === "ka" ? 1 : 2;

    const isAdmin = useMemo(() => {
        if (!token) return false;
        try {
            const decoded = jwtDecode(token);
            const role = decoded.role || decoded.Role || decoded.roleId || decoded.RoleID || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "";
            return role == 1 || String(role).toLowerCase() === "admin";
        } catch {
            return false;
        }
    }, [token]);

    useEffect(() => {
        axios.get(`${URL}/api/events?languageId=${currentLanguageId}`)
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
                setEvents(data);
            })
            .catch(err => console.error(err));
    }, [currentLanguageId]);

    const deleteHandler = async (eventId) => {
        if (!window.confirm(t("ნამდვილად გსურთ წაშლა?"))) return;
        setIsDeleting(true);
        try {
            await axios.delete(`${URL}/api/events/${eventId}`, { headers: { Authorization: `Bearer ${token}` } });
            setEvents(prev => prev.filter(item => item.eventId !== eventId));
        } catch(error) {
            console.error(error);
            alert(t("წაშლა ვერ მოხერხდა."));
        } finally {
            setIsDeleting(false);
        }
    };

    const editHandler = async (event) => {
        const oldTitle = event.title || event.titleGeo || "";
        const oldDescription = event.description || event.descriptionGeo || "";
        const newTitle = window.prompt(t("შეიყვანეთ ახალი სათაური"), oldTitle);
        if (!newTitle) return;
        const newDescription = window.prompt(t("შეიყვანეთ ახალი აღწერა"), oldDescription);
        if (!newDescription) return;
        const updatedEvent = { titleGeo: newTitle, titleEng: newTitle, descriptionGeo: newDescription, descriptionEng: newDescription, eventDate: event.eventDate };
        try {
            await axios.put(`${URL}/api/events/${event.eventId}?languageId=${currentLanguageId}`, updatedEvent, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
            });
            setEvents(prev => prev.map(item => item.eventId === event.eventId ? { ...item, title: newTitle, description: newDescription } : item));
            alert(t("რედაქტირება წარმატებულია"));
        } catch(error) {
            console.error("EDIT ERROR:", error.response?.data || error);
            alert(t("რედაქტირება ვერ მოხერხდა."));
        }
    };

    const { currentItems, totalPages } = useMemo(() => {
        let processed = events.filter(event => {
            const title = event.title || event.titleGeo || "";
            return title.toLowerCase().includes(searchTerm.toLowerCase());
        });
        if(sortBy === "az") {
            processed.sort((a,b) => (a.title || a.titleGeo || "").localeCompare(b.title || b.titleGeo || ""));
        }
        if(sortBy === "za") {
            processed.sort((a,b) => (b.title || b.titleGeo || "").localeCompare(a.title || a.titleGeo || ""));
        }
        const index = currentPage * itemsPerPage;
        return {
            currentItems: processed.slice(index - itemsPerPage, index),
            totalPages: Math.ceil(processed.length / itemsPerPage)
        };
    }, [events, searchTerm, sortBy, currentPage]);

    const limitText = (text, max) => !text ? "" : text.length > max ? text.slice(0, max) + "..." : text;

    return (
        <div className="asd">
            <div className="A-list">
                <div className="A-image">
                    <div className="controls-container">
                        <input className="search-bar" placeholder={t("ძებნა...")} value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                        <select className="sort-dropdown" value={sortBy} onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}>
                            <option value="default"></option>
                            <option value="az">{t("A-Z")}</option>
                            <option value="za">{t("Z-A")}</option>
                        </select>
                    </div>
                </div>
                <div className="As">
                    {currentItems.map(event => (
                        <div className="A" key={event.eventId}>
                            <div className="A-content">
                                <h3>{limitText(event.title || event.titleGeo, 20)}</h3>
                                <p>{limitText(event.description || event.descriptionGeo, 90)}</p>
                                <p>{event.eventDate}</p>
                                <div className="A-buttons">
                                    <Link to={`/event/${event.eventId}`}><button>{t("Learn More")}</button></Link>  {isAdmin && (
                                        <>
                                            <button className="edit-btn" onClick={() => editHandler(event)}>{t("Edit")}</button> <button className="delete-btn" disabled={isDeleting} onClick={() => deleteHandler(event.eventId)}>
                                                {isDeleting ? "..." : t("Delete")}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {totalPages > 1 && (
                    <div className="pagination-controls">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>{t("წინა")}</button>
                        <span>{currentPage} / {totalPages}</span>
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>{t("შემდეგი")}</button>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
export default Event;