export const POST      = 'POST';
export const GET       = "GET";
export const DELETE    = "DELETE"

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

export const apiGatewayFile = async (method, endPoint, formData) => {
  // method should usually be POST for file uploads
  const response = await fetch(serverUrl + endPoint, {
    method: method,
    mode: 'cors',
    body: formData // DO NOT JSON.stringify
    // fetch automatically sets the correct multipart/form-data headers
  });

  const statusCode = response.status;
  const body = await response.json();
  return { statusCode, body };
};