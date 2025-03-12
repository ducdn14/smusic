'use client'
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './banner.swiper.scss';

import slide1 from '../../../public/image/slide2.jpg';
import slide2 from '../../../public/image/slide1.jpg';
import slide3 from '../../../public/image/slide3.jpg';
import slide4 from '../../../public/image/sunset.jpg';
import Image from 'next/image';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


function SwiperSlider() {
    const arrImages = [slide1, slide2, slide3, slide4];

    return (
        <div className="container-slider">
            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={'auto'}
                coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 2.5,
                }}
                pagination={{ el: '.swiper-pagination', clickable: true }}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                modules={[EffectCoverflow, Pagination, Navigation]}
                className="swiper_container"
            >
                {arrImages.map((image) => {
                    return (
                        <SwiperSlide>
                            <Image src={image} alt="slide_image" />
                        </SwiperSlide>
                    )
                })}
                <div className="slider-controller">
                    <div className="swiper-button-prev slider-arrow">
                        <ArrowBackIcon sx={{
                            color: "#fff"
                        }}/>
                    </div>
                    <div className="swiper-button-next slider-arrow">
                        <ArrowForwardIcon sx={{
                            color: "#fff"
                        }} />
                    </div>
                    <div className="swiper-pagination"></div>
                </div>
            </Swiper>
        </div>
    );
}

export default SwiperSlider;