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

    const setEditModeForm = async (id) => {
        const response = await AnnouncementsService.Get(id);
        const { data } = response;
        if (!response.isOk) { return message.error(data.title) }

        data.showUntil = !data.showUntil ?? moment(data.showUntil);

        form.setFieldsValue(data);

        setFiles([{
            uid: '-1',
            name: data.title,
            status: 'done',
            url: data.url,
        }]);

        setLoading(false);
    }

    const onFinish = async (values) => {
        setLoading(true);

        const returnWithErrorMessage = ({ title }) => {
            message.error(title); setLoading(false);
        }

        const imageResponse = await AnnouncementsService.UploadImage(files[0]);
        const { data: imageData } = imageResponse;
        if (!imageResponse.isOk) { return returnWithErrorMessage(data); }

        const { secure_url: url, public_id: urlAssetId } = imageData;
        values = { ...values, ...{ url, urlAssetId } };

        const response = await (id ? AnnouncementsService.Edit(id, values) : AnnouncementsService.Create(values));
        const { data } = response;
        if (!response.isOk) { return returnWithErrorMessage(data); }

        message.success('Cambios guardados');
        navigate('/announcements');
        setLoading(false);
    };

    const props = {
        form: {
            form,
            layout: 'vertical',
            onFinish: onFinish,
            autoComplete: 'off',
            validateMessages: {
                required: 'Este campo es requerido',
                string: {
                    max: 'Este campo debe tener menos de ${max} caracteres'
                }
            }
        },
        formRow: { gutter: [32, 24], justify: 'center', align: 'middle' },

        formRowCol1: { xs: 24, md: 16, xl: 10 },
        formRowCol1Item: { label: 'Título', name: 'title', required: true, max: 100, hasFeedback: true },
        formRowCol1ItemInput: { disabled: loading },

        formRowCol2: { xs: 24, md: 8, xl: 4 },
        formRowCol2Item: { label: 'Mostrar hasta la fecha', name: 'showUntil' },
        formRowCol2ItemDatePicker: {
            disabled: loading,
            className: 'date-picker',
            format: 'DD MMM YYYY',
            locale,
            disabledDate: current => current.format('YYYYMMDD') < moment().format('YYYYMMDD')
        },

        formRowCol3: { xs: 24, md: 16, xl: 10 },
        formRowCol3Item: { label: 'Cover', name: 'url', required: true },
        formRowCol3ItemUpload: {
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
        },
        formRowCol3ItemUploadButton: { disabled: loading, icon: <UploadOutlined /> },
        modal: {
            visible: preview.visible,
            title: preview.title,
            onCancel: () => { setPreview({ visible: false }) },
            footer: null
        },
        modalImageDisplayer: { src: preview.url }
    }

    return (<>
        <Form {...props.form}>
            <Row {...props.formRow}>
                <Col {...props.formRowCol1}>
                    <Item {...props.formRowCol1Item}>
                        <Input  {...props.formRowCol1ItemInput} />
                    </Item>
                </Col>

                <Col {...props.formRowCol2}>
                    <Item {...props.formRowCol2Item}>
                        <DatePicker {...props.formRowCol2ItemDatePicker} />
                    </Item>
                </Col>

                <Col {...props.formRowCol3}>
                    <Item {...props.formRowCol3Item}>
                        <Upload {...props.formRowCol3ItemUpload}>
                            {files.length ? null : <Button {...props.formRowCol3ItemUploadButton}>Click para subir imagen</Button>}
                        </Upload>
                    </Item>
                </Col>
            </Row>
        </Form>

        <Modal {...props.modal}>
            <ImageDisplayer {...props.modalImageDisplayer} />
        </Modal>
    </>)
}