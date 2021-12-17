import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import { Row, Typography, Col, Form, Input, Affix, Button, message } from 'antd';
import { CloseCircleOutlined, SaveOutlined } from '@ant-design/icons';

import { PageContext } from '../../../contexts/pageContext';
import BlogEntriesService from '../../../services/apiServices/blogEntriesService';

import './blogEntriesForm.css';

const { Title } = Typography;
const { Item } = Form;

export default function BlogEntriesForm() {
    const { setCurrentPage } = useContext(PageContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    let [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) { setEditModeForm(id); }
        else { setLoading(false); }
    }, [])

    useEffect(() => {
        setCurrentPage({
            title: "Blog",
            subtitle: "Entradas",
            extra: [
                <Button key="cancel" icon={<CloseCircleOutlined />} danger ghost onClick={() => navigate(-1)}>
                    Cancelar
                </Button>,
                <Button key="submit" type="primary" size="large" icon={<SaveOutlined />} loading={loading} onClick={form.submit}>
                    Guardar
                </Button>
            ],
            onBack: () => navigate('/blog')
        });
    }, [loading]);

    const setEditModeForm = (id) => {
        BlogEntriesService.Get(id)
            .then(response => {
                response.json().then(data => {
                    if (response.ok) {
                        form.setFieldsValue(data);
                        setLoading(false);
                    } else {
                        message.error(data.title);
                    }
                })
            })
            .catch((error) => {
                message.error(error.message);
            });
    }

    const onFinish = (values) => {
        setLoading(true);

        (id ? BlogEntriesService.Edit(id, values) : BlogEntriesService.Create(values))
            .then(response => {
                if (response.ok) {
                    message.success('Cambios guardados');
                    navigate('/blog');
                } else {
                    console.log(response)
                    response.json().then(error => {
                        message.error(error.title);
                        setLoading(false);
                    })
                }
            })
            .catch((error) => {
                message.error(error.message);
                setLoading(false);
            });
    };

    return (<>
        <Affix target={() => document.getElementById('container')}>
            <Title level={4} className="form-title">{id ? 'Editar entrada' : 'Agregar entrada'}</Title>
        </Affix>

        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            style={{ marginTop: '48px' }}
        >
            <Row gutter={[32, 24]}>
                <Col span={8}>
                    <Item label="Título" name="title"
                        rules={[
                            {
                                required: true,
                                message: 'Este campo es requerido',
                            },
                        ]}
                        hasFeedback>
                        <Input disabled={loading} />
                    </Item>
                </Col>

                <Col span={8}>
                    <Item label="Cover" name="coverurl"
                        rules={[
                            {
                                required: true,
                                message: 'Este campo es requerido',
                            },
                        ]}
                        hasFeedback>
                        <Input disabled={loading} />
                    </Item>
                </Col>

                <Col span={8}>
                    <Item label="URL" name="headerurl"
                        rules={[
                            {
                                required: true,
                                message: 'Este campo es requerido',
                            },
                        ]}
                        hasFeedback>
                        <Input disabled={loading} />
                    </Item>
                </Col>

                <Col span={8}>
                    <Item label="Cuerpo" name="body"
                        rules={[
                            {
                                required: true,
                                message: 'Este campo es requerido',
                            },
                        ]}
                        hasFeedback>
                        <Input disabled={loading} />
                    </Item>
                </Col>

                <Col span={8}>
                    <Item label="Estado" name="status"
                        rules={[
                            {
                                required: true,
                                message: 'Este campo es requerido',
                            },
                        ]}
                        hasFeedback>
                        <Input disabled={loading} />
                    </Item>
                </Col>
            </Row>
        </Form>
    </>
    )
}