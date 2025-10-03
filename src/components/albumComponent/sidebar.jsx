import React, { useEffect, useState, useRef } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faEllipsis } from "@fortawesome/free-solid-svg-icons"
import { faCamera } from "@fortawesome/free-regular-svg-icons"
import { useSharedContext } from '../../SharedContext';


import './albumComponent.css'
import useRouteParams from '../../hooks/useRouteParams';

import { getAllImagesByFolderID, getFolderStructureByAlbumID } from '../../apiCalls/photographer/albumService';

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
                  <FontAwesomeIcon icon={faFolder} />
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

export const Sidebar = ({albumId, currentFolderID, setCurrentFolderID}) => {
    // For Folder Structure Panel
    const [currebtFolderIDOptionsClicked, setCurrebtFolderIDOptionsClicked] = useState(null)
    const [folderTree, setFolderTree] = useState([])
    const isResizing = useRef(false);
    const outerRef = useRef(null);

    useEffect(() => {
        if (albumId) {
            const folder_structure_downloaded = getFolderStructureByAlbumID(albumId)
            setFolderTree(buildTree(folder_structure_downloaded))
            setCurrentFolderID((folder_structure_downloaded.length > 0)?folder_structure_downloaded[0].id:null)
        }
    },[])

    return (
        <div style={{height: '100%', overflowY: 'auto', overflowX: 'hidden'}}>
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
    )
}