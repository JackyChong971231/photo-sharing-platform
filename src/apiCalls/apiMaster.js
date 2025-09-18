export const POST      = 'POST';
export const GET       = "GET";

// const serverUrl = process.env.REACT_APP_SERVER_IP || 'http://137.184.166.60:8080';
// const serverUrl = process.env.REACT_APP_SERVER_IP || 'http://localhost:8080';
// const serverUrl = 'http://localhost:8080';
const serverUrl = 'https://89tdcn1l68.execute-api.us-east-2.amazonaws.com';

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