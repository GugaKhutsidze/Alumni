import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Profile.css";
import { useTranslation } from "react-i18next";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://localhost:5001";

const LIMITS = {
  firstName: 20,
  lastName: 20,
  email: 50,
  faculty: 60,
  department: 60,
  bio: 700,
};

export default function Profile() {
  const token = localStorage.getItem("token"); 

  const { t } = useTranslation();
  const fileRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    faculty: "",
    department: "",
    photo: "",
  });

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(res.data);
    } catch (err) {
      console.error(err);
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

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("ფაილის ზომა არ უნდა აღემატებოდეს 5MB-ს!");
      return;
    }

    setSelectedFile(file);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("firstName", profile.firstName || "");
      formData.append("lastName", profile.lastName || "");
      formData.append("email", profile.email || "");
      formData.append("bio", profile.bio || "");
      formData.append("faculty", profile.faculty || "");
      formData.append("department", profile.department || "");

      if (selectedFile) {
        formData.append("photo", selectedFile);
      }

      await axios.put(
        `${API_BASE_URL}/api/profile/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("პროფილი წარმატებით განახლდა");
      setIsEditing(false);
      setSelectedFile(null);

      fetchProfile();
    } catch (err) {
      console.error(err);
      alert("შეცდომა პროფილის შენახვისას");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFile(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
  };

  const countChars = (text = "") => text.length;

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
              <button
                className="btn save"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "ინახება..." : "შენახვა"}
              </button>

              <button className="btn cancel" onClick={handleCancel}>
                გაუქმება
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
              <img
                src={previewUrl || profile.photo}
                alt="profile"
                className="profile__photo"
              />
            ) : (
              <div className="profile__emptyPhoto">Upload Photo</div>
            )}

            <input
              type="file"
              hidden
              ref={fileRef}
              accept="image/*"
              onChange={handlePhoto}
            />
          </div>

          <div className="profile__info">
            <div className="field">
              <label>{t("First Name")}</label>
              {isEditing ? (
                <>
                  <input
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleChange}
                  />
                  <small>
                    {countChars(profile.firstName)}/{LIMITS.firstName}
                  </small>
                </>
              ) : (
                <h2>{profile.firstName}</h2>
              )}
            </div>

            <div className="field">
              <label>{t("Last Name")}</label>
              {isEditing ? (
                <>
                  <input
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleChange}
                  />
                  <small>
                    {countChars(profile.lastName)}/{LIMITS.lastName}
                  </small>
                </>
              ) : (
                <h2>{profile.lastName}</h2>
              )}
            </div>

            <div className="field">
              <label>{t("Email")}</label>
              <p>{profile.email}</p>
            </div>

            <div className="field">
              <label>{t("Faculty")}</label>
              {isEditing ? (
                <input
                  name="faculty"
                  value={profile.faculty}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.faculty}</p>
              )}
            </div>

            <div className="field">
              <label>{t("About Me")}</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}