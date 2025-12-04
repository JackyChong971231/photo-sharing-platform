import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faBuilding,
  faCalendar,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";

import pro_pic from "../../../assets/images/user_pro_pic.jpg";

import "./myProfile.css";
import { StudioCard } from "../../../components/studioCard/studioCard";

import defaultStudioLogo from '../../../assets/dummy/default_studio_logo.png'
import goldenHourLogo from '../../../assets/dummy/goldenHourPhoto.jpeg'
import shutterworksLogo from '../../../assets/dummy/shutterworksStudio_logo.png'
import { updateUserInfo } from "../../../apiCalls/photographer/authService";

// Mock profile data
const profile_detail = {
  first_name: "Tom",
  last_name: "Holland",
  email: "tom.holland@rosewoodstudios.com",
  phone: "+1 (437) 660 1234",
  studio_name: "Rosewood Studios",
  studio_country: "Canada",
  role: "Photographer + Manager",
  date_joined: "January 15, 2021",
  profile_picture: pro_pic,
  bio: "Experienced photographer specializing in portrait and event photography. Passionate about capturing life's most memorable moments.",
};

export const MyProfile = ({userInfoLongTemp}) => {
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [editedUser, setEditedUser] = useState({});

  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a temporary URL for preview
    const previewUrl = URL.createObjectURL(file);

    setEditedUser(prev => ({
      ...prev,
      profile_picture: previewUrl, // show preview
      profile_picture_file: file   // keep the File object to send to backend
    }));
  };

  const handleSave = async () => {
    const userToUpdate = { ...editedUser };
    
    // Replace preview URL with the actual File object if exists
    if (editedUser.profile_picture_file) {
      userToUpdate.profile_picture = editedUser.profile_picture_file;
    }

    const result = await updateUserInfo(userToUpdate);
    if (result.statusCode === 200) {
      console.log("Profile updated:", result.body);
      // optionally refresh state with result.body
    } else {
      console.error("Failed to save changes:", result.body);
    }
  };

  const isChanged = (fieldName) => {
    return editedUser[fieldName] !== userInfoLongTemp[fieldName];
  };

  useEffect(() => {
    setEditedUser(userInfoLongTemp);
    setSelectedStudio(userInfoLongTemp.studios[0])
  }, [userInfoLongTemp]);

  return (
    <div className="profile-settings-container p-4">

      {/* Profile Picture Section */}
      <div className="section profile-picture-section">
        <h4>Profile Picture</h4>
        <div className="profile-picture-wrapper">
          <img
            src={editedUser.profile_picture || ""}
            alt="Profile"
            className={`profile-picture ${isChanged("profile_picture") ? "input-changed" : ""}`}
          />
          <div className="upload-btn-wrapper">
            <button className="btn btn-outline-primary">
              <FontAwesomeIcon icon={faUpload} className="me-2" />
              Change Picture
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="file-input"
            />
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="section mb-5">
        <h4>Bio</h4>
        <textarea
          name="short_bio"
          value={editedUser.short_bio || ""}
          onChange={handleChange}
          className={`form-control ${isChanged("short_bio") ? "input-changed" : ""}`}
          rows="5"
          placeholder="Tell us about yourself..."
        ></textarea>
      </div>

      {/* Personal Information */}
      <div className="section mb-5">
        <h4>Personal Information</h4>
        <div className="d-flex flex-wrap gap-3">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              value={editedUser.first_name || ""}
              onChange={handleChange}
              className={`form-control form-control--short ${isChanged("first_name") ? "input-changed" : ""}`}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              value={editedUser.last_name || ""}
              onChange={handleChange}
              className={`form-control form-control--short ${isChanged("last_name") ? "input-changed" : ""}`}
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <div className="position-relative d-flex align-items-center">
              <FontAwesomeIcon className='position-absolute ms-3' icon={faEnvelope} />
              <input
                type="email"
                name="email"
                value={editedUser.email || ""}
                onChange={handleChange}
                className={`form-control form-control--short ${isChanged("email") ? "input-changed" : ""} ps-5`}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={editedUser.phone || ""}
              onChange={handleChange}
              className={`form-control form-control--short ${isChanged("phone") ? "input-changed" : ""}`}
            />
          </div>
        </div>
      </div>

      {/* Studio and Role Information */}
      <div className="section mb-5">
        <h4>Studio and Role Information</h4>



        <div className="d-flex gap-5">
          {/* List of Studios */}
          <div className="studio-list flex-shrink-0" style={{ minWidth: "200px" }}>
            {editedUser.studios ? (editedUser.studios.map((studio) => (
              <div
                key={studio.id}
                className={`studio-item p-2 mb-2 border rounded ${selectedStudio?.id === studio.id ? "bg-light" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedStudio(studio)}
              >
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={studio.logo || defaultStudioLogo}
                    alt={studio.name}
                    style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
                  />
                  <div>
                    <span>{studio.name}</span>
                    <div>
                      {studio.tags.length > 0 && (
                        <div className="studio-tags mt-1">
                          {studio.tags.join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))) : null}
          </div>

          {/* Studio Details Card */}
          <div className="studio-details flex-grow-1">
            {selectedStudio ? (
              <StudioCard selectedStudio={selectedStudio} userInfoLongTemp={userInfoLongTemp} />
            ) : (
              <div className="text-muted">Select a studio to view details</div>
            )}
          </div>
        </div>




      </div>

      {/* Account Details */}
      <div className="section mb-5">
        <h4>Account Information</h4>
        <p>
          <FontAwesomeIcon icon={faCalendar} className="me-2" />
          <strong>Date Joined:</strong> {Date(editedUser.created_at).toLocaleString()}
        </p>
      </div>

      {/* Save Button */}
      <div className="mt-4">
        <button className="btn btn-primary" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
};