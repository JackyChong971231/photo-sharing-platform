import React, { useEffect, useState, useRef } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faCloudArrowUp, faCloudArrowDown, faTrash, faEllipsis } from "@fortawesome/free-solid-svg-icons"
import { faCamera } from "@fortawesome/free-regular-svg-icons"
import { useSharedContext } from '../../SharedContext';


import './albumComponent.css'
import useRouteParams from '../../hooks/useRouteParams';

import img01 from '../../assets/dummy/album/environment/IMG0001.jpg'
import img02 from '../../assets/dummy/album/environment/IMG0002.jpg'
import img03 from '../../assets/dummy/album/environment/IMG0003.jpeg'
import img04 from '../../assets/dummy/album/environment/IMG0004.jpg'
import img05 from '../../assets/dummy/album/environment/IMG0005.jpg'
import img06 from '../../assets/dummy/album/environment/IMG0006.jpg'

import img07 from '../../assets/dummy/album/group/IMG0007.jpeg'
import img08 from '../../assets/dummy/album/group/IMG0008.jpeg'
import img09 from '../../assets/dummy/album/group/IMG0009.jpeg'
import img10 from '../../assets/dummy/album/group/IMG0010.jpeg'
import img11 from '../../assets/dummy/album/group/IMG0011.jpeg'
import img12 from '../../assets/dummy/album/group/IMG0012.jpeg'
import img13 from '../../assets/dummy/album/group/IMG0013.jpeg'
import img14 from '../../assets/dummy/album/group/IMG0014.jpeg'

import img15 from '../../assets/dummy/album/portrait/IMG0015.jpeg'
import img16 from '../../assets/dummy/album/portrait/IMG0016.jpeg'
import img17 from '../../assets/dummy/album/portrait/IMG0017.jpeg'
import img18 from '../../assets/dummy/album/portrait/IMG0018.jpeg'
import img19 from '../../assets/dummy/album/portrait/IMG0019.jpeg'

import img20 from '../../assets/dummy/album/ceremony/welcome/IMG0020.jpeg'
import img21 from '../../assets/dummy/album/ceremony/welcome/IMG0021.jpeg'
import img22 from '../../assets/dummy/album/ceremony/welcome/IMG0022.jpeg'
import img23 from '../../assets/dummy/album/ceremony/welcome/IMG0023.jpg'

import img24 from '../../assets/dummy/album/ceremony/vow/IMG0024.jpeg'
import img25 from '../../assets/dummy/album/ceremony/vow/IMG0025.jpeg'
import img26 from '../../assets/dummy/album/ceremony/vow/IMG0026.jpeg'
import img27 from '../../assets/dummy/album/ceremony/vow/IMG0027.jpg'
import img28 from '../../assets/dummy/album/ceremony/vow/IMG0028.jpeg'

// dummy
const dummy_folder_structure = [
  {
    "id": 1,
    "name": "Environment",
    "type": "folder",
    "parent_id": null,
    "album_id": 101,
    "created_at": "2023-01-01"
  },
  {
    "id": 2,
    "name": "Group Photos",
    "type": "folder",
    "parent_id": null,
    "album_id": 101,
    "created_at": "2023-01-02"
  },
  {
    "id": 3,
    "name": "Portrait",
    "type": "folder",
    "parent_id": null,
    "album_id": 101,
    "created_at": "2023-01-02"
  },
  {
    "id": 4,
    "name": "Ceremony Photos",
    "type": "folder",
    "parent_id": null,
    "album_id": 101,
    "created_at": "2023-01-03"
  },
  {
    "id": 5,
    "name": "Vows",
    "type": "folder",
    "parent_id": 4,
    "album_id": 101,
    "created_at": "2023-01-04"
  },
  {
    "id": 6,
    "name": "Welcome",
    "type": "folder",
    "parent_id": 4,
    "album_id": 101,
    "created_at": "2023-01-04"
  },
  {
    "id": 7,
    "name": "Readings",
    "type": "folder",
    "parent_id": 4,
    "album_id": 101,
    "created_at": "2023-01-04"
  },
  {
    "id": 8,
    "name": "Testing",
    "type": "folder",
    "parent_id": 7,
    "album_id": 101,
    "created_at": "2023-01-04"
  },
  {
    "id": 9,
    "name": "Trial",
    "type": "folder",
    "parent_id": 4,
    "album_id": 101,
    "created_at": "2023-01-04"
  }
]

const images_in_folder_id = {
  1: [img01,img02,img03,img04,img05,img06],
  2: [img07,img08,img09,img10,img11,img12,img13,img14],
  3: [img15,img16,img17,img18,img19],
  5: [img24,img25,img26,img27,img28],
  6: [img20,img21,img22,img23]
}

const buildTree = (data) => {
  const map = {};
  const tree = [];

  // Create a map of items by their ID
  if (data.length === 0) {return tree}
  data.forEach((item) => {
    map[item.id] = { ...item, children: [] };
  });

  // Build the tree structure
  data.forEach((item) => {
    if (item.parent_id === null) {
      // Root-level items
      tree.push(map[item.id]);
    } else {
      // Add to parent's children
      map[item.parent_id]?.children.push(map[item.id]);
    }
  });

  return tree;
};

