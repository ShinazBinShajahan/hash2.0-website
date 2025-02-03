
import React from "react";
import Hyperspeed from "./components/landing";
import EventSlider from './components/EventSlider';
import eventsData from './data/events.json';

const Home = () => {
  return (
    <>

    <div className="w-full h-full relative min-h-[100vh]"><Hyperspeed /></div>
      <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-red-600 mb-8 font-['Chakra_Petch']">
          
            College Events
          </h1>
        <EventSlider events={eventsData.events} />
      </div>

    </>
  );
};

export default Home;
