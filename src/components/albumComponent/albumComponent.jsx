import React, { useEffect, useState, useRef } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faCloudArrowUp, faCloudArrowDown, faTrash, faEllipsis } from "@fortawesome/free-solid-svg-icons"
import { faCamera } from "@fortawesome/free-regular-svg-icons"
import { useSharedContext } from '../../SharedContext';

import './albumComponent.css'

import { buildTree, Sidebar } from './sidebar';
import { GalleryToolbar } from './galleryToolbar';
import { Gallery } from './gallery';
import { deletePhotos, getFolderStructureByAlbumID, insertPhotos } from '../../apiCalls/photographer/albumService';

import JSZip from "jszip";
import { saveAs } from "file-saver";

export const AlbumComponent = ({albumId}) => {
    const {user} = useSharedContext();

    const [imgMaxHeight, setImgMaxHeight] = useState(250);
  
    // For Folder Structure Panel
    const [currentFolderID, setCurrentFolderID] = useState(null);
    const [sidebarWidth, setSidebarWidth] = useState(250); // default width
    const isResizing = useRef(false);
    const outerRef = useRef(null);

    const [selectedImages, setSelectedImages] = useState([]);
    const [imagesInFolder, setImagesInFolder] = useState([]);
    const imgRefs = useRef([]);
    const [folderStructureArray, setFolderStructureArray] = useState([])

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
      const fetch_folders = async (albumId) => {
        const folder_structure_downloaded = await getFolderStructureByAlbumID(albumId);
        setFolderStructureArray(folder_structure_downloaded);
      }
      fetch_folders(albumId)
    },[])

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    const handlePhotosDownload = async () => {
      if (!selectedImages || selectedImages.length === 0) return;

      if (selectedImages.length === 1) {
        // Download single image directly
        const img = imagesInFolder[selectedImages[0]];
        if (!img) return;

        try {
          const response = await fetch(img.source);
          const blob = await response.blob();
          const fileExt = img.source.split('.').pop().split(/\#|\?/)[0];
          const filename = `${img.name ?? `image_${img.id}`}.${fileExt}`;
          saveAs(blob, filename);
        } catch (err) {
          console.error(`Failed to fetch ${img.source}`, err);
        }

      } else {
        // Multiple images → zip them
        const zip = new JSZip();
        const folder = zip.folder("photos");

        for (const idx of selectedImages) {
          const img = imagesInFolder[idx];
          if (!img) continue;

          try {
            const response = await fetch(img.source);
            const blob = await response.blob();
            const fileExt = img.source.split('.').pop().split(/\#|\?/)[0];
            const filename = `${img.name ?? `image_${img.id}`}.${fileExt}`;
            folder.file(filename, blob);
          } catch (err) {
            console.error(`Failed to fetch ${img.source}`, err);
          }
        }

        const zipped = await zip.generateAsync({ type: "blob" });
        saveAs(zipped, "selected_photos.zip");
      }
    };

    const handlePhotosUpload = async (files) => {
      if (!files || !files.length) return null;
      try {
        const images_to_be_uploaded = files.length;
        const { statusCode, body } = await insertPhotos(albumId, currentFolderID, user.id, files);
        const images_uploaded = body.created_photos;

        if (images_to_be_uploaded === images_uploaded.length) {
            setImagesInFolder(prevImagesInFolder => [...prevImagesInFolder, ...images_uploaded]);

            if (images_uploaded) {
                imgRefs.current = [...imgRefs.current, ...images_uploaded.map(
                    (_, i) => imgRefs.current[i] ?? React.createRef()
                )]
            }
        }

        if (statusCode === 201) {
          return body.created_photos
        } else {
          return null;
        }
      } catch (err) {
        return null;
      }
    }

    const handlePhotosDelete = async () => {
      if (!selectedImages || selectedImages.length === 0) return;

      const photoIdsToDelete = selectedImages.map(idx => imagesInFolder[idx].id);

      try {
        const { statusCode, body } = await deletePhotos(photoIdsToDelete);

        if (statusCode === 200) {
          // Remove deleted photos from state
          setImagesInFolder(prev => prev.filter(img => !photoIdsToDelete.includes(img.id)));

          // Remove corresponding refs
          imgRefs.current = imgRefs.current.filter((_, idx) => !selectedImages.includes(idx));

          // Clear selection
          setSelectedImages([]);

          console.log("Deleted photos:", body);
        } else {
          console.error("Failed to delete photos:", body);
        }
      } catch (err) {
        console.error(err);
        alert("Error deleting photos. Please try again.");
      }
    };

    return (
        <div className='album-component-outer-container' ref={outerRef}>
          <div className='d-flex flex-column h-100 w-100'
          >
            <div style={{borderBottom: '1px solid #ccc', zIndex: '100'}}>
              <GalleryToolbar 
              imgMaxHeight={imgMaxHeight} 
              setImgMaxHeight={setImgMaxHeight} 
              selectedImages={selectedImages} 
              handlePhotosUpload={handlePhotosUpload}
              handlePhotosDownload={handlePhotosDownload}
              handlePhotosDelete={handlePhotosDelete}
              />
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
                <Sidebar 
                  albumId={albumId} 
                  currentFolderID={currentFolderID} 
                  setCurrentFolderID={setCurrentFolderID} 
                  setFolderStructureArray={setFolderStructureArray}/>
              </div>

              {/* -------------- Divider -------------- */}
              <div className="album-divider-container" onMouseDown={handleMouseDown}><div className="album-divider"/></div>

              {/* -------------- Gallery related -------------- */}
              <div className='py-2 flex-grow-1'
                style={{minHeight: '100%', maxHeight: '100%'}}>
                <Gallery 
                  albumId={albumId} 
                  handlePhotosUpload={handlePhotosUpload}
                  handlePhotosDownload={handlePhotosDownload}
                  currentFolderID={currentFolderID} 
                  setCurrentFolderID={setCurrentFolderID} 
                  imagesInFolder={imagesInFolder}
                  setImagesInFolder={setImagesInFolder}
                  imgRefs={imgRefs}
                  imgMaxHeight={imgMaxHeight} 
                  selectedImages={selectedImages} 
                  setSelectedImages={setSelectedImages} 
                  folderStructureArray={folderStructureArray}/>
              </div>
            </div>

          </div>
        </div>
        
    )
}