import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons"
import { useSharedContext } from '../../../SharedContext';


import './createAlbumForm.css'
import useRouteParams from '../../../hooks/useRouteParams';
import { Album } from '../album/album';
import { AlbumComponent } from '../../../components/albumComponent/albumComponent';
import { getAllPhotographersByStudio } from '../../../apiCalls/photographer/studioService';

export const CreateAlbumForm = () => {
    const [formData, setFormData] = useState({
        client_first_name: '',
        client_last_name: '',
        photo_shoot_location: '',
        photo_shoot_date: '',
        album_creation_date: '',
        photographers: []
    })
    const [photographersByStudio, setPhotographersByStudio] = useState([]);
    const [photographerComponent, setPhotographerComponent] = useState([]);

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

    const handlePhotographerChange = (e, index) => {
        if (!photographersByStudio.includes(e.target.value)) return;

        const photographer = e.target.value;

        setFormData(prev => {
            const updated = [...prev.photographers]; // copy array
            updated[index] = photographer;           // update safely
            return { ...prev, photographers: updated };
        });
    };

    useEffect(() => {
        const dummy_studio_id = 123;
        setPhotographersByStudio(getAllPhotographersByStudio(dummy_studio_id))
    },[])

    useEffect(() => {
        let photographerComponent_temp = []
        for (let i=0; i <= formData.photographers.length; i++) {
            photographerComponent_temp.push(
                <div className="d-flex align-items-center gap-3 mb-2">
                    <label>{i+1}.</label>
                    <select
                        name="photographer_name"
                        value={formData.photographers[i]?formData.photographers[i]:''}
                        onChange={(e) => {handlePhotographerChange(e, i)}}
                        className="form-select"
                        style={{width: '15rem'}}
                    >
                        {photographersByStudio.map((photographer) => (
                        <option value={photographer}>
                            {photographer}
                        </option>
                        ))}
                    </select>
                </div>
            )
        }
        setPhotographerComponent(photographerComponent_temp)
    }, [photographersByStudio, formData.photographers])

    return (
        <div className='p-0' style={{overflowY: 'auto'}}>
            <div className='p-4'
                style={{overflow: 'auto'}}>
                <div className='mx-4 mt-1'>
                    <input className='album_title_input px-3 bg-transparent' placeholder='Untitled Album' style={{fontSize: '2.5rem'}}/>
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
                    </div>
                    <div className='ms-3 mt-3'>
                        <p>Photographers:</p>
                        {photographerComponent}
                    </div>
                </div>
            </div>
            <div className='px-5 position-relative d-flex justify-content-between'>
                <span></span>
                <div className='d-flex gap-4'>
                    <button className='px-4 py-1 bg-primary-subtle border border-secondary-subtle rounded'
                    onClick={() => {console.log(formData)}}>Create</button>
                    <button className='px-4 py-1 bg-secondary-subtle border border-secondary-subtle rounded'>Clear</button>
                </div>
            </div>
        </div>
        
    )
}