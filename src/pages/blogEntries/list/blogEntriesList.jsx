import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Button, Card, Col, DatePicker, Divider, Form, Input, message, Popconfirm, Result, Row, Typography } from "antd";
import { PlusOutlined, CloseCircleOutlined, InboxOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import moment from "moment";
import 'moment/locale/es';
import locale from 'antd/es/date-picker/locale/es_ES';
import InfiniteScroll from "react-infinite-scroll-component";

import { PageContext } from "../../../contexts/pageContext";
import BlogEntriesService from "../../../services/apiServices/blogEntriesService";
import ImageDisplayer from "../../../componets/imagedisplayer/imagedisplayer";

import './blogEntriesList.css';

const { Meta } = Card;
const { Text, Paragraph, Title } = Typography;
const { Item } = Form;

let index = undefined;
moment.locale('es');

export default function BlogEntriesList() {
    const { setCurrentPage } = useContext(PageContext);
    const [form] = Form.useForm();

    const [entries, setEntries] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        setCurrentPage({
            breadcrumb: [
                { path: '/', breadcrumbName: 'Inicio' },
                { breadcrumbName: 'Blog' },
                { path: '/blog/entries', breadcrumbName: 'Entradas' }
            ],
            title: "Entradas",
            extra: [
                <Link key="add" to="/blog/entries/add">
                    <Button type="primary" size="large" icon={<PlusOutlined />}>Agregar</Button>
                </Link>
            ],
            description: filterForm,
            collapseOptions: {
                onCollapse: {
                    name: 'Mostrar filtros',
                    icon: <CaretDownOutlined />
                },
                onShow: {
                    name: 'Ocultar filtros',
                    icon: <CaretUpOutlined />,
                    height: 32
                },
                isCollapse: true
            }
        });

        return () => {
            clearTimeout(index);
        }
    }, []);

    const getMoreEntries = (search, from, to) => {
        setPage(page + 1);

        BlogEntriesService.GetPage(page, search, from, to)
            .then(response => {
                response.json().then(data => {
                    if (response.ok) {
                        setHasMore(data.hasMore);
                        setEntries([...entries, ...data.list]);
                    } else {
                        message.error(data.title);
                    }
                })
            })
            .catch((error) => {
                message.error(error.message);
            });
    }

    useEffect(() => {
        getMoreEntries();
    }, []);

    const remove = (id) => {
        return new Promise((resolve, reject) => {
            BlogEntriesService.Delete(id)
                .then(response => {
                    if (response.ok) {
                        setTimeout(() => setEntries(entries.filter(entry => entry.id !== id)), 0);
                        message.success('Publicación eliminada');
                        resolve();
                    } else {
                        response.json().then(error => {
                            message.error(error.title);
                            reject(error.title);
                        })
                    }
                })
                .catch(error => {
                    message.error(error.message);
                    reject(error.message);
                })
        })
    }

    const filterData = (values) => {
        clearTimeout(index);

        index = setTimeout(() => {
            const { search, from, to } = values;

            setPage(0);
            setEntries([]);
            getMoreEntries(search, from?.toJSON(), to?.toJSON());
        }, 500);
    }

    const filterForm = (
        <Form
            form={form}
            autoComplete="off"
            onFinish={filterData}
        >
            <Row gutter={[32, 0]} justify="center" align="middle">
                <Col xs={24} md={24} lg={8}>
                    <Item label="Buscar" name="search">
                        <Input onChange={form.submit} allowClear />
                    </Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                    <Item label="Desde" name="from">
                        <DatePicker
                            className="date-picker"
                            format="DD MMM YYYY"
                            locale={locale}
                            disabledDate={current => current > moment()}
                            onChange={form.submit}
                        />
                    </Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                    <Item label="Hasta" name="to">
                        <DatePicker
                            className="date-picker"
                            format="DD MMM YYYY"
                            locale={locale}
                            disabledDate={current => current > moment()}
                            onChange={form.submit}
                        />
                    </Item>
                </Col>
            </Row>
        </Form>
    );

    return (<>
        <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
            {`Mostrando ${entries.length} resultados encontrados`}
        </Text>

        <InfiniteScroll
            dataLength={entries.length}
            next={getMoreEntries}
            hasMore={hasMore}
            scrollThreshold={0.75}
            scrollableTarget="container"
            loader={
                <Row gutter={[64, 64]}>{
                    Array.from({ length: 4 }).map((_, index) => {
                        return (
                            <Col xs={24} md={12} lg={8} xl={6} key={index}>
                                <Card cover={<ImageDisplayer loading={true} />} loading={true} />
                            </Col>
                        )
                    })}
                </Row>
            }
            endMessage={
                entries.length ? <></> : (
                    <Result
                        icon={<InboxOutlined />}
                        title="No se encontraron resultados"
                    />
                )
            }
            style={{ overflowX: 'hidden' }}
        >
            <Row gutter={[64, 0]}>
                {entries.map(entry => {
                    return (
                        <Col xs={24} md={12} lg={8} xl={6} key={entry.id} style={{ marginBottom: '64px' }}>
                            <Card
                                hoverable
                                cover={
                                    <Link to={`/blog/entries/edit/${entry.id}`}>
                                        <ImageDisplayer src={entry.coverUrl} />
                                    </Link>
                                }
                            >
                                <Link to={`/blog/entries/edit/${entry.id}`}>
                                    <Meta
                                        description={
                                            <Title level={5}>
                                                <Paragraph ellipsis={{ rows: 3 }}>{entry.title}</Paragraph>
                                            </Title>
                                        }
                                    />
                                    <Text type="secondary">{moment(entry.publicationDate).format('DD MMM YYYY')}</Text>
                                </Link>

                                <Divider style={{ margin: '16px 0px' }} />

                                <div className="card-actions">
                                    <a href="/google.com" target="_blank">
                                        <Button type="primary" size="small" ghost>Visitar</Button>
                                    </a>

                                    <Link to={`/blog/entries/edit/${entry.id}`}>
                                        <Button type="primary" size="small">Editar</Button>
                                    </Link>

                                    <Popconfirm
                                        title="¿Desea eliminar esta publicación?"
                                        icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                                        onConfirm={() => remove(entry.id)}
                                        okText="Eliminar"
                                        okButtonProps={{ danger: "danger" }}
                                        cancelText="No"
                                        cancelButtonProps={{ type: "primary", ghost: "ghost" }}
                                    >
                                        <Button type="primary" size="small" danger>Eliminar</Button>
                                    </Popconfirm>
                                </div>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </InfiniteScroll>
    </>);
}