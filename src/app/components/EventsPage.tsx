import React from 'react';
import { Calendar } from 'lucide-react';
import EventSlider from './EventSlider';
import eventsData from "../data/events.json";

interface Event {
  id: number;
  title: string;
  date: string;
  url: string;
  image: string;
}

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
      <section className="relative w-full py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#aa000015,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,#ff000008,transparent)]" />
        
        {/* Corner Accents */}
        <div className="absolute left-2 top-2 w-8 h-8 border-l-2 border-t-2 border-red-700" />
        <div className="absolute right-2 top-2 w-8 h-8 border-r-2 border-t-2 border-red-700" />
        
        <div className="container mx-auto px-4">
          <h1 className="text-red-600 text-4xl md:text-5xl font-bold text-center mb-8 font-['Chakra_Petch'] tracking-wider">
            Featured Events
          </h1>
          {events.length >= 5 && <EventSlider events={events.slice(0, 5)} />}
        </div>
      </section>

      {/* All Events Grid */}
      <section className="relative w-full py-16 px-4" id="events">
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
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
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