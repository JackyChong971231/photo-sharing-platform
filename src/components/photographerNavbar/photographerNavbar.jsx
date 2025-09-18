import React from "react";
import { NavLink } from "react-router-dom";
import './photographerNavbar.css'

// dummy data
import studio_logo_png from '../../assets/dummy/studio_logo.png'

// icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faMessage, faCalendar, faImages, faCamera, faGear, faCircleUser } from "@fortawesome/free-solid-svg-icons"


const studio_profile = {
  image: studio_logo_png,
  name: 'Rosewood Studios',
  bio: 'Toronto Wedding Photographer'
}

const login_user = 'Jacky Chong'

const PhotographerNavbar = () => {
  return (
    <nav className="photographer-navbar">
      <div className="photographer-navbar-studio">
        <img src={studio_profile.image}></img>
        <div>
          <p style={{fontSize: '1.2rem', margin: '0', fontWeight: 'bold'}}>{studio_profile.name}</p>
          <p style={{fontSize: '0.8rem', margin: '0'}}>{studio_profile.bio}</p>
        </div>
      </div>
      <div className="photographer-navbar-panel">
        <section>INTERACTIONS</section>
          <div className="navLink-container">
            <NavLink className='navLink-container-button' to="/" activeClassName="active-link">
              <FontAwesomeIcon icon={faBell} />
              <p>Notification</p>
            </NavLink>
            <NavLink className='navLink-container-button' to="/" activeClassName="active-link">
              <FontAwesomeIcon icon={faMessage} />
              <p>Messages</p>
            </NavLink>
            <NavLink className='navLink-container-button' to="/" activeClassName="active-link">
              <FontAwesomeIcon icon={faCalendar} />
              <p>Calendar</p>
            </NavLink>
          </div>
        <section>MANAGEMENT</section>
          <div className="navLink-container">
            <NavLink className='navLink-container-button' to="/" activeClassName="active-link">
              <FontAwesomeIcon icon={faImages} />
              <p>Dashboard</p>
            </NavLink>
            <NavLink className='navLink-container-button' to="/create-album" activeClassName="active-link">
              <FontAwesomeIcon icon={faCamera} />
              <p>Create Gallery</p>
            </NavLink>
            <NavLink className='navLink-container-button' to="/" activeClassName="active-link">
              <FontAwesomeIcon icon={faGear} />
              <p>Settings</p>
            </NavLink>
          </div>
      </div>
      <div className="photographer-navbar-account">
        <FontAwesomeIcon style={{fontSize: '2rem'}} icon={faCircleUser} />
        <div>
          <p style={{fontSize: '1rem', margin: '0', fontWeight: 'bold'}}>{login_user}</p>
          <p style={{fontSize: '0.8rem', margin: '0'}}>Manage your account</p>
        </div>
      </div>
    </nav>
  );
};

export default PhotographerNavbar;