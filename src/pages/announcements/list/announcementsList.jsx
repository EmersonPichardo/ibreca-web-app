import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Button, Card, Col, Divider, Empty, Form, Input, message, Popconfirm, Row, Typography } from "antd";
import { PlusOutlined, CloseCircleOutlined, CaretUpOutlined, CaretDownOutlined, SearchOutlined } from '@ant-design/icons';
import moment from "moment";
import 'moment/locale/es';
import InfiniteScroll from "react-infinite-scroll-component";

import { PageContext } from "../../../contexts/pageContext";
import AnnouncementsService from "../../../services/apiServices/announcementsService";
import ImageDisplayer from "../../../componets/imagedisplayer/imagedisplayer";

import './announcementsList.css';

const { Meta } = Card;
const { Text, Paragraph, Title } = Typography;
const { Item } = Form;

let index = undefined;
moment.locale('es');

export default function AnnouncementsList() {
    const { setCurrentPage } = useContext(PageContext);
    const [form] = Form.useForm();

    const [announcements, setAnnouncements] = useState([]);
    const [page, setPage] = useState(0);
    const [totalLength, setTotalLength] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState({});

    useEffect(() => {
        setCurrentPage({
            breadcrumb: [
                { path: '/', breadcrumbName: 'Inicio' },
                { path: '/announcements', breadcrumbName: 'Anuncios' }
            ],
            title: "Anuncios",
            extra: [
                <Link key="add" to="/announcements/add">
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
                    height: 40
                }
            }
        });
    }, []);

    useEffect(() => {
        getMoreEntries();

        return () => clearTimeout(index)
    }, [filters])

    const getMoreEntries = async () => {
        const { search } = filters;

        const response = await AnnouncementsService.GetPage(page + 1, search);
        const { data: { title, totalLength, hasMore, list } } = response;
        if (!response.isOk) return message.error(title);

        setPage(page + 1);
        setTotalLength(totalLength);
        setHasMore(hasMore);
        setAnnouncements([...announcements, ...list]);
    }

    const remove = async (id) => {
        const returnWithErrorMessage = ({ title }) => {
            message.error(title);
            throw new Error(title);
        }

        const excludeAnnouncement = (id) => {
            return announcements.filter(announcement => announcement.id !== id);
        }

        const response = await AnnouncementsService.Delete(id);
        const { data } = response;
        if (!response.isOk) { return returnWithErrorMessage(data); }

        setAnnouncements(excludeAnnouncement(id))
        message.success('Anuncio eliminado');
    }

    const filterData = (values) => {
        clearTimeout(index);

        index = setTimeout(() => {
            setHasMore(true);
            setTotalLength(0);
            setAnnouncements([]);
            setPage(0);

            const { search } = values;
            setFilters({ search });
        }, 500);
    }

    const filterForm = (
        <Form
            form={form}
            autoComplete="off"
            onFinish={filterData}
        >
            <Row gutter={[8, 8]} justify="center" align="middle">
                <Col span={24}>
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
            </Row>
        </Form>
    );

    return (<>
        <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
            {`Mostrando ${totalLength} resultados`}
        </Text>

        <InfiniteScroll
            dataLength={announcements.length}
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
                announcements.length ? <></> : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="No se encontraron resultados"
                    />
                )
            }
            style={{ overflow: 'visible' }}
        >
            <Row gutter={[64, 0]}>
                {announcements.map(announcement => {
                    return (
                        <Col xs={24} md={12} lg={8} xl={6} key={announcement.id} style={{ marginBottom: '64px' }}>
                            <Card
                                hoverable
                                cover={
                                    <Link to={`/announcements/edit/${announcement.id}`}>
                                        <ImageDisplayer src={announcement.url} />
                                    </Link>
                                }
                            >
                                <Link to={`/announcements/edit/${announcement.id}`}>
                                    <Meta
                                        description={
                                            <Title level={5}>
                                                <Paragraph ellipsis={{ rows: 3 }}>{announcement.title}</Paragraph>
                                            </Title>
                                        }
                                    />
                                    {announcement.showUntil ? (
                                        <Text type="secondary">{`Mostrar hasta el: ${moment(announcement.showUntil).format('DD MMM YYYY')}`}</Text>
                                    ) : (
                                        <Text type="secondary">Mostrar simpre</Text>
                                    )}
                                </Link>

                                <Divider style={{ margin: '16px 0px' }} />

                                <div className="card-actions">
                                    <Link to={`/announcements/edit/${announcement.id}`}>
                                        <Button type="primary" size="small">Editar</Button>
                                    </Link>

                                    <Popconfirm
                                        title="¿Desea eliminar este anuncio?"
                                        icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
                                        onConfirm={() => remove(announcement.id)}
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