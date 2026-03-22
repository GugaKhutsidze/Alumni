import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Events.css";

function Event() {
    const [searchTerm, setSearchTerm] = useState("");
    const [events, setEvents] = useState([]);
    const [sortBy, setSortBy] = useState("default"); // სორტირების მდგომარეობა
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        const url = "https://warrior.ge/api/movies";
        axios.get(url)
            .then((res) => {
                setEvents(res.data.data || []);
            })
            .catch((err) => {
                console.error("მონაცემების წამოღების შეცდომა:", err);
            });
    }, []);

    // 1. ფილტრაცია ძებნის მიხედვით
    let filteredEvents = events.filter((event) =>
        event.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. სორტირება ანბანის მიხედვით
    if (sortBy === "az") {
        filteredEvents.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortBy === "za") {
        filteredEvents.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
    }

    // 3. პაგინაციის გამოთვლა
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // ძებნისას ვაბრუნებთ პირველ გვერდზე
    };

    return (
        <div className="Event-list">
            <div className="asd1">
            <h1 className="Event-list-title">აღმოაჩინე ახალი გამოცდილება! </h1>

            {/* კონტროლების კონტეინერი: ძებნა და სორტირება */}
            
            <div className="controls-container">
                <input
                    className="search-bar"
                    type="text"
                    placeholder="ძებნა"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                
                <select 
                    className="sort-dropdown" 
                    value={sortBy} 
                    onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                >
                    <option value="default">დალაგება</option>
                    <option value="az">A-Z (ანბანით)</option>
                    <option value="za">Z-A (ანბანით)</option>
                </select>
            </div>
            </div>

            <div className="events">
                {currentItems.length > 0 ? (
                    currentItems.map((event) => (
                        <div className="event" key={event.id}>
                            <img
                                src={event.image || "https://via.placeholder.com/300x180"}
                                alt={event.title}
                            />
                            <div className="event-content">
                                <h3>{event.title}</h3>
                                <p>{event.description}</p>
                                <p><strong>თარიღი:</strong> {event.date}</p>
                                <p><strong>კატეგორია:</strong> {event.category}</p>
                                <div className="EventButtons">
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

            {/* პაგინაციის კონტროლი */}
            {totalPages > 1 && (
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
    );
}

export default Event;