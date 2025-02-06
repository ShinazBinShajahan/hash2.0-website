"use client";
import React from "react";
import Hyperspeed from "./_components/landing";
import EventSlider from "./_components/EventSlider";
import eventsData from "./data/events.json";
import AboutContent from "./_components/About";
import Header from "./_components/Header";
import GridMotion from "./_components/Gridmotion";
import DecryptedText from "./_components/ui/decryptedText";


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
      <div className="w-full bg-gray-950 py-16 pt-8 relative overflow-hidden text-center h-32">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#aa000015,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,#ff000008,transparent)]" />

        <DecryptedText
          text="Pro-Show"
          speed={50}
          revealDirection="center"
          useOriginalCharsOnly={false}
          animateOn="view"
          sequential={true}
          maxIterations={20}
          characters="ABCD1234!?"
          className="revealed w-full font-['Chakra_Petch'] text-2xl md:text-3xl lg:text-5xl font-bold text-red-600 text-center tracking-wider [text-shadow:0_0_10px_rgba(220,0,0,0.3)]"
          parentClassName="all-letters"
          encryptedClassName="encrypted"
        />
      </div>
      <GridMotion />
    </>
  );
};



export default Home;
