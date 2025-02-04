"use client";
import React from "react";
import Hyperspeed from "./components/landing";
import EventSlider from "./components/EventSlider";
import eventsData from "./data/events.json";
import DecryptedText from "./components/ui/decryptedText";
import About from "./components/About"
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

      <div
        id="events"
        className="w-full bg-gray-950 py-16 relative overflow-hidden border-b border-red-900/30"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#aa000015,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,#ff000008,transparent)]" />

        {/* Decorative Lines */}
        <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-red-600 to-transparent" />
        <div className="absolute right-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-red-600 to-transparent" />

        {/* Corner Accents */}
        <div className="absolute left-2 top-2 w-8 h-8 border-l-2 border-t-2 border-red-700" />
        <div className="absolute right-2 top-2 w-8 h-8 border-r-2 border-t-2 border-red-700" />
        <div className="absolute left-2 bottom-2 w-8 h-8 border-l-2 border-b-2 border-red-700" />
        <div className="absolute right-2 bottom-2 w-8 h-8 border-r-2 border-b-2 border-red-700" />

        {/* Main Content Container */}
        <div className="relative z-10 w-full text-center">
          {/* Small top text */}
          <p className="text-red-600/50 text-center text-sm mb-2 font-['Chakra_Petch'] tracking-[0.3em] uppercase">
            HASH 2025
          </p>

          <DecryptedText
            text="Games and Events"
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

          {/* Decorative line below text */}
          <div className="mt-4 mx-auto w-32 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent" />
        </div>

        {/* Diagonal corner lines */}
        <div className="absolute left-0 top-0 w-16 h-16">
          <div className="absolute left-0 top-0 w-full h-0.5 bg-gradient-to-r from-red-600 to-transparent transform origin-left rotate-45" />
        </div>
        <div className="absolute right-0 top-0 w-16 h-16">
          <div className="absolute right-0 top-0 w-full h-0.5 bg-gradient-to-l from-red-600 to-transparent transform origin-right -rotate-45" />
        </div>

        {/* Animated pulse effect */}
        <div className="absolute inset-0 animate-pulse" />
      </div>

      <EventSlider events={eventsData.events} />
      <About />
    </>
  );
};

export default Home;
