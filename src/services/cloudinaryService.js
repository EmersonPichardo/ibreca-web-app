const uploadUrlTemplate = process.env.REACT_APP_CLOUDINARY_UPLOAD_URL;
const cloudname = process.env.REACT_APP_CLOUDINARY_CLOUDNAME;
const preset = process.env.REACT_APP_CLOUDINARY_PRESET;

export default async function Upload(file, folderPath) {
    let fullUploadUrl = uploadUrlTemplate.replace('${cloudName}', cloudname);
    let formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', preset);
    formData.append('folder', folderPath);

    const config = { method: 'post', body: formData };
    const response = await fetch(fullUploadUrl, config);
    const jsonResult = await response.json();
    const result = { isOk: response.ok, data: jsonResult };

    return result;
}