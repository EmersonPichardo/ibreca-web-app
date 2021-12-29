import Send from './_apiServiceConfig';

const url = 'login';

const LoginService = {
    Login: (credentials) => Send('post', url, credentials),
    IsValidToken: (token) => Send('get', url, undefined, { token })
}

export default LoginService;