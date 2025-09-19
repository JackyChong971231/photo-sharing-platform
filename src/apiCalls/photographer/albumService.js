import album_thumbnail_1 from '../../assets/dummy/album_thumbnail_1.jpg'
import album_thumbnail_2 from '../../assets/dummy/album_thumbnail_2.jpg';
import album_thumbnail_3 from '../../assets/dummy/album_thumbnail_3.jpg';
import album_thumbnail_4 from '../../assets/dummy/album_thumbnail_4.jpeg';

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