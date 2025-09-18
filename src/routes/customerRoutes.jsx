import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPhone, faEnvelope, faLock, faShieldHalved, faEarthAmericas, faCircleQuestion, faCircleInfo, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { useSharedContext } from '../SharedContext';
import { AlbumClient } from '../pages/albumClient';
import useRouteParams from '../hooks/useRouteParams';


export const CustomerRoutes = () => {
    const {dummyStr, setDummyStr} = useSharedContext();

    return (
        <div>
            <Routes>
                <Route path='/album/:albumId' element={<AlbumClient />} />
            </Routes>
        </div>
        
    )
}