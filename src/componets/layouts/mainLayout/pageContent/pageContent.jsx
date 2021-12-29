import { useContext, useEffect, useRef, useState } from 'react';

import { PageHeader, Layout, BackTop, Button, Tooltip } from 'antd';
import { ArrowUpOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

import { PageContext } from '../../../../contexts/pageContext';
import BreadcrumbService from '../../../../services/breadcrumbService';

import './pageContent.css'

const { Content } = Layout;

export default function PageContent(props) {
    const { currentPage } = useContext(PageContext);
    const { breadcrumb, title, subtitle, extra, onBack, description, collapseOptions } = currentPage;
    const { onCollapse, onShow, isCollapse } = collapseOptions ?? {};
    const ref = useRef();

    const [collapse, setCollase] = useState(isCollapse ?? false);

    return (<>
        <PageHeader
            className="site-layout-pageheader"
            ghost={false}
            breadcrumb={{ itemRender: BreadcrumbService.itemRender, routes: breadcrumb }}
            onBack={onBack}
            title={title}
            subTitle={subtitle}
            extra={extra}
        >
            <div
                ref={ref}
                className={`description ${collapse ? 'collapsed' : ''}`}
                style={{ maxHeight: onShow?.height ?? 32 }}>
                {description}
            </div>
            <Button type="link" size="small"
                className={`collapse-buttom ${collapse ? 'collapsed' : ''}`}
                icon={collapse ? (onCollapse?.icon ?? <EyeOutlined />) : (onShow?.icon ?? <EyeInvisibleOutlined />)}
                onClick={() => setCollase(!collapse)}
            >
                {collapse ? (onCollapse?.name ?? 'Mostrar') : (onShow?.name ?? 'Ocultar')}
            </Button>
        </PageHeader>

        <Content id="container" className="site-layout-background">
            <BackTop duration={700} target={() => document.getElementById('container')} visibilityHeight={0}>
                <Tooltip title="Volver arriba" placement="left" color="#1890ff">
                    <Button type="primary" shape="circle" size="large" ghost icon={<ArrowUpOutlined />} className="backtop" />
                </Tooltip>
            </BackTop>

            {props.children}
        </Content>
    </>)
}