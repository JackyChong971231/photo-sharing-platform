import React, { useEffect, useState, useRef } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faCloudArrowUp, faCloudArrowDown, faTrash, faClipboardUser } from "@fortawesome/free-solid-svg-icons"
import { faCamera } from "@fortawesome/free-regular-svg-icons"
import { useSharedContext } from '../../SharedContext';


import './albumComponent.css'
import useRouteParams from '../../hooks/useRouteParams';

export const GalleryToolbar = ({imgMaxHeight, setImgMaxHeight, selectedImages}) => {
    return (
        <div>
            <div className='px-3 py-3 d-flex justify-content-between position-sticky top-0'>
                <div className='d-flex gap-5'>
                    <div className='d-flex align-items-center gap-2'>
                        <FontAwesomeIcon icon={faImage} style={{fontSize: '0.7rem'}}/>
                        <input
                        type="range"
                        min="100"
                        max="400"
                        value={imgMaxHeight}
                        onChange={(e) => setImgMaxHeight(e.target.value)}
                        className="w-full accent-blue-500"
                        />
                        <FontAwesomeIcon icon={faImage} style={{fontSize: '1.3rem'}}/>
                    </div>
                    <div className='d-flex align-items-center gap-2' style={{cursor: 'pointer'}}>
                        <FontAwesomeIcon icon={faClipboardUser} style={{fontSize: '1.3rem'}}/>
                        <p className='m-0'>Filter by face</p>
                        {/* <div className='filter-by-face-container'>
                            <p>adsfsadfsdf</p>
                        </div> */}
                    </div>
                </div>
                <div className='d-flex align-items-center gap-3' style={{minHeight: '1.5rem'}}>
                    {selectedImages.length > 0?
                    <p className='m-0 p-0'>{selectedImages.length} Selected</p>  
                    :
                    null}
                    <FontAwesomeIcon icon={faCloudArrowUp} style={{color:'rgba(58, 58, 58, 1)', fontSize: '1.3rem', cursor: 'pointer'}}/>
                    <FontAwesomeIcon icon={faTrash} style={{
                    color: selectedImages.length>0?'rgba(58, 58, 58, 1)':'rgba(233, 233, 233, 1)',
                    cursor: selectedImages.length>0?'pointer':'',
                    fontSize: '1.3rem'
                    }}/>
                    <FontAwesomeIcon icon={faCloudArrowDown} style={{
                    color: selectedImages.length>0?'rgba(58, 58, 58, 1)':'rgba(233, 233, 233, 1)',
                    cursor: selectedImages.length>0?'pointer':'',
                    fontSize: '1.3rem'
                    }}/>
                </div>
            </div>
        </div>
    )
}