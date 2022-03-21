import Send from './_apiServiceConfig';
import Upload from '../cloudinaryService';

const url = 'announcements';

const AnnouncementsService = {
    GetPage: (page, search) => Send('get', `${url}/page/${page}/${search || ' '}/`),
    Get: (id) => Send('get', `${url}/${id}`),
    Edit: (id, element) => { element.id = id; return Send('put', `${url}/${id}`, element); },
    Create: (element) => Send('post', url, element),
    Delete: (id) => Send('delete', `${url}/${id}`),
    UploadImage: async (file) => await (await Upload(file, 'ibreca/announcements')).json()
}

export default AnnouncementsService;