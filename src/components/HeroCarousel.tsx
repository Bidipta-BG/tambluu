"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const CAROUSEL_IMAGES = [
  "/images/1festivalglow.png",
  "/images/2northeastessence.png",
  "/images/3royaltambola.png",
  "/images/4neonnight.png",
  "/images/5colorsplash.png",
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3000); // Rotate every 3 seconds
    
    return () => clearInterval(timer);
  }, []);

  // 360 degrees / 5 images = 72 degrees per image
  const angleStep = 72;
  // Rotate the entire container negatively to bring the next image to the front (0 deg)
  const currentRotation = currentIndex * -angleStep;

  return (
    // Perspective container
    <div className="relative mx-auto w-full max-w-full h-[500px] flex items-center justify-center overflow-hidden [perspective:1200px]">
      
      {/* 3D Rotating Container */}
      <div 
        className="relative w-[220px] sm:w-[260px] lg:w-[280px] aspect-[9/16] transition-transform duration-1000 ease-out [transform-style:preserve-3d]"
        style={{ transform: `translateZ(-200px) rotateX(-5deg) rotateY(${currentRotation}deg)` }}
      >
        {CAROUSEL_IMAGES.map((src, idx) => {
          // Each card gets rotated to its position in the circle, then pushed outward by 200px
          const cardAngle = idx * angleStep;
          
          return (
            <div
              key={src}
              className="absolute inset-0 rounded-[1.5rem] border-[6px] border-gray-800 bg-black overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] [backface-visibility:hidden]"
              style={{ transform: `rotateY(${cardAngle}deg) translateZ(200px)` }}
            >
              <Image 
                src={src} 
                alt={`Theme ${idx + 1}`} 
                fill 
                sizes="240px"
                className="object-cover" 
                priority={idx === 0}
              />
              {/* Optional dark overlay for cards not in front to create depth */}
              <div 
                className="absolute inset-0 bg-black transition-opacity duration-1000 pointer-events-none"
                style={{ 
                  opacity: (currentIndex % 5 === idx || (currentIndex % 5 + 5) % 5 === idx) ? 0 : 0.6
                }}
              />
            </div>
          );
        })}
      </div>
      
    </div>
  );
}
