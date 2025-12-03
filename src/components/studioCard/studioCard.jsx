import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

import defaultStudioLogo from '../../assets/dummy/default_studio_logo.png'

import "./studioCard.css";

export const StudioCard = ({selectedStudio, userInfoLongTemp}) => {

  return (
    <div className="studio-card-container">
        <div className="d-flex justify-content-between">
            <span></span>
            <img src={selectedStudio.logo?selectedStudio.logo:defaultStudioLogo} style={{
                width: '4rem',
                height: '4rem',
                objectFit: 'cover'
            }}/>
        </div>
        <div>
            <p className="fw-bold fs-4">{selectedStudio.name}</p>
            <div className="d-flex gap-2 mb-1">
                <p style={{fontSize: "0.9rem", margin: '0'}}>{userInfoLongTemp.first_name} {userInfoLongTemp.last_name}</p>
                <p style={{fontSize: "0.9rem", margin: '0'}}>|</p>
                <p style={{fontSize: "0.9rem", margin: '0'}}>{userInfoLongTemp.role}</p>
            </div>
            <div className="studio-card-services">
                {selectedStudio.tags.map(tag => (
                    <p key={tag}>{tag}</p>
                ))}
            </div>
        </div>
        <div className="studio-card-detail">
            <div>
                <p>{selectedStudio.phone}</p>
                <a href={selectedStudio.website} target="_blank" rel="noreferrer">
                    {selectedStudio.website}
                </a>
            </div>
            <div>
                <p>{selectedStudio.address_str}</p>
            </div>
        </div>
    </div>
  );
};