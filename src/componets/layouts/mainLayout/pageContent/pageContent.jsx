import { PageHeader, Layout } from 'antd';

import './pageContent.css'

const { Content } = Layout;

export default function PageContent(props) {
    const { title, subtitle, extra, onBack } = props;

    return (<>
        <PageHeader
            className="site-layout-pageheader"
            ghost={false}
            onBack={onBack}
            title={title}
            subTitle={subtitle}
            extra={extra}
        />

        <Content id="container" className="site-layout-background">
            {props.children}
        </Content>
    </>)
}