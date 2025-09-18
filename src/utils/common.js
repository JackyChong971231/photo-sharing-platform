import { useSharedContext } from "../SharedContext";

import nightIcon from '../assets/images/timeslotsIcon/night1.png'
import noonIcon from '../assets/images/timeslotsIcon/noon.png'
import morningIcon from '../assets/images/timeslotsIcon/morning.png'

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const timeslots = {
    'Morning': {icon: morningIcon, unit: 'AM', 
        sessions: [
            "7:00:00","8:00:00","9:00:00","10:00:00","11:00:00"]},
    'Afternoon': {icon: noonIcon, unit: 'PM', 
        sessions: [
            "12:00:00","13:00:00","14:00:00","15:00:00","16:00:00","17:00:00"]},
    'Evening': {icon: nightIcon, unit: 'PM', 
        sessions: [
            "18:00:00","19:00:00","20:00:00","21:00:00","22:00:00","23:00:00","0:00:00","1:00:00","2:00:00","3:00:00","4:00:00","5:00:00","6:00:00"]},
}

export const isSessionStartTimeBetweenCenterOpeningHours = (targetTime, startTime, endTime) => {
    // Convert time strings to Date objects for easy comparison
    const toDate = (timeStr) => {
        const [hours, minutes, seconds] = timeStr.split(":").map(Number);
        return new Date(2000, 0, 1, hours, minutes, seconds); // Arbitrary date
    };

    const target = toDate(targetTime);
    const start = toDate(startTime);
    const end = toDate(endTime);

    // Check if targetTime is within the range
    return target >= start && target < end;
}

export async function sha256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);                    

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    // TODO: add ssl cert for the website (i.e. https) to use the above function

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string                  
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

export function navigate(href) {
    window.location.href = href
}

export const starRatingGenerator = (rating) => {
    if (rating !== null) {
        let starRatingContainer = [];
        let tempRating = rating;
        for (let i=0; i<5; i++) {
            if (tempRating >= 1) {
                starRatingContainer.push(<svg focusable="false" viewBox="0 0 24 24" className="plp-svg-icon plp-rating__star plp-rating__star--filled" aria-hidden="true"><path d="m12 6 2.1245 3.6818 4.1255.9018-2.8125 3.1773L15.8627 18 12 16.2818 8.1373 18l.4252-4.2391L5.75 10.5836l4.1255-.9018L12 6z"></path></svg>)
            } else if (tempRating >= 0 && tempRating < 1) {
                starRatingContainer.push(<svg focusable="false" viewBox="0 0 24 24" className="plp-svg-icon plp-rating__star plp-rating__star--half-filled" aria-hidden="true"><path d="M12 6v10.2818L8.1373 18l.4252-4.2391L5.75 10.5836l4.1255-.9018L12 6z"></path><path d="m12 6 2.1245 3.6818 4.1255.9018-2.8125 3.1773L15.8627 18 12 16.2818V6z" fill="rgb(var(--colour-neutral-3, 223, 223, 223))"></path></svg>)
            } else if (tempRating <= 0) {
                starRatingContainer.push(<svg focusable="false" viewBox="0 0 24 24" className="plp-svg-icon plp-rating__star plp-rating__star--empty" aria-hidden="true"><path d="m12 6 2.1245 3.6818 4.1255.9018-2.8125 3.1773L15.8627 18 12 16.2818 8.1373 18l.4252-4.2391L5.75 10.5836l4.1255-.9018L12 6z" fill="rgb(var(--colour-neutral-3, 223, 223, 223))"></path></svg>)
            }
            tempRating -= 1;
        }
        return starRatingContainer
    } else {
        return null
    }
}

export const converPrice2String = (priceInt) => {
    let priceStr = priceInt.toFixed(2).split('.');
    return priceStr
}

export const daysDifference = (startDate, endDate) => {
    const millisecondsDiff = endDate.getTime() - startDate.getTime()
    const daysDiff = Math.round(millisecondsDiff / (1000 * 3600 * 24))
    // console.log(daysDiff)
    return daysDiff
}

export const dateToString = (date) => {
    if (date === '') {return ''}
    const thisMonth = months[date.getMonth()].slice(0,3);
    const thisDate = date.getDate();
    const thisYear = date.getFullYear();
    return thisMonth + ' ' + thisDate + ', ' + thisYear
}

export const dateToYYYYMMDD = (date) => {
    if (date === '') {return ''}
    let thisMonth = (date.getMonth()+1).toString();
    if (thisMonth.length === 1) {thisMonth = '0'+thisMonth}
    let thisDate = date.getDate().toString();
    if (thisDate.length === 1) {thisDate = '0'+thisDate}
    let thisYear = date.getFullYear().toString();
    // console.log(thisMonth, thisMonth, thisDate);
    return `${thisYear}${thisMonth}${thisDate}`;
}

export const dateToYYYY_MM_DD = (date) => { // to 2023-03-20
    if (date === '') {return ''}
    let thisMonth = (date.getMonth()+1).toString();
    if (thisMonth.length === 1) {thisMonth = '0'+thisMonth}
    let thisDate = date.getDate().toString();
    if (thisDate.length === 1) {thisDate = '0'+thisDate}
    let thisYear = date.getFullYear().toString();
    // console.log(thisMonth, thisMonth, thisDate);
    return `${thisYear}-${thisMonth}-${thisDate}`;
}

export const parseJwt = (token) => {
    // console.log(token)
    if (token === "") {return {}}
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // Decode base64 string
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
    console.log(JSON.parse(jsonPayload))
    return JSON.parse(jsonPayload);
}

export const get_current_dateTime = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDateTime
}