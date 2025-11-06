import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faImage } from "@fortawesome/free-solid-svg-icons"
import { useSharedContext } from '../../../SharedContext';
import MetadataCard from '../../../components/metadataCard/metadataCard';

import album_thumbnail_1 from '../../../assets/dummy/album_thumbnail_1.jpg';
import album_thumbnail_2 from '../../../assets/dummy/album_thumbnail_2.jpg';
import album_thumbnail_3 from '../../../assets/dummy/album_thumbnail_3.jpg';
import album_thumbnail_4 from '../../../assets/dummy/album_thumbnail_4.jpeg';

import chart_img from '../../../assets/dummy/chart.png'

import './dashboard.css'
import { deleteAlbumByID, getAllAlbumsByStudioID, getMetadataByStudioID, setAlbumVisibility } from '../../../apiCalls/photographer/albumService';
import { postgresql_datetime_to_date } from '../../../utils/common';

export const AlbumOptionMenu = ({album_info, handleAlbumDelete, handleAlbumMakePublicOrPrivate, setOptionMenuAlbumID}) => {
    return (
        <div className='position-absolute p-2 mt-5 mx-2 end-0 bg-light'
        style={{width: '10rem', borderRadius: '0.7rem'}}>
            <button className='btn btn-light text-start border-0 rounded px-3 py-1 w-100'
            style={{borderRadius: '1.4rem'}}
            onClick={() => {
                handleAlbumDelete(album_info.id);
                setOptionMenuAlbumID(null);
            }}>Delete</button>
            <button className='btn btn-light text-start border-0 rounded px-3 py-1 w-100'
            style={{borderRadius: '1.4rem'}}
            onClick={() => {
                handleAlbumMakePublicOrPrivate(album_info.id, album_info.is_public);
                setOptionMenuAlbumID(null);
            }}>Make {album_info.is_public?'private':'public'}</button>
        </div>
    )
}