// Recursive component to render the folder structure
const FolderTree = ({ tree, setCurrentFolderID, currentFolderID, layer, currebtFolderIDOptionsClicked, setCurrebtFolderIDOptionsClicked }) => {
  if (tree.length === 0) {return null}
  return (
    <ul className="folder-tree ps-1 pe-0">
      {tree.map((node) => (
        <li key={node.id} className={"folder-item folder-item-"+layer}>
          {/* Render folder icon and name */}
          <div className="folder-label" 
            style={{background: (currentFolderID===node.id?'lightgray':'none'), borderRadius: '0.5rem', paddingBlock:'0.1rem', paddingLeft:'1rem'}}
          >
            <div className='d-flex justify-content-between align-items-center w-100 pe-2'>
              <div role='button' onClick={() => {
                if(node.children.length===0) {setCurrentFolderID(node.id)}
                else {setCurrentFolderID(node.children[0].id)}
              }}>
                <span className="folder-icon" role="img" aria-label="folder">
                  📁
                </span>
                <span>{node.name}</span>
              </div>
              <div className='relative' 
                onMouseEnter={() => {setCurrebtFolderIDOptionsClicked(node.id)}} 
                onMouseLeave={() => {setCurrebtFolderIDOptionsClicked(null)}}
              >
                <FontAwesomeIcon role='button' icon={faEllipsis}
                  // onClick={() => {setCurrebtFolderIDOptionsClicked(node.id)}}
                />
                <div className={'folder-option-menu '+((currebtFolderIDOptionsClicked===node.id)?'folder-option-menu--show':'folder-option-menu--hide')}>
                  <ul className='folder-option-menu-ul'>
                    <li><p>Rename</p></li>
                    <li><p>Create New Folder</p></li>
                    <li><p>Delete</p></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Render children recursively */}
          {node.children.length > 0 && <FolderTree 
            tree={node.children} 
            setCurrentFolderID={setCurrentFolderID} 
            currentFolderID={currentFolderID} 
            layer={layer+1}
            currebtFolderIDOptionsClicked={currebtFolderIDOptionsClicked}
            setCurrebtFolderIDOptionsClicked={setCurrebtFolderIDOptionsClicked}
          />}
        </li>
      ))}
    </ul>
  );
};

const dummy_api_getFolderStructure = (albumId) => {
  if (['1234', '2345', '3456', '4567'].includes(albumId)) {
    return dummy_folder_structure
  } else {
    return []
  }
}

export const AlbumComponent = ({albumId}) => {
  const [imgMaxHeight, setImgMaxHeight] = useState(250);
  const didInitialMount = React.useRef(false);
  
  // For album and images from server
  const [folderStructure, setFolderStructure] = useState([]);
  const [imagesInFolder, setImagesInFolder] = useState([]);
  
  // For Folder Structure Panel
    const [currentFolderID, setCurrentFolderID] = useState(null);
    const [currebtFolderIDOptionsClicked, setCurrebtFolderIDOptionsClicked] = useState(null)
    const [folderTree, setFolderTree] = useState([])
    const [sidebarWidth, setSidebarWidth] = useState(250); // default width
    const isResizing = useRef(false);
    const outerRef = useRef(null);

    // For images selection
    const galleryRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [dragCurrent, setDragCurrent] = useState({ x: 0, y: 0 });
    const imgRefs = useRef([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const clickThreshold = 5;

    // For Folder Structure Slider Resizing
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
      if (!didInitialMount.current) {
        if (albumId) {
          const folder_structure_downloaded = dummy_api_getFolderStructure(albumId)
          setFolderTree(buildTree(folder_structure_downloaded))
          setCurrentFolderID((folder_structure_downloaded.length > 0)?folder_structure_downloaded[0].id:null)
        }
        didInitialMount.current = true
      }
      else {
        setSelectedImages([])
        const images_downloaded = images_in_folder_id[currentFolderID]
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
            <div
                className="file-structure-container"
                style={{
                width: sidebarWidth + "px",
                minWidth: sidebarWidth + "px",
                maxWidth: sidebarWidth + "px",
                }}
            >
                <FolderTree 
                  tree={folderTree} 
                  setCurrentFolderID={setCurrentFolderID} 
                  currentFolderID={currentFolderID} 
                  layer={0}
                  currebtFolderIDOptionsClicked={currebtFolderIDOptionsClicked}
                  setCurrebtFolderIDOptionsClicked={setCurrebtFolderIDOptionsClicked}
                />
                <div className='p-2'>
                  <button className='w-100 text-white bg-dark rounded'>+ New Folder</button>
                </div>
            </div>
            {/* Divider */}
            <div
                className="divider"
                style={{
                cursor: "col-resize",
                paddingInline: '0.5rem'
                }}
                onMouseDown={handleMouseDown}

            >
              <div 
                className="divider"
                style={{
                width: 1,
                background: "#ccc",
                height: '100%'
                }}/>
            </div>
            <div className='d-flex flex-column flex-grow-1'>
              <div className='px-3 py-3 d-flex justify-content-between'>
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
              <div className='gallery-container pt-3 px-3'
                ref={galleryRef}
                onMouseDown={(e) => {
                  if (e.button !== 0) return;
                  const rect = galleryRef.current.getBoundingClientRect();
                  const scrollTop = galleryRef.current.scrollTop;
                  const scrollLeft = galleryRef.current.scrollLeft;

                  const x = e.clientX - rect.left + scrollLeft;
                  const y = e.clientY - rect.top + scrollTop;

                  setIsDragging(true);
                  setDragStart({ x, y });
                  setDragCurrent({ x, y });
                }}

                onMouseMove={(e) => {
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
                }}

                onMouseUp={(e) => {
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
                }}

                style={{ position: "relative", userSelect: "none" }}
              >
                {(imagesInFolder.length===0)?
                  // When there is NO images
                  <div className='empty-folder-container'>
                    <FontAwesomeIcon icon={faCamera} style={{fontSize: '5rem', color: 'lightgray'}}/>
                    <h3>No photos yet</h3>
                    <p>Create the first folder or drag or drop photos to get started</p>
                    <button>+ Create Your First Folder</button>
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
            </div>
        </div>
        
    )
}