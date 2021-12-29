import Send from './_apiServiceConfig';

const url = 'login';

const LoginService = {
    Login: (credentials) => Send('post', url, credentials),
    IsValidToken: () => Send('get', url)
}

export default LoginService;