'use client'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from "react-slick";
import { Box, Button, Divider } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Link from "next/link";
import { convertSlugUrl } from "@/utils/api";
import Image from "next/image";

interface IProps {
    data: ITrackTop[],
    title: string
}

const MainSlider = (props: IProps) => {

    const { data, title } = props;

    const PrevArrow = (props: any) => {
        return (
            <Button color="inherit" variant="contained" onClick={props.onClick}
                sx={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
                }}>
                <ChevronLeft />
            </Button>
        )
    }

    const NextArrow = (props: any) => {
        return (
            <Button color="inherit" variant="contained" onClick={props.onClick}
                sx={{
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
                }}>
                <ChevronRight />
            </Button>
        )
    }

    var setting: Settings = {
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 5,
        slidesToScroll: 1,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]

    };
    return (
        <Box sx={{
            margin: "0 50px",
            ".track": {
                padding: "0 10px",
                "img": {
                    height: 150,
                    width: 150
                }
            },
            "h3": {
                border: "1px solid #333",
                padding: "20px",
                height: "200px"
            }
        }}>
            <h2>{title}</h2>
            <Slider {...setting}>
                {data.map(track => {
                    return (
                        <div className="track" key={track._id}>
                            <div style={{
                                position: 'relative',
                                height: '150px',
                                width: '150px',
                            }}>

                                <Image
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`} alt="alt-image"
                                    fill
                                    style={{
                                        objectFit: "cover"
                                    }}
                                />
                            </div>
                            <Link
                                style={{
                                    textDecoration: "none",
                                    color: "unset"
                                }}
                                href={`track/${convertSlugUrl(track.title)}-${track._id}.html?audio=${track.trackUrl}`}>
                                <h4>{track.title}</h4>
                            </Link>
                            <h5>{track.description}</h5>
                        </div>
                    )
                })}
            </Slider>
            <Divider />
        </Box>
    )
}

export default MainSlider;