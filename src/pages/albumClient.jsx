import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPhone, faEnvelope, faLock, faShieldHalved, faEarthAmericas, faCircleQuestion, faCircleInfo, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { useSharedContext } from '../SharedContext';
import useRouteParams from '../hooks/useRouteParams';


export const AlbumClient = () => {
    const {dummyStr, setDummyStr} = useSharedContext();
    const { albumId } = useRouteParams(); // Extract 'albumId' from the URL

    return (
        <div>
            <p>Customer Album: {albumId}</p>
        </div>
        
    )
}