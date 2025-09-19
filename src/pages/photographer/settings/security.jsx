import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

import "./security.css";

export const Security = () => {
  const [passwordDetails, setPasswordDetails] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordDetails({ ...passwordDetails, [name]: value });
  };

  // Handle form submission
  const handleSave = () => {
    const { currentPassword, newPassword, confirmPassword } = passwordDetails;

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("All fields are required.");
      setSuccessMessage("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation password do not match.");
      setSuccessMessage("");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters long.");
      setSuccessMessage("");
      return;
    }

    // Simulate saving changes (in a real-world app, this would involve sending the data to the backend)
    setErrorMessage("");
    setSuccessMessage("Password updated successfully!");
    setPasswordDetails({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="security-container p-4">
      <h2 className="mb-4">Security Settings</h2>

      {/* Password Change Section */}
      <div className="section">
        <h4>Change Password</h4>
        <div className="form-group">
          <label>Current Password</label>
          <div className="input-icon position-relative d-flex align-items-center">
            <FontAwesomeIcon icon={faLock} className="me-2 position-absolute ms-3" />
            <input
              type="password"
              name="currentPassword"
              value={passwordDetails.currentPassword}
              onChange={handleChange}
              className="form-control ps-5"
              placeholder="Enter current password"
            />
          </div>
        </div>
        <div className="form-group mt-3">
          <label>New Password</label>
          <div className="input-icon position-relative d-flex align-items-center">
            <FontAwesomeIcon icon={faLock} className="me-2 position-absolute ms-3" />
            <input
              type="password"
              name="newPassword"
              value={passwordDetails.newPassword}
              onChange={handleChange}
              className="form-control ps-5"
              placeholder="Enter new password"
            />
          </div>
        </div>
        <div className="form-group mt-3">
          <label>Confirm New Password</label>
          <div className="input-icon position-relative d-flex align-items-center">
            <FontAwesomeIcon icon={faLock} className="me-2 position-absolute ms-3" />
            <input
              type="password"
              name="confirmPassword"
              value={passwordDetails.confirmPassword}
              onChange={handleChange}
              className="form-control ps-5"
              placeholder="Confirm new password"
            />
          </div>
        </div>
      </div>

      {/* Error and Success Messages */}
      {errorMessage && <p className="error-message mt-3">{errorMessage}</p>}
      {successMessage && <p className="success-message mt-3">{successMessage}</p>}

      {/* Save Button */}
      <div className="mt-4">
        <button className="btn btn-primary" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
};