import { Result, Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

import './notFound.css';

export default function NotFound() {
    return (
        <div className="container" >
            <Result
                status="404"
                title="404"
                subTitle="Lo sentimos, esta página no existe"
                extra={
                    <Button type="primary" icon={<HomeOutlined />} onClick={() => window.location.replace("/")}>
                        Volver al inicio
                    </Button>
                }
            />
        </div >
    );
}