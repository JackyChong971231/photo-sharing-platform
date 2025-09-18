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

// dummy data
const dummy = [
    {
        name: 'Tom & Jerry',
        date: 'Aug 14, 2025',
        photo_count: 1235,
        thumbnail: album_thumbnail_1,
        albumId: 1234
    },
    {
        name: 'Konie & Thomas',
        date: 'May 16, 2025',
        photo_count: 562,
        thumbnail: album_thumbnail_2,
        albumId: 2345
    },
    {
        name: 'Jessica & Johnny',
        date: 'Feb 23, 2025',
        photo_count: 2347,
        thumbnail: album_thumbnail_3,
        albumId: 3456
    },
    {
        name: 'Sabrina & Alex',
        date: 'Dec 31, 2024',
        photo_count: 5673,
        thumbnail: album_thumbnail_4,
        albumId: 4567
    },
]


export const Dashboard = () => {
    const {dummyStr, setDummyStr} = useSharedContext();
    const navigate = useNavigate();

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
                <MetadataCard title='Total Albums' value='126' description='Active client albums'/>
                <MetadataCard title='Total Photos' value='53,300' description='Photos shared with clients'/>
                <MetadataCard title='Total Clients' value='72' description='Clients'/>
                <MetadataCard title='Total Photographers' value='12' description='Active photographers'/>
                <MetadataCard title='Client Growth' value='+30%' description='Compared to last month' graph={chart_img}/>
            </div>
            <div className='all-galleries mt-4'>
                <h2>Recent Galleries</h2>
                <div className='galleries-container'>
                    {
                        dummy.map(album_info => (
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