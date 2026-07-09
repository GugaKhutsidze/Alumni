import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Profile.css";
import { useTranslation } from "react-i18next";

const API_URL =
  "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api/profile/me";

const CHANGE_PASSWORD_URL =
  "https://alumni-tsu-api-2026-gde9e8bsd3hnb7ar.westeurope-01.azurewebsites.net/api/profile/change-password";

const LIMITS = {
  firstName: 20,
  lastName: 20,
  email: 50,
  phoneNumber: 20,
  department: 60,
  bio: 450,
};

export default function Profile() {
  const token = localStorage.getItem("token");
  const { t } = useTranslation();
  const fileRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false); // აკონტროლებს პაროლის ველების გამოჩენას
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    bio: "",
    department: "",
    photo: "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      setProfile(res.data);
    } catch (err) {
      console.error("GET PROFILE ERROR:", err?.response?.data || err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const limit = LIMITS[name];
    if (limit && value.length > limit) return;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("ფაილი ძალიან დიდია (max 5MB)");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // ერთიანი შენახვის ფუნქცია
  const handleSave = async () => {
    // თუ მომხმარებელმა პაროლის ველები გახსნა, ვალიდაციას ვუკეთებთ
    if (showPasswordFields && (!passwords.oldPassword || !passwords.newPassword)) {
      alert("პაროლის შესაცვლელად შეავსეთ ორივე ველი");
      return;
    }

    try {
      setLoading(true);

      // 1. პროფილის მონაცემების განახლება
      const profilePayload = {
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        bio: profile.bio || "",
        contactEmail: profile.contactEmail || "",
        contactPhoneNumber: profile.contactPhoneNumber || "",
        additionalInformation: profile.additionalInformation || "",
      };

      await axios.put(API_URL, profilePayload, { headers: authHeaders });

      // 2. პაროლის განახლება (მხოლოდ იმ შემთხვევაში, თუ მომხმარებელმა დააჭირა და შეავსო)
      if (showPasswordFields) {
        const passwordPayload = {
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword,
        };
        await axios.put(CHANGE_PASSWORD_URL, passwordPayload, { headers: authHeaders });
      }

      alert("მონაცემები წარმატებით განახლდა");
      
      // რესეტი და ახალი ინფორმაციის წამოღება
      setIsEditing(false);
      setShowPasswordFields(false);
      setPasswords({ oldPassword: "", newPassword: "" });
      fetchProfile();
    } catch (err) {
      console.error("SAVE ERROR:", err?.response?.data || err.message);
      alert(err?.response?.data?.message || "შეცდომა მონაცემების შენახვისას");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowPasswordFields(false);
    setPasswords({ oldPassword: "", newPassword: "" });
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const countChars = (text = "") => text.length;

  if (!token) {
    return <h2>Unauthorized</h2>;
  }

  return (
    <div className="profile">
      <div className="profile__container">
        <div className="profile__topbar">
          {!isEditing ? (
            <button className="btn edit" onClick={() => setIsEditing(true)}>
              {t("Edit")}
            </button>
          ) : (
            <>
              <button className="btn save" onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
              <button className="btn cancel" onClick={handleCancel}>
                Cancel
              </button>
            </>
          )}
        </div>

        <div className="profile__header">
          <div
            className="profile__photoBox"
            onClick={() => isEditing && fileRef.current.click()}
          >
            {previewUrl || profile.photo ? (
              <img src={previewUrl || profile.photo} alt="profile" className="profile__photo" />
            ) : (
              <div className="profile__emptyPhoto"> </div>
            )}
            <input type="file" hidden ref={fileRef} accept="image/*" onChange={handlePhoto} />
          </div>

          <div className="profile__info">
            <div className="namefield">
              <div className="field">
                <label>{t("First Name")}</label>
                {isEditing ? (
                  <>
                    <input name="firstName" value={profile.firstName} onChange={handleChange} />
                    <small>{countChars(profile.firstName)}/{LIMITS.firstName}</small>
                  </>
                ) : (
                  <h2>{profile.firstName}</h2>
                )}
              </div>

              <div className="field">
                <label>{t("Last Name")}</label>
                {isEditing ? (
                  <>
                    <input name="lastName" value={profile.lastName} onChange={handleChange} />
                    <small>{countChars(profile.lastName)}/{LIMITS.lastName}</small>
                  </>
                ) : (
                  <h2>{profile.lastName}</h2>
                )}
              </div>
            </div>
            
            <div className="contactfield">
              <div className="field">
                <label>{t("Email")}</label>
                <p>{profile.email}</p>
              </div>
              <div className="field">
                <label>{t("Phone Number")}</label>
                {isEditing ? (
                  <>
                    <input name="phoneNumber" value={profile.phoneNumber || ""} onChange={handleChange} />
                    <small>{countChars(profile.phoneNumber)}/{LIMITS.phoneNumber}</small>
                  </>
                ) : (
                  <p>{profile.phoneNumber}</p>
                )}
              </div>
            </div>

            <div className="field">
              <label>{t("About Me")}</label>
              {isEditing ? (
                <textarea name="bio" value={profile.bio} onChange={handleChange} />
              ) : (
                <p>{profile.bio}</p>
              )}
            </div>

            {/* --- პაროლის დინამიკური სექცია (მხოლოდ რედაქტირებისას) --- */}
            {isEditing && (
              <div className="password-edit-zone">
                {!showPasswordFields ? (
                  // ღილაკი, რომელსაც რედაქტირებაში ყოფნისას ვაჭერთ პაროლის ველების დასამატებლად
                  <button
                    type="button"
                    className="btn btn-inline-change"
                    onClick={() => setShowPasswordFields(true)}
                  >
                     {t("Change Password")}
                  </button>
                ) : (
                  // ჩვენით დამატებული ძველი და ახალი პაროლის ველები
                  <div className="inline-password-fields">
                    <div className="field">
                      <label>{t("Old Password")}</label>
                      <input
                        type="password"
                        name="oldPassword"
                        value={passwords.oldPassword}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="field">
                      <label>{t("New Password")}</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwords.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                      />
                    </div>
                    <button
                      type="button"
                      className="btn-remove-fields"
                      onClick={() => {
                        setShowPasswordFields(false);
                        setPasswords({ oldPassword: "", newPassword: "" });
                      }}
                    >
                      {t("Cancel Password Change")}
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}