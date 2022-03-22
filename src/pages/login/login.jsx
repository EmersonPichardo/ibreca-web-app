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

    const onFinish = async (values) => {
        setLoading(true);

        const returnWithErrorMessage = ({ status, title }) => {
            if (status === 404) message.error('Crendenciales incorrectas');
            else message.error(`${status}: ${title}`);
            setLoading(false);
        }

        const response = await LoginService.Login(values);
        const { data } = response;
        if (!response.isOk) { return returnWithErrorMessage(data); }

        setSesion(data);
        navigate(callbackRoute);
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