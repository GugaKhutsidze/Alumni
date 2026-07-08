import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Footer from "../components/Footer";
import "./EE.css";
import { useTranslation } from "react-i18next";

const URL="https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net";

function Event(){
const [searchTerm,setSearchTerm]=useState("");
const [events,setEvents]=useState([]);
const [sortBy,setSortBy]=useState("default");
const [currentPage,setCurrentPage]=useState(1);
const [isDeleting,setIsDeleting]=useState(false);

const {t,i18n}=useTranslation();
const itemsPerPage=20;
const token=localStorage.getItem("token");
const currentLanguageId=i18n.language==="ka"?1:2;

const isAdmin=useMemo(()=>{
if(!token)return false;

try{
const decoded=jwtDecode(token);

let role=
decoded.role||
decoded.Role||
decoded.roleId||
decoded.RoleID||
decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]||
"";

if(role===1||role==="1") return true;

return String(role).toLowerCase().trim()==="admin";

}catch{
return false;
}
},[token]);


useEffect(()=>{
axios.get(`${URL}/api/events?languageId=${currentLanguageId}`)
.then(res=>{
const data=Array.isArray(res.data)?res.data:res.data?.data||[];
setEvents(data);
})
.catch(err=>console.error(err));
},[currentLanguageId]);


const deleteHandler=async(eventId)=>{
if(!window.confirm(t("ნამდვილად გსურთ წაშლა?")))return;

setIsDeleting(true);

try{
await axios.delete(`${URL}/api/events/${eventId}`,{
headers:{
Authorization:`Bearer ${token}`
}
});

setEvents(prev=>prev.filter(e=>e.eventId!==eventId));

}catch{
alert(t("წაშლა ვერ მოხერხდა."));
}
finally{
setIsDeleting(false);
}
};


const {currentItems,totalPages}=useMemo(()=>{
let processed=events.filter(event=>
event?.title?.toLowerCase().includes(searchTerm.toLowerCase())
);

if(sortBy==="az")
processed.sort((a,b)=>(a.title||"").localeCompare(b.title||""));

else if(sortBy==="za")
processed.sort((a,b)=>(b.title||"").localeCompare(a.title||""));

const index=currentPage*itemsPerPage;

return{
currentItems:processed.slice(index-itemsPerPage,index),
totalPages:Math.ceil(processed.length/itemsPerPage)
};

},[events,searchTerm,sortBy,currentPage]);


const limitText=(text,max)=>
!text?"":text.length>max?text.slice(0,max)+"...":text;


return(
<div className="asd">

<div className="A-list">

<div className="A-image">

<div className="controls-container">

<input
className="search-bar"
placeholder="ძებნა..."
value={searchTerm}
onChange={e=>{
setSearchTerm(e.target.value);
setCurrentPage(1);
}}
/>

<select
className="sort-dropdown"
value={sortBy}
onChange={e=>{
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


// ... (კოდის დანარჩენი ნაწილი უცვლელია)

                <div className="As">
                    {currentItems.map(event => (
                        <div className="A" key={event.eventId}>
                            <div className="A-content">
                                <h3>{limitText(event.title, 20)}</h3>
                                <p>{limitText(event.description, 90)}</p>
                                <p>{event.eventDate}</p>

                                <div className="A-buttons">
                                    <Link to={`/event/${event.eventId}`}>
                                        <button>{t("Learn More")}</button>
                                    </Link> {isAdmin && (
                                        <button
                                            className="delete-btn"
                                            disabled={isDeleting}
                                            onClick={() => deleteHandler(event.eventId)}
                                        >
                                            {isDeleting ? t("...") : t("Delete")}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* პაგინაციის ბლოკი */}
                {totalPages > 1 && (
                    <div className="pagination-controls">
                        <button 
                            disabled={currentPage === 1} 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        >
                            {t("წინა")}
                        </button>
                        <span>{currentPage} / {totalPages}</span>
                        <button 
                            disabled={currentPage === totalPages} 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        >
                            {t("შემდეგი")}
                        </button>
                    </div>
                )}

            </div>
            <Footer/>
        </div>
    );
}

export default Event;
