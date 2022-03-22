const baseUrl = process.env.REACT_APP_API_URL;

export default async function Send(method, url, body) {
    const getJsonFromText = (text) => {
        try {
            return JSON.parse(text);
        } catch (exception) {
            return { text, exception };
        }
    }

    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Token': JSON.parse(localStorage.getItem('sesion'))?.token
        },
        body: JSON.stringify(body)
    };

    const response = await fetch(`${baseUrl}/${url}`, config);
    const textResult = await response.text();
    const jsonResult = getJsonFromText(textResult);
    const result = { isOk: response.ok, data: jsonResult };

    return result;
}