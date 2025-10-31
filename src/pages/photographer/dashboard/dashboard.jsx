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
import { postgresql_datetime_to_date } from '../../../utils/common';

export const Dashboard = () => {
    const navigate = useNavigate();
    const [allAlbums, setAllAlbums] = useState([]);
    const [metadata, setMetadata] = useState([]);
    const imgWidth = '13rem';

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
                            <div className='dashboard-gallery'
                            onClick={() => {handleClick(album_info.id)}}>
                                <div>
                                    <div className='position-relative' style={{width: imgWidth, height: imgWidth}}>
                                        <div className='position-absolute p-2 d-flex gap-2'>
                                            <p className={'dashboard-album-tag '+(album_info.is_public?'dashboard-album-tag--public':'dashboard-album-tag--private')}>{album_info.is_public?'Public':'Private'}</p>
                                        </div>
                                        <img style={{width: '100%'}} src={album_info.thumbnail}></img>
                                    </div>
                                </div>
                                <div className='dashboard-gallery-description'
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