import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "./Alumni.css";
import { useTranslation } from "react-i18next";

function Alumni() {
    const [searchTerm, setSearchTerm] = useState("");
    const [alumnis, setAlumnis] = useState([]);
    const [sortBy, setSortBy] = useState("default");
    const [currentPage, setCurrentPage] = useState(1);
    const { t } = useTranslation();

    const itemsPerPage = 20;

    useEffect(() => {
        const url = "https://localhost:8000/api/alumni";

        axios.get(url)
            .then((res) => setAlumnis(res.data.data || []))
            .catch((err) => console.error("მონაცემების წამოღების შეცდომა:", err));
    }, []);

    let filteredAlumnis = alumnis.filter((alumni) =>
        `${alumni.firstname} ${alumni.lastname}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    // sort
    if (sortBy === "az") {
        filteredAlumnis.sort((a, b) =>
            (a.firstname + " " + a.lastname).localeCompare(b.firstname + " " + b.lastname)
        );
    } else if (sortBy === "za") {
        filteredAlumnis.sort((a, b) =>
            (b.firstname + " " + b.lastname).localeCompare(a.firstname + " " + a.lastname)
        );
    }

    // pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAlumnis.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAlumnis.length / itemsPerPage);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="Bsd">
            <div className="B-list">
                <div className="B-image">
                    <div className="controls-container">
                        <input
                            className="search-bar"
                            type="text"
                            placeholder="ძებნა..."
                            value={searchTerm}
                            onChange={handleSearch}
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

                <div className="Bs">
                    {currentItems.length > 0 ? (
                        currentItems.map((alumni) => (
                            <div className="B" key={alumni.id}>
                                <div className="B-content">
                                    <h3>
                                        {alumni.firstname} {alumni.lastname}
                                    </h3>
                                </div>

                                <div className="B-buttons">
                                    <Link to={`/profile/${alumni.id}`}>
                                        <button>{t("Learn More")}</button>
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-data">{t("Not found")}</p>
                    )}
                </div>

                {totalPages > 0 && (
                    <div className="pagination-controls">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            წინა
                        </button>

                        <span>
                            გვერდი {currentPage} / {totalPages}
                        </span>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            შემდეგი
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default Alumni;