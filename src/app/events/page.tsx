// pages/events/page.tsx
'use client'
import React from 'react';
import { Calendar } from 'lucide-react';
import eventsData from '../data/events.json';
import Image from 'next/image';

const EventsPage = () => {
  const events = eventsData?.events || [];
  
  if (!events.length) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-red-600">No events available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section with Slider */}
      <section className="flex items-center justify-center min-h-7 bg-gray-950 py-16 pb-0">
        <button
          onClick={() => window.location.href = "/"}
          className="px-6 py-3 bg-red-600 text-white rounded-full text-xl font-bold hover:bg-red-700 transition-colors duration-200"
        >
          Go to Home
        </button>
      </section>

      {/* All Events Grid */}
      <section className="relative w-full py-16 px-4 pt-10" id="events">
        <div className="container mx-auto">
          <h2 className="text-red-600 text-3xl md:text-4xl font-bold mb-8 font-['Chakra_Petch'] tracking-wider">
            All Events
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div 
                key={event.id}
                className="bg-gray-900 rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
              >
                <div className="relative h-96">
                <Image
                src={event.image}
                alt={event.title}
                fill
                loading='lazy'
                className="object-cover"
              />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">{event.title}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-300">
                      <Calendar size={16} className="mr-2" />
                      <span className="text-sm">{event.date}</span>
                    </div>
                  </div>
                  
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full bg-red-600 hover:bg-red-700 text-white text-center px-6 py-2 rounded-full font-semibold transition-colors duration-200"
                  >
                    Register Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
