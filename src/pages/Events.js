import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "./EE.css";
import { useTranslation } from "react-i18next";
import img4 from "../images/imag7.png";

const isHex = (str) =>
    typeof str === "string" &&
    /^[0-9a-fA-F]+$/.test(str) &&
    str.length % 2 === 0;

const hexToBase64 = (hex) => {
    const bytes = new Uint8Array(
        hex.match(/.{2}/g).map((b) => parseInt(b, 16))
    );
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary);
};

const getImageSrc = (file) => {
    if (!file) return img4;
    try {
        if (file.startsWith("data:image")) return file;
        if (file.startsWith("/9j") || file.startsWith("iVBOR")) {
            return `data:image/jpeg;base64,${file}`;
        }
        if (isHex(file)) {
            return `data:image/jpeg;base64,${hexToBase64(file)}`;
        }
        return img4;
    } catch (e) {
        console.error("Image parse error:", e);
        return img4;
    }
};

function Event() {
    const [searchTerm, setSearchTerm] = useState("");
    const [events, setEvents] = useState([]);
    const [sortBy, setSortBy] = useState("default");
    const [currentPage, setCurrentPage] = useState(1);
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    const { t, i18n } = useTranslation();
    const itemsPerPage = 20;
    const token = localStorage.getItem("token");

   
    const currentLanguageId = i18n.language === "ka" ? 1 : 2;

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setLoadingUser(false);
                return;
            }
            try {
                const res = await axios.get(
                    "https://localhost:8000/api/user",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("USER:", res.data);
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

   
    useEffect(() => {
        axios
            .get(
                `https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api/events?languageId=${currentLanguageId}`
            )
            .then((res) => {
                console.log("EVENT API RAW:", res.data);
                const data = Array.isArray(res.data)
                    ? res.data
                    : res.data?.data || [];
                setEvents(data);
            })
            .catch((err) => console.error(err));
    }, [currentLanguageId]);

    async function deleteHandler(eventId) {
        const confirmDelete = window.confirm(
            t("ნამდვილად გსურთ წაშლა?")
        );
        if (!confirmDelete) return;

        try {
            await axios.delete(
                `https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api/events/${eventId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setEvents((prev) =>
                prev.filter((e) => e.eventId !== eventId)
            );
        } catch (e) {
            alert("წაშლა ვერ მოხერხდა.");
        }
    }

    const filteredEvents = events.filter((event) =>
        event?.title
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    if (sortBy === "az") {
        filteredEvents.sort((a, b) =>
            (a.title || "").localeCompare(b.title || "")
        );
    } else if (sortBy === "za") {
        filteredEvents.sort((a, b) =>
            (b.title || "").localeCompare(a.title || "")
        );
    }

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = filteredEvents.slice(
        indexOfFirst,
        indexOfLast
    );

    const totalPages = Math.ceil(
        filteredEvents.length / itemsPerPage
    );

    const limitText = (text, max) =>
        !text
            ? ""
            : text.length > max
            ? text.slice(0, max) + "..."
            : text;

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
                            <option value="az">
                                {t("A-Z")}
                            </option>
                            <option value="za">
                                {t("Z-A")}
                            </option>
                        </select>
                    </div>
                </div>

                <div className="As">
                    {currentItems.length > 0 ? (
                        currentItems.map((event) => (
                            <div
                                className="A"
                                key={event.eventId}
                            >
                                <img
                                    src={getImageSrc(
                                        event.file
                                    )}
                                    alt={event.title}
                                />

                                <div className="A-content">
                                    <h3>
                                        {limitText(
                                            event.title,
                                            20
                                        )}
                                    </h3>

                                    <p>
                                        {limitText(
                                            event.description,
                                            90
                                        )}
                                    </p>

                                    <p>{event.eventDate}</p>

                                    <div className="A-buttons">
                                        <Link
                                            to={`/event/${event.eventId}`}
                                        >
                                            <button>
                                                {t(
                                                    "Learn More"
                                                )}
                                            </button>
                                        </Link> {isAdmin && (
                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    deleteHandler(
                                                        event.eventId
                                                    )
                                                }
                                            >
                                                {t("წაშლა")}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-data">
                            {t("Not found")}
                        </p>
                    )}
                </div>

                {totalPages > 0 && (
                    <div className="pagination-controls">
                        <button
                            disabled={currentPage === 1}
                            onClick={() =>
                                setCurrentPage(
                                    (prev) => prev - 1
                                )
                            }
                        >
                            {t("Previous")}
                        </button>

                        <span>
                            გვერდი {currentPage} /{" "}
                            {totalPages}
                        </span>

                        <button
                            disabled={
                                currentPage === totalPages
                            }
                            onClick={() =>
                                setCurrentPage(
                                    (prev) => prev + 1
                                )
                            }
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

export default Event;