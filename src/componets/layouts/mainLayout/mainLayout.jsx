import React, { useState } from 'react';
import { Link, Outlet } from "react-router-dom";

import { Layout, Menu, Typography, Row, Col, Space, Divider, Badge, Dropdown } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    BellOutlined,
    UserOutlined,
    PoweroffOutlined,
    HomeOutlined,
    ShopOutlined,
    ShoppingOutlined,
    TagsOutlined,
    TeamOutlined,
    OrderedListOutlined
} from '@ant-design/icons';

import './mainLayout.css';

const { Header, Sider } = Layout;
const { Text } = Typography;

export default function MainLayout() {
    let [collapsed, setCollapsed] = useState(false);

    function toggle() {
        setCollapsed(!collapsed);
    }

    const menu = (
        <Menu>
            <Menu.Item key="0">
                <Space size="large">
                    <Text type="danger"><PoweroffOutlined /></Text>
                    <a href="/login">
                        <Text type="danger">Cerrar sesión</Text>
                    </a>
                </Space>
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1" icon={<HomeOutlined />}>
                        <Link to="/">inicio</Link>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<ShopOutlined />}>
                        <Link to="/sucursales">Sucursales</Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<ShoppingOutlined />}>
                        <Link to="/proveedores">Proveedores</Link>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<TagsOutlined />}>
                        <Link to="/productos">Productos</Link>
                    </Menu.Item>
                    <Menu.Item key="5" icon={<TeamOutlined />}>
                        <Link to="/usuarios">Usuarios</Link>
                    </Menu.Item>
                    <Menu.Item key="6" icon={<OrderedListOutlined />}>
                        <Link to="/inventario">Inventario</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background">
                    <Row justify="space-between">
                        <Col span={8}>
                            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'header-icon trigger',
                                onClick: toggle,
                            })}
                        </Col>
                        <Col span={8} style={{ textAlign: 'right', paddingRight: '16px' }}>
                            <Space split={<Divider type="vertical" />}>
                                <Badge dot>
                                    <BellOutlined className="header-icon" />
                                </Badge>
                                <Dropdown overlay={menu}>
                                    <span className="header-icon"><UserOutlined />
                                        <span style={{ padding: '0px 24px 0px 6px' }}>{JSON.parse(localStorage.getItem('sesion'))?.name || 'Desconocido'}</span>
                                    </span>
                                </Dropdown>
                            </Space>
                        </Col>
                    </Row>
                </Header>

                <Outlet />
            </Layout>
        </Layout>
    )
}