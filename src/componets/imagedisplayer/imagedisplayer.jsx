import { useRef, useState, useEffect } from "react";

import { Skeleton, Typography } from "antd";

import './imagedisplayer.css';

const { Title } = Typography;

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
    const [index, setIndex] = useState();
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
        window.addEventListener("resize", updateWidth, { capture: true, passive: true });

        return () => {
            window.removeEventListener("resize", updateWidth);
            clearTimeout(index);
        };
    }, [])

    useEffect(() => {
        setHeight(ref.current?.offsetWidth * 0.5625);
    }, [width]);

    const updateWidth = () => {
        clearTimeout(index);

        setIndex(setTimeout(() => {
            setWidth(window.innerWidth);
        }, 500));
    };

    if (isLoading || loading) {
        return (
            <div ref={ref}>
                <Skeleton.Input style={{ width: '100%', height }} active />
            </div>
        )
    } else if (!isValid) {
        return (
            <div ref={ref} className="result-wrapper" style={{ height }} onClick={onClick}>
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
                    height
                }}
                onClick={onClick}
            />
        );
    }
}