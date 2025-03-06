'use client'
import { useWavesurfer } from "@/utils/customHook";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { WaveSurferOptions } from "wavesurfer.js";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import './wave.scss';
import { Tooltip } from "@mui/material";
import { useTrackContext } from "@/lib/track.wrapper";
import { fetchDefaultImages, sendRequest } from "@/utils/api";
import CommentTrack from "./comment.track";
import LikeTrack from "./like.track";
import Image from "next/image";

interface IProps {
    track: ITrackTop | null;
    comments: ITrackComment[]
}


const WaveTrack = (props: IProps) => {
    const { track, comments } = props;
    const router = useRouter();
    const firstViewRef = useRef(true);

    const searchParams = useSearchParams();
    const fileName = searchParams.get('audio');
    const containerRef = useRef<HTMLDivElement>(null);
    const [time, setTime] = useState<string>("0:00");
    const [duration, setDuration] = useState<string>("0:00");
    const hoverRef = useRef<HTMLDivElement>(null);
    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

    const optionsMemo = useMemo((): Omit<WaveSurferOptions, 'container'> => {

        let gradient, progressGradient;
        if (typeof window !== "undefined") {
            const canvas = document.createElement('canvas')!;
            const ctx = canvas.getContext('2d')!;

            // Define the waveform gradient
            gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
            gradient.addColorStop(0, '#656666') // Top color
            gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666') // Top color
            gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1') // Bottom color
            gradient.addColorStop(1, '#B1B1B1')

            // Define the progress gradient
            progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
            progressGradient.addColorStop(0, '#EE772F') // Top color
            progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926') // Top color
            progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#F6B094') // Bottom color
            progressGradient.addColorStop(1, '#F6B094')
        }

        return {
            waveColor: gradient,
            progressColor: progressGradient,
            height: 100,
            barWidth: 3,
            url: `/api?audio=${fileName}`
        }
    }, [])

    const wavesurfer = useWavesurfer(containerRef, optionsMemo);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    useEffect(() => {
        if (!wavesurfer) return;
        setIsPlaying(false)

        // hover on wave
        const hover = hoverRef.current;
        const waveform = containerRef.current!;
        //@ts-ignore
        waveform.addEventListener('pointermove', (e) => (hover.style.width = `${e.offsetX}px`))

        const subcriptions = [
            wavesurfer.on('play', () => setIsPlaying(true)),
            wavesurfer.on('pause', () => setIsPlaying(false)),
            wavesurfer.on('decode', (duration) => {
                setDuration(formatTime(duration));
            }),
            wavesurfer.on('timeupdate', (currentTime) => {
                setTime(formatTime(currentTime));
            }),
            wavesurfer.once('interaction', () => {
                wavesurfer.play()
            })
        ]

        return () => {
            subcriptions.forEach((unsub) => unsub());
        }
    }, [wavesurfer]);

    const onPlayClick = useCallback(() => {
        if (wavesurfer) {
            wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
        }
    }, [wavesurfer])

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secondsRemainder = Math.round(seconds) % 60
        const paddedSeconds = `0${secondsRemainder}`.slice(-2)
        return `${minutes}:${paddedSeconds}`
    }

    // calc comments distance
    const calcLeft = (moment: number) => {
        const hardcodeDuration = wavesurfer?.getDuration() ?? 0;
        let percent = (moment / hardcodeDuration) * 100;
        return `${percent}%`
    }

    useEffect(() => {
        if (wavesurfer && currentTrack.isPlaying) {
            wavesurfer.pause();
        }
    }, [currentTrack])

    useEffect(() => {
        if (track?._id && !currentTrack?._id)
            setCurrentTrack({ ...track, isPlaying: false })
    }, [track])

    const handleIncreaseView = async () => {
        if (firstViewRef.current) {

            await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/increase-view`,
                method: "POST",
                body: {
                    trackId: track?._id
                }
            })
            await sendRequest<IBackendRes<any>>({
                url: `/api/revalidate`,
                method: "POST",
                queryParams: {
                    tag: "track-by-id",
                    secret: "justArandomString"
                }
            })
            router.refresh();
            firstViewRef.current = false;
        }
    }

    return (
        <div style={{ marginTop: 60 }}>
            <div className="background-song">
                <div className="left">
                    <div className="info">
                        <div>
                            <div className="button-play"
                                onClick={() => {
                                    onPlayClick();
                                    handleIncreaseView();
                                    if (track && wavesurfer) {
                                        setCurrentTrack({ ...currentTrack, isPlaying: false })
                                    }
                                }}
                            >
                                {isPlaying === true ?
                                    <PauseIcon
                                        sx={{ fontSize: 30, color: "white" }}
                                    />
                                    :
                                    <PlayArrowIcon
                                        sx={{ fontSize: 30, color: "white" }}
                                    />
                                }
                            </div>
                        </div>
                        <div style={{ marginLeft: 20 }}>
                            <div className="song-title">
                                {track?.title}
                            </div>
                            <div className="description">
                                {track?.description}
                            </div>
                        </div>
                    </div>
                    <div ref={containerRef} className="waveform">
                        <div className="time" >{time}</div>
                        <div className="duration" >{duration}</div>
                        <div ref={hoverRef} className="hover-wave"></div>
                        <div className="overlay"></div>
                        <div className="comments"
                            style={{ position: "relative" }}>
                            {
                                comments?.map(item => {
                                    return (
                                        <Tooltip title={item.content} arrow key={item._id}>
                                            <Image
                                                onPointerMove={(e) => {
                                                    const hover = hoverRef.current!;
                                                    hover.style.width = calcLeft(item.moment + 3)
                                                }}
                                                alt="user-comment"
                                                key={item._id}
                                                height={20}
                                                width={20}
                                                style={{
                                                    position: "absolute",
                                                    top: 71,
                                                    zIndex: 20,
                                                    left: calcLeft(item.moment)
                                                }}
                                                src={fetchDefaultImages(item.user.type)}
                                            />
                                        </Tooltip>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="right">
                    <div style={{
                        background: "#ccc",
                        width: 250,
                        height: 250
                    }}>
                        {track?.imgUrl ?
                            <Image
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl}`}
                                width={250}
                                height={250}
                                alt="track-image"
                            />
                            :
                            <div style={{
                                background: "#ccc",
                                width: 250,
                                height: 250
                            }}></div>
                        }
                    </div>
                </div>
            </div>
            <div>
                <LikeTrack
                    track={track}
                />
            </div>
            <div>
                <CommentTrack
                    comments={comments}
                    track={track}
                    wavesurfer={wavesurfer}
                />
            </div>
        </div >
    )
}

export default WaveTrack;