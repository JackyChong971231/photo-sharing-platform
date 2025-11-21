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

import rosewoodLogo from '../../../assets/dummy/studio_logo.png'
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

// Mock studio data
const studio_list = [
  {
    id: 1,
    name: "Rosewood Studios",
    location: "Toronto, Canada",
    description: "A premium studio specializing in portrait and event photography.",
    services: ["Portrait Photography", "Event Photography", "Videography"],
    email: "contact@rosewoodstudios.com",
    phone: "+1 (437) 660 9876",
    website: "https://rosewoodstudios.com",
    logo: rosewoodLogo
  },
  {
    id: 2,
    name: "Golden Hour Photography",
    location: "Vancouver, Canada",
    description: "Known for capturing stunning outdoor and natural light photos.",
    services: ["Outdoor Photography", "Wedding Photography", "Lifestyle Shoots"],
    email: "info@goldenhourphotography.com",
    phone: "+1 (604) 555 1234",
    website: "https://goldenhourphotography.com",
    logo: goldenHourLogo
  },
  {
    id: 3,
    name: "Shutterworks Studio",
    location: "Montreal, Canada",
    description: "Expert in commercial photography and high-end product shoots.",
    services: ["Commercial Photography", "Product Shoots", "Food Photography"],
    email: "support@shutterworksstudio.com",
    phone: "+1 (514) 789 5678",
    website: "https://shutterworksstudio.com",
    logo: shutterworksLogo
  },
];

export const MyProfile = () => {
  const [userDetail, setUserDetail] = useState({});
  const [editedDetails, setEditedDetails] = useState({});
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [selectedStudio, setSelectedStudio] = useState(null);

  useEffect(() => {
    // Load user details into state
    setUserDetail(profile_detail);
    setEditedDetails(profile_detail);

    // Set default studio details
    const defaultStudio = studio_list.find(
      (studio) => studio.name === profile_detail.studio_name
    );
    setSelectedStudio(defaultStudio);
  }, []);

  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails({ ...editedDetails, [name]: value });
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewProfilePicture(event.target.result); // Base64 encoded image
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle studio selection
  const handleStudioChange = (e) => {
    const studio = studio_list.find((studio) => studio.name === e.target.value);
    setSelectedStudio(studio);
    setEditedDetails({ ...editedDetails, studio_name: studio.name });
  };

  // Save changes (dummy save logic for now)
  const handleSave = () => {
    setUserDetail({
      ...editedDetails,
      profile_picture: newProfilePicture || userDetail.profile_picture,
    });
    alert("Profile updated successfully!");
  };

  return (
    <div className="profile-settings-container p-4">

      {/* Profile Picture Section */}
      <div className="section profile-picture-section">
        <h4>Profile Picture</h4>
        <div className="profile-picture-wrapper">
          <img
            src={userDetail.profile_picture}
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
          value={editedDetails.bio || ""}
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
              value={editedDetails.first_name || ""}
              onChange={handleChange}
              className="form-control form-control--short"
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              value={editedDetails.last_name || ""}
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
                value={editedDetails.email || ""}
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
              value={editedDetails.phone || ""}
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
          <div>
            {/* Dropdown Menu */}
            <div className="form-group studio-select">
              <label>Select Studio</label>
              <select
                name="studio_name"
                value={editedDetails.studio_name || ""}
                onChange={handleStudioChange}
                className="form-control"
              >
                {studio_list.map((studio) => (
                  <option key={studio.id} value={studio.name}>
                    {studio.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Role */}
            <div className="form-group mt-4">
              <label>Role</label>
              <input
                type="text"
                name="role"
                value={editedDetails.role || ""}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          {/* Studio Details */}

          {selectedStudio && (
            <StudioCard selectedStudio={selectedStudio}/>
          )}
        </div>



      </div>

      {/* Account Details */}
      <div className="section mb-5">
        <h4>Account Information</h4>
        <p>
          <FontAwesomeIcon icon={faCalendar} className="me-2" />
          <strong>Date Joined:</strong> {userDetail.date_joined}
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