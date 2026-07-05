import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "./EE.css";
import { useTranslation } from "react-i18next";
import img4 from "../images/imag7.png";

function Event() {
    const [searchTerm, setSearchTerm] = useState("");
    const [events, setEvents] = useState([]);
    const [sortBy, setSortBy] = useState("default");
    const [currentPage, setCurrentPage] = useState(1);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const { t } = useTranslation();
    const itemsPerPage = 20;

    const token = localStorage.getItem("token");

    // 🔐 GET USER FROM BACKEND (ROLE COMES FROM SERVER)
    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get("https://warrior.ge/api/me", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUser(res.data);
            } catch (err) {
                console.log("User fetch error:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    const isAdmin = user?.role === "admin";

    // 🔥 FETCH EVENTS
    useEffect(() => {
        axios.get("https://warrior.ge/api/movies")
            .then((res) => setEvents(res.data.data || []))
            .catch((err) => console.error(err));
    }, []);

    // ❌ DELETE
    async function deleteHandler(id) {
        const confirmDelete = window.confirm(t("ნამდვილად გსურთ წაშლა?"));
        if (!confirmDelete) return;

        try {
            await axios.delete(
                `https://warrior.ge/api/movies/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setEvents(prev => prev.filter(e => e.id !== id));

        } catch (e) {
            alert("წაშლა ვერ მოხერხდა.");
        }
    }

    const filteredEvents = events.filter(e =>
        e.title?.toLowerCase().includes(searchTerm.toLowerCase())
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
    const currentItems = filteredEvents.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

    const limitText = (text, max) =>
        !text ? "" : text.length > max ? text.slice(0, max) + "..." : text;

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    if (loading) return <p>Loading user...</p>;

    return (
        <div className="asd">
            <div className="A-list">
                <div className="A-image">

                <div className="controls-container">
                    <input
                        className="search-bar"
                        placeholder="ძებნა..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />

                    <select className="sort-dropdown"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="default"></option>
                        <option value="az">{t("A-Z")}</option>
                        <option value="za">{t("Z-A")}</option>
                    </select>
                </div>
                </div>

                <div className="As">
                    {currentItems.map(event => (
                        <div className="A" key={event.id}>
                            <img src={event.image || img4} />

                            <div className="A-content">
                                <h3>{limitText(event.title, 30)}</h3>
                                <p>{limitText(event.description, 120)}</p>
                                <p>{event.year}</p>

                                <div className="A-buttons">
                                    <Link to={`/event/${event.id}`}>
                                        <button>Learn More</button>
                                    </Link>

                                    {isAdmin && (
                                        <button
                                            onClick={() => deleteHandler(event.id)}
                                        >
                                            {t("წაშლა")}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            <Footer />
        </div>
    );
}

export default Event;