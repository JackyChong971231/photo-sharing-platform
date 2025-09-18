import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons"
import { useSharedContext } from '../../../SharedContext';


import './createAlbum.css'
import useRouteParams from '../../../hooks/useRouteParams';
import { Album } from '../album/album';
import { AlbumComponent } from '../../../components/albumComponent/albumComponent';


export const CreateAlbum = () => {
    const [formData, setFormData] = useState({
        client_first_name: '',
        client_last_name: '',
        photo_shoot_location: '',
        photo_shoot_date: '',
        album_creation_date: ''
    })

    const handleInputChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        });
    };

    const handleDateChange = (e) => {
        let value = e.target.value.replace(/\D/g, ""); // keep only numbers

        // Auto insert slashes
        if (value.length > 2 && value.length <= 4) {
        value = value.slice(0, 2) + "/" + value.slice(2);
        } else if (value.length > 4) {
        value = value.slice(0, 2) + "/" + value.slice(2, 4) + "/" + value.slice(4, 8);
        }

        setFormData({
            ...formData,
            [e.target.name]: value,
        });
    };

    return (
        <div className='p-0'>
            <div className='d-flex flex-column vh-100'>
                <div className='sticky-top flex-shrink-0 border-bottom p-4'
                    style={{maxHeight: '40%', overflow: 'auto'}}>
                    <div className='mx-4 mt-1'>
                        <input className='album_title_input px-3' placeholder='Untitled Album' style={{fontSize: '2.5rem'}}/>
                    </div>
                    <div className='mx-4 mt-3'>
                        <p className='custom-bold-text'>Client Information</p>
                        <div className='d-flex flex-wrap mb-3'>
                            <div className='form-input-group'>
                                <input
                                    type="text"
                                    name="client_first_name"
                                    value={formData.client_first_name}
                                    onChange={handleInputChange}
                                    placeholder=" "
                                    className='form-input ps-3'
                                />
                                <label className='form-label ms-2'><small>First name</small></label>
                            </div>
                            <div className='form-input-group'>
                                <input
                                    type="text"
                                    name="client_last_name"
                                    value={formData.client_last_name}
                                    onChange={handleInputChange}
                                    placeholder=" "
                                    className='form-input ps-3'
                                />
                                <label className='form-label ms-2'><small>Last name</small></label>
                            </div>
                            <div className='form-input-group'>
                                <input
                                    type="text"
                                    name="client_email"
                                    value={formData.client_email}
                                    onChange={handleInputChange}
                                    placeholder=" "
                                    className='form-input ps-3'
                                />
                                <label className='form-label ms-2'><small>Email</small></label>
                            </div>
                            <div className='form-input-group'>
                                <input
                                    type="text"
                                    name="client_phone"
                                    value={formData.client_phone}
                                    onChange={handleInputChange}
                                    placeholder=" "
                                    className='form-input ps-3'
                                />
                                <label className='form-label ms-2'><small>Phone Number</small></label>
                            </div>
                        </div>
                    </div>

                    <div className='mx-4 mt-3'>
                        <p className='custom-bold-text'>Album Information</p>
                        <div className='d-flex flex-wrap'>
                            <div className='form-input-group'>
                                <input
                                    type="text"
                                    name="photo_shoot_location"
                                    value={formData.photo_shoot_location}
                                    onChange={handleInputChange}
                                    placeholder=" "
                                    className='form-input ps-3'
                                />
                                <label className='form-label ms-2'><small>Photo Shoot Location</small></label>
                            </div>
                            <div className='form-input-group'>
                                <input
                                    type="text"
                                    name="photo_shoot_date"
                                    value={formData.photo_shoot_date}
                                    onChange={handleDateChange}
                                    placeholder="mm/dd/yyyy"
                                    maxLength={10}
                                    className='form-input ps-3'
                                ></input>
                                <label className='form-label ms-2'><small>Photo Shoot Date</small></label>
                            </div>
                            <div className='form-input-group'>
                                <input
                                    type="text"
                                    name="album_creation_date"
                                    value={formData.album_creation_date}
                                    onChange={handleDateChange}
                                    placeholder="mm/dd/yyyy"
                                    className='form-input ps-3'
                                />
                                <label className='form-label ms-2'><small>Album Creation Date</small></label>
                            </div>
                            <div className='form-input-group'>
                                <input
                                    type="text"
                                    name="client_phone"
                                    value={formData.client_phone}
                                    onChange={handleInputChange}
                                    placeholder=" "
                                    className='form-input ps-3'
                                />
                                <label className='form-label ms-2'><small>Phone Number</small></label>
                            </div>
                        </div>
                        <p className='ms-3 mt-3'>Photographers:</p>
                    </div>
                </div>
                <div className='w-100 flex-grow-1 d-flex flex-column overflow-hidden vh-50'>
                    <AlbumComponent albumId={null}/>
                </div>
            </div>
        </div>
        
    )
}