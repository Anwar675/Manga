"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

import { Media } from "@/payload-types";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export interface Slide {
  id: string;
  title?: string | null;
  link?: string | null;
  image: string | Media;
}


export const BackgroundSlider = () => {
  const trpc = useTRPC()
  const {data:slides} = useSuspenseQuery(trpc.brand.getMany.queryOptions())
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{
        delay: 5000, 
        disableOnInteraction: false,
      }}
      pagination={{ dynamicBullets: true }}
      loop
      className="md:h-100 h-52"
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
