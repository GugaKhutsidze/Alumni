import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "./Employment.css";

function Employment() {
    const [searchTerm, setSearchTerm] = useState("");
    const [employment, setEmployment] = useState([]);
    const [sortBy, setSortBy] = useState("default");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

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

    // 1. ფილტრაცია
    let filteredEmployment = employment.filter((emp) =>
        emp.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. სორტირება
    if (sortBy === "az") {
        filteredEmployment.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortBy === "za") {
        filteredEmployment.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
    }

    // 3. პაგინაცია
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredEmployment.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEmployment.length / itemsPerPage);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="Employment-list">
            <div className="asd1">
            <h1 className="Employment-list-title">შენი შემდეგი კარიერული ნაბიჯი!</h1>

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
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="default">დალაგება</option>
                    <option value="az">A-Z</option>
                    <option value="za">Z-A</option>
                </select>
                </div>
            </div>

            <div className="employments">
                {currentItems.length > 0 ? (
                    currentItems.map((emp) => (
                        <div className="employment" key={emp.id}>
                            <img
                                src={emp.image || "https://via.placeholder.com/300x180"}
                                alt={emp.title}
                            />
                            <div className="employment-content">
                                <h3>{emp.title}</h3>
                                <p>{emp.description}</p>
                                <p><strong>თარიღი:</strong> {emp.date}</p>
                                <p><strong>კატეგორია:</strong> {emp.category}</p>
                                <div className="EmploymentButtons">
                                    <Link to={`/employment/${emp.id}`}>
                                        <button>განაცხადი</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-data">ინფორმაცია ვერ მოიძებნა</p>
                )}
            </div>

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
                        onClick={() => setCurrentPage(prev => prev + 1)} >
                        შემდეგი
                    </button>
                    
                </div>
            )}
        </div>
    );
    
}

export default Employment;