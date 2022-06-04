import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Badge, Button, Card, Col, DatePicker, Divider, Empty, Form, Grid, Input, message, Popconfirm, Radio, Row, Typography } from "antd";
import { PlusOutlined, CloseCircleOutlined, CaretUpOutlined, CaretDownOutlined, SearchOutlined } from '@ant-design/icons';
import moment from "moment";
import 'moment/locale/es';
import locale from 'antd/es/date-picker/locale/es_ES';
import InfiniteScroll from "react-infinite-scroll-component";

import { PageContext } from "../../../contexts/pageContext";
import BlogEntriesService from "../../../services/apiServices/blogEntriesService";
import ImageDisplayer from "../../../componets/imagedisplayer/imagedisplayer";

import './blogEntriesList.css';

const { Ribbon } = Badge;
const { Meta } = Card;
const { Text, Paragraph, Title } = Typography;
const { Item } = Form;
const { useBreakpoint } = Grid;

let index = undefined;
moment.locale('es');

export default function BlogEntriesList() {
    const { setCurrentPage } = useContext(PageContext);
    const [form] = Form.useForm();
    const screens = useBreakpoint();

    const [entries, setEntries] = useState([]);
    const [page, setPage] = useState(0);
    const [totalLength, setTotalLength] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState({});

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
            description: (filterForm),
            collapseOptions: {
                onCollapse: {
                    name: 'Mostrar filtros',
                    icon: <CaretDownOutlined />
                },
                onShow: {
                    name: 'Ocultar filtros',
                    icon: <CaretUpOutlined />,
                    height: screens['lg'] ? 40 : (screens['md'] ? 80 : 160)
                }
            }
        });
    }, [screens['lg'], screens['md']]);

    useEffect(() => {
        getMoreEntries();

        return () => clearTimeout(index)
    }, [filters])

    const getMoreEntries = async () => {
        const { search, status, from, to } = filters;

        const response = await BlogEntriesService.GetPage(page + 1, status, search, from, to);

        const { data: { title, totalLength, hasMore, list } } = response;
        if (!response.isOk) { return message.error(title) }

        setPage(page + 1);
        setTotalLength(totalLength);
        setHasMore(hasMore);
        setEntries([...entries, ...list]);
    }

    const remove = async (id) => {
        const returnWithErrorMessage = ({ title }) => {
            message.error(title);
            throw new Error(title);
        }

        const excludeEntry = (id) => {
            return entries.filter(entry => entry.id !== id);
        }

        const response = await BlogEntriesService.Delete(id);
        const { data } = response;
        if (!response.isOk) { return returnWithErrorMessage(data) }

        setEntries(excludeEntry(id));
        message.success('Publicación eliminada');
    }

    const translate = (status) => {
        switch (status) {
            case 'private':
                return 'Privado'

            case 'public':
                return 'Público'

            default:
                return '';
        }
    }

    const getColor = (status) => {
        switch (status) {
            case 'private':
                return 'red'

            case 'public':
                return '#108ee9'

            default:
                return '';
        }
    }

    const filterData = (values) => {
        clearTimeout(index);

        index = setTimeout(() => {
            setHasMore(true);
            setTotalLength(0);
            setEntries([]);
            setPage(0);

            const { search, status, from, to } = values;
            setFilters({ search, status, from: from?.toJSON(), to: to?.toJSON() });
        }, 500);
    }

    const filterForm = (
        <Form
            form={form}
            autoComplete="off"
            initialValues={{
                status: undefined
            }}
            onFinish={filterData}
        >
            <Row gutter={[8, 8]} justify="center" align="middle">
                <Col xs={24} md={12} lg={6}>
                    <Item name="search">
                        <Input
                            type="search"
                            prefix={<SearchOutlined />}
                            placeholder="Buscar"
                            onChange={form.submit}
                            allowClear
                        />
                    </Item>
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <Item name="status">
                        <Radio.Group buttonStyle="solid" onChange={form.submit}>
                            <Radio.Button value={undefined}>Todos</Radio.Button>
                            <Radio.Button value="private">Privado</Radio.Button>
                            <Radio.Button value="public">Público</Radio.Button>
                        </Radio.Group>
                    </Item>
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <Item name="from">
                        <DatePicker
                            className="date-picker"
                            placeholder="Desde"
                            format="DD MMM YYYY"
                            locale={locale}
                            disabledDate={current => current > moment()}
                            onChange={form.submit}
                        />
                    </Item>
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <Item name="to">
                        <DatePicker
                            className="date-picker"
                            placeholder="Hasta"
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
            {`Mostrando ${totalLength} resultados`}
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
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No se encontraron resultados"
                    />
                )
            }
            style={{ overflow: 'visible' }}
        >
            <Row gutter={[64, 0]}>
                {entries.map(entry => {
                    return (
                        <Col xs={24} md={12} lg={8} xl={6} key={entry.id} style={{ marginBottom: '64px' }}>
                            <Ribbon text={translate(entry.status)} color={getColor(entry.status)}>
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
                                        {entry.status = 'private' ? <></> : (
                                            <a href={`${process.env.REACT_APP_PUBLIC_URL}/blog/${entry.id}`} target="_blank">
                                                <Button type="primary" size="small" ghost>Visitar</Button>
                                            </a>
                                        )}

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
                            </Ribbon>
                        </Col>
                    );
                })}
            </Row>
        </InfiniteScroll>
    </>);
}