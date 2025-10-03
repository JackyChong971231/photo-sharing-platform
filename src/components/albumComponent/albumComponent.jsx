import React, { useEffect, useState, useRef } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faCloudArrowUp, faCloudArrowDown, faTrash, faEllipsis } from "@fortawesome/free-solid-svg-icons"
import { faCamera } from "@fortawesome/free-regular-svg-icons"
import { useSharedContext } from '../../SharedContext';

import './albumComponent.css'

import { Sidebar } from './sidebar';
import { GalleryToolbar } from './galleryToolbar';
import { Gallery } from './gallery';

export const AlbumComponent = ({albumId}) => {
    const [imgMaxHeight, setImgMaxHeight] = useState(250);
  
    // For Folder Structure Panel
    const [currentFolderID, setCurrentFolderID] = useState(null);
    const [sidebarWidth, setSidebarWidth] = useState(250); // default width
    const isResizing = useRef(false);
    const outerRef = useRef(null);

    const [selectedImages, setSelectedImages] = useState([]);

    // For Divider Resizing
    const handleMouseDown = () => {
        isResizing.current = true;
        document.body.style.cursor = "col-resize";
    };

    const handleMouseMove = (e) => {
        if (!isResizing.current) return;
        const cursor_x = e.clientX;
        const outerRef_x = outerRef.current.getBoundingClientRect().x
        const newWidth = cursor_x - outerRef_x;
        if (newWidth > 150 && newWidth < 300) {
            setSidebarWidth(newWidth);
        }
    };

    const handleMouseUp = () => {
        isResizing.current = false;
        document.body.style.cursor = "default";
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    return (
        <div className='album-component-outer-container' ref={outerRef}>
          <div className='d-flex flex-column h-100'
          >
            <div style={{borderBottom: '1px solid #ccc', zIndex: '100'}}>
              <GalleryToolbar imgMaxHeight={imgMaxHeight} setImgMaxHeight={setImgMaxHeight} selectedImages={selectedImages} />
            </div>

            <div className='flex-grow-1 d-flex'
             style={{overflowY: 'hidden'}}>
              <div className="file-structure-container"
                style={{
                  width: sidebarWidth + "px",
                  minWidth: sidebarWidth + "px",
                  maxWidth: sidebarWidth + "px",
                }}
              >
                <Sidebar albumId={albumId} currentFolderID={currentFolderID} setCurrentFolderID={setCurrentFolderID} />
              </div>

              {/* -------------- Divider -------------- */}
              <div className="album-divider-container" onMouseDown={handleMouseDown}><div className="album-divider"/></div>

              {/* -------------- Gallery related -------------- */}
              <div className='py-2'
              style={{minHeight: '100%', maxHeight: '100%'}}>
                <Gallery currentFolderID={currentFolderID} imgMaxHeight={imgMaxHeight} selectedImages={selectedImages} setSelectedImages={setSelectedImages}/>
              </div>
            </div>

          </div>
        </div>
        
    )
}