'use client';

import React from 'react';
import { 
  FaAmazon, 
  FaApple, 
  FaGoogle, 
  FaMicrosoft,
  FaYoutube,
  FaTwitch,
  FaSnapchat,
  FaTiktok
} from 'react-icons/fa';
import { SiX } from 'react-icons/si';
import SwiperCore from 'swiper';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/autoplay';

SwiperCore.use([Autoplay]);

interface Logo {
  Icon: React.ComponentType<{ className?: string }>;
  name: string;
}

const logos: Logo[] = [
  { Icon: FaAmazon, name: 'Amazon' },
  { Icon: FaApple, name: 'Apple' },
  { Icon: FaGoogle, name: 'Google' },
  { Icon: FaMicrosoft, name: 'Microsoft' },
  { Icon: SiX, name: 'X' },
  { Icon: FaYoutube, name: 'YouTube' },
  { Icon: FaTwitch, name: 'Twitch' },
  { Icon: FaSnapchat, name: 'Snapchat' },
  { Icon: FaTiktok, name: 'TikTok' },
];

const LogoSlider: React.FC = () => {
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div 
      className="w-full py-8 relative"
      style={{ backgroundColor: 'transparent' }}
    >
      <div className="max-w-7xl mx-auto px-4 overflow-hidden">
        <Swiper
          spaceBetween={32}
          slidesPerView={window.innerWidth < 640 ? 3 : 5}
          loop={true}
          autoplay={{
            delay: 1000,
            disableOnInteraction: false,
          }}
          speed={3000} 
          freeMode={true}
          style={{
            maskImage: 'linear-gradient(to right, transparent, var(--background-primary) 10%, var(--background-primary) 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, var(--background-primary) 10%, var(--background-primary) 90%, transparent)',
          }}
        >
          {duplicatedLogos.map((logo, index) => (
            <SwiperSlide key={`${logo.name}-${index}`}>
              <div
                className="flex-shrink-0 w-40 h-20 flex items-center justify-center group hover:bg-[var(--hover)] transition-all duration-200 rounded-lg"
              >
                <logo.Icon 
                  className="text-4xl text-[var(--text-2)] group-hover:text-[var(--active-mode)] transition-colors duration-200" 
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default LogoSlider;
