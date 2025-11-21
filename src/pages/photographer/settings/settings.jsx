import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons"
import { useSharedContext } from '../../../SharedContext';

import './settings.css'
import { MyProfile } from './myProfile';
import { Security } from './security';


export const Settings = () => {
    const [currentPage, setCurrentPage] = useState(<MyProfile />)
    const { logout } = useSharedContext();
    const navigate = useNavigate();

    const logoutHandler = () => {
        logout();
        navigate('/')
        console.log('asdsdfasdf')
    }

    return (
        <div className='p-4 h-100 d-flex flex-column'>
            <h2>Account Settings</h2>
            <div className='photographer-setting-container-outer'>
                <div className='photographer-setting-container'>
                    <div className='d-flex w-100'>
                        <div className='photographer-settings-bar'>
                            <p onClick={() => {setCurrentPage(<MyProfile />)}}>My Profile</p>
                            <p onClick={() => {setCurrentPage(<Security />)}}>Security</p>
                            <p>Notifications</p>
                            <p>Billing</p>
                            <p>Data Export</p>
                            <button onClick={logoutHandler}>Sign Out</button>
                        </div>
                        {/* Divider */}
                        <div
                            className="divider"
                            style={{
                                cursor: "col-resize",
                                paddingInline: '1rem',
                            }}
                        >
                            <div 
                                className="divider"
                                style={{
                                    width: 1,
                                    background: "#ccc",
                                    height: '100%'
                                }}
                            />
                        </div>
                        <div className='photographer-settings-content'>
                            {currentPage}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}