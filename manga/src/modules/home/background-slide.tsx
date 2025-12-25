"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

import { Media } from "@/payload-types";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

export interface Slide {
  id: string;
  title?: string | null;
  link?: string | null;
  image: string | Media;
}

interface BackgroundSliderProps {
  slides: Slide[];
}
export const BackgroundSlider = ({ slides }: BackgroundSliderProps) => {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{ dynamicBullets: true }}
      loop
      className="h-125"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={slide.id ?? index}>
          
            <Image
              src={
                typeof slide.image === "string"
                  ? slide.image
                  : (slide.image?.url ?? "/img/background.png")
              }
              alt={slide.title ?? "banner"}
              fill
              priority={index === 0}
              className="object-cover"
            />
        </SwiperSlide>
        
      ))}
      
    </Swiper>
    
  );
};
