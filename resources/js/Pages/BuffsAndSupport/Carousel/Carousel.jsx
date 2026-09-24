import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Carousel({ eventPhotos = [] }) {
  const [positionIndexes, setPositionIndexes] = useState([0, 1, 2, 3, 4]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const totalSlides = eventPhotos.length;
  const positions = ["center", "left1", "left", "right", "right1"];
  const imageVariants = {
    center: { x: "0%", scale: 1, zIndex: 5, opacity: 1 },
    left1: { x: "-25%", scale: 0.7, zIndex: 3, opacity: 1 },
    left: { x: "-90%", scale: 0.5, zIndex: 2, opacity: 0 },
    right: { x: "90%", scale: 0.5, zIndex: 1, opacity: 0 },
    right1: { x: "25%", scale: 0.7, zIndex: 3, opacity: 1 },
  };

  const minSwipeDistance = 50;

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handleBack = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (!isPaused && totalSlides > 0) {
      const interval = setInterval(() => {
        handleNext();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isPaused, currentSlide, totalSlides]);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handleBack();
    }
  };

  // Get the visible slides based on current position
  // We show currentSlide in the center with 2 on each side
  const getVisibleSlides = () => {
    if (totalSlides === 0) return [];
    const slides = [];
    for (let i = 0; i < 5; i++) {
      const slideIndex = (currentSlide - 2 + i + totalSlides) % totalSlides;
      slides.push(slideIndex);
    }
    return slides;
  };

  const visibleSlides = getVisibleSlides();

  // Map each array index to its fixed position
  // arrayIndex 0 = left position 2
  // arrayIndex 1 = left1 position 1  
  // arrayIndex 2 = center position 0
  // arrayIndex 3 = right1 position 4
  // arrayIndex 4 = right position 3
  const getPositionForArrayIndex = (arrayIndex) => {
    const positionMap = [2, 1, 0, 4, 3]; // left, left1, center, right1, right
    return positionMap[arrayIndex];
  };

  return (
    <div className="w-full max-w-[1900px] h-auto px-2 md:px-12 mx-auto">
      <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-center mb-3 md:mb-10 text-white font-montserrat">EVENT PHOTOS</h2>
      <p className="text-center text-sm md:text-base text-gray-400 font-montserrat mb-6">
        Capturing memorable moments from our latest tournaments and events.
      </p>
      
      <div 
        className="relative flex items-center justify-center h-[200px] md:h-[400px] w-full overflow-hidden"
        style={{ minHeight: 200 }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {visibleSlides.map((photoIndex, arrayIndex) => {
          const photo = eventPhotos[photoIndex];
          if (!photo) return null;
          
          // Use fixed position mapping - center is always arrayIndex 2
          const positionIndex = getPositionForArrayIndex(arrayIndex);
          const positionName = positions[positionIndex];
          
          return (
            <motion.div
              key={`${photo.id || photoIndex}-${photoIndex}`}
              className="absolute rounded-2xl md:rounded-[40px] overflow-hidden shadow-lg"
              initial={positionName}
              animate={positionName}
              variants={imageVariants}
              transition={{ duration: 0.5 }}
              style={{
                width: "80vw",
                maxWidth: 320,
                height: 160,
                top: 0,
                // Scaled down for desktop
                ...(window.innerWidth >= 768 ? { width: 800, maxWidth: 800, height: 400 } : {})
              }}
            >
              <div 
                className="w-full h-full"
               
              >
                <img 
                  src={photo.picture || "/images/MCC/News/News - Holder.jpg"} 
                  alt={photo.event_name || photo.title || 'Event photo'} 
                  className="w-full h-full object-cover"
                  style={{ 
                    height: "100%",
                    width: "100%",
                    // Adjust object position based on array position to show the actual edges
                    objectPosition: 
                      arrayIndex === 0 || arrayIndex === 1 ? '0% center' : // Left - leftmost edge
                      arrayIndex === 3 || arrayIndex === 4 ? '100% center' : // Right - rightmost edge
                      'center center' // Center shows center
                  }}
                />
              </div>
              {/* Overlay for center and adjacent slides */}
              {arrayIndex === 1 || arrayIndex === 2 || arrayIndex === 3 ? (
                <div className="absolute bottom-0 left-0 right-0 p-2 md:p-6 bg-gradient-to-t from-black/80 to-transparent z-10">
                  <h3 className="text-sm md:text-lg lg:text-xl font-semibold text-white mb-1 md:mb-2 font-montserrat line-clamp-2">
                    {photo.event_name}
                  </h3>
                  <p className="text-xs md:text-sm lg:text-base text-white/90 font-montserrat">
                    {photo.school_name}
                  </p>
                </div>
              ) : null}
            </motion.div>
          );
        })}
      </div>
      
      {/* Navigation Controls Below Carousel */}
      <div className="hidden md:flex items-center justify-center gap-4 mt-0.5">
        <button
          onClick={handleBack}
          className="bg-white/10 hover:bg-white/20 text-white p-1.5 md:p-2 rounded-full backdrop-blur-sm transition-colors"
        >
          <ChevronLeft size={16} className="md:size-6" />
        </button>
        <div className="flex gap-1 md:gap-2 px-2 py-1 md:px-4 md:py-2 rounded-full">
          {eventPhotos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                const diff = (idx - currentSlide + totalSlides) % totalSlides;
                for (let i = 0; i < diff; i++) handleNext();
              }}
              className={`rounded-full transition-all ${
                currentSlide === idx
                  ? "w-2 h-2 md:w-3 md:h-3 bg-yellow-400"
                  : "w-1.5 h-1.5 md:w-2 md:h-2 bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          className="bg-white/10 hover:bg-white/20 text-white p-1.5 md:p-2 rounded-full backdrop-blur-sm transition-colors"
        >
          <ChevronRight size={16} className="md:size-6" />
        </button>
      </div>
    </div>
  );
}
