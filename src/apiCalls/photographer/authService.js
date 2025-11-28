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

export const userRegister = async (formData) => {
    try {
        // Create a FormData object to handle file upload
        const password_hash = await hashPassword(formData.password)
        const form = new FormData();
        form.append("first_name", formData.firstName);
        form.append("last_name", formData.lastName);
        form.append("email", formData.email);
        form.append("password_hash", password_hash);
        form.append("role", formData.isStudioMember ? "photographer" : "customer");

        if (formData.profilePicture)
            form.append("profile_picture", formData.profilePicture);

        if (formData.studioId)
            form.append("studio", formData.studioId);
        

        // Debug
        console.log("Submitting registration form:", form);

        // Call API
        const { statusCode, body } = await apiGateway(
        POST,
        '/core/auth/register/',
        form,
        {} // important for files
        );

        return { statusCode, body };

    } catch (err) {
        console.error("Error in userRegister:", err);
        return { statusCode: 500, body: { error: "Registration failed" } };
    }
};

export const fetchUserInfoShort = async (userId) => {
  try {
    if (!userId) throw new Error("userId is required");

    const { statusCode, body } = await apiGateway(
      GET,
      `/core/auth/userInfo/short/${userId}/`,
      null
    );

    return { statusCode, body };
  } catch (error) {
    console.error("Error in fetchUserInfoShort:", error);
    return { statusCode: 500, body: { error: "Failed to fetch user info" } };
  }
};