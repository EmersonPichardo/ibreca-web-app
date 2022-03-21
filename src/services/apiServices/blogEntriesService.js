import Send from './_apiServiceConfig';
import Upload from '../cloudinaryService';

const url = 'blogEntries';

const BlogEntriesService = {
    GetPage: (page, search, status, from, to) => Send('get', `${url}/page/${page}/${search || ' '}/${status || ' '}/${from || ' '}/${to || ' '}/`),
    Get: (id) => Send('get', `${url}/${id}`),
    Edit: (id, element) => { element.id = id; return Send('put', `${url}/${id}`, element); },
    Create: (element) => Send('post', url, element),
    Delete: (id) => Send('delete', `${url}/${id}`),
    UploadImage: async (file) => await (await Upload(file, 'ibreca/announcements')).json()
}

export default BlogEntriesService;