import { apiGateway, GET, POST } from "../apiMaster"

export const getAllPhotographersByStudio = async (studio_id) => {
    const {statusCode, body} = await apiGateway(POST, `/core/studios/${studio_id}/staff/`)
    return body
}

export const getMetadataByStudioID = async (studioID) => {
    const { statusCode, body } = await apiGateway(
      GET,
      `/core/studios/${studioID}/dashboard`
    );

    if (statusCode !== 200 || !body) return [];


    return { statusCode, body }
}

export const getStudios = async () => {
    try {
        const { statusCode, body } = await apiGateway(GET, `/core/studios/all/`)
        if (statusCode === 200 && Array.isArray(body)) {
            return body
        } else {
            console.warn('Failed to fetch studios or empty response')
            return []
        }
    } catch (error) {
        console.error('Error fetching studios:', error)
        return []
    }
}