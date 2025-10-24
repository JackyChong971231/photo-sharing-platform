import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faImage, faXmark } from "@fortawesome/free-solid-svg-icons"
import { useSharedContext } from '../../../SharedContext';


import './createAlbumForm.css'
import useRouteParams from '../../../hooks/useRouteParams';
import { Album } from '../album/album';
import { AlbumComponent } from '../../../components/albumComponent/albumComponent';
import { getAllPhotographersByStudio } from '../../../apiCalls/photographer/studioService';
import { insertAlbum } from '../../../apiCalls/photographer/albumService';
import ImageUploadContainer from '../../../components/imageUploadContainer/imageUploadContainer';

export const CreateAlbumForm = ({ formData, setFormData, submitCreateAlbum, photographersByStudio, setPhotographersByStudio }) => {
    const dummy_studio_id = 1;
    const [isAlbumCreated, setIsAlbumCreated] = useState(false)

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
        const photographer_id = e.target.value;

        setFormData(prev => {
            const updated = [...prev.photographers]; // copy array
            updated[index] = photographer_id;           // update safely
            return { ...prev, photographers: updated };
        });
    };

    const handleRemovePhotographer = (index) => {
    setFormData((prev) => {
        const newPhotographers = [...prev.photographers]; // copy the array
        newPhotographers.splice(index, 1); // remove the photographer at that index
        return {
        ...prev,
        photographers: newPhotographers,
        };
    });
    };

    const onThumbnailChange = (blob) => {
        setFormData((prev) => ({ ...prev, thumbnail: blob }));
    };

    useEffect(() => {
        const fetchPhotographers = async () => {
            const photographers = await getAllPhotographersByStudio(dummy_studio_id);
            setPhotographersByStudio(photographers);
        };

        fetchPhotographers(); // call the async function
    }, []);

    return (
        <div className='p-0' style={{overflowY: 'auto', height: '100vh'}}>
            <div className='p-4'
                style={{overflow: 'auto'}}>
                <div className='mx-4 mt-1'>
                    <input
                    className='album_title_input px-3 bg-transparent'
                    type="text"
                    name="album_title"
                    value={formData.album_title}
                    onChange={handleInputChange}
                    placeholder="Untitled Album"
                    style={{ fontSize: '2.5rem', height: '4rem', marginRight: '1rem' }}
                    />

                    {isAlbumCreated && (
                        <div className='d-flex gap-2 align-items-center text-success mt-2'>
                        <FontAwesomeIcon icon={faCircleCheck} />
                        <p className='m-0'>Album is created successfully!</p>
                        </div>
                    )}
                </div>
                <div className='mx-4 my-5'>
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
                            <label className='custom-input-label form-label ms-2'><small>First name</small></label>
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
                            <label className='custom-input-label form-label ms-2'><small>Last name</small></label>
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
                            <label className='custom-input-label form-label ms-2'><small>Email</small></label>
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
                            <label className='custom-input-label form-label ms-2'><small>Phone Number</small></label>
                        </div>
                    </div>
                </div>

                <div className='d-flex gap-5 mx-4 my-5'>
                    <div>
                        <ImageUploadContainer size='15rem' onThumbnailChange={onThumbnailChange}/>
                    </div>
                    <div className=''>
                        <p className='custom-bold-text'>Album Information</p>
                        <div className='d-flex flex-wrap'>
                            <div className='form-input-group'>
                                <input
                                    type="text"
                                    name="album_description"
                                    value={formData.album_description}
                                    onChange={handleInputChange}
                                    placeholder=" "
                                    className='form-input ps-3'
                                />
                                <label className='custom-input-label form-label ms-2'><small>Album Description</small></label>
                            </div>
                            <div className='form-input-group'>
                                <input
                                    type="text"
                                    name="photo_shoot_location"
                                    value={formData.photo_shoot_location}
                                    onChange={handleInputChange}
                                    placeholder=" "
                                    className='form-input ps-3'
                                />
                                <label className='custom-input-label form-label ms-2'><small>Photo Shoot Location</small></label>
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
                                <label className='custom-input-label form-label ms-2'><small>Photo Shoot Date</small></label>
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
                                <label className='custom-input-label form-label ms-2'><small>Album Creation Date</small></label>
                            </div>
                        </div>
                        <div className='ms-3 mt-3'>
                            <p>Photographers:</p>
                            <div>
                                {Array.from({ length: formData.photographers.length+1 }).map((_, i) => {
                                    // filter out IDs that are already selected in other rows
                                    const availablePhotographers = photographersByStudio.filter(
                                        (p) => !formData.photographers.includes(p.id.toString()) || p.id.toString() === formData.photographers[i]
                                    );

                                    return (
                                        <div className="d-flex align-items-center gap-3 mb-2" key={i}>
                                            <label>{i + 1}.</label>
                                            <select
                                                name="photographer_name"
                                                value={formData.photographers[i] || ''}
                                                onChange={(e) => handlePhotographerChange(e, i)}
                                                className="form-select"
                                                style={{ width: '15rem' }}
                                            >
                                                <option value={null}>Select a photographer</option>
                                                {availablePhotographers.map((photographer) => (
                                                    <option key={photographer.id} value={photographer.id}>
                                                        {photographer.first_name} {photographer.last_name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div onClick={() => handleRemovePhotographer(i)}
                                            role='button'>
                                                {(formData.photographers.length >= i+1)?
                                                    <FontAwesomeIcon icon={faXmark} />
                                                :null}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {/* {photographerComponent} */}
                        </div>
                    </div>
                </div>
            </div>
            <div className='px-5 position-relative d-flex justify-content-between'>
                <span></span>
                <div className='d-flex gap-4'>
                    <button className='px-4 py-1 bg-primary-subtle border border-secondary-subtle rounded'
                    onClick={() => {submitCreateAlbum()}}>Create</button>
                    <button className='px-4 py-1 bg-secondary-subtle border border-secondary-subtle rounded'>Clear</button>
                </div>
            </div>
        </div>
        
    )
}