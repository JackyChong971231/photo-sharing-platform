import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudios } from '../../apiCalls/photographer/studioService';
import { userLogin, userRegister } from '../../apiCalls/photographer/authService';
import './register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useSharedContext } from '../../SharedContext';

const StudioSelect = ({ studios, formData, handleChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedStudio = studios.find(s => s.id === formData.studioId);

  // Filter studios based on search term
  const filteredStudios = useMemo(() => {
    return studios.filter(studio =>
      studio.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [studios, searchTerm]);

  const handleSelect = (studio) => {
    handleChange({ target: { name: "studioId", value: studio.id } });
    setSearchTerm(studio.name);
    setIsOpen(false);
  };

  return (
    <div className="custom-dropdown">
      <label>Select Studio</label>

      {/* Input field replaces the selected div */}
      <input
        type="text"
        placeholder="Search or select a studio..."
        value={searchTerm}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        className="studio-search-input"
      />

      {/* Dropdown options */}
      {isOpen && (
        <div className="dropdown-options">
          {filteredStudios.map(studio => (
            <div
              key={studio.id}
              className="dropdown-option"
              onClick={() => handleSelect(studio)}
            >
              <img
                src={studio.logo || "/placeholder-logo.png"}
                alt={studio.name}
                className="studio-logo"
              />
              <div className="studio-details">
                <span className="studio-name">{studio.name}</span>
                {studio.short_bio && (
                  <span className="studio-bio">{studio.short_bio}</span>
                )}
                {studio.tags.length > 0 && (
                  <span className="studio-tags">
                    Tags: {studio.tags.join(", ")}
                  </span>
                )}
              </div>
            </div>
          ))}

          {filteredStudios.length === 0 && (
            <div className="dropdown-option no-results">No studios found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudioSelect;

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
          <StudioSelect 
            studios={studios}       // array from your API
            formData={formData}     // current form state
            handleChange={handleChange}  // function to update formData
          />
        )}

        <button type="submit" className="register-button">Sign Up</button>

        <p className="footer-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};
