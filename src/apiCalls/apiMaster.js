export const POST      = 'POST';
export const GET       = "GET";
export const PUT       = "PUT";
export const DELETE    = "DELETE"

const serverUrl = 'http://127.0.0.1:8000';

export const apiGateway = async (method, endPoint, requestBody) => {
    let options = {
        method: method,
        mode: 'cors',
    };

    // Determine if the body is FormData
    if (method !== 'GET' && requestBody) {
        if (requestBody instanceof FormData) {
            options.body = requestBody;
            // Do NOT set Content-Type, browser will set it automatically
        } else {
            options.headers = { 'Content-Type': 'application/json' };
            options.body = JSON.stringify(requestBody);
        }
    }

    const response = await fetch(serverUrl + endPoint, options);
    const statusCode = response.status;
    const body = await response.json();
    return { statusCode, body };
};


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