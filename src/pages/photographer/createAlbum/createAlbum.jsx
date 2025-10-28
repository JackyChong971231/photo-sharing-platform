import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons"
import { useSharedContext } from '../../../SharedContext';


import './createAlbum.css'
import useRouteParams from '../../../hooks/useRouteParams';
import { Album } from '../album/album';
import { AlbumComponent } from '../../../components/albumComponent/albumComponent';
import { getAllPhotographersByStudio } from '../../../apiCalls/photographer/studioService';
import { CreateAlbumForm } from './createAlbumForm';
import { getAlbumMetadataByAlbumID, insertAlbum } from '../../../apiCalls/photographer/albumService';
import { CreateAlbumSuccess } from './createAlbumSuccess';
import { useLocation, useNavigate } from 'react-router-dom';

export const CreateAlbum = () => {
    const navigate = useNavigate();
    const [formHeightRatio, setFormHeightRatio] = useState(1);
    const {user} = useSharedContext();
    const [photographersByStudio, setPhotographersByStudio] = useState([]);
    const [isFormCollapsed, setIsFormCollapsed] = useState(false)

    const [formData, setFormData] = useState({
        album_title: '',
        client_first_name: '',
        client_last_name: '',
        photo_shoot_location: '',
        photo_shoot_date: '',
        album_creation_date: '',
        photographers: []
    })
    const [isAlbumCreated, setIsAlbumCreated] = useState(false)
    const [albumCreatedMetadata, setAlbumCreatedMetadata] = useState(null);
    const [albumID, setAlbumID] = useState(null)
    const location = useLocation();

    const submitCreateAlbum = async () => {
        const {statusCode, body} = await insertAlbum(formData, user, 1)
        if (statusCode===201) {
            setAlbumCreatedMetadata(body)
            setIsAlbumCreated(true);
            setFormHeightRatio(0.3);
            
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set('album_id', body.album.id); // or body.id depending on your API
            navigate(`${window.location.pathname}?${searchParams.toString()}`, { replace: true });
        }
    }

    const handleResize = () => {
        setIsFormCollapsed(prevState => !prevState)
    }

    useEffect(() => {
        const fetchPhotographers = async () => {
            const photographers = await getAllPhotographersByStudio(1);
            setPhotographersByStudio(photographers);
        };

        fetchPhotographers(); // call the async function
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const albumIdFromUrl = searchParams.get('album_id');

        if (albumIdFromUrl && albumCreatedMetadata===null) {
            // Call your API to fetch album metadata
            const fetchAlbum = async () => {
                try {
                    const {statusCode, body} = await getAlbumMetadataByAlbumID(albumIdFromUrl); // implement this API call
                    console.log(body)
                    setAlbumCreatedMetadata(body);
                    setIsAlbumCreated(true);
                } catch (err) {
                    console.error('Failed to fetch album:', err);
                }
            };

            fetchAlbum();
        }
    }, [location.search]);

    return (
        <div className='position-relative vh-100 p-0'>
            <div className='d-flex flex-column'>
                <div className={`position-relative transition-all overflow-hidden ${
                        isFormCollapsed ? 'collapsed-section' : ''
                    }`}
                    style={{
                        flex: isAlbumCreated ? '0 0 auto' : '1 1 auto',
                        // maxHeight: isAlbumCreated && isFormCollapsed ? '3rem' : 'none',
                        minHeight: isAlbumCreated?'auto':'100vh',
                        transition: '0.3s ease',
                    }}
                >
                    {isAlbumCreated && albumCreatedMetadata ? (
                        <CreateAlbumSuccess isFormCollapsed={isFormCollapsed} albumCreatedMetadata={albumCreatedMetadata} formData={formData} photographersByStudio={photographersByStudio}/>
                    ) : (
                        <CreateAlbumForm studioID={123}  formData={formData} setFormData={setFormData} submitCreateAlbum={submitCreateAlbum}
                        photographersByStudio={photographersByStudio} setPhotographersByStudio={setPhotographersByStudio}/>
                    )}

                    {isAlbumCreated&&<div className="resizing-button d-flex justify-content-center w-100 py-2 border-bottom"
                        onClick={handleResize}
                        role='button'
                    >
                        <FontAwesomeIcon icon={isFormCollapsed ? faArrowDown : faArrowUp} />
                    </div>}
                </div>

                <div className='position-relative overflow-hidden'
                style={{ 
                    flex: '1 1 auto', 
                    transition: '0.3s', 
                    width: '100%'
                }}
                >
                    <AlbumComponent albumId={null}/>
                </div>
            </div>
        </div>
        
    )
}