import React, { useEffect, useState, useRef } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faCloudArrowUp, faCloudArrowDown, faTrash, faClipboardUser, faXmark } from "@fortawesome/free-solid-svg-icons"
import { faCamera } from "@fortawesome/free-regular-svg-icons"
import { useSharedContext } from '../../SharedContext';

import person01 from '../../assets/dummy/faces/person1.jpg'
import person02 from '../../assets/dummy/faces/person2.jpg'
import person03 from '../../assets/dummy/faces/person3.jpg'
import person04 from '../../assets/dummy/faces/person4.jpg'
import person05 from '../../assets/dummy/faces/person5.jpg'
import person06 from '../../assets/dummy/faces/person6.jpg'
import person07 from '../../assets/dummy/faces/person7.jpg'
import person08 from '../../assets/dummy/faces/person8.jpg'

import './albumComponent.css'
import './galleryToolbar.css'
import useRouteParams from '../../hooks/useRouteParams';

const faces = {
    '01':person01, 
    '02':person02, 
    '03':person03, 
    '04':person04, 
    '05':person05, 
    '06':person06, 
    '07':person07, 
    '08':person08}

const FilterByFaceComponent = ({setIsShowFaceFilterComponent, filterFaces, setFilterFaces}) => {
    const imageSelectHandler = (face_id) => {
        if (filterFaces.includes(face_id)) {
            console.log('asdfasdfsadf')
            // Remove face_id from filterFaces
            setFilterFaces(filterFaces.filter(f => f !== face_id));
        } else {
            // Add face_id to filterFaces
            setFilterFaces([...filterFaces, face_id]);
        }
    }
    
    return (
        <div className='p-3'>
            <p>Select multiple faces:</p>
            <div className='d-flex flex-wrap'>
                {Object.keys(faces).map(face_id => (
                    <div role='button' className='position-relative m-2' onClick={() => {imageSelectHandler(face_id)}}>
                        <img className='filter-by-face-img' src={faces[face_id]}/>
                        <div className='filter-by-face-img-border' style={{visibility: filterFaces.includes(face_id)?'visible':'hidden'}}/>
                    </div>
                ))}
            </div>
            <div className='mt-2 d-flex justify-content-between align-items-center'>
                {filterFaces.length > 0
                ?
                    <div className='filter-by-face-tag'>
                        <button className='filter-by-face-clear-btn'
                        onClick={() => {setFilterFaces([])}}>
                            <FontAwesomeIcon icon={faXmark} />
                            <p className='m-0'>clear</p>
                        </button>
                        <p className='m-0'>{filterFaces.length} faces</p>
                    </div>
                : <span/>}
                <div className='d-flex gap-2'>
                    <button className='px-3 py-1 bg-primary-subtle border border-secondary-subtle rounded'>Apply</button>
                    <button className='px-3 py-1 bg-secondary-subtle border border-secondary-subtle rounded'
                    onClick={() => {setIsShowFaceFilterComponent(false)}}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export const GalleryToolbar = ({imagesPerRow, setImagesPerRow, imgMaxHeight, setImgMaxHeight, selectedImages, handlePhotosUpload, handlePhotosDownload, handlePhotosDelete}) => {
    const [isShowFaceFilterComponent, setIsShowFaceFilterComponent] = useState(false)
    const filterByFaceRef = useRef(null)
    const [filterFaces, setFilterFaces] = useState([])

    const fileInputRef = useRef(null); // <-- ref for hidden file input

    const handleClickOutside = (e) => {
        if (!filterByFaceRef.current.contains(e.target)) {
            setIsShowFaceFilterComponent(false)
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const openFileDialog = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // programmatically open file picker
        }
    };

    const onFileChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            handlePhotosUpload(files); // pass to parent handler
        }
    };

    return (
        <div>
            <div className='px-3 py-3 d-flex justify-content-between gap-5 position-sticky top-0'
            style={{overflowX: 'auto'}}>
                <div className='d-flex gap-5'>
                    <div className='d-flex align-items-center gap-2'>
                        <FontAwesomeIcon icon={faImage} style={{fontSize: '0.7rem'}}/>
                        <input 
                            type="range" 
                            min="2" 
                            max="8" 
                            value={imagesPerRow} 
                            onChange={(e) => setImagesPerRow(Number(e.target.value))} 
                        />
                        <FontAwesomeIcon icon={faImage} style={{fontSize: '1.3rem'}}/>
                    </div>
                    <div ref={filterByFaceRef} >
                        <div className='d-flex align-items-center gap-2' style={{cursor: 'pointer'}}
                        onClick={()=>{if (isShowFaceFilterComponent===false) setIsShowFaceFilterComponent(true)}}
                        >
                            <FontAwesomeIcon icon={faClipboardUser} style={{fontSize: '1.3rem'}}/>
                            <p className='m-0 text-nowrap'>Filter by face</p>
                        </div>
                        {isShowFaceFilterComponent?
                            <div className='filter-by-face-container'>
                                <FilterByFaceComponent setIsShowFaceFilterComponent={setIsShowFaceFilterComponent}
                                filterFaces={filterFaces}
                                setFilterFaces={setFilterFaces}/>
                            </div>
                        : null}
                    </div>
                </div>
                <div className='d-flex align-items-center gap-3' style={{minHeight: '1.5rem'}}>
                    {selectedImages.length > 0?
                    <p className='m-0 p-0 text-nowrap'>{selectedImages.length} Selected</p>  
                    :
                    null}

                    <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={onFileChange}
                    />

                    <div onClick={() => {openFileDialog()}}>
                        <FontAwesomeIcon icon={faCloudArrowUp} style={{color:'rgba(58, 58, 58, 1)', fontSize: '1.3rem', cursor: 'pointer'}}/>    
                    </div>
                    <div onClick={() => {handlePhotosDelete()}}>
                        <FontAwesomeIcon icon={faTrash} style={{
                        color: selectedImages.length>0?'rgba(58, 58, 58, 1)':'rgba(233, 233, 233, 1)',
                        cursor: selectedImages.length>0?'pointer':'',
                        fontSize: '1.3rem'
                        }}/>
                    </div>
                    <div onClick={() => {handlePhotosDownload()}}>
                        <FontAwesomeIcon icon={faCloudArrowDown} style={{
                        color: selectedImages.length>0?'rgba(58, 58, 58, 1)':'rgba(233, 233, 233, 1)',
                        cursor: selectedImages.length>0?'pointer':'',
                        fontSize: '1.3rem'
                        }}/>
                    </div>
                </div>
            </div>
        </div>
    )
}