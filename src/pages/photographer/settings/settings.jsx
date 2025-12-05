import React, { useEffect, useState, useReducer } from 'react';
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons"
import { useSharedContext } from '../../../SharedContext';

import './settings.css'
import { MyProfile } from './myProfile';
import { Security } from './security';
import { fetchUserInfoLong } from '../../../apiCalls/photographer/authService';

// Initial state for user info
const initialUserInfoLongTemp = {
    id: null,
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    profile_picture: null,
    short_bio: '',
    created_at: null,
    updated_at: null,
    studios: []
};

// Reducer function
const userInfoLongTempReducer = (state, action) => {
    switch(action.type) {
        case 'SET_USER_INFO':
            return { ...state, ...action.payload };
        case 'UPDATE_FIELD':
            return { ...state, [action.field]: action.value };
        case 'ADD_STUDIO':
            return { ...state, studios: [...state.studios, action.studio] };
        case 'REMOVE_STUDIO':
            return { ...state, studios: state.studios.filter(s => s.id !== action.studioId) };
        case 'RESET':
            return initialUserInfoLongTemp;
        default:
            return state;
    }
}

export const Settings = () => {
    const [userInfoLongTemp, dispatchUserInfoLongTemp] = useReducer(userInfoLongTempReducer, initialUserInfoLongTemp);
    const [currentPage, setCurrentPage] = useState("profile"); // store page type as string
    const { logout, decodedToken } = useSharedContext();
    const navigate = useNavigate();

    const logoutHandler = () => {
        logout();
        navigate('/')
    }

    useEffect(() => {
        const loadUserInfo = async () => {
            try {
                const { statusCode, body } = await fetchUserInfoLong(decodedToken.id);
                if (statusCode === 200) {
                    console.log(body)
                    dispatchUserInfoLongTemp({ type: 'SET_USER_INFO', payload: body });
                } else {
                    console.error("Failed to fetch user info:", body);
                }
            } catch (error) {
                console.error("Error loading user info:", error);
            }
        }
        loadUserInfo();
    }, []);

    const renderCurrentPage = () => {
        switch(currentPage) {
            case "profile":
                return <MyProfile userInfoLongTemp={userInfoLongTemp} dispatchUserInfoLongTemp={dispatchUserInfoLongTemp} />;
            case "security":
                return <Security userInfoLongTemp={userInfoLongTemp} dispatchUserInfoLongTemp={dispatchUserInfoLongTemp} />;
            default:
                return null;
        }
    }
    
    return (
        <div className='p-4 d-flex flex-column'
        style={{height: '100vh'}}>
        <h2 className='pb-2 flex-shrink-0'>Account Settings</h2>
        
        <div className='photographer-setting-container-outer' style={{flex: '1 1 auto', overflow: 'hidden'}}>
            <div className='photographer-setting-container' style={{height: '100%', overflow: 'hidden'}}>
            <div className='position-relative d-flex w-100 flex-row h-100'>
                
                <div className='photographer-settings-bar' style={{flex: '0 0 auto'}}>
                <p onClick={() => setCurrentPage("profile")}>My Profile</p>
                <p onClick={() => setCurrentPage("security")}>Security</p>
                <button onClick={logoutHandler}>Sign Out</button>
                </div>

                <div className="divider" style={{
                cursor: "col-resize",
                padding: '1rem',
                flex: '0 0 auto'
                }}>
                <div style={{
                    width: 1,
                    background: "#ccc",
                    height: '100%'
                }}/>
                </div>

                <div className='photographer-settings-content' style={{
                flex: '1 1 auto',
                overflow: 'auto'
                }}>
                {renderCurrentPage()}
                </div>

            </div>
            </div>
        </div>
        </div>
    )
}