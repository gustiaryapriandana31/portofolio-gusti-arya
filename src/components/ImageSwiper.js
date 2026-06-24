"use client";
import React, { useState, useEffect, useRef } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export default function ImageSwiper({ images, className = "" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  const startTimer = () => {
    stopTimer();
    if (images && images.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 4000); // Change image every 4 seconds
    }
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [images]);

  if (!images || images.length === 0) return null;

  if (images.length === 1) {
    return (
      <img
        src={images[0]}
        alt="Preview"
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  const handlePrev = (e) => {
    e.stopPropagation(); // Prevent card clicks if nested
    stopTimer();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    startTimer();
  };

  const handleNext = (e) => {
    e.stopPropagation(); // Prevent card clicks if nested
    stopTimer();
    setCurrentIndex((prev) => (prev + 1) % images.length);
    startTimer();
  };

  const handleDotClick = (e, index) => {
    e.stopPropagation(); // Prevent card clicks if nested
    stopTimer();
    setCurrentIndex(index);
    startTimer();
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden group/swiper`}
      onMouseEnter={stopTimer}
      onMouseLeave={startTimer}
    >
      {/* Slides wrapper */}
      <div 
        className="flex w-full h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <div key={idx} className="w-full h-full shrink-0">
            <img
              src={img}
              alt={`Slide ${idx + 1}`}
              className={`w-full h-full object-cover ${className}`}
            />
          </div>
        ))}
      </div>

      {/* Left Navigation Arrow */}
      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-950/70 border border-slate-800 text-slate-200 hover:text-accent hover:bg-slate-900 transition-all opacity-0 group-hover/swiper:opacity-100 focus:opacity-100 z-20"
      >
        <LuChevronLeft size={16} />
      </button>

      {/* Right Navigation Arrow */}
      <button
        type="button"
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-950/70 border border-slate-800 text-slate-200 hover:text-accent hover:bg-slate-900 transition-all opacity-0 group-hover/swiper:opacity-100 focus:opacity-100 z-20"
      >
        <LuChevronRight size={16} />
      </button>

      {/* Slide Indicators (Dots) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 bg-slate-950/40 px-2 py-1 rounded-full backdrop-blur-xs">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={(e) => handleDotClick(e, idx)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              idx === currentIndex ? "bg-accent w-3" : "bg-slate-500 hover:bg-slate-300"
            }`}
            title={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
