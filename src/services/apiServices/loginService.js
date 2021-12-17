import Send from './_apiServiceConfig';

const url = 'login';

const LoginService = {
    Login: (credentials) => Send('post', url, credentials)
}

export default LoginService;