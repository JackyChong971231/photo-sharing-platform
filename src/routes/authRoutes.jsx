import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPhone, faEnvelope, faLock, faShieldHalved, faEarthAmericas, faCircleQuestion, faCircleInfo, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { useSharedContext } from '../SharedContext';


export const AuthRoutes = () => {
    const {dummyStr, setDummyStr} = useSharedContext();

    return (
        <div>
            <p>Login the Photographer Account</p>
        </div>
        
    )
}