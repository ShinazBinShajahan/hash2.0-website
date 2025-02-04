'use client'

import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, StepForward } from 'lucide-react';
import Link from 'next/link';

interface Event {
  id: number;
  title: string;
  date: string;
  url: string;
  image: string;
}

interface EventSliderProps {
  events: Event[];
  showViewMore?: boolean; // New prop to control visibility of View More card
}

const EventSlider: React.FC<EventSliderProps> = ({ events, showViewMore }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<number | undefined>(undefined);
  
  // State to track if we are at the start or end of the slider
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 200; // card width + gap
      const maxScroll = container.scrollWidth - container.clientWidth;
      const currentScroll = container.scrollLeft;

      let newScrollLeft: number;
      if (direction === 'left') {
        newScrollLeft = currentScroll - scrollAmount;
        if (newScrollLeft < 0) {
          newScrollLeft = maxScroll; // Loop to end
        }
      } else {
        newScrollLeft = currentScroll + scrollAmount;
        if (newScrollLeft > maxScroll) {
          newScrollLeft = 0; // Loop to start
        }
      }
      
      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Update arrow visibility based on scroll position
  const updateArrowVisibility = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      setIsAtStart(container.scrollLeft === 0);
      setIsAtEnd(container.scrollLeft >= container.scrollWidth - container.clientWidth);
    }
  };

  // Auto scroll setup
  useEffect(() => {
    const startAutoScroll = () => {
      autoScrollIntervalRef.current = window.setInterval(() => {
        scroll('right');
      }, 5000);
    };

    const stopAutoScroll = () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };

    // Start auto-scroll
    startAutoScroll();

    // Pause on hover
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('mouseenter', stopAutoScroll);
      container.addEventListener('mouseleave', startAutoScroll);
      container.addEventListener('scroll', updateArrowVisibility); // Listen for scroll events
    }

    // Cleanup
    return () => {
      stopAutoScroll();
      if (container) {
        container.removeEventListener('mouseenter', stopAutoScroll);
        container.removeEventListener('mouseleave', startAutoScroll);
        container.removeEventListener('scroll', updateArrowVisibility); // Cleanup listener
      }
    };
  }, []);

  return (
    <div className="relative w-full pb-8 scrollbar">
      {/* Left Arrow */}
      {!isAtStart && (
        <button 
          onClick={() => scroll('left')}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 p-2 rounded-full backdrop-blur-sm transition-all duration-200 text-white/70 hover:text-white"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Right Arrow */}
      {!isAtEnd && (
        <button 
          onClick={() => scroll('right')}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 p-2 rounded-full backdrop-blur-sm transition-all duration-200 text-white/70 hover:text-white"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      )}

      <div 
        ref={scrollContainerRef}
        className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
      >
        {events.map((event) => (
          <div
            key={event.id}
            className="flex-none w-[280px] md:w-[320px] group relative cursor-pointer transition-transform duration-300 hover:scale-105"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100 group-hover:opacity-90 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg md:text-xl font-bold mb-2">{event.title}</h3>
                <p className="text-sm mb-3">
                  {event.date}
                </p>
                <a 
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200"
                >
                  Register Now
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* Conditionally Render View More Card */}
        {showViewMore && (
          <Link
            href="/events"
            className="flex-none w-[280px] md:w-[320px] group relative cursor-pointer transition-transform duration-300 hover:scale-105"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-gray-900 border-2 border-dashed border-red-600/30 hover:border-red-600/50 transition-colors duration-300">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                <StepForward size={48} className="mb-4 text-red-600" />
                <h3 className="text-lg md:text-xl font-bold text-center mb-2">View More Events</h3>
                <p className="text-sm text-gray-400 text-center">
                  Discover all available events and tournaments
                </p>
              </div>
            </div>
          </Link>
        )}
        
      </div>
    </div>
  );
};

export default EventSlider;
