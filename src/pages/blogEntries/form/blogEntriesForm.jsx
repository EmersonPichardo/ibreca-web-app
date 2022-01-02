import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import { Row, Col, Form, Input, Radio, Button, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';

import { PageContext } from '../../../contexts/pageContext';
import BlogEntriesService from '../../../services/apiServices/blogEntriesService';
import Player, { DefaultPlayer } from '../../../componets/player/player';
import ImageDisplayer, { CanDisplay } from '../../../componets/imagedisplayer/imagedisplayer';

import './blogEntriesForm.css';

const { Item } = Form;

export default function BlogEntriesForm() {
    const { setCurrentPage } = useContext(PageContext);
    const { id } = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [coverurl, setCoverurl] = useState();
    const [headerurl, setHeaderurl] = useState();
    const [body, setBody] = useState();

    useEffect(() => {
        setCurrentPage({
            breadcrumb: [
                { path: '/', breadcrumbName: 'Inicio' },
                { breadcrumbName: 'Blog' },
                { path: '/blog/entries', breadcrumbName: 'Entradas' },
                { breadcrumbName: `${id ? 'Editar' : 'Agregar'} entrada` }
            ],
            title: `${id ? 'Editar' : 'Agregar'} entrada`,
            extra: [
                <Button key="submit" type="primary" size="large" icon={<SaveOutlined />} loading={loading} onClick={form.submit}>
                    Guardar
                </Button>
            ],
            onBack: () => navigate('/blog/entries')
        });
    }, [loading]);

    useEffect(() => {
        if (id) { setEditModeForm(id); }
        else { setLoading(false); }
    }, [])

    const setEditModeForm = (id) => {
        BlogEntriesService.Get(id)
            .then(response => {
                response.json().then(data => {
                    if (response.ok) {
                        form.setFieldsValue(data);
                        setCoverurl(data.coverUrl);
                        setHeaderurl(data.headerUrl);
                        setBody(data.body);
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
        if (!body) return message.error("El cuerpo es requerido");

        setLoading(true);

        values.body = body;
        (id ? BlogEntriesService.Edit(id, values) : BlogEntriesService.Create(values))
            .then(response => {
                if (response.ok) {
                    message.success('Cambios guardados');
                    navigate('/blog/entries');
                } else {
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
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            initialValues={{
                status: 'private'
            }}
            validateMessages={{
                required: 'Este campo es requerido',
                string: {
                    max: 'Este campo debe tener menos de ${max} caracteres'
                }
            }}
        >
            <Row gutter={[32, 24]} justify="center" align="middle">
                <Col xs={24} md={14} lg={16} xl={18}>
                    <Item label="Título" name="title" rules={[{ required: true, max: 100 }]} hasFeedback>
                        <Input disabled={loading} />
                    </Item>
                </Col>

                <Col xs={24} md={10} lg={8} xl={6}>
                    <Item label="Estado" name="status" rules={[{ required: true }]}>
                        <Radio.Group buttonStyle="solid" disabled={loading}>
                            <Radio.Button danger ghost value="private">Privado</Radio.Button>
                            <Radio.Button value="public">Público</Radio.Button>
                        </Radio.Group>
                    </Item>
                </Col>

                <Col xs={24} sm={14} md={16} lg={17} xl={7}>
                    <Item label="Cover" name="coverUrl"
                        rules={[
                            { required: true },
                            { max: 256 },
                            {
                                validator: (_, value) => {
                                    if (!value) return Promise.resolve();
                                    return CanDisplay(value)
                                        .then(
                                            () => Promise.resolve(),
                                            () => Promise.reject('Imagen no encontrada')
                                        );
                                }
                            }
                        ]}
                        hasFeedback={form.getFieldValue('coverUrl')}
                    >
                        <Input disabled={loading} onChange={(event) => setCoverurl(event.target.value)} />
                    </Item>
                </Col>

                <Col xs={24} sm={10} md={8} lg={7} xl={5}>
                    <ImageDisplayer src={coverurl} />
                </Col>

                <Col xs={24} sm={14} md={16} lg={17} xl={7}>
                    <Item label="Cabecera" name="headerUrl"
                        rules={[
                            { max: 256 },
                            {
                                validator: (_, value) => {
                                    if (!value || DefaultPlayer.canPlay(value)) {
                                        return Promise.resolve();
                                    } else {
                                        return Promise.reject('URL incompatible');
                                    }
                                }
                            }
                        ]}
                        hasFeedback={form.getFieldValue('headerUrl')}
                    >
                        <Input disabled={loading} onChange={(event) => setHeaderurl(event.target.value)} />
                    </Item>
                </Col>

                <Col xs={24} sm={10} md={8} lg={7} xl={5}>
                    <Player url={headerurl} />
                </Col>

                <Col xs={24} md={20} lg={18} xl={15}>
                    <div className="ant-col ant-form-item-label">
                        <label className="ant-form-item-required">Cuerpo</label>
                    </div>
                    <Editor
                        apiKey="jfzn77e77mliy3nhiwh8s5qq1v669czhlotxr057fr7jw75c"
                        init={{
                            height: 500,
                            menubar: true,
                            plugins: [
                                'advlist autolink lists link image charmap print preview anchor',
                                'searchreplace visualblocks code fullscreen',
                                'insertdatetime media table paste code wordcount'
                            ],
                            toolbar: 'undo redo | formatselect | ' +
                                'bold italic backcolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat'
                        }}
                        value={body}
                        onEditorChange={(value) => setBody(value)}
                    />
                </Col>
            </Row>
        </Form>
    </>
    )
}