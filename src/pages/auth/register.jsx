import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudios } from '../../apiCalls/photographer/studioService';
import { userLogin, userRegister } from '../../apiCalls/photographer/authService';
import './register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useSharedContext } from '../../SharedContext';

export const Register = () => {
  const navigate = useNavigate();
  const {register} = useSharedContext();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    isStudioMember: false,
    studioId: '',
    profilePicture: null
  });

  const [studios, setStudios] = useState([]);

  useEffect(() => {
    const fetchStudios = async () => {
      const data = await getStudios();
      setStudios(data);
    };
    fetchStudios();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    await register(formData);
  };

  return (
    <div className="register-container">
      <form className="register-card" onSubmit={handleSubmit} encType="multipart/form-data">
        <h2 className='register-title'>Create Account</h2>
        <p>Sign up to get started</p>

        <div className="profile-picture-section">
          <label htmlFor="profilePicture">Profile Picture</label>
          <div className='d-flex align-items-center gap-4 mt-3'>
            <div className='profile-preview'>
              {
                formData.profilePicture? (
                  <img
                    src={URL.createObjectURL(formData.profilePicture)}
                    alt="Preview"
                  />
                ) : (
                  <span>
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                )
              }
            </div>
            <div className='d-flex align-items-center gap-3'>
              <label htmlFor="profilePicture" className="custom-file-button">
                Select File
              </label>
              <input
                type="file"
                name="profilePicture"
                id="profilePicture"
                accept="image/*"
                onChange={handleChange}
              />
              <p className='m-0'>{formData.profilePicture?formData.profilePicture.name:'No file chosen.'}</p>
            </div>
          </div>
        </div>

        <div className="name-row">
          <div className="custom-input-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              />
          </div>
          <div className="custom-input-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="contact-row">
          <div className="custom-input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="custom-input-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="password-row">
          <div className="custom-input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="custom-input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isStudioMember"
              checked={formData.isStudioMember}
              onChange={handleChange}
            />
            {' '}I belong to a photography studio
          </label>
        </div>

        {formData.isStudioMember && (
          <div className="custom-input-group">
            <label>Select Studio</label>
            <select
              name="studioId"
              value={formData.studioId}
              onChange={handleChange}
              required
            >
              <option value="">Select a studio</option>
              {studios.map(studio => (
                <option key={studio.id} value={studio.id}>{studio.name}</option>
              ))}
            </select>
          </div>
        )}

        <button type="submit" className="register-button">Sign Up</button>

        <p className="footer-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};
