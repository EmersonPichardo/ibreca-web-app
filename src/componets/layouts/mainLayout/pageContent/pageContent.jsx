import { useContext } from 'react';

import { PageHeader, Layout, BackTop, Button, Tooltip } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';

import { PageContext } from '../../../../contexts/pageContext';
import BreadcrumbService from '../../../../services/breadcrumbService';

import './pageContent.css'

const { Content } = Layout;

export default function PageContent(props) {
    const { currentPage } = useContext(PageContext);
    const { breadcrumb, title, subtitle, extra, onBack, description } = currentPage;

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
            {description}
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