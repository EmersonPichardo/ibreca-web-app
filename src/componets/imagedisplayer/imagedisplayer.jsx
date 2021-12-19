import { useRef, useState, useEffect } from "react";

import { Skeleton, Typography } from "antd";

import './imagedisplayer.css';

const { Title } = Typography;

let index = undefined;

export function CanDisplay(src) {
    return (
        new Promise((resolve, reject) => {
            if (!src) {
                return reject();
            }

            let img = new Image();
            img.src = src;

            img.onload = resolve;
            img.onerror = reject;
        })
    )
}

export default function ImageDisplayer(props) {
    const { src, onClick, loading } = props;
    const ref = useRef();
    const [isLoading, setLoading] = useState(false);
    const [isValid, setValid] = useState(false);
    const [width, setWidth] = useState();
    const [height, setHeight] = useState();

    useEffect(() => {
        setLoading(true);

        CanDisplay(src)
            .then(() => {
                setLoading(false);
                setValid(true);
            }, () => {
                setLoading(false);
                setValid(false);
            });
    }, [src])

    useEffect(() => {
        setHeight(ref.current?.offsetWidth * 0.5625);
        window.addEventListener("resize", updateWidth);

        return () => {
            window.removeEventListener("resize", updateWidth);
            clearTimeout(index);
        };
    }, [width]);

    const updateWidth = () => {
        clearTimeout(index);

        index = setTimeout(() => {
            setWidth(window.innerWidth);
        }, 500);
    };

    if (isLoading || loading) {
        return (
            <div ref={ref}>
                <Skeleton.Input style={{ width: '100%', height: `${height}px` }} active />
            </div>
        )
    } else if (!isValid) {
        return (
            <div ref={ref} className="result-wrapper" style={{ height: `${height}px` }} onClick={onClick}>
                <Title level={5} style={{ textAlign: 'center' }}>Imagen no encontrada</Title>
            </div >
        );
    } else if (isValid) {
        return (
            <div
                ref={ref}
                className="image-wrapper"
                style={{
                    backgroundImage: `url("${src}")`,
                    height: `${height}px`
                }}
                onClick={onClick}
            />
        );
    }
}