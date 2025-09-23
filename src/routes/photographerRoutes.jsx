import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPhone, faEnvelope, faLock, faShieldHalved, faEarthAmericas, faCircleQuestion, faCircleInfo, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { useSharedContext } from '../SharedContext';
import PhotographerLayout from '../layout/photographerLayout';
import { Route, Routes } from 'react-router-dom';
import { Dashboard } from '../pages/photographer/dashboard/dashboard';
import { Album } from '../pages/photographer/album/album';
import { CreateAlbum } from '../pages/photographer/createAlbum/createAlbum';
import { Settings } from '../pages/photographer/settings/settings';


export const PhotographerRoutes = () => {
    return (
        <PhotographerLayout>
            <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path='/album/:albumId' element={<Album />} />
                <Route path='/create-album' element={<CreateAlbum />} />
                <Route path='/settings' element={<Settings />} />
            </Routes>
        </PhotographerLayout>
        
    )
}