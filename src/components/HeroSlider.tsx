import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { HeroSlide } from '../types';

interface HeroSliderProps {
  slides: HeroSlide[];
  onFindUniform: () => void;
  onPartnerWithUs: () => void;
}

export default function HeroSlider({ slides, onFindUniform, onPartnerWithUs }: HeroSliderProps) {
  const activeSlides = slides.filter(s => s.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (activeSlides.length === 0) return;

    if (!isHovered) {
      autoplayTimerRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % activeSlides.length);
      }, 6000);
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isHovered, activeSlides.length]);

  if (activeSlides.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % activeSlides.length);
  };

  const currentSlide = activeSlides[currentIndex];

  return (
    <div
      id="hero-slider-section"
      className="relative w-full h-[650px] sm:h-[750px] overflow-hidden bg-neutral-900"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Slides with Fade Transition */}
      {activeSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="object-cover w-full h-full scale-[1.03] transition-transform duration-[6000ms] ease-out"
          />
          {/* Apple Style Dark Gradients */}
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-neutral-950/70 to-neutral-950 z-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-neutral-950/40 z-20" />
        </div>
      ))}

      {/* Slide Content Overlay */}
      <div className="absolute inset-0 z-30 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl space-y-6 sm:space-y-8 text-white">
            {/* Small Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 bg-white/10 backdrop-blur-md rounded-full text-[10px] sm:text-xs tracking-[0.25em] font-mono text-neutral-200 uppercase animate-pulse">
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              {currentSlide.subtitle || 'OFFICIAL CAMPUS LINE'}
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-extrabold tracking-tight block leading-[1.05] drop-shadow-sm select-none">
              {currentSlide.title || 'Find Your Official Campus Uniform.'}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg lg:text-xl text-neutral-300 font-normal leading-relaxed max-w-2xl select-none">
              {currentSlide.description ||
                'Shop official institution-approved uniforms with verified quality and seamless online ordering.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={currentSlide.buttonText === 'Partner With Us' ? onPartnerWithUs : onFindUniform}
                className="group px-8 py-4 bg-white text-black hover:bg-neutral-100 rounded-xl text-sm font-semibold tracking-tight transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-white/10"
              >
                {currentSlide.buttonText || 'Find Uniform'}
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <button
                onClick={onPartnerWithUs}
                className="px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md text-white rounded-xl text-sm font-semibold tracking-tight transition-all duration-300 flex items-center justify-center"
              >
                Partner With Us
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full border border-white/15 bg-black/35 hover:bg-white text-white hover:text-black transition-all duration-300 backdrop-blur-md"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 animate-none" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full border border-white/15 bg-black/35 hover:bg-white text-white hover:text-black transition-all duration-300 backdrop-blur-md"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 animate-none" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5">
        {activeSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-500 rounded-full ${idx === currentIndex ? 'w-8 h-2 bg-white' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/60'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Soft Stats Ribbon at slide edge */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-black/45 backdrop-blur-md border-t border-white/10 py-6 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 justify-items-center">
            {/* Stat 1 */}
            <div className="text-center">
              <span className="block text-xl lg:text-2xl font-extrabold text-white tracking-tight leading-none mb-1">
                50+
              </span>
              <span className="block text-[10px] uppercase font-mono tracking-widest text-neutral-400">
                Institutions Enrolled
              </span>
            </div>
            {/* Stat 2 */}
            <div className="text-center border-x border-neutral-800 px-12 lg:px-20">
              <span className="block text-xl lg:text-2xl font-extrabold text-white tracking-tight leading-none mb-1">
                50+
              </span>
              <span className="block text-[10px] uppercase font-mono tracking-widest text-neutral-400">
                Verified Campus Students
              </span>
            </div>
            {/* Stat 3 */}
            <div className="text-center">
              <span className="block text-xl lg:text-2xl font-extrabold text-white tracking-tight leading-none mb-1">
                100+
              </span>
              <span className="block text-[10px] uppercase font-mono tracking-widest text-neutral-400">
                Orders Delivered
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
