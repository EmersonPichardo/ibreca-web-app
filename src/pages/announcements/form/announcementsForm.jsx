import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import { Row, Col, Form, Input, Button, message, DatePicker, Upload, Modal } from 'antd';
import { SaveOutlined, UploadOutlined } from '@ant-design/icons';
import moment from "moment";
import locale from 'antd/es/date-picker/locale/es_ES';

import { PageContext } from '../../../contexts/pageContext';
import AnnouncementsService from '../../../services/apiServices/announcementsService';
import ImageDisplayer from '../../../componets/imagedisplayer/imagedisplayer';

import './announcementsForm.css';

const { Item } = Form;

export default function AnnouncementsForm() {
    const { setCurrentPage } = useContext(PageContext);
    const { id } = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [files, setFiles] = useState([]);
    const [preview, setPreview] = useState({});

    const uploadProps = {
        listType: 'picture',
        maxCount: 1,
        fileList: files,
        beforeUpload: () => false,
        onChange: ({ file }) => {
            if (file.status == 'removed') return;

            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = ({ target: { result } }) => {
                file.url = result;
                setFiles([file]);
            };
        },
        onPreview: file => {
            setPreview({
                visible: true,
                title: file.name,
                url: file.url
            });
        },
        onRemove: () => setFiles([])
    }

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
                        setFiles([{
                            uid: '-1',
                            name: data.title,
                            status: 'done',
                            url: data.url,
                        }]);
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

    const onFinish = async (values) => {
        setLoading(true);

        const { secure_url, public_id } = await AnnouncementsService.UploadImage(files[0]);

        values.url = secure_url;
        values.UrlAssetId = public_id;

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
                <Col xs={24} md={16} xl={10}>
                    <Item label="Título" name="title" rules={[{ required: true, max: 100 }]} hasFeedback>
                        <Input disabled={loading} />
                    </Item>
                </Col>

                <Col xs={24} md={8} xl={4}>
                    <Item label="Mostrar hasta la fecha" name="showUntil">
                        <DatePicker
                            disabled={loading}
                            className="date-picker"
                            format="DD MMM YYYY"
                            locale={locale}
                            disabledDate={current => current.format('YYYYMMDD') < moment().format('YYYYMMDD')}
                        />
                    </Item>
                </Col>

                <Col xs={24} md={16} lg={17} xl={10}>
                    <Item label="Cover" name="url" required>
                        <Upload {...uploadProps}>
                            {files.length ? null : <Button disabled={loading} icon={<UploadOutlined />}>Click para subir imagen</Button>}
                        </Upload>
                    </Item>
                </Col>
            </Row>
        </Form>

        <Modal
            visible={preview.visible}
            title={preview.title}
            onCancel={() => { setPreview({ visible: false }) }}
            footer={null}
        >
            <ImageDisplayer src={preview.url} />
        </Modal>
    </>
    )
}