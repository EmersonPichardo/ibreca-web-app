import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import { Row, Col, Form, Input, Button, message, DatePicker } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import moment from "moment";
import locale from 'antd/es/date-picker/locale/es_ES';

import { PageContext } from '../../../contexts/pageContext';
import AnnouncementsService from '../../../services/apiServices/announcementsService';
import ImageDisplayer, { CanDisplay } from '../../../componets/imagedisplayer/imagedisplayer';

import './announcementsForm.css';

const { Item } = Form;

export default function AnnouncementsForm() {
    const { setCurrentPage } = useContext(PageContext);
    const { id } = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [url, setUrl] = useState();

    useEffect(() => {
        setCurrentPage({
            breadcrumb: [
                { path: '/', breadcrumbName: 'Inicio' },
                { path: '/announcements', breadcrumbName: 'Anuncios' },
                { breadcrumbName: `${id ? 'Editar' : 'Agregar'} anuncio` }
            ],
            title: `${id ? 'Editar' : 'Agregar'} anuncio`,
            extra: [
                <Button key="submit" type="primary" size="large" icon={<SaveOutlined />} loading={loading} onClick={form.submit}>
                    Guardar
                </Button>
            ],
            onBack: () => navigate('/announcements')
        });
    }, [loading]);

    useEffect(() => {
        if (id) { setEditModeForm(id); }
        else { setLoading(false); }
    }, [])

    const setEditModeForm = (id) => {
        AnnouncementsService.Get(id)
            .then(response => {
                response.json().then(data => {
                    if (response.ok) {
                        if (data.showUntil) data.showUntil = moment(data.showUntil);
                        form.setFieldsValue(data);
                        setUrl(data.url);
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

        (id ? AnnouncementsService.Edit(id, values) : AnnouncementsService.Create(values))
            .then(response => {
                if (response.ok) {
                    message.success('Cambios guardados');
                    navigate('/announcements');
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
            validateMessages={{
                required: 'Este campo es requerido',
                string: {
                    max: 'Este campo debe tener menos de ${max} caracteres'
                }
            }}
        >
            <Row gutter={[32, 24]} justify="center" align="middle">
                <Col xs={24} md={12} xl={6}>
                    <Item label="Título" name="title" rules={[{ required: true, max: 100 }]} hasFeedback>
                        <Input disabled={loading} />
                    </Item>
                </Col>

                <Col xs={24} md={12} xl={6}>
                    <Item label="Mostrar hasta la fecha" name="showUntil">
                        <DatePicker
                            className="date-picker"
                            format="DD MMM YYYY"
                            locale={locale}
                            disabledDate={current => current.format('YYYYMMDD') < moment().format('YYYYMMDD')}
                        />
                    </Item>
                </Col>

                <Col xs={24} sm={14} md={16} lg={17} xl={6}>
                    <Item label="Cover" name="url"
                        rules={[
                            { required: true },
                            { max: 512 },
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
                        hasFeedback={form.getFieldValue('url')}
                    >
                        <Input disabled={loading} onChange={(event) => setUrl(event.target.value)} />
                    </Item>
                </Col>

                <Col xs={24} sm={10} md={8} lg={7} xl={5}>
                    <ImageDisplayer src={url} />
                </Col>
            </Row>
        </Form>
    </>
    )
}