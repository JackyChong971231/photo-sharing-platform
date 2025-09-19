import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

import "./studioCard.css";

export const StudioCard = ({selectedStudio}) => {

  return (
    <div className="studio-card-container">
        <div className="d-flex justify-content-between">
            <span></span>
            <img src={selectedStudio.logo} style={{
                width: '4rem',
                height: '4rem',
                objectFit: 'cover'
            }}/>
        </div>
        <div>
            <p className="fw-bold fs-4">{selectedStudio.name}</p>
            <div className="studio-card-services">
                {selectedStudio.services.map(service => (
                    <p>{service}</p>
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
                <p>{selectedStudio.location}</p>
            </div>
        </div>
    </div>
  );
};