import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import "./createAlbumSuccess.css";

export const CreateAlbumSuccess = ({ isFormCollapsed, albumID, albumCreatedMetadata, formData, photographers }) => {
    useEffect(() => {
        console.log(albumCreatedMetadata)
    })

  return (
    <div className="create-album-success p-4">
        {isFormCollapsed ? (
            <div className="d-flex gap-4">
                <div>
                    <img
                        className="create-album-success-thumbnail"
                        src={albumCreatedMetadata.thumbnail}
                        alt="Album Thumbnail"
                        style={{ borderRadius: '0.8rem', width: '5rem', height: '5rem', objectFit: 'cover' }}
                        />
                </div>
                <div>
                    <h2>{albumCreatedMetadata.title}</h2>
                    <div className="album_create_flag mb-2">
                        <FontAwesomeIcon icon={faCircleCheck} className="success-icon" />
                        <span className="success-text">Album Created Successfully</span>
                    </div>
                </div>
            </div>
        ): (
            
            <div className="d-flex gap-5">
                <div>
                    <div className="success-header mb-2">
                        <h2>{albumCreatedMetadata.title}</h2>
                        <div className="album_create_flag">
                            <FontAwesomeIcon icon={faCircleCheck} className="success-icon" />
                            <span className="success-text">Album Created Successfully</span>
                        </div>
                    </div>
                    <div className="py-2">
                        <p className='mb-1' style={{fontSize: '1.1rem', fontWeight: '600', textDecoration: 'underline'}}>Client Information:</p>
                        <div className="d-flex">
                            <div className="me-2 client-info-text-container">
                                <p>Client Name:</p>
                                <p>Client Email:</p>
                                <p>Client Phone:</p>
                            </div>
                            <div className="client-info-text-container">
                                <p>{albumCreatedMetadata.client_first_name} {albumCreatedMetadata.client_last_name}</p>
                                <p>{albumCreatedMetadata.client_email}</p>
                                <p>{albumCreatedMetadata.client_phone}</p>
                            </div>
                        </div>
                        <p></p>
                    </div>
                </div>
                <div className="d-flex gap-4">
                    <div>
                        <img
                        className="create-album-success-thumbnail"
                        src={albumCreatedMetadata.thumbnail}
                        alt="Album Thumbnail"
                        style={{ borderRadius: '0.8rem', width: '10rem', height: '10rem', objectFit: 'cover' }}
                        />
                    </div>
                    <div>
                        <p className='mb-1' style={{fontSize: '1.1rem', fontWeight: '600', textDecoration: 'underline'}}>Album Information:</p>

                        <div className="d-flex gap-3">
                            <div className="me-2 client-info-text-container">
                                <p>Description: </p>
                                <p>Location: </p>
                                <p>Date: </p>
                                <p>Created on: </p>
                            </div>
                            <div className="me-2 client-info-text-container">
                                <p>{albumCreatedMetadata.description}</p>
                                <p>{albumCreatedMetadata.event_location}</p>
                                <p>{albumCreatedMetadata.event_date}</p>
                                <p>{albumCreatedMetadata.created_at}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )}
    </div>
  );
};
