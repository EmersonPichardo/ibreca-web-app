import React, { useContext, useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import { Layout, Menu, Typography, Row, Col, Space, Divider, Badge, Dropdown, message } from 'antd';
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

import { SecurityContext } from '../../../contexts/securityContext';
import PageContent from './pageContent/pageContent';
import LoginService from '../../../services/apiServices/loginService';

import './mainLayout.css';

const { createElement } = React;
const { Header, Sider } = Layout;
const { SubMenu, Item } = Menu;
const { Text } = Typography;

export default function MainLayout() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { getSesion, logout, setCallbackRoute } = useContext(SecurityContext);

    const [collapsed, setCollapsed] = useState(true);

    useEffect(() => {
        if (!getSesion()) {
            message.error('Por favor inicie sesión');
            setCallbackRoute(pathname);
            return navigate('/login');
        }

        LoginService.IsValidToken()
            .then(response => {
                if (response.status == 401) {
                    message.error('Sesión agotada');
                    setCallbackRoute(pathname);
                    navigate('/login');
                } else if (response.status != 200) {
                    response.json().then(data => {
                        message.error(data.Message);
                        setCallbackRoute(pathname);
                        navigate('/login');
                    });
                }
            })
            .catch((error) => {
                message.error(error.message);
                navigate('/login');
            });
    }, [pathname]);

    const toggle = () => {
        setCollapsed(!collapsed);
    }

    const menu = (
        <Menu>
            <Item key="logout">
                <Link to="login" onClick={logout}>
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
                        <Col xs={collapsed ? 8 : 24} xl={3}>
                            {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'header-icon trigger',
                                onClick: toggle,
                            })}
                        </Col>
                        <Col xs={collapsed ? 16 : 0} xl={21} style={{ textAlign: 'right', paddingRight: '16px' }}>
                            <Dropdown overlay={menu} trigger={['click']}>
                                <span className="header-icon">
                                    <UserOutlined />
                                    <span style={{ padding: '0px 24px 0px 6px' }}>
                                        {getSesion()?.name}
                                    </span>
                                </span>
                            </Dropdown>
                        </Col>
                    </Row>
                </Header>

                <PageContent>
                    <Outlet />
                </PageContent>
            </Layout>
        </Layout>
    )
}