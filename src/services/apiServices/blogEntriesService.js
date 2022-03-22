import Send from './_apiServiceConfig';
import Upload from '../cloudinaryService';

const url = 'blogEntries';

const BlogEntriesService = {
    GetPage: async (page, search, status, from, to) => await Send('get', `${url}/page/${page}/${search || ' '}/${status || ' '}/${from || ' '}/${to || ' '}/`),
    Get: async (id) => await Send('get', `${url}/${id}`),
    Edit: async (id, element) => { element.id = id; return await Send('put', `${url}/${id}`, element); },
    Create: async (element) => await Send('post', url, element),
    Delete: async (id) => await Send('delete', `${url}/${id}`),
    UploadImage: async (file) => await Upload(file, 'ibreca/blogentries')
}

export default BlogEntriesService;