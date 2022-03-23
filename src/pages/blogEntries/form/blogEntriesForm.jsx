import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import { Row, Col, Form, Input, Radio, Button, message, Upload, Modal } from 'antd';
import { SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';

import { PageContext } from '../../../contexts/pageContext';
import BlogEntriesService from '../../../services/apiServices/blogEntriesService';
import Player, { DefaultPlayer } from '../../../componets/player/player';
import ImageDisplayer from '../../../componets/imagedisplayer/imagedisplayer';

import './blogEntriesForm.css';

const { Item } = Form;

export default function BlogEntriesForm() {
    const { setCurrentPage } = useContext(PageContext);
    const { id } = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [headerurl, setHeaderurl] = useState();
    const [body, setBody] = useState();
    const [files, setFiles] = useState([]);
    const [preview, setPreview] = useState({});

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

    const setEditModeForm = async (id) => {
        const response = await BlogEntriesService.Get(id);
        const { data } = response;
        const { title, coverUrl: url, headerUrl, body } = data;
        if (!response.isOk) { return message.error(title); }

        form.setFieldsValue(data);

        setFiles([{ uid: '-1', name: title, status: 'done', url }]);
        setHeaderurl(headerUrl);
        setBody(body);

        setLoading(false);
    }

    const onFinish = async (values) => {
        if (!body) return message.error("El cuerpo es requerido");

        setLoading(true);

        const returnWithErrorMessage = ({ title }) => {
            message.error(title);
            setLoading(false);
        }

        const imageResponse = await BlogEntriesService.UploadImage(files[0]);
        const { data: imageData } = imageResponse;
        if (!imageResponse.isOk) { return returnWithErrorMessage(imageData) }

        const { secure_url: coverUrl, public_id: coverUrlAssetId } = imageData;
        values = { ...values, ...{ coverUrl, coverUrlAssetId, body } };

        const response = await (id ? BlogEntriesService.Edit(id, values) : BlogEntriesService.Create(values))
        const { data } = response;
        if (!response.isOk) { return returnWithErrorMessage(data); }

        message.success('Cambios guardados');
        navigate('/blog/entries');
    };

    const onHeaderInputChange = ({ event: { target: { value } } }) => setHeaderurl(value);
    const onUploadChange = ({ file }) => {
        if (file.status === 'removed') return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = ({ target: { result } }) => {
            file.url = result;
            setFiles([file]);
        };
    }
    const onUploadedFilePreview = (file) => {
        setPreview({
            visible: true,
            title: file.name,
            url: file.url
        });
    }

    const uploadProps = {
        listType: 'picture',
        maxCount: 1,
        fileList: files,
        beforeUpload: () => false,
        onChange: onUploadChange,
        onPreview: onUploadedFilePreview,
        onRemove: () => setFiles([])
    }
    const formProps = {
        form: form,
        layout: 'vertical',
        onFinish: onFinish,
        autoComplete: 'off',
        initialValues: {
            status: 'private'
        },
        validateMessages: {
            required: 'Este campo es requerido',
            string: {
                max: 'Este campo debe tener menos de ${max} caracteres'
            }
        }
    }
    const headerInputRules = [{
        validator: (_, value) => {
            if (!value || DefaultPlayer.canPlay(value)) {
                return Promise.resolve();
            } else {
                return Promise.reject('URL incompatible');
            }
        }
    }];
    const editorProps = {
        apiKey: 'jfzn77e77mliy3nhiwh8s5qq1v669czhlotxr057fr7jw75c',
        init: {
            height: 500,
            menubar: true,
            plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code wordcount'
            ],
            toolbar: (
                'undo redo | formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat'
            )
        },
        value: body,
        onEditorChange: (value) => setBody(value)
    }
    const modalProps = {
        visible: preview.visible,
        title: preview.title,
        onCancel: () => { setPreview({ visible: false }) },
        footer: null
    }

    return (<>
        <Form {...formProps}>
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
                    <Item label="Cover" name="coverUrl" required>
                        <Upload {...uploadProps}>
                            {files.length ? null : <Button disabled={loading} icon={<UploadOutlined />}>Click para subir imagen</Button>}
                        </Upload>
                    </Item>
                </Col>

                <Col xs={24} sm={14} md={16} lg={17} xl={7}>
                    <Item label="Cabecera" name="headerUrl" max={512} rules={headerInputRules} hasFeedback={form.getFieldValue('headerUrl')}>
                        <Input disabled={loading} onChange={onHeaderInputChange} />
                    </Item>
                </Col>

                <Col xs={24} sm={10} md={8} lg={7} xl={5}>
                    <Player url={headerurl} />
                </Col>

                <Col xs={24} md={20} lg={18} xl={15}>
                    <div className="ant-col ant-form-item-label">
                        <label className="ant-form-item-required">Cuerpo</label>
                    </div>
                    <Editor {...editorProps} />
                </Col>
            </Row>
        </Form>

        <Modal {...modalProps}>
            <ImageDisplayer src={preview.url} />
        </Modal>
    </>
    )
}