import React, { useEffect, useState, useRef } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faCloudArrowUp, faCloudArrowDown, faTrash, faEllipsis, faExpand, faFolder } from "@fortawesome/free-solid-svg-icons"
import { faCamera } from "@fortawesome/free-regular-svg-icons"
import { useSharedContext } from '../../SharedContext';


import './albumComponent.css'
import './gallery.css'
import useRouteParams from '../../hooks/useRouteParams';
import { getAllImagesByFolderID, insertPhotos } from '../../apiCalls/photographer/albumService';
import { ImageOptionMenu } from './imageOptionMenu';

export const Gallery = ({albumId, handlePhotosUpload, handlePhotosDownload, currentFolderID, setCurrentFolderID, imagesInFolder, setImagesInFolder, imgRefs, imgMaxHeight, selectedImages, setSelectedImages, folderStructureArray}) => {
    const [folderChildren, setFolderChildren] = useState([])
    
    // For image selection
    const galleryRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dragCurrent, setDragCurrent] = useState({ x: 0, y: 0 });
    const clickThreshold = 5;

    // For image hovering effect
    const [hoveredIndex, setHoveredIndex] = useState([]);

    // For option menu
    const [optionMenuIndex, setOptionMenuIndex] = useState(null);
    const [optionMenuAnchor, setOptionMenuAnchor] = useState('translate(0%, 0%)');
    const [optionMenuTop, setOptionMenuTop] = useState('0px');
    const optionMenuWidth = '10rem';

    // For dragging files
    const dragCounter = useRef(0);
    const [dragOverFiles, setDragOverFiles] = useState([]);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [isFilesDragging, setIsFilesDragging] = useState(false);

    // For photo upload
    const {user} = useSharedContext();

    // Close option menu if another image is clicked
    useEffect(() => {
        if (!selectedImages.includes(optionMenuIndex)) {
            setOptionMenuIndex(null);   // Close option menu if another image is clicked or no image is selected
        }
        if (selectedImages.length > 1 || selectedImages.length === 0) {
            setHoveredIndex([]) // If more than one image is selected, NO hover effect
        }
    },[selectedImages])

    // For downloading images from this folder
    useEffect(() => {
        if (!currentFolderID) return;

        const fetchImages = async () => {
            await setSelectedImages([]);
            const images = await getAllImagesByFolderID(currentFolderID);
            if (images) {
                imgRefs.current = images.map(
                    (_, i) => imgRefs.current[i] ?? React.createRef()
                );
            }
            setImagesInFolder(images);
        };
        
        fetchImages();
    }, [currentFolderID]);

    // For images dragging in effect
    const handleDragEnter = (e) => {
        e.preventDefault();
        dragCounter.current += 1;
        
        if (e.dataTransfer?.items?.length) {
            const files = Array.from(e.dataTransfer.items)
            setDragOverFiles(files);
        }
        setIsFilesDragging(true);
    };

    // For images dragging out effect
    const handleDragLeave = (e) => {
        e.preventDefault();
        dragCounter.current -= 1;
        if (dragCounter.current === 0) {
            setIsFilesDragging(false);
            setDragOverFiles([]);
        }
    };

    // For images dragging around effect
    const handleDragOver = (e) => {
        e.preventDefault();
        setCursorPos({ x: e.clientX, y: e.clientY });
    };

    // For images dropped logic
    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFilesDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length === 0) return;

        const images_to_be_uploaded = files.length;

        // Call upload directly
        await handlePhotosUpload(files);
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
        if (selectedImages.length===1) {
            setHoveredIndex(selected)   // set the image to hovered if there is only one image is selected DURING selection stage
        }
    }

    const handleMouseUp = (e) => {
        e.preventDefault()
        e.stopPropagation();
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
            if ([clickedImage].length === 1) {
                setHoveredIndex([clickedImage]) // set the image to hovered if there is only one image is selected AFTER selection stage
            }
        } else {
            setSelectedImages([]);
        }
        }

        setIsDragging(false);
    }

    const showImageOptionMenu = (e, image_idx) => {
        // determine anchor
        let translateX = '0%'
        let translateY = '0%'
        let top = '1.5rem'
        if (e.clientX/window.innerWidth > 0.8) {
            translateX = '-100%';
        }
        if (e.clientY/window.innerHeight > 0.7) {
            translateY = '-100%';
            top = '-1.5rem'
        }
        setOptionMenuTop(top)
        setOptionMenuAnchor(`translate(${translateX}, ${translateY}`)

        e.stopPropagation(); // prevent triggering gallery mouse events
        const prevOptionMenuIndex = optionMenuIndex
        setOptionMenuIndex(prev_image_idx => prev_image_idx===image_idx?null:image_idx);
        // setHoveredIndex(prevHoveredIndex => [...prevHoveredIndex.filter(index => index !== prevOptionMenuIndex), image_idx]); // keep hover active while menu is open
    };

    // remove all hover or option menu effect if clicked outside
    const handleClickOutside = (e) => {
        if (!galleryRef.current.contains(e.target)) {
            setOptionMenuIndex(null);
            setHoveredIndex([]);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setFolderChildren(
            folderStructureArray.filter(folder => 
                folder.parent_id === currentFolderID
            )
        )
    }, [folderStructureArray, currentFolderID])

    return (
        <div className='gallery-container flex-grow-1 p-3'
            ref={galleryRef}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ position: "relative", userSelect: "none" }}
        >
            <div className='gallery-folder-container'
            style={{paddingBottom: (folderChildren.length>0?'2rem':'0rem')}}
            >
                {
                    folderChildren.map(folder => (
                        <div className='gallery-folder' 
                        onClick={()=>{setCurrentFolderID(folder.id)}}>
                            <FontAwesomeIcon icon={faFolder} />
                            <p className='m-0'>{folder.name}</p>
                        </div>
                    ))
                }
            </div>
            {(imagesInFolder.length===0 && folderChildren.length===0)?
                // When there is NO images
                <div className='empty-folder-container'>
                    <div className='no-photos-yet-container'>
                        <FontAwesomeIcon icon={faCamera} style={{fontSize: '5rem', color: 'lightgray'}}/>
                        <h3>No photos yet</h3>
                        <p>Create the first folder or drag or drop photos to get started</p>
                        {/* <button>+ Create Your First Folder</button> */}
                    </div>
                </div>
            :
                // When there is images
                (imagesInFolder.map((img, i) => (
                <div
                    className={`image-container ${hoveredIndex===i ? 'image-container--hovered' : ''}`}
                    key={i}
                    ref={imgRefs.current[i]}
                    onMouseEnter={() => {
                        if (selectedImages.length < 2 || 
                            (selectedImages.length > 1 && !selectedImages.includes(i))
                        ) {
                            setHoveredIndex(prevHoveredIndex => [...prevHoveredIndex, i]) // set image to hover
                        }
                    }}
                    onMouseLeave={() => {
                        // only clear hover if option menu is not open for this image
                        if (optionMenuIndex !== i) {
                            setHoveredIndex(prevHoveredIndex => 
                                prevHoveredIndex.filter(index => index !== i)
                            );
                        }
                    }}
                >
                    <img
                        src={img.source}
                        style={{
                            height: imgMaxHeight + "px",
                            maxWidth: imgMaxHeight * 2 + "px",
                            objectFit: "cover",
                            display: "block"
                        }}
                    />
                    <div className='image-container-border' style={{visibility: (selectedImages.includes(i)?'visible':'hidden')}}/>
                    <div className={`image-container-hover-overlay ${hoveredIndex.includes(i) ? 'image-container-hover-overlay--hovered' : ''}`}></div>
                    <div className='position-absolute top-0 end-0 text-white m-2'
                        style={{visibility: (hoveredIndex.includes(i)?'visible':'hidden')}}
                    >
                        <button className='image-options-btn'
                        onMouseDownCapture={(e) => {e.stopPropagation()}}
                        onClick={(e) => {showImageOptionMenu(e,i)}}><FontAwesomeIcon style={{fontSize: '0.75rem'}} icon={faEllipsis} /></button>
                        {optionMenuIndex===i? 
                        <div className={`image-option-menu ${optionMenuIndex===i ? 'image-option-menu--show' : 'image-option-menu--hidden'}`}
                        style={{transform: optionMenuAnchor, top: optionMenuTop}}>
                            <ImageOptionMenu optionMenuWidth={optionMenuWidth} handlePhotosDownload={handlePhotosDownload} />
                        </div>:null}
                    </div>
                    <div className='position-absolute bottom-0 end-0 text-white m-2'
                        style={{visibility: (hoveredIndex.includes(i)?'visible':'hidden')}}
                    >
                        <button className='image-expand-btn'>
                            <FontAwesomeIcon icon={faExpand}/>
                        </button>
                    </div>
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

            {/* Center overlay when dragging */}
            {isFilesDragging && dragOverFiles.length > 0 && (
                <div className="drag-overlay">
                <h3>Uploading {dragOverFiles.length} files</h3>
                {/* <ul>
                    {dragOverFiles.slice(0, 5).map((file, idx) => (
                        file ? (
                            <li key={idx}>{file.name} ({Math.round(file.size / 1024)} KB)</li>
                        ) : null
                    ))}
                    {dragOverFiles.length > 5 && <li>+ {dragOverFiles.length - 5} more…</li>}
                </ul> */}
                </div>
            )}

            {/* Cursor-following badge */}
            {isFilesDragging && dragOverFiles.length > 0 && (
                <div
                className="drag-cursor-badge"
                style={{ top: cursorPos.y + 10, left: cursorPos.x + 10 }}
                >
                <FontAwesomeIcon icon={faImage} size="2x" />
                <span className="file-count">{dragOverFiles.length}</span>
                </div>
            )}
        </div>

    )
}