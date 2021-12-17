const baseUrl = process.env.REACT_APP_API_URL;

export default function Send(method, url, body) {
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };

    return fetch(`${baseUrl}/${url}`, config);
}