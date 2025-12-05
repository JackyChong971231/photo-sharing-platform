import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

import "./security.css";
import { hashPassword } from '../../../utils/common';
import { apiGateway, POST } from '../../../apiCalls/apiMaster';
import { useSharedContext } from '../../../SharedContext';

export const Security = ({userInfoLongTemp}) => {
  const [passwordDetails, setPasswordDetails] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errorMessages, setErrorMessages] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState({currentPassword: false, newPasswords: false});

  const { decodedToken } = useSharedContext();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordDetails({ ...passwordDetails, [name]: value });
  };

  const validatePassword = () => {
    const { currentPassword, newPassword, confirmPassword } = passwordDetails;

    let errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    let isValid = {
      currentPassword: true,
      newPasswords: true
    };

    // --- Required field checks ---
    if (!currentPassword) {
      errors.currentPassword = "Current password is required.";
      isValid.currentPassword = false;
    }

    if (!newPassword) {
      errors.newPassword = "New password is required.";
      isValid.newPasswords = false;
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your new password.";
      isValid.newPasswords = false;
    }

    // --- Password length ---
    if (newPassword && newPassword.length < 8) {
      errors.newPassword = "New password must be at least 8 characters long.";
      isValid.newPasswords = false;
    }

    // --- Password match ---
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      errors.confirmPassword = "New password and confirmation password do not match.";
      isValid.newPasswords = false;
    }

    // Update states ONCE
    setErrorMessages(errors);
    setIsPasswordValid(isValid);
  }

  // Handle form submission — hash passwords and call backend
  const handleSave = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    // basic client-side validation: ensure no validation errors
    validatePassword();
    if (!isPasswordValid.currentPassword || !isPasswordValid.newPasswords) {
      setErrorMessage("Please fix the validation errors before saving.");
      return;
    }

    const userId = userInfoLongTemp?.id || decodedToken?.id;
    if (!userId) {
      setErrorMessage("User ID is not available.");
      return;
    }

    try {
      const currentHash = await hashPassword(passwordDetails.currentPassword);
      const newHash = await hashPassword(passwordDetails.newPassword);

      const requestBody = {
        current_password: currentHash,
        new_password: newHash
      };

      const endpoint = `/core/auth/users/${userId}/change_password/`;
      const { statusCode, body } = await apiGateway(POST, endpoint, requestBody);

      if (statusCode === 200) {
        setSuccessMessage(body?.message || "Password updated successfully!");
        // setPasswordDetails({ currentPassword: "", newPassword: "", confirmPassword: "" });
        // setErrorMessage("");
      } else {
        const err = body?.error || body?.detail || "Failed to change password.";
        setErrorMessage(err);
        setSuccessMessage("");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setSuccessMessage("");
    }
  };

  useEffect(() => {
    validatePassword();
  },[passwordDetails]);

  return (
    <div className="security-container p-4">
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
              className={`form-control form-control--${isPasswordValid.currentPassword?'success':'fail'} ps-5`}
              placeholder="Enter current password"
            />
          </div>
          <p className="text-danger">{errorMessages.currentPassword}</p>
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
              className={`form-control form-control--${isPasswordValid.newPasswords?'success':'fail'} ps-5`}
              placeholder="Enter new password"
            />
          </div>
          <p className="text-danger">{errorMessages.newPassword}</p>
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
              className={`form-control form-control--${isPasswordValid.newPasswords?'success':'fail'} ps-5`}
              placeholder="Confirm new password"
            />
          </div>
          <p className="text-danger">{errorMessages.confirmPassword}</p>
        </div>
      </div>


      {/* Save Button */}
      <div className="mt-5 d-flex align-items-end gap-3">
        <button className="btn btn-primary" onClick={handleSave}>
          Save Changes
        </button>
        {/* Error and Success Messages */}
        {errorMessage && <p className="error-message m-0 text-danger">{errorMessage}</p>}
        {successMessage && <p className="success-message m-0 text-success">{successMessage}</p>}
      </div>
    </div>
  );
};