import React, { useState, useEffect, useMemo } from "react";
import "./ImageSlider.css";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Footer from "../components/Footer";
import img1 from "../images/img1.jpg";
import img2 from "../images/img2.jpg";
import img3 from "../images/img3.jpg";
import img4 from "../images/img4.jpg";
import img5 from "../images/imag5.jpg";

const LOCAL_IMAGES = [img1, img2, img3, img4, img5];
const URL = "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net";

const ImageSlider = () => {
    const { i18n, t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slides, setSlides] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);
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

    const cleanText = (text, maxLength) => {
        if (!text) return "";
        const plainText = text.replace(/<[^>]*>/g, "");
        return plainText.length > maxLength ? plainText.substring(0, maxLength) + "..." : plainText;
    };

    useEffect(() => {
        axios.get(`${URL}/api/news?languageId=${currentLanguageId}`)
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
                setSlides(data.slice(-5).reverse().map((item, index) => ({
                    newsId: item.newsId,
                    url: LOCAL_IMAGES[index % LOCAL_IMAGES.length],
                    title: item.title || item.titleGeo || "",
                    body: item.body || item.bodyGeo || "",
                    date: item.newsDate
                })));
            })
            .catch(err => console.error("NEWS ERROR:", err));
    }, [currentLanguageId]);

    const deleteHandler = async (newsId) => {
        if (!window.confirm(t("ნამდვილად გსურთ წაშლა?"))) return;
        setIsDeleting(true);
        try {
            await axios.delete(`${URL}/api/news/${newsId}`, { headers: { Authorization: `Bearer ${token}`, Accept: "*/*" } });
            setSlides(prev => prev.filter(item => item.newsId !== newsId));
        } catch (error) {
            console.error("DELETE ERROR:", error.response?.data || error);
            alert(t("წაშლა ვერ მოხერხდა"));
        } finally {
            setIsDeleting(false);
        }
    };

    const editHandler = async (news) => {
        const newTitle = window.prompt(t("შეიყვანეთ ახალი სათაური"), news.title);
        if (!newTitle) return;
        const newBody = window.prompt(t("შეიყვანეთ ახალი ტექსტი"), news.body);
        if (!newBody) return;
        const updatedNews = { titleGeo: newTitle, titleEng: newTitle, bodyGeo: newBody, bodyEng: newBody, newsDate: news.date };
        try {
            await axios.put(`${URL}/api/news/${news.newsId}`, updatedNews, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });
            setSlides(prev => prev.map(item => item.newsId === news.newsId ? { ...item, title: newTitle, body: newBody } : item));
            alert(t("რედაქტირება წარმატებულია"));
        } catch (error) {
            console.error("EDIT ERROR:", error.response?.data || error);
            alert(t("რედაქტირება ვერ მოხერხდა"));
        }
    };

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => setCurrentIndex(prev => (prev + 1) % slides.length), 5000);
        return () => clearInterval(timer);
    }, [slides]);

    if (!slides.length) return null;

    return (
        <div className="asd">
            <div className="slider-full-container">
                <div className="slider-viewport">
                    <div className="slider-track" style={{ display: "flex", transform: `translateX(-${currentIndex * 100}%)`, transition: "transform .5s ease-in-out" }}>
                        {slides.map(slide => (
                            <div key={slide.newsId} className="slide-item" style={{ backgroundImage: `url(${slide.url})`, flex: "0 0 100%" }}>
                                <div className="slide-content">
                                    <span className="slide-date">{slide.date && new Date(slide.date).toLocaleDateString()}</span>
                                    <h1 className="text-limit">{cleanText(slide.title, 60)}</h1>
                                    <p className="text-limit-body">{cleanText(slide.body, 160)}</p>
                                    <Link to={`/news/${slide.newsId}`}><button>{t("Read More")}</button></Link>
                                    {isAdmin && (
                                        <>
                                            <button className="edit-btn" onClick={() => editHandler(slide)}>{t("Edit")}</button>
                                            <button className="delete-btn" disabled={isDeleting} onClick={() => deleteHandler(slide.newsId)}>
                                                {isDeleting ? "..." : t("Delete")}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="arrow arrow-left" onClick={() => setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length)}>❮</button>
                    <button className="arrow arrow-right" onClick={() => setCurrentIndex(prev => (prev + 1) % slides.length)}>❯</button>
                    <div className="dots-container">
                        {slides.map((_, index) => (
                            <div key={index} className={currentIndex === index ? "dot active" : "dot"} onClick={() => setCurrentIndex(index)} />
                        ))}
                    </div>
                </div>
            </div>
                  <Footer />

        </div>
        
        
        
    );
};

export default ImageSlider;