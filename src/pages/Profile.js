import React,{useEffect,useRef,useState} from "react";
import axios from "axios";
import "./Profile.css";
import {useTranslation} from "react-i18next";

const API_URL="https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api/profile/me";
const CHANGE_PASSWORD_URL="https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api/profile/change-password";

const LIMITS={
 firstName:20,
 lastName:20,
 phoneNumber:20,
 bio:450
};

export default function Profile(){

const token=localStorage.getItem("token");
const {t}=useTranslation();
const fileRef=useRef(null);

const [isEditing,setIsEditing]=useState(false);
const [showPasswordFields,setShowPasswordFields]=useState(false);
const [loading,setLoading]=useState(false);
const [selectedFile,setSelectedFile]=useState(null);
const [previewUrl,setPreviewUrl]=useState("");

const [profile,setProfile]=useState({
 firstName:"",
 lastName:"",
 email:"",
 phoneNumber:"",
 bio:"",
 contactEmail:"",
 contactPhoneNumber:"",
 additionalInformation:"",
 photo:""
});

const [passwords,setPasswords]=useState({
 oldPassword:"",
 newPassword:""
});

useEffect(()=>{
 if(token) fetchProfile();
},[token]);


const fetchProfile=async()=>{
 try{
  const res=await axios.get(API_URL,{
   headers:{Authorization:`Bearer ${token}`}
  });

  setProfile({
   firstName:res.data.firstName||"",
   lastName:res.data.lastName||"",
   email:res.data.email||"",
   phoneNumber:res.data.phoneNumber||"",
   bio:res.data.bio||"",
   contactEmail:res.data.contactEmail||"",
   contactPhoneNumber:res.data.contactPhoneNumber||"",
   additionalInformation:res.data.additionalInformation||"",
   photo:res.data.profilePicture||""
  });

 }catch(err){
  console.log(err.response?.data||err.message);
 }
};


const handleChange=e=>{
 const {name,value}=e.target;
 if(LIMITS[name]&&value.length>LIMITS[name])return;

 setProfile(p=>({...p,[name]:value}));
};


const handlePasswordChange=e=>{
 setPasswords(p=>({...p,[e.target.name]:e.target.value}));
};


const handlePhoto=e=>{
 const file=e.target.files[0];
 if(!file)return;

 if(file.size>5*1024*1024){
  alert("ფაილი დიდია");
  return;
 }

 setSelectedFile(file);
 setPreviewUrl(URL.createObjectURL(file));
};


const handleSave=async()=>{

if(showPasswordFields&&(!passwords.oldPassword||!passwords.newPassword)){
 alert("შეავსეთ პაროლის ველები");
 return;
}

try{

setLoading(true);

const formData=new FormData();

formData.append("FirstName",profile.firstName);
formData.append("LastName",profile.lastName);
formData.append("Email",profile.email);
formData.append("PhoneNumber",profile.phoneNumber);
formData.append("Bio",profile.bio);
formData.append("ContactEmail",profile.contactEmail);
formData.append("ContactPhoneNumber",profile.contactPhoneNumber);
formData.append("AdditionalInformation",profile.additionalInformation);

if(selectedFile)
 formData.append("ProfilePicture",selectedFile);


await axios.put(API_URL,formData,{
 headers:{
  Authorization:`Bearer ${token}`
 }
});


if(showPasswordFields){

await axios.put(CHANGE_PASSWORD_URL,{
 oldPassword:passwords.oldPassword,
 newPassword:passwords.newPassword
},{
 headers:{
  Authorization:`Bearer ${token}`
 }
});

}

alert("მონაცემები განახლდა");

setIsEditing(false);
setShowPasswordFields(false);
setPasswords({oldPassword:"",newPassword:""});
setSelectedFile(null);
setPreviewUrl("");

fetchProfile();

}catch(err){

console.log(err.response?.data||err.message);
alert("შეცდომა");

}finally{
setLoading(false);
}

};


const handleCancel=()=>{
 setIsEditing(false);
 setShowPasswordFields(false);
 setPasswords({oldPassword:"",newPassword:""});
 setSelectedFile(null);
 setPreviewUrl("");
 fetchProfile();
};


if(!token)return <h2>Unauthorized</h2>;


return(
<div className="profile">
<div className="profile__container">

<div className="profile__topbar">
{
!isEditing?
<button className="btn edit" onClick={()=>setIsEditing(true)}>
{t("Edit")}
</button>
:
<>
<button className="btn save" onClick={handleSave} disabled={loading}>
{loading?"Saving...":"Save"}
</button>

<button className="btn cancel" onClick={handleCancel}>
Cancel
</button>
</>
}
</div>


<div className="profile__header">

<div className="profile__photoBox"
onClick={()=>isEditing&&fileRef.current.click()}>

{
previewUrl||profile.photo?
<img className="profile__photo" src={previewUrl||profile.photo}/>
:
<div className="profile__emptyPhoto"/>
}

<input
hidden
ref={fileRef}
type="file"
accept="image/*"
onChange={handlePhoto}
/>

</div>


<div className="profile__info">

<h2>{profile.firstName} {profile.lastName}</h2>

<div className="field">
<label>{t("First Name")}</label>
{isEditing?
<input name="firstName" value={profile.firstName} onChange={handleChange}/>
:
<p>{profile.firstName}</p>}
</div>


<div className="field">
<label>{t("Last Name")}</label>
{isEditing?
<input name="lastName" value={profile.lastName} onChange={handleChange}/>
:
<p>{profile.lastName}</p>}
</div>


<div className="field">
<label>{t("Email")}</label>
<p>{profile.email}</p>
</div>


<div className="field">
<label>{t("Phone Number")}</label>
{isEditing?
<input name="phoneNumber" value={profile.phoneNumber} onChange={handleChange}/>
:
<p>{profile.phoneNumber}</p>}
</div>


<div className="field">
<label>{t("About Me")}</label>
{isEditing?
<textarea name="bio" value={profile.bio} onChange={handleChange}/>
:
<p>{profile.bio}</p>}
</div>


<div className="field">
<label>{t("Contact Email")}</label>
{isEditing?
<input name="contactEmail" value={profile.contactEmail} onChange={handleChange}/>
:
<p>{profile.contactEmail}</p>}
</div>


<div className="field">
<label>{t("Contact Phone Number")}</label>
{isEditing?
<input name="contactPhoneNumber" value={profile.contactPhoneNumber} onChange={handleChange}/>
:
<p>{profile.contactPhoneNumber}</p>}
</div>


<div className="field">
<label>{t("Additional Information")}</label>
{isEditing?
<textarea name="additionalInformation" value={profile.additionalInformation} onChange={handleChange}/>
:
<p>{profile.additionalInformation}</p>}
</div>


{
isEditing&&
<div className="password-edit-zone">

{
!showPasswordFields?

<button className="btn btn-inline-change"
onClick={()=>setShowPasswordFields(true)}>
{t("Change Password")}
</button>

:

<>
<input
type="password"
name="oldPassword"
placeholder="Old password"
value={passwords.oldPassword}
onChange={handlePasswordChange}
/>

<input
type="password"
name="newPassword"
placeholder="New password"
value={passwords.newPassword}
onChange={handlePasswordChange}
/>

<button onClick={()=>{
setShowPasswordFields(false);
setPasswords({oldPassword:"",newPassword:""});
}}>
Cancel Password Change
</button>
</>
}

</div>
}


</div>
</div>
</div>
</div>
);

}