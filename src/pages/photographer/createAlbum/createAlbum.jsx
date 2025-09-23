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

export const CreateAlbum = () => {
    const [formHeightRatio, setFormHeightRatio] = useState(0.7);

    const handleResize = () => {
        if (formHeightRatio===0.7) {setFormHeightRatio(0.2)}
        else if (formHeightRatio===0.2) {setFormHeightRatio(0.7)}
    }

    return (
        <div className='p-0'>
            <div className='d-flex flex-column vh-100'>
                <div className="d-flex flex-column" 
                    style={{ flexBasis: formHeightRatio * 100 + "%", overflow: "hidden", transition: '0.3s' }}
                >
                <CreateAlbumForm studioID={123} />
                </div>

                <div className="resizing-button d-flex justify-content-center w-100 py-2 border-bottom"
                    onClick={handleResize}
                    role='button'
                >
                <FontAwesomeIcon icon={formHeightRatio < 0.5 ? faArrowDown : faArrowUp} />
                </div>
                <div className='w-100 d-flex flex-column overflow-hidden'
                style={{ flexBasis: (1 - formHeightRatio) * 100 + "%", transition: '0.3s' }}
                >
                    <AlbumComponent albumId={null}/>
                </div>
            </div>
        </div>
        
    )
}