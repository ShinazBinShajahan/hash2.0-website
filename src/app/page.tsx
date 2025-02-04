"use client";
import React from "react";
import Hyperspeed from "./components/landing";
import EventSlider from "./components/EventSlider";
import eventsData from "./data/events.json";
import AboutContent from "./components/About";
import Header from "./components/Header";
import EventsPage from "./components/EventsPage";


const Home = () => {
  return (
    <>
      <div className="w-full h-full relative min-h-[100vh] bg-black">
        <Hyperspeed
          effectOptions={{
            onSpeedUp: () => { },
            onSlowDown: () => { },
            distortion: "mountainDistortion",
            length: 400,
            roadWidth: 9,
            islandWidth: 2,
            lanesPerRoad: 3,
            fov: 90,
            fovSpeedUp: 150,
            speedUp: 2,
            carLightsFade: 0.4,
            totalSideLightSticks: 50,
            lightPairsPerRoadWay: 50,
            shoulderLinesWidthPercentage: 0.05,
            brokenLinesWidthPercentage: 0.1,
            brokenLinesLengthPercentage: 0.5,
            lightStickWidth: [0.12, 0.5],
            lightStickHeight: [1.3, 1.7],
            movingAwaySpeed: [60, 80],
            movingCloserSpeed: [-120, -160],
            carLightsLength: [400 * 0.05, 400 * 0.15],
            carLightsRadius: [0.05, 0.14],
            carWidthPercentage: [0.3, 0.5],
            carShiftX: [-0.2, 0.2],
            carFloorSeparation: [0.05, 1],
            colors: {
              roadColor: 0x080808,
              islandColor: 0x0a0a0a,
              background: 0x000000,
              shoulderLines: 0x131318,
              brokenLines: 0x131318,
              leftCars: [0xff102a, 0xeb383e, 0xff102a],
              rightCars: [0xdadafa, 0xbebae3, 0x8f97e4],
              sticks: 0xdadafa,
            },
          }}
        />
      </div>
      <AboutContent />
      <Header id="events" heading="Games and Events" />

      <div className="container mx-auto px-4">
        {eventsData.events.length >= 5 && <EventSlider events={eventsData.events.slice(0, 5)} showViewMore={true} />}
      </div>
    </>
  );
};

export default Home;
