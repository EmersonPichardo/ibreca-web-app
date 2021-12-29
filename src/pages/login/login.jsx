import { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";

import { Typography, Form, Input, Divider, Button, message } from 'antd';

import { SecurityContext } from '../../contexts/securityContext';
import LoginService from '../../services/apiServices/loginService';

import './login.css';

const { Title } = Typography;
const { Item } = Form;
const { Password } = Input;

export default function Login() {
    const { setSesion, logout, callbackRoute } = useContext(SecurityContext);
    let navigate = useNavigate();
    const [form] = Form.useForm();

    let [loading, setLoading] = useState(false);

    useEffect(() => { logout() }, []);

    const onFinish = (values) => {
        setLoading(true);

        LoginService.Login(values)
            .then(response => {
                if (response.ok) {
                    response.json().then(sesion => {
                        setSesion(sesion);
                        navigate(callbackRoute);
                    })
                } else {
                    response.json().then(error => {
                        if (error.status === 404) {
                            message.error('Crendenciales incorrectas');
                        } else {
                            message.error(`${error.status}: ${error.title}`);
                        }

                        setLoading(false);
                    })
                }
            })
            .catch((error) => {
                message.error(error.message);
                setLoading(false);
            });
    };

    return (
        <div className='login-form'>
            <Title level={3} style={{ marginBottom: '24px', textAlign: 'center' }}>Inicio de sesión</Title>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Item label="Correo" name="email"
                    rules={[
                        {
                            required: true,
                            message: 'Este campo es requerido'
                        }
                    ]}
                >
                    <Input disabled={loading} />
                </Item>

                <Item label="Contraseña" name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Este campo es requerido'
                        }
                    ]}
                >
                    <Password disabled={loading} />
                </Item>

                <Divider />

                <Item style={{ textAlign: 'center' }}>
                    <Button type="primary" size="large" htmlType="submit" loading={loading}>
                        Iniciar sesión
                    </Button>
                </Item>
            </Form>
        </div>
    )
}