export const Dashboard = () => {
    const navigate = useNavigate();
    const [allAlbums, setAllAlbums] = useState([]);
    const [metadata, setMetadata] = useState([]);
    const imgWidth = '13rem';
    const [optionMenuAlbumID, setOptionMenuAlbumID] = useState(null)

    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // if menu is open and click is outside menu and outside trigger button
            if (
                optionMenuAlbumID !== null &&
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                !event.target.closest('.dashboard-album-option-btn')
            ) {
                setOptionMenuAlbumID(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [optionMenuAlbumID]);

    useEffect(() => {
        const fetch_all_albums = async (studio_id) => {
            const { statusCode, body } = await getAllAlbumsByStudioID(dummy_studio_id);
            console.log(body)
            setAllAlbums(body.albums)
            const response2 = await getMetadataByStudioID(dummy_studio_id)
            let metadataForm = {
                'num_albums': {title: 'Total Albums', subtitle: 'Client albums', value: ''},
                'num_private_albums': {title: 'Private Albums', subtitle: 'Albums', value: ''},
                'num_public_albums': {title: 'Public Albums', subtitle: 'Albums shared with clients', value: ''},
                'num_photographers': {title: 'Total Photographers', subtitle: 'Active photographers', value: ''},
                'num_photos': {title: 'Total Photos', subtitle: 'Photos shared with clients', value: ''},
            }
            await Object.keys(metadataForm).forEach(key => {
                metadataForm[key].value = response2.body[key]
            })
            // console.log(metadataForm)
            setMetadata(metadataForm);
        }
        const dummy_studio_id = 1;
        
        fetch_all_albums(dummy_studio_id)
    }, [])

    const handleClick = (albumId) => {
        navigate("/album/"+albumId); // relative to base
    };

    const handleAlbumDelete = async (album_id) => {
        const confirmed = window.confirm("Are you sure you want to delete this album?");
        if (!confirmed) return;

        const { statusCode } = await deleteAlbumByID(album_id);

        if (statusCode === 200) {
            setAllAlbums(prev => prev.filter(a => a.id !== album_id));
        }
    }

    const handleAlbumMakePublicOrPrivate = async (album_id, currentVisibility) => {
        const newVisibility = !currentVisibility;

        const confirmed = window.confirm(
            newVisibility 
            ? "This album will become PUBLIC and visible to clients. Continue?" 
            : "This album will become PRIVATE and hidden from clients. Continue?"
        );

        if (!confirmed) return;

        const { statusCode } = await setAlbumVisibility(album_id, newVisibility);

        if (statusCode === 200) {
            // Update UI without refetching
            setAllAlbums(prev =>
            prev.map(a =>
                a.id === album_id ? { ...a, is_public: newVisibility } : a
            )
            );
        }
    }

    return (
        <div className='p-3'>
            <div className='dashboard-header p-2'>
                <h1 className='m-0'>Welcome back</h1>
                <p>Manage your client galleries and share beautiful moments</p>
            </div>
            <div className='dashboard-content p-2 d-flex'>
                {
                    Object.keys(metadata).map(key => (
                        <MetadataCard
                            title={metadata[key].title} 
                            value={metadata[key].value} 
                            description={metadata[key].subtitle}
                            graph={metadata[key].graph}
                        />
                    ))
                }
            </div>
            <div className='all-galleries mt-4 p-3'>
                <h2>Recent Galleries</h2>
                <div className='galleries-container'>
                    {
                        allAlbums.map(album_info => (
                            <div className='dashboard-gallery'>
                                <div>
                                    <div className='position-relative' style={{width: imgWidth, height: imgWidth}}>
                                        <div className='position-absolute w-100 p-2 d-flex justify-content-between align-items-center'>
                                            <div className='d-flex gap-2'>
                                                <p className={'dashboard-album-tag '+(album_info.is_public?'dashboard-album-tag--public':'dashboard-album-tag--private')}>{album_info.is_public?'Public':'Private'}</p>
                                            </div>
                                            <div>
                                                <div className='dashboard-album-option-btn'
                                                onClick={() => {
                                                    setOptionMenuAlbumID(prevOptionMenuAlbumID => prevOptionMenuAlbumID===album_info.id?null:album_info.id)
                                                }}>
                                                    <FontAwesomeIcon icon={faEllipsisVertical} />
                                                </div>
                                            </div>
                                        </div>
                                        {optionMenuAlbumID===album_info.id ? (
                                            <div ref={menuRef}>
                                                <AlbumOptionMenu 
                                                    album_info={album_info} 
                                                    handleAlbumDelete={handleAlbumDelete} 
                                                    handleAlbumMakePublicOrPrivate={handleAlbumMakePublicOrPrivate} 
                                                    setOptionMenuAlbumID={setOptionMenuAlbumID}
                                                />
                                            </div>
                                        ) : null}
                                        <img onClick={() => {handleClick(album_info.id)}} style={{width: '100%'}} src={album_info.thumbnail}></img>
                                    </div>
                                </div>
                                <div className='dashboard-gallery-description'
                                onClick={() => {handleClick(album_info.id)}}
                                style={{width: imgWidth, paddingInline: '0.2rem'}}>
                                    <p className='m-0'>{album_info.title}</p>

                                    <div>
                                        <div style={{
                                            fontSize: '0.8rem', 
                                            paddingBlock: '0.3rem',
                                            textWrap: 'nowrap',
                                            color: 'gray'
                                        }}>
                                            <p className='m-0 text-decoration-underline fw-bold'>Client Info</p>
                                            <div style={{width: '100%'}}>
                                                <p className='m-0'>Client name: {album_info.client_name}</p>
                                                <p className='m-0 text-truncate'>Client email: {album_info.client_email}</p>
                                            </div>
                                        </div>
                                        <div className='d-flex align-items-end justify-content-between'>
                                            <div className='text-secondary' style={{fontSize: '0.7rem'}}>
                                                <p className='m-0'>Event date: {album_info.event_date}</p>
                                                <p className='m-0'>Created on: {postgresql_datetime_to_date(album_info.created_at)}</p>
                                            </div>
                                            <div className='d-flex align-items-center gap-1'>
                                                <FontAwesomeIcon icon={faImage} />
                                                <p className='m-0'>{album_info.photos_count}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
        
    )
}