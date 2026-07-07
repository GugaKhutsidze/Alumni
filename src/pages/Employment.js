import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "./EE.css";
import { useTranslation } from "react-i18next";
import img4 from "../images/imag7.png";

const apiBaseUrl = "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net";

// კომპონენტი, რომელიც თითოეული ვაკანსიის ID-ით და ენის მიხედვით იღებს მის imageUrl-ს
function JobImage({ jobId, languageId, alt }) {
    const [imgSrc, setImgSrc] = useState(img4);

    useEffect(() => {
        if (!jobId) return;

        axios
            .get(`${apiBaseUrl}/api/jobs/${jobId}?languageId=${languageId}`)
            .then((res) => {
                if (res.data && res.data.imageUrl) {
                    const url = res.data.imageUrl;
                    const cleanPath = url.startsWith("/") ? url.slice(1) : url;
                    setImgSrc(`${apiBaseUrl}/${cleanPath}`);
                }
            })
            .catch((err) => {
                console.error(`შეცდომა სურათის წამოღებისას ვაკანსიისთვის ${jobId}:`, err);
                setImgSrc(img4);
            });
    }, [jobId, languageId]);

    return <img src={imgSrc} alt={alt} />;
}

function Employment() {
    const [searchTerm, setSearchTerm] = useState("");
    const [employment, setEmployment] = useState([]);
    const [sortBy, setSortBy] = useState("default");
    const [currentPage, setCurrentPage] = useState(1);

    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    const { t, i18n } = useTranslation();
    const itemsPerPage = 20;

    const token = localStorage.getItem("token");
    const currentLanguageId = i18n.language === "ka" ? 1 : 2;

    // მომხმარებლის ავტორიზაციის შემოწმება
    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setLoadingUser(false);
                return;
            }

            try {
                const res = await axios.get(`${apiBaseUrl}/api/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(res.data);
            } catch (err) {
                console.log("User fetch error:", err);
                setUser(null);
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUser();
    }, [token]);

    const isAdmin = user?.role === "admin";

    // ვაკანსიების სიის წამოღება ბეკენდიდან
    useEffect(() => {
        axios.get(`${apiBaseUrl}/api/jobs?languageId=${currentLanguageId}`)
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
                setEmployment(data);
            })
            .catch((err) => console.error(err));
    }, [currentLanguageId]);

    // ვაკანსიის წაშლა
    async function deleteHandler(id) {
        const confirmDelete = window.confirm(t("ნამდვილად გსურთ წაშლა?"));
        if (!confirmDelete) return;

        try {
            await axios.delete(
                `${apiBaseUrl}/api/jobs/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setEmployment(prev => prev.filter(emp => emp.id !== id));
        } catch (e) {
            alert("წაშლა ვერ მოხერხდა.");
        }
    }

    // ძებნა და სორტირება (A-Z, Z-A)
    const filteredEmployment = useMemo(() => {
        let processed = employment.filter(emp =>
            emp.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortBy === "az") {
            processed.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        } else if (sortBy === "za") {
            processed.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
        }

        return processed;
    }, [employment, searchTerm, sortBy]);

    // პაგინაციის გამოთვლები
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = filteredEmployment.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredEmployment.length / itemsPerPage);

    const limitText = (text, max) =>
        !text ? "" : text.length > max ? text.slice(0, max) + "..." : text;

    if (loadingUser) return <p>Loading...</p>;

    return (
        <div className="asd">
            <div className="A-list">
                <div className="A-image">
                    <div className="controls-container">
                        <input
                            className="search-bar"
                            placeholder="ძებნა..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />

                        <select 
                            className="sort-dropdown"
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="default"></option>
                            <option value="az">{t("A-Z")}</option>
                            <option value="za">{t("Z-A")}</option>
                        </select>
                    </div>
                </div>

                <div className="As">
                    {currentItems.length > 0 ? (
                        currentItems.map(emp => (
                            <div className="A" key={emp.id}>
                                {/* დინამიური სურათის კომპონენტი */}
                                <JobImage 
                                    jobId={emp.id} 
                                    languageId={currentLanguageId} 
                                    alt={emp.title} 
                                />

                                <div className="A-content">
                                    <h3>{limitText(emp.title, 30)}</h3>
                                    <p>{limitText(emp.description, 120)}</p>
                                    <p>{emp.year}</p>

                                    <div className="A-buttons">
                                        <Link to={`/employment/${emp.id}`}>
                                            <button>{t("Learn More")}</button>
                                        </Link>

                                        {isAdmin && (
                                            <button
                                                className="delete-btn"
                                                onClick={() => deleteHandler(emp.id)}
                                            >
                                                {t("წაშლა")}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-data">{t("Not found")}</p>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="pagination-controls">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                        >
                            {t("Previous")}
                        </button>

                        <span>
                            გვერდი {currentPage} / {totalPages}
                        </span>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                        >
                            {t("Next")}
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Employment;