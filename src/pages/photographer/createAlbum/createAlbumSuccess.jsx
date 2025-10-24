import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import "./createAlbumSuccess.css";

export const CreateAlbumSuccess = ({ isFormCollapsed, formData, photographers }) => {
  return (
    <div className="create-album-success p-4">
        {isFormCollapsed ? (
            <div className="d-flex gap-4">
                <div>
                    <img
                        className="create-album-success-thumbnail"
                        src={formData.thumbnail ? URL.createObjectURL(formData.thumbnail) : null}
                        alt="Album Thumbnail"
                        style={{ borderRadius: '0.8rem', width: '5rem', height: '5rem', objectFit: 'cover' }}
                        />
                </div>
                <div>
                    <h2>{formData.album_title}</h2>
                    <div className="success-header mb-2">
                        <FontAwesomeIcon icon={faCircleCheck} className="success-icon" />
                        <span className="success-text">Album Created Successfully</span>
                    </div>
                </div>
            </div>
        ): (
            
            <div className="d-flex gap-5">
                <div>
                    <div className="success-header mb-2">
                        <FontAwesomeIcon icon={faCircleCheck} className="success-icon" />
                        <span className="success-text">Album Created Successfully</span>
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
                                <p>{formData.client_first_name} {formData.client_last_name}</p>
                                <p>{formData.client_email}</p>
                                <p>{formData.client_phone}</p>
                            </div>
                        </div>
                        <p></p>
                    </div>
                </div>
                <div className="d-flex gap-4">
                    <div>
                        <img
                        className="create-album-success-thumbnail"
                        src={formData.thumbnail ? URL.createObjectURL(formData.thumbnail) : null}
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
                                <p>{formData.album_description}</p>
                                <p>{formData.photo_shoot_location}</p>
                                <p>{formData.photo_shoot_date}</p>
                                <p>{formData.album_creation_date}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )}
    </div>
  );
};
