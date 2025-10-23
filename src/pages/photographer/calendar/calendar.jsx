import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

export const Calendar = () => {
    return (
        <div>
            <p>Calendar</p>
            <iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=Asia%2FHong_Kong&showPrint=0&src=amFja3lja3kzMUBnbWFpbC5jb20&src=ZmFtaWx5MTEwMzEzMzEyMDE2NTI3NDc0NTFAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=ZW4uaG9uZ19rb25nI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%23ff2968&color=%234285f4&color=%23009688" 
            style={{
                border:"solid 1px #777",
                width:"40rem",
                height:"30rem",
                frameborder:"0",
                scrolling:"no"
            }}></iframe>
        </div>
    )
}