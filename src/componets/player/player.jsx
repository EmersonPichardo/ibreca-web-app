import { Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';

import './player.css';

const { Title } = Typography;

export const DefaultPlayer = ReactPlayer;

export default function Player(props) {
    const {
        url, playing, loop, controls, light,
        volume, muted, playbackRate, width, height,
        style, progressInterval, playsinline, pip, stopOnUnmount,
        fallback, wrapper, playIcon, previewTabIndex, config
    } = props;
    const ref = useRef();
    const [_width, setWidth] = useState();
    const [_height, setHeight] = useState();

    useEffect(() => {
        setHeight(ref.current?.offsetWidth * 0.5625);
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    });

    const updateWidth = () => {
        setWidth(window.innerWidth);
    };

    return (
        ReactPlayer.canPlay(url) ? (
            <div className="player-wrapper">
                <ReactPlayer
                    className="react-player"
                    url={url}
                    width={width || "100%"}
                    height={height || "100%"}
                    controls={controls || true}
                    playing={playing}
                    loop={loop}
                    light={light}
                    volume={volume}
                    muted={muted}
                    playbackRate={playbackRate}
                    style={style}
                    progressInterval={progressInterval}
                    playsinline={playsinline}
                    pip={pip}
                    stopOnUnmount={stopOnUnmount}
                    fallback={fallback}
                    wrapper={wrapper}
                    playIcon={playIcon}
                    previewTabIndex={previewTabIndex}
                    config={config}
                />
            </div>
        ) :
            <div ref={ref} className="result-wrapper" style={{ height: `${_height}px` }}>
                <Title level={5} style={{ textAlign: 'center' }}>Recurso audio-visual no encontrado</Title>
            </div >
    )
}