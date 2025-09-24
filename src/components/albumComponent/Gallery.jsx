import React, { useEffect, useState, useRef } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faCloudArrowUp, faCloudArrowDown, faTrash, faEllipsis } from "@fortawesome/free-solid-svg-icons"
import { faCamera } from "@fortawesome/free-regular-svg-icons"
import { useSharedContext } from '../../SharedContext';


import './albumComponent.css'
import useRouteParams from '../../hooks/useRouteParams';
import { getAllImagesByFolderID } from '../../apiCalls/photographer/albumService';

export const Gallery = ({currentFolderID, imgMaxHeight, selectedImages, setSelectedImages}) => {
    const galleryRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dragCurrent, setDragCurrent] = useState({ x: 0, y: 0 });
    const imgRefs = useRef([]);
    const clickThreshold = 5;
    const [imagesInFolder, setImagesInFolder] = useState([]);

    useEffect(() => {
        if (currentFolderID) {
            setSelectedImages([])
            const images_downloaded = getAllImagesByFolderID(currentFolderID)
            if (images_downloaded) {
            imgRefs.current = images_downloaded.map(
                (_, i) => imgRefs.current[i] ?? React.createRef()
            );
            setImagesInFolder(images_downloaded)
            } else {
            imgRefs.current = []
            setImagesInFolder([])
            }
        }
    }, [currentFolderID])

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            const fileNames = files.map(f => f.name);
            alert("Dropped images:\n" + fileNames.join("\n"));

            // optional: show preview
            const newImageURLs = files.map(f => URL.createObjectURL(f));
            setImagesInFolder(prev => [...prev, ...newImageURLs]);
        }
    };

    const handleMouseDown = (e) => {
        if (e.button !== 0) return;
        const rect = galleryRef.current.getBoundingClientRect();
        const scrollTop = galleryRef.current.scrollTop;
        const scrollLeft = galleryRef.current.scrollLeft;

        const x = e.clientX - rect.left + scrollLeft;
        const y = e.clientY - rect.top + scrollTop;

        setIsDragging(true);
        setDragStart({ x, y });
        setDragCurrent({ x, y });
    }

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const rect = galleryRef.current.getBoundingClientRect();
        const scrollTop = galleryRef.current.scrollTop;
        const scrollLeft = galleryRef.current.scrollLeft;

        const x = e.clientX - rect.left + scrollLeft;
        const y = e.clientY - rect.top + scrollTop;
        setDragCurrent({ x, y });

        const selBox = {
        left: Math.min(dragStart.x, x),
        top: Math.min(dragStart.y, y),
        right: Math.max(dragStart.x, x),
        bottom: Math.max(dragStart.y, y),
        };

        const selected = imgRefs.current
        .map((ref, i) => {
            const imgRect = ref.current.getBoundingClientRect();
            const imgX = imgRect.left - rect.left + scrollLeft;
            const imgY = imgRect.top - rect.top + scrollTop;
            const imgWidth = imgRect.width;
            const imgHeight = imgRect.height;

            return (
            imgX < selBox.right &&
            imgX + imgWidth > selBox.left &&
            imgY < selBox.bottom &&
            imgY + imgHeight > selBox.top
            ) ? i : null;
        })
        .filter(i => i !== null);

        setSelectedImages(selected);
    }

    const handleMouseUp = (e) => {
        const rect = galleryRef.current.getBoundingClientRect();
        const scrollTop = galleryRef.current.scrollTop;
        const scrollLeft = galleryRef.current.scrollLeft;

        const dx = dragCurrent.x - dragStart.x;
        const dy = dragCurrent.y - dragStart.y;

        // If movement is very small -> treat as click
        if (Math.abs(dx) < clickThreshold && Math.abs(dy) < clickThreshold) {
        const clickedImage = imgRefs.current.findIndex(ref => {
            const imgRect = ref.current.getBoundingClientRect();
            const imgX = imgRect.left - rect.left + scrollLeft;
            const imgY = imgRect.top - rect.top + scrollTop;
            const imgWidth = imgRect.width;
            const imgHeight = imgRect.height;

            const clickX = e.clientX - rect.left + scrollLeft;
            const clickY = e.clientY - rect.top + scrollTop;

            return (
            clickX >= imgX &&
            clickX <= imgX + imgWidth &&
            clickY >= imgY &&
            clickY <= imgY + imgHeight
            );
        });

        if (clickedImage !== -1) {
            setSelectedImages([clickedImage]);
        } else {
            setSelectedImages([]);
        }
        }

        setIsDragging(false);
    }

    return (
        <div className='gallery-container px-3'
        ref={galleryRef}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ position: "relative", userSelect: "none" }}
        >
        {(imagesInFolder.length===0)?
            // When there is NO images
            <div className='empty-folder-container'>
            <div className='no-photos-yet-container'>
                <FontAwesomeIcon icon={faCamera} style={{fontSize: '5rem', color: 'lightgray'}}/>
                <h3>No photos yet</h3>
                <p>Create the first folder or drag or drop photos to get started</p>
                <button>+ Create Your First Folder</button>
            </div>
            </div>
        :
            // When there is images
            (imagesInFolder.map((imgSrc, i) => (
            <div
                key={imgSrc}
                ref={imgRefs.current[i]}
                style={{
                display: "inline-block",
                padding: selectedImages.includes(i) ? "2px" : "0", // white space
                border: selectedImages.includes(i) ? "3px solid #007bff" : "none",
                boxSizing: "border-box",
                margin: selectedImages.includes(i) ? "0px" : "5px" // optional: gap between images
                }}
            >
                <img
                src={imgSrc}
                style={{
                    height: imgMaxHeight + "px",
                    maxWidth: imgMaxHeight * 2 + "px",
                    objectFit: "cover",
                    display: "block"
                }}
                />
            </div>
            )))
        }
        

        {isDragging && (
            <div
            style={{
                position: "absolute",
                left: Math.min(dragStart.x, dragCurrent.x),
                top: Math.min(dragStart.y, dragCurrent.y),
                width: Math.abs(dragCurrent.x - dragStart.x),
                height: Math.abs(dragCurrent.y - dragStart.y),
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                border: "1px solid #007bff",
                pointerEvents: "none", // so it doesn’t block mouse events
                zIndex: 1000
            }}
            />
        )}
        </div>
    )
}