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

    const onCoverPhotoChange = (blob) => {
        setFormData((prev) => ({ ...prev, cover_photo: blob }));
    };

    useEffect(() => {
        const fetchPhotographers = async () => {
            const photographers = await getAllPhotographersByStudio(dummy_studio_id);
            setPhotographersByStudio(photographers);
        };

        fetchPhotographers(); // call the async function
    }, []);

    return (
        <div className='position-relative pb-4' style={{
            overflowY: 'auto', 
            height: '100vh',
            width: '100%'
        }}>
            <div>
                <div className='sticky-header'>
                    <div className='d-flex flex-wrap gap-3 align-items-center justify-content-between px-3 py-4'>
                        <h3 className='m-0 text-nowrap' style={{color: 'var(--text-color)', fontSize: '1.7rem'}}>Create New Album</h3>
                        <div className='position-relative d-flex justify-content-between'
                        style={{flex: '0 0 auto'}}>
                            <span></span>
                            <div className='d-flex gap-4'>
                                <button className='px-4 py-1 bg-primary-subtle border border-secondary-subtle rounded'
                                onClick={() => {submitCreateAlbum()}}>Create</button>
                                <button className='px-4 py-1 bg-secondary-subtle border border-secondary-subtle rounded'>Clear</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='p-4'
                    style={{overflow: 'auto', flex: '1 1 auto', color: 'var(--text-color)',
                        borderTop: '1px solid gray'
                    }}>
                    <div className='mx-4 mt-1' style={{
                        minWidth: '40rem', maxWidth: '50rem'
                    }}>
                        <div>
                            <label className='custom-input-label-2'>Album Title *</label>
                            <input
                            className='form-input px-3 bg-transparent'
                            type="text"
                            name="album_title"
                            value={formData.album_title}
                            onChange={handleInputChange}
                            placeholder="Untitled Album"
                            style={{ marginRight: '1rem' }}
                            />
                        </div>
                        <div className='w-100 mt-2'>
                            <label className='custom-input-label-2'>Album Cover Photo *</label>
                            <ImageUploadContainer textOnContainer={<p className="fw-semibold m-0">Click or drag to upload <span className='fw-bold text-decoration-underline'>cover photo</span></p>} height='12rem' width='100%' onImageChange={onCoverPhotoChange}/>
                        </div>
                        <div className='d-flex gap-4 my-3'>
                            <div className='form-input-group flex-grow-1'>
                                <label className='custom-input-label-2'>Client First Name *</label>
                                <input
                                    type="text"
                                    name="client_first_name"
                                    value={formData.client_first_name}
                                    onChange={handleInputChange}
                                    placeholder=" "
                                    className='form-input ps-3'
                                />
                                {/* <label className='custom-input-label form-label ms-2'><small>First name</small></label> */}
                            </div>
                            <div className='form-input-group flex-grow-1'>
                                <label className='custom-input-label-2'>Client Last Name *</label>
                                <input
                                    type="text"
                                    name="client_last_name"
                                    value={formData.client_last_name}
                                    onChange={handleInputChange}
                                    placeholder=" "
                                    className='form-input ps-3'
                                />
                                {/* <label className='custom-input-label form-label ms-2'><small>Last name</small></label> */}
                            </div>
                        </div>
                        <div className='d-flex flex-column gap-4'>
                            <div>
                                <label className='custom-input-label-2'>Client Email *</label>
                                <input
                                    type="text"
                                    name="client_email"
                                    value={formData.client_email}
                                    onChange={handleInputChange}
                                    placeholder=" "
                                    className='form-input ps-3'
                                />
                            </div>
                            <div>
                                <label className='custom-input-label-2'>Client Phone Number *</label>
                                <input
                                    type="text"
                                    name="client_phone"
                                    value={formData.client_phone}
                                    onChange={handleInputChange}
                                    placeholder=" "
                                    className='form-input ps-3'
                                />
                            </div>
                            <div className='d-flex justify-content-between gap-5'>
                                <div className='flex-grow-0'>
                                    <ImageUploadContainer textOnContainer={<p className="fw-semibold m-0">Click or drag to upload <span className='fw-bold text-decoration-underline'>thumbnail</span></p>} width='13rem' height='13rem' onImageChange={onThumbnailChange}/>
                                </div>
                                <div className='flex-grow-1'>
                                    <label className='custom-input-label-2'>Album Description *</label>
                                    <textarea 
                                        style={{width: '100%', minHeight: '5rem'}}
                                        name="album_description"
                                        value={formData.album_description}
                                        onChange={handleInputChange}
                                        className='p-2'
                                    />
                                </div>
                            </div>
                            <div>
                                <label className='custom-input-label-2'>Photo Shoot Location *</label>
                                <input
                                    type="text"
                                    name="photo_shoot_location"
                                    value={formData.photo_shoot_location}
                                    onChange={handleInputChange}
                                    placeholder=" "
                                    className='form-input ps-3'
                                />
                            </div>
                            <div>
                                <label className='custom-input-label-2'>Photo Shoot Date *</label>
                                <input
                                    type="text"
                                    name="photo_shoot_date"
                                    value={formData.photo_shoot_date}
                                    onChange={handleDateChange}
                                    placeholder="mm/dd/yyyy"
                                    maxLength={10}
                                    className='form-input ps-3'
                                ></input>
                            </div>
                            <div>
                                <label className='custom-input-label-2'>Photographers *</label>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}