"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { CardMangaItems } from "./card-mangaItems";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";



export const CardManga = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(false);
  const handleNext = () => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    if (swiper.isEnd) {
      swiper.slideTo(0); 
    } else {
      swiper.slideNext();
    }
  };

  const handlePrev = () => {
    const swiper = swiperRef.current;
     
    if (!swiper) return;

    if (swiper.isBeginning) {
      swiper.slideTo(swiper.slides.length -( swiper.params.slidesPerView as number));
    } else {
      swiper.slidePrev();
    }
  };

  return (
    <div className="relative">
      <Swiper
        modules={[Autoplay]}
        onSwiper={(swiper) => {swiperRef.current = swiper; setIsBeginning(swiper.isBeginning)}}
         breakpoints={{
          0: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 6 },
        }}
        slidesPerView={6}
          onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
        }}
        spaceBetween={16}
        autoplay={{ delay: 5000 }}
        className="h-70 "
      >
        {[1, 2, 3, 4, 5, 6, 7, 8,9,10,11,12,13,14,15,16,17,18,19,20].map((slide) => (
          <SwiperSlide key={slide}>
            <CardMangaItems />
          </SwiperSlide>
        ))}
      </Swiper>

       {!isBeginning && (
        <Button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30"
        >
          <ChevronLeft />
        </Button>
      )}

      <Button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-30"
      >
        <ChevronRight />
      </Button>
    </div>
  );
};
