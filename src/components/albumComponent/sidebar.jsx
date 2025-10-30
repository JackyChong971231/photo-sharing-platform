import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { getFolderStructureByAlbumID, createFolderAPI } from '../../apiCalls/photographer/albumService';

import './albumComponent.css';
import './sidebar.css';

const buildTree = (data) => {
  const map = {};
  const tree = [];

  if (!data || data.length === 0) return tree;

  data.forEach(item => {
    map[item.id] = { ...item, children: [] };
  });

  data.forEach(item => {
    if (item.parent_id === null) {
      tree.push(map[item.id]);
    } else {
      map[item.parent_id]?.children.push(map[item.id]);
    }
  });

  return tree;
};

const FolderTree = ({
  createFolderHandler,
  tree,
  setCurrentFolderID,
  currentFolderID,
  layer,
  currentFolderIDOptionsClicked,
  setCurrentFolderIDOptionsClicked,
  tempFolder,
  setTempFolder
}) => {
  const tempRef = useRef(null);

  // Scroll temp folder into view
  useEffect(() => {
    if (tempRef.current) {
      tempRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [tempFolder]);

  if (!tree || tree.length === 0) return null;

  return (
    <ul className="folder-tree ps-1 pe-0">
      {tree.map((node) => (
        <li key={node.id} className={`folder-item folder-item-${layer}`}>
          <div className="folder-label"
               style={{
                 background: currentFolderID === node.id ? 'lightgray' : 'none',
                 borderRadius: '0.5rem',
                 paddingBlock: '0.1rem',
                 paddingLeft: `${layer}rem`
               }}>
            <div className="d-flex justify-content-between align-items-center w-100 px-3">
              {/* Folder Name Section */}
              <div
                role="button"
                className="d-flex align-items-center gap-2 flex-grow-1 text-truncate"
                style={{
                  minWidth: 0, // crucial for truncation in flexbox
                }}
                onClick={() => {
                  setCurrentFolderID(node.id);
                  setCurrentFolderIDOptionsClicked(null);
                }}
              >
                <FontAwesomeIcon icon={faFolder} className="me-1" />
                <span
                  className="text-truncate"
                  style={{
                    display: 'inline-block',
                    maxWidth: '100%',
                  }}
                >
                  {node.name}
                </span>
              </div>

              {/* Options (faEllipsis) */}
              <div className="ms-2" style={{ flexShrink: 0, position: 'relative' }}>
                <FontAwesomeIcon
                  role="button"
                  icon={faEllipsis}
                  onClick={() =>{
                    console.log(node.id)
                    setCurrentFolderIDOptionsClicked((prevFolderID) =>
                      prevFolderID === node.id ? null : node.id
                    )}
                  }
                />

                <div
                  className={`folder-option-menu ${
                    currentFolderIDOptionsClicked === node.id
                      ? 'folder-option-menu--show'
                      : 'folder-option-menu--hide'
                  }`}
                >
                  <ul className="folder-option-menu-ul">
                    <li>
                      <p>Rename</p>
                    </li>
                    <li>
                      <p
                        role="button"
                        onClick={() => {
                          setTempFolder({ parent_id: node.id, name: '', layer: layer + 1 });
                          setCurrentFolderIDOptionsClicked(null);
                        }}
                      >
                        Create New Folder
                      </p>
                    </li>
                    <li>
                      <p>Delete</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Render temporary folder under this parent if exists */}
          {tempFolder && tempFolder.parent_id === node.id && (
            <ul className="folder-tree ps-1 pe-1">
              <li ref={tempRef} className={`folder-item folder-item-${layer + 1}`}>
                <div className="folder-label"
                  style={{
                  borderRadius: '0.5rem',
                  paddingBlock: '0.1rem',
                  paddingLeft: `${layer}rem`
                }}
                >
                  <div className="position-relative d-flex justify-content-start align-items-start w-100 ps-3 pe-1 gap-2">
                    <div style={{flex: '0 0 auto', paddingRight: '0.2rem'}}><FontAwesomeIcon icon={faFolder} className="me-1 pt-1"/></div>
                    <div style={{flex: '1 1 auto', width: '100%'}}>
                      <input
                        autoFocus
                        value={tempFolder.name}
                        onChange={(e) => setTempFolder({ ...tempFolder, name: e.target.value })}
                        onKeyDown={async (e) => {
                          if (e.key === 'Enter') {
                            createFolderHandler(tempFolder.name, tempFolder.parent_id);
                          } else if (e.key === 'Escape') {
                            setTempFolder(node.id);
                          }
                        }}
                        placeholder="New folder"
                        style={{minWidth: '0rem', maxWidth: '30rem', width: '100%'}}
                      />
                      <div className='new-folder-confirmation-button-container'>
                        <button>Save</button>
                        <button>Cancel</button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          )}

          {/* Render children recursively */}
          {node.children.length > 0 && (
            <FolderTree
              createFolderHandler={createFolderHandler}
              tree={node.children}
              setCurrentFolderID={setCurrentFolderID}
              currentFolderID={currentFolderID}
              layer={layer + 1}
              currentFolderIDOptionsClicked={currentFolderIDOptionsClicked}
              setCurrentFolderIDOptionsClicked={setCurrentFolderIDOptionsClicked}
              tempFolder={tempFolder}
              setTempFolder={setTempFolder}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export const Sidebar = ({ albumId, currentFolderID, setCurrentFolderID }) => {
  const [currentFolderIDOptionsClicked, setCurrentFolderIDOptionsClicked] = useState(null);
  const [folderTree, setFolderTree] = useState([]);
  const [tempFolder, setTempFolder] = useState(null);
  const rootTempRef = useRef(null); // ✅ define ref once here
  const sidebarRef = useRef(null);

  useEffect(() => {
    const fetchFolders = async () => {
      if (albumId) {
        const folder_structure_downloaded = await getFolderStructureByAlbumID(albumId);
        console.log(folder_structure_downloaded)
        setFolderTree(buildTree(folder_structure_downloaded));
        setCurrentFolderID(folder_structure_downloaded.length > 0 ? folder_structure_downloaded[0].id : null);
      }
    };
    fetchFolders();
  }, [albumId, setCurrentFolderID]);

  useEffect(() => {
    if (rootTempRef.current) {
      rootTempRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [tempFolder]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setCurrentFolderIDOptionsClicked(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const createFolderHandler = async (folder_name, parent_folder_id) => {
    const {statusCode, body} = await createFolderAPI(albumId, folder_name, parent_folder_id);
    const folders = body.folders
    setFolderTree(buildTree(folders));
    setCurrentFolderID(folders.length > 0 ? folders[0].id : null);
    setTempFolder(null);
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
      <div ref={sidebarRef}>
        <FolderTree
          createFolderHandler={createFolderHandler}
          tree={folderTree}
          setCurrentFolderID={setCurrentFolderID}
          currentFolderID={currentFolderID}
          layer={0}
          currentFolderIDOptionsClicked={currentFolderIDOptionsClicked}
          setCurrentFolderIDOptionsClicked={setCurrentFolderIDOptionsClicked}
          tempFolder={tempFolder}
          setTempFolder={setTempFolder}
        />
      </div>

      {/* ✅ Use ref here safely */}
      {tempFolder && tempFolder.parent_id === null && (
        <ul className="folder-tree folder-tree-no-vertical-line ps-1 pe-1">
          <li ref={rootTempRef} className="folder-item folder-item-0 ps-3 pe-1">
            <div className="position-relative folder-label d-flex justify-content-start align-items-start gap-2">
              <div style={{flex: '0 0 auto', paddingRight: '0.2rem'}}><FontAwesomeIcon icon={faFolder} /></div>
              <div className='position-relative' style={{
                flex: '1 1 auto', minWidth: '0', overflow: 'hidden'
              }}>
                <input
                  autoFocus
                  value={tempFolder.name}
                  onChange={(e) => setTempFolder({ ...tempFolder, name: e.target.value })}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                      createFolderHandler(tempFolder.name, null);
                    } else if (e.key === 'Escape') {
                      setTempFolder(null);
                    }
                  }}
                  placeholder="New folder"
                  style={{'minWidth': '0rem', 'maxWidth': '30rem', width: '100%'}}
                />
                <div className='new-folder-confirmation-button-container'>
                  <button>Save</button>
                  <button>Cancel</button>
                </div>
              </div>
            </div>
          </li>
        </ul>
      )}

      <div className='p-2'>
        <button
          className='w-100 text-white bg-dark rounded'
          onClick={() => setTempFolder({ parent_id: null, name: '', layer: 0 })}
        >
          + New Folder
        </button>
      </div>
    </div>
  );
};

