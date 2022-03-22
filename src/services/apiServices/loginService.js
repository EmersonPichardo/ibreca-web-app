import Send from './_apiServiceConfig';

const url = 'login';

const LoginService = {
    Login: async (credentials) => await Send('post', url, credentials),
    IsValidToken: async () => await Send('get', url)
}

export default LoginService;