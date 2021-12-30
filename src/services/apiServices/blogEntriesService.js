import Send from './_apiServiceConfig';

const url = 'blogEntries';

const BlogEntriesService = {
    GetPage: (page, search, status, from, to) => Send('get', `${url}/page/${page}/${search || ' '}/${status || ' '}/${from || ' '}/${to || ' '}/`),
    Get: (id) => Send('get', `${url}/${id}`),
    Edit: (id, element) => { element.id = id; return Send('put', `${url}/${id}`, element); },
    Create: (element) => Send('post', url, element),
    Delete: (id) => Send('delete', `${url}/${id}`)
}

export default BlogEntriesService;