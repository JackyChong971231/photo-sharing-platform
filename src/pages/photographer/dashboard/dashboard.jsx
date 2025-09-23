import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons"
import { useSharedContext } from '../../../SharedContext';
import MetadataCard from '../../../components/metadataCard/metadataCard';

import album_thumbnail_1 from '../../../assets/dummy/album_thumbnail_1.jpg';
import album_thumbnail_2 from '../../../assets/dummy/album_thumbnail_2.jpg';
import album_thumbnail_3 from '../../../assets/dummy/album_thumbnail_3.jpg';
import album_thumbnail_4 from '../../../assets/dummy/album_thumbnail_4.jpeg';

import chart_img from '../../../assets/dummy/chart.png'

import './dashboard.css'
import { getAllAlbumsByStudioID, getMetadataByStudioID } from '../../../apiCalls/photographer/albumService';

export const Dashboard = () => {
    const navigate = useNavigate();
    const [allAlbums, setAllAlbums] = useState([]);
    const [metadata, setMetadata] = useState([]);

    useEffect(() => {
        const dummy_studio_id = 123;
        setMetadata(getMetadataByStudioID(dummy_studio_id));
        const albums = getAllAlbumsByStudioID(dummy_studio_id);
        setAllAlbums(albums)
    }, [])

    const handleClick = (albumId) => {
        navigate("/album/"+albumId); // relative to base
    };

    return (
        <div className='p-3'>
            <div className='dashboard-header p-2'>
                <h1 className='m-0'>Welcome back</h1>
                <p>Manage your client galleries and share beautiful moments</p>
            </div>
            <div className='dashboard-content p-2 d-flex'>
                {
                    metadata.map(eachMetadata => (
                        <MetadataCard 
                            title={eachMetadata.title} 
                            value={eachMetadata.value} 
                            description={eachMetadata.subtitle}
                            graph={eachMetadata.graph}
                        />
                    ))
                }
            </div>
            <div className='all-galleries mt-4'>
                <h2>Recent Galleries</h2>
                <div className='galleries-container'>
                    {
                        allAlbums.map(album_info => (
                            <div className='dashboard-gallery'
                            onClick={() => {handleClick(album_info.albumId)}}>
                                <img src={album_info.thumbnail}></img>
                                <div className='dashboard-gallery-description'>
                                    <p className='m-0'>{album_info.name}</p>
                                    <div className='d-flex justify-content-between'>
                                        <p className='m-0'>{album_info.date}</p>
                                        <div className='d-flex align-items-center gap-1'>
                                            <FontAwesomeIcon icon={faImage} />
                                            <p className='m-0'>{album_info.photo_count}</p>
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