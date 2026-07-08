import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Footer from "../components/Footer";
import "./EE.css";
import { useTranslation } from "react-i18next";

const URL = "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net";

function Employment() {
    const { t, i18n } = useTranslation();
    const [employment, setEmployment] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("default");
    const [currentPage, setCurrentPage] = useState(1);
    const [isDeleting, setIsDeleting] = useState(false);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");
    const currentLanguageId = i18n.language === "ka" ? 1 : 2;
    const itemsPerPage = 20;

    const isAdmin = useMemo(() => {
        if (!token) return false;
        try {
            const decoded = jwtDecode(token);
            const role = decoded.role || decoded.Role || decoded.roleId || 
                         decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            return role == 1 || String(role).toLowerCase() === "admin";
        } catch { return false; }
    }, [token]);

    useEffect(() => {
        setLoading(true);
        axios.get(`${URL}/api/jobs?advertisementTypeId=1&languageId=${currentLanguageId}`)
            .then((res) => {
                setEmployment(Array.isArray(res.data) ? res.data : []);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [currentLanguageId]);

    const deleteHandler = async (id) => {
        if (!window.confirm(t("ნამდვილად გსურთ წაშლა?"))) return;
        setIsDeleting(true);
        try {
            await axios.delete(`${URL}/api/jobs/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployment(prev => prev.filter(emp => emp.advertisementId !== id));
        } catch {
            alert(t("წაშლა ვერ მოხერხდა."));
        } finally {
            setIsDeleting(false);
        }
    };

    const { currentItems, totalPages } = useMemo(() => {
        let processed = [...employment].filter(emp => 
            emp.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (sortBy === "az") processed.sort((a,b) => (a.title || "").localeCompare(b.title || ""));
        else if (sortBy === "za") processed.sort((a,b) => (b.title || "").localeCompare(a.title || ""));
        
        const index = currentPage * itemsPerPage;
        return {
            currentItems: processed.slice(index - itemsPerPage, index),
            totalPages: Math.ceil(processed.length / itemsPerPage)
        };
    }, [employment, searchTerm, sortBy, currentPage]);

    return (
        <div className="asd">
            <div className="A-list">
                <div className="A-image">
                    <div className="controls-container">
                        <input className="search-bar" placeholder={t("ძებნა...")} value={searchTerm} 
                               onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                        <select className="sort-dropdown" value={sortBy} onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}>
                            <option value="default"></option>
                            <option value="az">{t("A-Z")}</option>
                            <option value="za">{t("Z-A")}</option>
                        </select>
                    </div>
                </div>

                <div className="As">
                    {loading ? <p>{t("იტვირთება...")}</p> : currentItems.map(emp => (
                        <div className="A" key={emp.advertisementId}>
                            <div className="A-content">
                                <h3>{emp.title}</h3>
                                <p>{emp.description?.substring(0, 90)}...</p>
                                <p><strong>{t("ხელფასი")}:</strong> {emp.salary} GEL</p>
                                <p><strong>{t("თარიღი")}:</strong> {new Date(emp.startDate).toLocaleDateString()} - {new Date(emp.endDate).toLocaleDateString()}</p>
                                
                                <div className="A-buttons">
                                    <Link to={`/employment/${emp.advertisementId}`}>
                                        <button>{t("Learn More")}</button>
                                    </Link> {isAdmin && (
                                        <button className="delete-btn" disabled={isDeleting} onClick={() => deleteHandler(emp.advertisementId)}>
                                            {isDeleting ? "..." : t("Delete")}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* პაგინაცია - აი ეს ბლოკი უნდა გქონდეს აუცილებლად */}
                {totalPages > 1 && (
                    <div className="pagination-controls">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                            {t("წინა")}
                        </button>
                        <span>{currentPage} / {totalPages}</span>
                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                            {t("შემდეგი")}
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Employment;