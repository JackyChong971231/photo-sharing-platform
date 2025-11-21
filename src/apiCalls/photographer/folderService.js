import { useSharedContext } from '../../SharedContext';
import { now } from '../../utils/common';
import { apiGateway, apiGatewayFile, GET, POST, DELETE } from '../apiMaster';

export const getFolderStructureByAlbumID = async (album_id) => {
  try {
    const { statusCode, body } = await apiGateway(
      GET,
      `/core/folders/album/${album_id}/` // Django endpoint you defined
    );

    if (statusCode === 200 && Array.isArray(body)) {
      // Example expected structure:
      // [
      //   { id: 1, album_id: 3, parent_id: null, name: 'Main', created_at: ... },
      //   { id: 2, album_id: 3, parent_id: 1, name: 'Child', created_at: ... }
      // ]
      return body;
    } else {
      console.error('Unexpected folder structure response:', body);
      return [];
    }
  } catch (error) {
    console.error('Error fetching folder structure:', error);
    return [];
  }
};

export const createFolderAPI = async (album_id, name, parent_id) => {
    const request_body = {
        album_id: album_id,
        parent_id: parent_id || null,
        name: name,
        created_at: now(),
    };
    const { statusCode, body } = await apiGateway(POST, "/core/folders/create/", request_body);
    return { statusCode, body };
}

export const deleteFolderByID = async (folder_id) => {
  try {
    const { statusCode, body } = await apiGateway(
      DELETE,
      `/core/folders/${folder_id}/delete/`
    );

    return { statusCode, body };
  } catch (error) {
    // Inspect error structure
    console.error("Error deleting folder:", error);

    return {
      statusCode: error?.statusCode ?? 500,
      body: error?.body ?? "Unexpected error"
    };
  }
};

export const renameFolderAPI = async (folder_id, new_name) => {
  if (!folder_id || !new_name) {
    throw new Error("folder_id and new_name are required");
  }

  try {
    const request_body = {
      name: new_name,
      updated_at: now(),
    };

    const { statusCode, body } = await apiGateway(
      POST, // or PATCH if your backend prefers
      `/core/folders/${folder_id}/rename/`,
      request_body
    );

    return { statusCode, body };
  } catch (error) {
    console.error("Error renaming folder:", error);
    return {
      statusCode: error?.statusCode ?? 500,
      body: error?.body ?? "Unexpected error"
    };
  }
};