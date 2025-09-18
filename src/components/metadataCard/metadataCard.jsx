import React from "react";
import { NavLink } from "react-router-dom";
import './metadataCard.css'

// icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faMessage, faCalendar, faImages, faCamera, faGear, faCircleUser } from "@fortawesome/free-solid-svg-icons"



const MetadataCard = ({title, value, description, graph}) => {
  return (
    <div className="metacard-outer-container mx-4 d-flex">
        <div>
            <p className="metacard-title">{title}</p>
            <p className="metacard-value">{value}</p>
            <p className="metacard-description">{description}</p>
        </div>
        {graph?<img src={graph}></img>: null}
        
    </div>
  );
};

export default MetadataCard;