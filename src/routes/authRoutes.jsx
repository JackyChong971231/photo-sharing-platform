import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate  } from 'react-router-dom';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPhone, faEnvelope, faLock, faShieldHalved, faEarthAmericas, faCircleQuestion, faCircleInfo, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { useSharedContext } from '../SharedContext';
import { Login } from '../pages/auth/login';
import { Signup } from '../pages/auth/signup';


export const AuthRoutes = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
            </Routes>
        </div>
        
    )
}