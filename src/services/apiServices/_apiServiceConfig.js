const baseUrl = process.env.REACT_APP_API_URL;

export default function Send(method, url, body, headers) {
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        body: JSON.stringify(body)
    };

    return fetch(`${baseUrl}/${url}`, config);
}