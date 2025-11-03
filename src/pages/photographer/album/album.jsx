import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons"
import { useSharedContext } from '../../../SharedContext';


import './album.css'
import useRouteParams from '../../../hooks/useRouteParams';
import { AlbumComponent } from '../../../components/albumComponent/albumComponent';
import { getAlbumMetadataByAlbumID } from '../../../apiCalls/photographer/albumService';
import { postgresql_datetime_to_date } from '../../../utils/common';

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
    const [albumCreatedMetadata, setAlbumCreatedMetadata] = useState({});

    useEffect(() => {
        const fetch_data = async (albumId) => {
            const {statusCode, body} = await getAlbumMetadataByAlbumID(albumId);
            if (statusCode===200) {setAlbumCreatedMetadata(body)}
            // console.log(body)
        }
        fetch_data(albumId)
    },[])

    return (
        <div className='album-page-container d-flex flex-column vh-100'>
            <div className='photographer-album-title-container px-5 pt-4 sticky-top flex-shrink-0'>
                <div className='d-flex gap-4'>
                    <h1>{albumCreatedMetadata.title}</h1>
                    <button className='border-0 rounded px-4 bg-dark text-white'>Copy shared link</button>
                </div>
                <p>ID: {albumCreatedMetadata.id}</p>
            </div>
            <div className='photographer-album-detail-container d-flex px-5 pb-3 gap-4 flex-shrink-0 overflow-auto'>
                <div className='position-relative flex-shrink-0' style={{width: '10rem', height: '10rem'}}>
                    <img style={{width: '100%', objectFit: 'cover', borderRadius: '0.5rem'}} src={albumCreatedMetadata.thumbnail} />
                </div>
                <div className='photographer-album-detail photographer-album-detail--customer'>
                    <p className='photographer-album-detail-title'>Client Information</p>
                    <p>Customer Name: {albumCreatedMetadata.client_first_name} {albumCreatedMetadata.client_last_name}</p>
                    <p>Customer Email: {albumCreatedMetadata.client_email}</p>
                    <p>Customer Phone: {albumCreatedMetadata.client_phone}</p>
                    {/* <p>Couple Names: {album_metadata.couple_names}</p> */}
                </div>
                <div className='photographer-album-detail photographer-album-detail--album'>
                    <p className='photographer-album-detail-title'>Album Information</p>
                    <p>Photo Shoot Date: {albumCreatedMetadata.event_date}</p>
                    <p>Photo Shoot Location: {albumCreatedMetadata.event_location}</p>
                    <p>Album Created On: {albumCreatedMetadata.created_at?postgresql_datetime_to_date(albumCreatedMetadata.created_at):null}</p>
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