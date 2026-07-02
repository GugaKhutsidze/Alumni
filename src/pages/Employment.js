import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "./EE.css";
import { useTranslation } from "react-i18next";

function Employment() {
    
    const [searchTerm, setSearchTerm] = useState("");
    const [employment, setEmployment] = useState([]);
    const [sortBy, setSortBy] = useState("default");
    const [currentPage, setCurrentPage] = useState(1);
    const { t } = useTranslation();
    const itemsPerPage =20;

    useEffect(() => {
        const url = "https://warrior.ge/api/movies"; 
        axios.get(url)
            .then((res) => {
                setEmployment(res.data.data || []);
            })
            .catch((err) => {
                console.error("მონაცემების წამოღების შეცდომა:", err);
            });
    }, []);

    let filteredEmployment = employment.filter((emp) =>
        emp.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === "az") {
        filteredEmployment.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortBy === "za") {
        filteredEmployment.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEmployment.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEmployment.length / itemsPerPage);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="asd">
        <div className="A-list">
            <div className="A-image">

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
                        onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                    >
                        <option value="default"></option>
                        <option value="az">{t("A-Z")}</option>
                        <option value="za">{t("Z-A")}</option>
                    </select>
                </div>
            </div>

            <div className="As">
                {currentItems.length > 0 ? (
                    currentItems.map((emp) => (
                        <div className="A" key={emp.id} >
                            <img
                                src={emp.image || "https://via.placeholder.com/300x180"}
                                alt={emp.title}
                            />
                            <div className="A-content">
                                <h3>{emp.title}</h3>
                                <p>{emp.description}</p>
                                <p><strong>{t("Date")}:</strong> {emp.year}</p>
                           <div className="A-buttons">
                                    <Link to={`/employment/${emp.id}`}>
                                        <button>{t("Learn More")}</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-data">{t("Not found")}</p>
                )}
            </div>
            <div/>

            {totalPages > 0 && (
                <div className="pagination-controls">
                    <button 
                        disabled={currentPage === 1} 
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        წინა
                    </button>
                    <span>გვერდი {currentPage} / {totalPages}</span>
                    <button 
                        disabled={currentPage === totalPages} 
                        onClick={() => setCurrentPage(prev => prev + 1)} >
                        შემდეგი
                    </button>
                </div>
            )}

        </div>
        <Footer />
        </div>

    );
}

export default Employment;