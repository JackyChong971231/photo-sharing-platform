import { apiGateway, GET, POST } from "../apiMaster"

export const getAllPhotographersByStudio = async (studioID) => {
    const {statusCode, body} = await apiGateway(POST, '/core/studio/all_staff/', {studio_id: studioID})
    return body
}