'use client';

import React, { useEffect } from 'react';
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
import { Autoplay } from 'swiper/modules'; // Import Autoplay module
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';

// Enable Autoplay module
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
  const duplicatedLogos = [...logos, ...logos]; // Duplicate for seamless looping

  return (
    <div 
      className="w-full py-8 relative"
      style={{ backgroundColor: 'transparent' }}
    >
      <div className="max-w-7xl mx-auto px-4 overflow-hidden">
        <Swiper
          spaceBetween={32} // Gap between slides (matches your gap-8)
          slidesPerView={5} // Adjust based on how many logos you want visible
          loop={true} // Infinite loop
          autoplay={{
            delay: 0, // No delay between transitions
            disableOnInteraction: false, // Keep autoplaying even on interaction
          }}
          speed={5000} // Duration of slide transition in ms (adjust for smoother effect)
          freeMode={true} // Allows continuous scrolling
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