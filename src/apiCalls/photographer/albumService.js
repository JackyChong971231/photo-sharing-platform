import album_thumbnail_1 from '../../assets/dummy/album_thumbnail_1.jpg'
import album_thumbnail_2 from '../../assets/dummy/album_thumbnail_2.jpg';
import album_thumbnail_3 from '../../assets/dummy/album_thumbnail_3.jpg';
import album_thumbnail_4 from '../../assets/dummy/album_thumbnail_4.jpeg';

import chart_img from '../../assets/dummy/chart.png'

export const getMetadataByStudioID = (studioID) => {
    const dummy = [
        {
            title: 'Total Albums',
            value: '126',
            subtitle: 'Active client albums',
            graph: null
        },
        {
            title: 'Total Photos',
            value: '53,300',
            subtitle: 'Photos shared with clients',
            graph: null
        },
        {
            title: 'Total Clients',
            value: '72',
            subtitle: 'Clients',
            graph: null
        },
        {
            title: 'Total Photographers',
            value: '12',
            subtitle: 'Active photographers',
            graph: null
        },
        {
            title: 'Client Growth',
            value: '+30%',
            subtitle: 'Compared to last month',
            graph: chart_img
        },
    ]
    return dummy
}

export const getAllAlbumsByStudioID = (studioID) => {

    const dummy = [
        {
            name: 'Tom & Jerry',
            date: 'Aug 14, 2025',
            photo_count: 1235,
            thumbnail: album_thumbnail_1,
            albumId: 1234
        },
        {
            name: 'Konie & Thomas',
            date: 'May 16, 2025',
            photo_count: 562,
            thumbnail: album_thumbnail_2,
            albumId: 2345
        },
        {
            name: 'Jessica & Johnny',
            date: 'Feb 23, 2025',
            photo_count: 2347,
            thumbnail: album_thumbnail_3,
            albumId: 3456
        },
        {
            name: 'Sabrina & Alex',
            date: 'Dec 31, 2024',
            photo_count: 5673,
            thumbnail: album_thumbnail_4,
            albumId: 4567
        },
    ]
    return dummy
}