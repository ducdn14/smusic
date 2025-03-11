'use client'
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import slide2 from '../../../public/image/slide1.jpg';
import slide1 from '../../../public/image/slide2.jpg';
import slide3 from '../../../public/image/slide3.jpg';
import slide4 from '../../../public/image/sunset.jpg';
import Image from 'next/image';
import Container from '@mui/material/Container';
import "./banner.slider.scss"


const BannerSlider = () => {

    const arrImages = [slide1, slide2, slide3, slide4];

    const setting = {
        dots: true,
        fade: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoPlay: true,
        autoplaySpeed: 2000
    }

    return (
        <div style={{
            padding: "1rem"
        }}>
            <Slider {...setting}>
                {arrImages.map((image, index) => {
                    return (
                        <Container
                            className='slide-container'
                            key={index}
                            sx={{
                                height: "60vh"
                            }}>
                            <Image
                                src={image}
                                alt='slider-img'
                                fill
                                style={{
                                    objectFit: "cover"
                                }}
                            />
                        </Container>
                    )
                })}
            </Slider>
        </div>
    )
}

export default BannerSlider;