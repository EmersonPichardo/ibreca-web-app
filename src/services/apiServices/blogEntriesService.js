import Send from './_apiServiceConfig';

const url = 'blogEntries';

const BlogEntriesService = {
    GetAll: () => Send('get', url),
    Get: (id) => Send('get', url, id),
    Edit: (id, element) => { element.id = id; return Send('put', url, element); },
    Create: (element) => Send('post', url, element),
    Delete: (id) => Send('delete', url, id)
}

export default BlogEntriesService;