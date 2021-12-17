import React, { useContext, useState } from 'react';
import { Link, Outlet, useLocation } from "react-router-dom";

import { Layout, Menu, Typography, Row, Col, Space, Divider, Badge, Dropdown } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    BellOutlined,
    UserOutlined,
    PoweroffOutlined,
    HomeOutlined,
    NotificationOutlined,
    PicLeftOutlined
} from '@ant-design/icons';

import { PageContext } from '../../../contexts/pageContext';
import PageContent from './pageContent/pageContent';

import './mainLayout.css';

const { createElement } = React;
const { Header, Sider } = Layout;
const { SubMenu, Item } = Menu;
const { Text } = Typography;

export default function MainLayout() {
    const { currentPage } = useContext(PageContext);
    const { pathname } = useLocation();

    const [collapsed, setCollapsed] = useState(false);

    const toggle = () => {
        setCollapsed(!collapsed);
    }

    const menu = (
        <Menu>
            <Item key="logout">
                <Link to="login">
                    <Space>
                        <Text type="danger"><PoweroffOutlined /></Text>
                        <Text type="danger">Cerrar sesión</Text>
                    </Space>
                </Link>
            </Item>
        </Menu>
    );

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" />
                <Menu theme="dark" mode="vertical" defaultSelectedKeys={[pathname]} className={collapsed || "fast-out"}>
                    <Item key="/" icon={<HomeOutlined />}>
                        <Link to="/">inicio</Link>
                    </Item>
                    <SubMenu key="blog" icon={<NotificationOutlined />} title="Blog">
                        <Item key="/blog/entries" icon={<PicLeftOutlined />}>
                            <Link to="blog/entries">Entradas</Link>
                        </Item>
                    </SubMenu>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background">
                    <Row justify="space-between">
                        <Col span={4}>
                            {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'header-icon trigger',
                                onClick: toggle,
                            })}
                        </Col>
                        <Col span={14} style={{ textAlign: 'right', paddingRight: '16px' }}>
                            <Space split={<Divider type="vertical" />}>
                                <Badge dot>
                                    <BellOutlined className="header-icon" />
                                </Badge>
                                <Dropdown overlay={menu} trigger={['click']}>
                                    <span className="header-icon">
                                        <UserOutlined />
                                        <span style={{ padding: '0px 24px 0px 6px' }}>
                                            {JSON.parse(localStorage.getItem('sesion'))?.name || 'Desconocido'}
                                        </span>
                                    </span>
                                </Dropdown>
                            </Space>
                        </Col>
                    </Row>
                </Header>

                <PageContent title={currentPage.title} subtitle={currentPage.subtitle} extra={currentPage.extra} onBack={currentPage.onBack}>
                    <Outlet />
                </PageContent>
            </Layout>
        </Layout>
    )
}