import { Result, Button } from 'antd';
import { Link } from "react-router-dom";

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
                    <Link to="/">
                        <Button type="primary" icon={<HomeOutlined />}>
                            Volver al inicio
                        </Button>
                    </Link>
                }
            />
        </div >
    );
}