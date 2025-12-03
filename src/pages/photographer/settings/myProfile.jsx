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

  // Handle field change
  const handleChange = (e) => {
    // const { name, value } = e.target;
    // setEditedDetails({ ...editedDetails, [name]: value });
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        // setNewProfilePicture(event.target.result); // Base64 encoded image
      };
      reader.readAsDataURL(file);
    }
  };

  // Save changes (dummy save logic for now)
  const handleSave = () => {
    // setUserDetail({
    //   ...editedDetails,
    //   profile_picture: newProfilePicture || userDetail.profile_picture,
    // });
    console.log("Profile updated successfully!");
  };

  return (
    <div className="profile-settings-container p-4">

      {/* Profile Picture Section */}
      <div className="section profile-picture-section">
        <h4>Profile Picture</h4>
        <div className="profile-picture-wrapper">
          <img
            src={userInfoLongTemp.profile_picture}
            alt="Profile"
            className="profile-picture"
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
          name="bio"
          value={userInfoLongTemp.bio || ""}
          onChange={handleChange}
          className="form-control"
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
              value={userInfoLongTemp.first_name || ""}
              onChange={handleChange}
              className="form-control form-control--short"
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              value={userInfoLongTemp.last_name || ""}
              onChange={handleChange}
              className="form-control form-control--short"
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <div className="position-relative d-flex align-items-center">
              <FontAwesomeIcon className='position-absolute ms-3' icon={faEnvelope} />
              <input
                type="email"
                name="email"
                value={userInfoLongTemp.email || ""}
                onChange={handleChange}
                className="form-control form-control--short ps-5"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={userInfoLongTemp.phone || ""}
              onChange={handleChange}
              className="form-control form-control--short"
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
            {userInfoLongTemp.studios.map((studio) => (
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
            ))}
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
          <strong>Date Joined:</strong> {userInfoLongTemp.created_at}
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