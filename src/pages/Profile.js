import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Profile.css";

export default function Profile() {

  const user = JSON.parse(localStorage.getItem("user"));
  const fileRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    bio: "",
    faculty: "",
    department: "",
    photo: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `https://localhost:5001/api/profile/${profile.email}`
      );

      setProfile(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setProfile((prev) => ({
      ...prev,
      photo: preview
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      await axios.put(
        "https://localhost:5001/api/profile/update",
        profile
      );

      alert("პროფილი შენახულია");
      setIsEditing(false);

    } catch (err) {
      console.log(err);
      alert("შეცდომა");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile">

      <div className="profile__container">

        {/* TOP BAR */}
        <div className="profile__topbar">

          {!isEditing ? (
            <button className="btn edit" onClick={() => setIsEditing(true)}>
              რედაქტირება
            </button>
          ) : (
            <>
              <button className="btn save" onClick={handleSave}>
                {loading ? "ინახება..." : "შენახვა"}
              </button>

              <button className="btn cancel" onClick={() => setIsEditing(false)}>
                გაუქმება
              </button>
            </>
          )}

        </div>

        {/* HEADER */}
        <div className="profile__header">

          {/* PHOTO */}
          <div
            className="profile__photoBox"
            onClick={() => fileRef.current.click()}
          >

            {profile.photo ? (
              <img
                src={profile.photo}
                alt="profile"
                className="profile__photo"
              />
            ) : (
              <div className="profile__emptyPhoto">
                Upload Photo
              </div>
            )}

            <input
              type="file"
              hidden
              ref={fileRef}
              accept="image/*"
              onChange={handlePhoto}
            />

          </div>

          {/* INFO */}
          <div className="profile__info">

            {/* NAME */}
            <div className="nameRow">

              <div className="field">
                <label>სახელი</label>
                <small>შეიყვანეთ თქვენი სახელი</small>

                {isEditing ? (
                  <input
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleChange}
                    placeholder="მაგ: გიორგი"
                  />
                ) : (
                  <h2>{profile.firstName}</h2>
                )}
              </div>

              <div className="field">
                <label>გვარი</label>
                <small>შეიყვანეთ თქვენი გვარი</small>

                {isEditing ? (
                  <input
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleChange}
                    placeholder="მაგ: გიორგაძე"
                  />
                ) : (
                  <h2>{profile.lastName}</h2>
                )}
              </div>

            </div>

            {/* EMAIL */}
            <div className="field">
              <label>ელფოსტა</label>
              <p className="readonly">{profile.email}</p>
            </div>

    

            {/* FACULTY + DEPT */}
            <div className="grid">

              <div className="field">
                <label>ფაკულტეტი</label>

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
                <label>დეპარტამენტი</label>

                {isEditing ? (
                  <input
                    name="department"
                    value={profile.department}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{profile.department}</p>
                )}
              </div>
                      {/* BIO */}
            <div className="field">
              <label>ბიო</label>

              {isEditing ? (
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  placeholder="მოკლე აღწერა თქვენს შესახებ..."
                />
              ) : (
                <p>{profile.bio}</p>
              )}
            </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}