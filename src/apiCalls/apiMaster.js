export const POST      = 'POST';
export const GET       = "GET";

const serverUrl = 'http://127.0.0.1:8000';

export const apiGateway = async (method, endPoint, requestBody) => {
    const response = await fetch(serverUrl + endPoint, {
        method: method,
        mode: 'cors',
        headers: { 
            'Content-Type': 'application/json'},
        body: (method !== GET)? JSON.stringify(requestBody): null
    })
    const statusCode = await response.status
    const body = await response.json();
    const apiResult = {statusCode, body}
    return apiResult;
}