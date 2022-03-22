import Send from './_apiServiceConfig';
import Upload from '../cloudinaryService';

const url = 'announcements';

const AnnouncementsService = {
    GetPage: async (page, search) => await Send('get', `${url}/page/${page}/${search || ' '}/`),
    Get: async (id) => await Send('get', `${url}/${id}`),
    Edit: async (id, element) => { element.id = id; return await Send('put', `${url}/${id}`, element); },
    Create: async (element) => await Send('post', url, element),
    Delete: async (id) => await Send('delete', `${url}/${id}`),
    UploadImage: async (file) => await Upload(file, 'ibreca/announcements')
}

export default AnnouncementsService;