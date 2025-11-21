import { useSharedContext } from '../../SharedContext';
import { now } from '../../utils/common';
import { apiGateway, apiGatewayFile, GET, POST, DELETE } from '../apiMaster';



export const getAllAlbumsByStudioID = async (studioID) => {

    if (!studioID) return [];

    const { statusCode, body } = await apiGateway(
      GET,
      `/core/albums/studio/${studioID}`
    );

    if (statusCode !== 200 || !body.albums) return [];

    console.log(body);

    return { statusCode, body }
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

  let base64CoverPhoto = null;
  if (form_data.cover_photo) {
    base64CoverPhoto = await fileToBase64(form_data.cover_photo);
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
    cover_photo: base64CoverPhoto,
    client_first_name: form_data.client_first_name,
    client_last_name: form_data.client_last_name,
    client_email: form_data.client_email,
    client_phone: form_data.client_phone,
  };

  const { statusCode, body } = await apiGateway(POST, '/core/albums/create/', request_body);
//   console.log(body)
  return {statusCode, body}
};

export const getAlbumMetadataByAlbumID = async (album_id) => {
    const request_body = {album_id: album_id}
    const { statusCode, body } = await apiGateway(
      POST, 
      `/core/albums/${album_id}/metadata/`, 
      request_body
    );
    return {statusCode, body}
}

export const deleteAlbumByID = async (album_id) => {
  if (!album_id) {
    throw new Error("album_id is required to delete an album");
  }

  try {
    const { statusCode, body } = await apiGateway(
      DELETE,
      `/core/albums/${album_id}/delete/`
    );

    return { statusCode, body };
  } catch (error) {
    console.error("Error deleting album:", error);
    return {
      statusCode: error?.statusCode ?? 500,
      body: error?.body ?? "Unexpected error"
    };
  }
};

export const setAlbumVisibility = async (album_id, is_public) => {
  if (!album_id) throw new Error("album_id is required");
  
  const request_body = { is_public };

  const { statusCode, body } = await apiGateway(
    POST,
    `/core/albums/${album_id}/visibility/`,
    request_body
  );

  return { statusCode, body };
};