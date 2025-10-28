import album_thumbnail_1 from '../../assets/dummy/album_thumbnail_1.jpg'
import album_thumbnail_2 from '../../assets/dummy/album_thumbnail_2.jpg';
import album_thumbnail_3 from '../../assets/dummy/album_thumbnail_3.jpg';
import album_thumbnail_4 from '../../assets/dummy/album_thumbnail_4.jpeg';

// Dummy
import chart_img from '../../assets/dummy/chart.png'

import img01 from '../../assets/dummy/album/environment/IMG0001.jpg'
import img02 from '../../assets/dummy/album/environment/IMG0002.jpg'
import img03 from '../../assets/dummy/album/environment/IMG0003.jpeg'
import img04 from '../../assets/dummy/album/environment/IMG0004.jpg'
import img05 from '../../assets/dummy/album/environment/IMG0005.jpg'
import img06 from '../../assets/dummy/album/environment/IMG0006.jpg'

import img07 from '../../assets/dummy/album/group/IMG0007.jpeg'
import img08 from '../../assets/dummy/album/group/IMG0008.jpeg'
import img09 from '../../assets/dummy/album/group/IMG0009.jpeg'
import img10 from '../../assets/dummy/album/group/IMG0010.jpeg'
import img11 from '../../assets/dummy/album/group/IMG0011.jpeg'
import img12 from '../../assets/dummy/album/group/IMG0012.jpeg'
import img13 from '../../assets/dummy/album/group/IMG0013.jpeg'
import img14 from '../../assets/dummy/album/group/IMG0014.jpeg'

import img15 from '../../assets/dummy/album/portrait/IMG0015.jpeg'
import img16 from '../../assets/dummy/album/portrait/IMG0016.jpeg'
import img17 from '../../assets/dummy/album/portrait/IMG0017.jpeg'
import img18 from '../../assets/dummy/album/portrait/IMG0018.jpeg'
import img19 from '../../assets/dummy/album/portrait/IMG0019.jpeg'

import img20 from '../../assets/dummy/album/ceremony/welcome/IMG0020.jpeg'
import img21 from '../../assets/dummy/album/ceremony/welcome/IMG0021.jpeg'
import img22 from '../../assets/dummy/album/ceremony/welcome/IMG0022.jpeg'
import img23 from '../../assets/dummy/album/ceremony/welcome/IMG0023.jpg'

import img24 from '../../assets/dummy/album/ceremony/vow/IMG0024.jpeg'
import img25 from '../../assets/dummy/album/ceremony/vow/IMG0025.jpeg'
import img26 from '../../assets/dummy/album/ceremony/vow/IMG0026.jpeg'
import img27 from '../../assets/dummy/album/ceremony/vow/IMG0027.jpg'
import img28 from '../../assets/dummy/album/ceremony/vow/IMG0028.jpeg'
import { useSharedContext } from '../../SharedContext';
import { now } from '../../utils/common';
import { apiGateway, POST } from '../apiMaster';

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

export const getFolderStructureByAlbumID = (albumID) => {
    const dummy_folder_structure = [
    {
        "id": 1,
        "name": "Environment",
        "type": "folder",
        "parent_id": null,
        "album_id": 101,
        "created_at": "2023-01-01"
    },
    {
        "id": 2,
        "name": "Group Photos",
        "type": "folder",
        "parent_id": null,
        "album_id": 101,
        "created_at": "2023-01-02"
    },
    {
        "id": 3,
        "name": "Portrait",
        "type": "folder",
        "parent_id": null,
        "album_id": 101,
        "created_at": "2023-01-02"
    },
    {
        "id": 4,
        "name": "Ceremony Photos",
        "type": "folder",
        "parent_id": null,
        "album_id": 101,
        "created_at": "2023-01-03"
    },
    {
        "id": 5,
        "name": "Vows",
        "type": "folder",
        "parent_id": 4,
        "album_id": 101,
        "created_at": "2023-01-04"
    },
    {
        "id": 6,
        "name": "Welcome",
        "type": "folder",
        "parent_id": 4,
        "album_id": 101,
        "created_at": "2023-01-04"
    },
    {
        "id": 7,
        "name": "Readings",
        "type": "folder",
        "parent_id": 4,
        "album_id": 101,
        "created_at": "2023-01-04"
    },
    {
        "id": 8,
        "name": "Testing",
        "type": "folder",
        "parent_id": 7,
        "album_id": 101,
        "created_at": "2023-01-04"
    },
    {
        "id": 9,
        "name": "Trial",
        "type": "folder",
        "parent_id": 4,
        "album_id": 101,
        "created_at": "2023-01-04"
    }
    ]

    if (['1234', '2345', '3456', '4567'].includes(albumID)) {
        return dummy_folder_structure
    } else {
        return []
    }
}

export const getAllImagesByFolderID = (folderID) => {
    const dummy_images_by_folderID = {
        1: [img01,img02,img03,img04,img05,img06],
        2: [img07,img08,img09,img10,img11,img12,img13,img14],
        3: [img15,img16,img17,img18,img19],
        5: [img24,img25,img26,img27,img28],
        6: [img20,img21,img22,img23]
    }
    const images = dummy_images_by_folderID[folderID]
    return images
}

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const insertAlbum = async (form_data, user, studio_id) => {
  let base64Thumbnail = null;
  if (form_data.thumbnail) {
    base64Thumbnail = await fileToBase64(form_data.thumbnail);
  }

  const request_body = {
    title: form_data.album_title,
    description: form_data.album_description,
    is_public: false,
    studio_id: studio_id,
    created_at: now(),
    updated_at: now(),
    published_at: null,
    created_by_id: user.id,
    event_date: form_data.photo_shoot_date,
    event_location: form_data.photo_shoot_location,
    photographers: form_data.photographers,
    thumbnail: base64Thumbnail,
    client_first_name: form_data.client_first_name,
    client_last_name: form_data.client_last_name,
    client_email: form_data.client_email,
    client_phone: form_data.client_phone,
  };

  const { statusCode, body } = await apiGateway(POST, '/core/create_album/', request_body);
//   console.log(body)
  return {statusCode, body}
};

export const getAlbumMetadataByAlbumID = async (album_id) => {
    const request_body = {album_id: album_id}
    const { statusCode, body } = await apiGateway(POST, '/core/get_album_metadata/', request_body);
    return {statusCode, body}
}