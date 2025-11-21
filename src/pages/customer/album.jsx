import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPhone, faEnvelope, faLock, faShieldHalved, faEarthAmericas, faCircleQuestion, faCircleInfo, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { useSharedContext } from '../../SharedContext';
import useRouteParams from '../../hooks/useRouteParams';

import { AlbumComponent } from '../../components/albumComponent/albumComponent';
import { customGetAlbumInfo } from '../../apiCalls/customer/albumService';

import './album.css'

export const Album = () => {
    const { albumId } = useRouteParams(); // Extract 'albumId' from the URL
    const [headerContentData, setHeaderContentData] = useState({});
    const [collapsed, setCollapsed] = useState(false);

    const handleScroll = () => {
        if (!collapsed) {
            setCollapsed(true)
        }
    };

    useEffect(() => {
        const api_result = customGetAlbumInfo(albumId);
        setHeaderContentData(api_result);
    },[])

    useEffect(() => {
        
        window.addEventListener('wheel', handleScroll);
        return () => window.removeEventListener('wheel', handleScroll);
    }, []);
    
    return (
        <div className='positive-relative d-flex flex-column vh-100'>
            <div className='header-content'>
                <p className='customer-name'>{headerContentData.client_names}</p>
                <p className='platform-name'>TBD Wedding Platform</p>
            </div>
            {/* Cover photo */}
            <div className={`cover-photo-wrapper cover-photo-wrapper${collapsed ? '--collapsed' : '--show'}`}>
                <img className='customer-album-img' src={headerContentData.cover_photo} alt="cover" />
                <div className='cover-photo-text-wrapper'>
                    <p>{headerContentData.album_title}</p>
                    <p>Date: {headerContentData.photo_shoot_date}</p>
                </div>
            </div>
            <div className='flex-grow-1 d-flex flex-column overflow-hidden'>
                <AlbumComponent albumId={albumId}/>
            </div>
        </div>
        
    )
}