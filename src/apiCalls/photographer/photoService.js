import { useSharedContext } from '../../SharedContext';
import { now } from '../../utils/common';
import { apiGateway, apiGatewayFile, GET, POST, DELETE } from '../apiMaster';

export const insertPhotos = async (albumId, folderId, uploadedBy, files) => {
  if (!albumId || !uploadedBy || !files || files.length === 0) {
    throw new Error("albumId, uploadedBy, and files are required");
  }

  const formData = new FormData();
  formData.append("album_id", albumId);
  if (folderId) formData.append("folder_id", folderId);
  formData.append("uploaded_by", uploadedBy);

  files.forEach((file) => {
    formData.append("photos", file); // can append multiple files under same key
  });

  const { statusCode, body } = await apiGatewayFile(
    POST,
    "/core/photos/upload/",
    formData
  );

  return { statusCode, body };
};

export const deletePhotos = async (photoIds) => {
  if (!photoIds || photoIds.length === 0) {
    throw new Error("photoIds array is required");
  }

  const request_body = { photo_ids: photoIds };

  const { statusCode, body } = await apiGateway(
    DELETE,
    "/core/photos/delete/",
    request_body,
  );

  return { statusCode, body };
};

export const getAllImagesByFolderID = async (folderId) => {
  if (!folderId) return [];

  const { statusCode, body } = await apiGateway(
    GET,
    `/core/photos/folder/${folderId}`
  );

  if (statusCode !== 200 || !body.photos) return [];

  // Return array of photo URLs
  // return body.photos.map(photo => photo.source);
  return body.photos;
};