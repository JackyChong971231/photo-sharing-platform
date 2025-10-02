import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPhone, faEnvelope, faLock, faShieldHalved, faEarthAmericas, faCircleQuestion, faCircleInfo, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { useSharedContext } from '../../SharedContext';
import useRouteParams from '../../hooks/useRouteParams';

import { AlbumComponent } from '../../components/albumComponent/albumComponent';
import { customGetAlbumInfo } from '../../apiCalls/guest/albumService';

import './album.css'

export const Album = () => {
    const { albumId } = useRouteParams(); // Extract 'albumId' from the URL
    const [headerContentData, setHeaderContentData] = useState({});

    useEffect(() => {
        const api_result = customGetAlbumInfo(albumId);
        setHeaderContentData(api_result);
    })

    return (
        <div className='positive-relative d-flex flex-column vh-100'>
            <div className='header-content'>
                <p className='customer-name'>{headerContentData.client_names}</p>
                <p className='platform-name'>TBD Wedding Platform</p>
            </div>
            <div className='w-100'>
                <img className='customer-album-img' src={headerContentData.cover_photo}></img>
            </div>
            <div className='flex-grow-1 d-flex flex-column overflow-hidden'>
                <AlbumComponent albumId={albumId}/>
            </div>
        </div>
        
    )
}