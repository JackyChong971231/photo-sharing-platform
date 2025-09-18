import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons"
import { useSharedContext } from '../../../SharedContext';


import './album.css'
import useRouteParams from '../../../hooks/useRouteParams';
import { AlbumComponent } from '../../../components/albumComponent/albumComponent';

// dummy
const album_metadata = {
    customer_name: 'Tom Holland',
    customer_email: 'tomholland@gmail.com',
    customer_phone: '4376601234',
    couple_names: ['Tom Holland', 'Jerry Lewis'],
    album_name: 'Tom & Jerry Wedding',
    album_photo_shoot_date: 'Aug 14, 2025',
    album_photo_shoot_location: '2040 Sheppard Ave East, Toronto',
    album_created_on: 'Aug 14, 2025',
    album_last_update: 'Aug 31, 2025',
    album_photo_count: '3060',
}

export const Album = () => {
    const { albumId } = useRouteParams(); // Extract 'albumId' from the URL

    return (
        <div className='album-page-container d-flex flex-column vh-100'>
            <div className='photographer-album-title-container px-5 pt-4 sticky-top flex-shrink-0'>
                <div className='d-flex gap-4'>
                    <h1>{album_metadata.album_name}</h1>
                    <button className='border-0 rounded px-4 bg-dark text-white'>Copy shared link</button>
                </div>
                <p>ID: {albumId}</p>
            </div>
            <div className='photographer-album-detail-container d-flex px-5 pb-3 flex-shrink-0 overflow-auto'>
                <div className='photographer-album-detail photographer-album-detail--customer'>
                    <p className='photographer-album-detail-title'>Client Information</p>
                    <p>Customer Name: {album_metadata.customer_name}</p>
                    <p>Customer Email: {album_metadata.customer_email}</p>
                    <p>Customer Phone: {album_metadata.customer_phone}</p>
                    <p>Couple Names: {album_metadata.couple_names}</p>
                </div>
                <div className='photographer-album-detail photographer-album-detail--album'>
                    <p className='photographer-album-detail-title'>Album Information</p>
                    <p>Photo Shoot Date: {album_metadata.album_photo_shoot_date}</p>
                    <p>Photo Shoot Location: {album_metadata.album_photo_shoot_location}</p>
                    <p>Album Created On: {album_metadata.album_created_on}</p>
                    <p>Last Updated On: {album_metadata.album_last_update}</p>
                    <p>Photo Count: {album_metadata.album_photo_count}</p>
                </div>
            </div>
            <div className='flex-grow-1 d-flex flex-column overflow-hidden'>
                <AlbumComponent albumId={albumId}/>
            </div>
        </div>
        
    )
}