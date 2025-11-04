import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { getFolderStructureByAlbumID, createFolderAPI, deleteFolderByID, renameFolderAPI } from '../../apiCalls/photographer/albumService';

import './albumComponent.css';
import './sidebar.css';

export const buildTree = (data) => {
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
  deleteFolderHandler,
  tree,
  setCurrentFolderID,
  currentFolderID,
  layer,
  activeOptionsFolderId,
  setActiveOptionsFolderId,
  draftNewFolder,
  setDraftNewFolder,
  renameFolderHandler,
  folderBeingRenamed, 
  setFolderBeingRenamed,
  draftName,
  setDraftName
}) => {
  const tempRef = useRef(null);

  // Scroll temp folder into view
  useEffect(() => {
    if (tempRef.current) {
      tempRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [draftNewFolder]);

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
                  setActiveOptionsFolderId(null);
                }}
              >
                <FontAwesomeIcon icon={faFolder} className="me-1" />
                {folderBeingRenamed===node.id ? (
                <input
                  style={{ border: '1px solid gray', minWidth: '0rem', outline: 'none' }}
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  autoFocus
                  onBlur={async () => {
                    // Only rename if the user actually changed the name
                    if (draftName && folderBeingRenamed !== null) {
                      await renameFolderHandler(folderBeingRenamed, draftName);
                    }
                    setFolderBeingRenamed(null);
                    setDraftName('');
                  }}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                      // Call the renameFolderHandler with the current folder ID and new name
                      await renameFolderHandler(node.id, draftName);
                      // Clear the input state after renaming
                      setFolderBeingRenamed(null);
                      setDraftName('');
                    } else if (e.key === 'Escape') {
                      // Cancel renaming
                      setFolderBeingRenamed(null);
                      setDraftName('');
                    }
                  }}
                />
                ) : (
                  <span
                    className="text-truncate"
                    style={{
                      display: 'inline-block',
                      maxWidth: '100%',
                    }}
                  >
                    {node.name}
                  </span>

                )}
              </div>

              {/* Options (faEllipsis) */}
              <div className="ms-2" style={{ flexShrink: 0, position: 'relative' }}>
                <FontAwesomeIcon
                  role="button"
                  icon={faEllipsis}
                  onClick={() =>{
                    setActiveOptionsFolderId((prevFolderID) =>
                      prevFolderID === node.id ? null : node.id
                    )}
                  }
                />

                <div
                  className={`folder-option-menu ${
                    activeOptionsFolderId === node.id
                      ? 'folder-option-menu--show'
                      : 'folder-option-menu--hide'
                  }`}
                >
                  <ul className="folder-option-menu-ul">
                    <li>
                      <p
                        role="button"
                        onClick={() => {
                          setDraftName(node.name)
                          setFolderBeingRenamed(node.id);
                          setActiveOptionsFolderId(null);
                        }}
                      >
                        Rename
                      </p>
                    </li>
                    <li>
                      <p
                        role="button"
                        onClick={() => {
                          setDraftNewFolder({ parent_id: node.id, name: '', layer: layer + 1 });
                          setActiveOptionsFolderId(null);
                        }}
                      >
                        Create New Folder
                      </p>
                    </li>
                    <li>
                      <p role='button'
                      onClick={() => {
                        deleteFolderHandler(node.id);
                      }}>Delete</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Render temporary folder under this parent if exists */}
          {draftNewFolder && draftNewFolder.parent_id === node.id && (
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
                        value={draftNewFolder.name}
                        onChange={(e) => setDraftNewFolder({ ...draftNewFolder, name: e.target.value })}
                        onKeyDown={async (e) => {
                          if (e.key === 'Enter') {
                            createFolderHandler(draftNewFolder.name, draftNewFolder.parent_id);
                          } else if (e.key === 'Escape') {
                            setDraftNewFolder(node.id);
                          }
                        }}
                        placeholder="New folder"
                        style={{minWidth: '0rem', maxWidth: '30rem', width: '100%'}}
                      />
                      <div className='new-folder-confirmation-button-container'>
                        <button onClick={() => {createFolderHandler(draftNewFolder.name, draftNewFolder.parent_id);}}>Save</button>
                        <button onClick={() => {setDraftNewFolder(null);}}>Cancel</button>
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
              deleteFolderHandler={deleteFolderHandler}
              tree={node.children}
              setCurrentFolderID={setCurrentFolderID}
              currentFolderID={currentFolderID}
              layer={layer + 1}
              activeOptionsFolderId={activeOptionsFolderId}
              setActiveOptionsFolderId={setActiveOptionsFolderId}
              draftNewFolder={draftNewFolder}
              setDraftNewFolder={setDraftNewFolder}
              renameFolderHandler={renameFolderHandler}
              folderBeingRenamed={folderBeingRenamed}
              setFolderBeingRenamed={setFolderBeingRenamed}
              draftName={draftName}
              setDraftName={setDraftName}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

export const Sidebar = ({ albumId, currentFolderID, setCurrentFolderID, setFolderStructureArray }) => {
  const [folderTree, setFolderTree] = useState([]);
  const [activeOptionsFolderId, setActiveOptionsFolderId] = useState(null);
  const [draftNewFolder, setDraftNewFolder] = useState(null);
  const [folderBeingRenamed, setFolderBeingRenamed] = useState(null);
  const [draftName, setDraftName] = useState(null)
  const rootTempRef = useRef(null); // ✅ define ref once here
  const sidebarRef = useRef(null);

  useEffect(() => {
    const fetchFolders = async () => {
      if (albumId) {
        const folder_structure_downloaded = await getFolderStructureByAlbumID(albumId);
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
  }, [draftNewFolder]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setActiveOptionsFolderId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const createFolderHandler = async (folder_name, parent_folder_id) => {
    const {statusCode, body} = await createFolderAPI(albumId, folder_name, parent_folder_id);
    const folders = body.folders
    setFolderTree(buildTree(folders));
    setFolderStructureArray(folders)
    setCurrentFolderID(body.folder.id);
    setDraftNewFolder(null);
  }

  const deleteFolderHandler = async (folder_id) => {
    const {statusCode, body} = await deleteFolderByID(folder_id);
    setFolderTree(buildTree(body.folders));
    if (body.folder===currentFolderID) {setCurrentFolderID(body.folders[0].id)}
    setActiveOptionsFolderId(false);
  }

  const renameFolderHandler = async (folder_id, new_name) => {
    const { statusCode, body } = await renameFolderAPI(folder_id, new_name);
    if (statusCode === 200) {
      const folders = body.folders;
      setFolderTree(buildTree(folders));
      setFolderStructureArray(folders);
      setCurrentFolderID(folder_id);
    }
    setDraftNewFolder(null); // remove any input if active
    setActiveOptionsFolderId(null);
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
      <div ref={sidebarRef}>
        <FolderTree
          createFolderHandler={createFolderHandler}
          deleteFolderHandler={deleteFolderHandler}
          tree={folderTree}
          setCurrentFolderID={setCurrentFolderID}
          currentFolderID={currentFolderID}
          layer={0}
          activeOptionsFolderId={activeOptionsFolderId}
          setActiveOptionsFolderId={setActiveOptionsFolderId}
          draftNewFolder={draftNewFolder}
          setDraftNewFolder={setDraftNewFolder}
          renameFolderHandler={renameFolderHandler}
          folderBeingRenamed={folderBeingRenamed}
          setFolderBeingRenamed={setFolderBeingRenamed}
          draftName={draftName}
          setDraftName={setDraftName}
        />
      </div>

      {/* ✅ Use ref here safely */}
      {draftNewFolder && draftNewFolder.parent_id === null && (
        <ul className="folder-tree folder-tree-no-vertical-line ps-1 pe-1">
          <li ref={rootTempRef} className="folder-item folder-item-0 ps-3 pe-1">
            <div className="position-relative folder-label d-flex justify-content-start align-items-start gap-2">
              <div style={{flex: '0 0 auto', paddingRight: '0.2rem'}}><FontAwesomeIcon icon={faFolder} /></div>
              <div className='position-relative' style={{
                flex: '1 1 auto', minWidth: '0', overflow: 'hidden'
              }}>
                <input
                  autoFocus
                  value={draftNewFolder.name}
                  onChange={(e) => setDraftNewFolder({ ...draftNewFolder, name: e.target.value })}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                      createFolderHandler(draftNewFolder.name, null);
                    } else if (e.key === 'Escape') {
                      setDraftNewFolder(null);
                    }
                  }}
                  placeholder="New folder"
                  style={{'minWidth': '0rem', 'maxWidth': '30rem', width: '100%'}}
                />
                <div className='new-folder-confirmation-button-container'>
                  <button onClick={() => {createFolderHandler(draftNewFolder.name, null);}}>Save</button>
                  <button onClick={() => {setDraftNewFolder(null);}}>Cancel</button>
                </div>
              </div>
            </div>
          </li>
        </ul>
      )}

      <div className='p-2'>
        <button
          className='w-100 text-white bg-dark rounded'
          onClick={() => setDraftNewFolder({ parent_id: null, name: '', layer: 0 })}
        >
          + New Folder
        </button>
      </div>
    </div>
  );
};

