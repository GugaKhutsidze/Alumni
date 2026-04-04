import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "./EE.css";

function Event() {
    const [searchTerm, setSearchTerm] = useState("");
    const [events, setEvents] = useState([]);
    const [sortBy, setSortBy] = useState("default");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const url = "https://warrior.ge/api/movies";
        axios.get(url)
            .then((res) => setEvents(res.data.data || []))
            .catch((err) => console.error("მონაცემების წამოღების შეცდომა:", err));
    }, []);

    let filteredEvents = events.filter((event) =>
        event.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === "az") filteredEvents.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    else if (sortBy === "za") filteredEvents.sort((a, b) => (b.title || "").localeCompare(a.title || ""));

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="asd">
        <div className="A-list">
            <div className="A-image">
                <h1 className="A-list-title">აღმოაჩინე ახალი გამოცდილება!</h1>

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
                        <option value="default">დალაგება</option>
                        <option value="az">A-Z</option>
                        <option value="za">Z-A</option>
                    </select>
                </div>
            </div>

            <div className="As">
                {currentItems.length > 0 ? (
                    currentItems.map((event) => (
                        <div className="A" key={event.id}>
                            <img
                                src={event.image || "https://via.placeholder.com/300x180"}
                                alt={event.title}
                            />
                            <div className="A-content">
                                <h3>{event.title}</h3>
                                <p>{event.description}</p>
                                <p><strong>თარიღი:</strong> {event.year}</p>
                                <p><strong>კატეგორია:</strong> {event.category}</p>
                                <div className="A-buttons">
                                    <Link to={`/event/${event.id}`}>
                                        <button>დეტალურად</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-data">ღონისძიებები ვერ მოიძებნა</p>
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
                    <span>გვერდი {currentPage} / {totalPages}</span>
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

export default Event;