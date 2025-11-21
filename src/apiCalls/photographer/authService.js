import { apiGateway, GET, POST } from "../apiMaster"
import { hashPassword } from '../../utils/common';

export const userLogin = async (credentials) => {
    const email = credentials.email
    const password_hash = await hashPassword(credentials.password)


    const request_body = {
    email,
    password_hash: password_hash,
    }
    const {statusCode, body} = await apiGateway(POST, '/core/auth/login/', request_body)
    return {statusCode, body}
}