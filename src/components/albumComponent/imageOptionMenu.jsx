import React, { useEffect, useState, useRef } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCloudArrowDown, faShare, faPaintBrush } from "@fortawesome/free-solid-svg-icons"
import { faCamera } from "@fortawesome/free-regular-svg-icons"
import { useSharedContext } from '../../SharedContext';


import './imageOptionMenu.css'

import useRouteParams from '../../hooks/useRouteParams';
import { getAllImagesByFolderID } from '../../apiCalls/photographer/albumService';

export const ImageOptionMenu = ({optionMenuWidth, handlePhotosDownload}) => {
    return (
        <div className='image-option-menu-inner-container'
            style={{width: (optionMenuWidth)}}
                onMouseDownCapture={(e) => {
                    e.stopPropagation();
                }}
                onMouseUpCapture={(e) => {
                    e.stopPropagation();
                }}
            >
            <div role='button'><FontAwesomeIcon icon={faHeart}/><p className='m-0'>Favourite</p></div>
            <div className='option-menu-border border-bottom p-0'/>
            <div role='button' onClick={() => {handlePhotosDownload()}}><FontAwesomeIcon icon={faCloudArrowDown}/><p className='m-0'>Download</p></div>
            <div role='button'><FontAwesomeIcon icon={faShare}/><p className='m-0'>Share</p></div>
            <div className='option-menu-border border-bottom p-0'/>
            <div role='button'><FontAwesomeIcon icon={faPaintBrush}/><p className='m-0'>Request retouch</p></div>
            {/* <button onClick={() => alert('asdfsdf')}>Request retouch</button> */}
        </div>
    )
}
