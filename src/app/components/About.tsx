/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DecryptedText from "./ui/decryptedText";

const AboutContent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="w-full bg-gray-950 pt-8 md:pt-12 pb-16 px-4 relative overflow-hidden border-b border-red-900/30">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#aa000015,transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent,#ff000008,transparent)]" />
      <div className="absolute inset-0 bg-[url('/grid.png')] opacity-10" />

      {/* Content Container */}
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Left Column - Text Content with Title */}
          <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
            {/* Section Heading */}
            <div className="relative z-10 mb-2 lg:mb-6">
              <DecryptedText
                text="ABOUT THE EVENT"
                speed={50}
                revealDirection="center"
                useOriginalCharsOnly={false}
                animateOn="view"
                sequential={true}
                maxIterations={20}
                characters="ABCD1234!?"
                className="text-red-600 text-2xl md:text-3xl font-['Chakra_Petch'] tracking-wider"
                parentClassName="all-letters"
                encryptedClassName="encrypted"
              />
              <div className="h-px w-32 bg-gradient-to-r from-red-600/50 to-transparent mt-2" />
            </div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gray-300 relative p-4 md:p-6"
            >
              {/* Decorative corner frames */}
              <div className="absolute left-0 top-0 w-4 h-4 border-l-2 border-t-2 border-red-600/50" />
              <div className="absolute right-0 top-0 w-4 h-4 border-r-2 border-t-2 border-red-600/50" />
              <div className="absolute left-0 bottom-0 w-4 h-4 border-l-2 border-b-2 border-red-600/50" />
              <div className="absolute right-0 bottom-0 w-4 h-4 border-r-2 border-b-2 border-red-600/50" />

              <div className="relative">
                <div className="absolute -left-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-red-600 to-transparent" />
                <div className="absolute -right-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-red-600 to-transparent" />

                <DecryptedText
                  text="HASH 2.0, the annual techno-cultural fest of the CSE Department, MBCCET Peermade, is set to take place on February 15, 2025. This edition features an exciting mix of technical challenges, gaming battles, workshops, and interactive exhibits, creating a platform for learning, competition, and collaboration."
                  speed={10}
                  revealDirection="start"
                  useOriginalCharsOnly={false}
                  animateOn="view"
                  sequential={false}
                  maxIterations={20}
                  characters="ABCD1234!?"
                  className="mb-4 leading-relaxed text-sm md:text-base"
                  parentClassName="all-letters"
                  encryptedClassName="encrypted"
                />

                <DecryptedText
                  text="This year, we are honored to host Farhan Bin Fazil, CEO & Founder of Offenso Hackers Academy, along with a robotic expo by Unique World Robotics. With tech showcases, thrilling games, and cultural performances, HASH 2.0 offers a unique experience for tech enthusiasts and creative minds alike."
                  speed={10}
                  revealDirection="end"
                  useOriginalCharsOnly={false}
                  animateOn="view"
                  sequential={false}
                  maxIterations={20}
                  characters="ABCD1234!?"
                  className="leading-relaxed text-sm md:text-base"
                  parentClassName="all-letters"
                  encryptedClassName="encrypted"
                />
              </div>

              {/* Animated line */}
              <div className="relative h-px w-full overflow-hidden mt-6">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/50 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-red-600/30 animate-pulse" />
              </div>
            </motion.div>
          </div>

          {/* Logo Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative px-4 md:px-8 py-6 order-1 lg:order-2"
          >
            <div className="aspect-square relative max-w-[280px] md:max-w-md mx-auto">
              {/* Logo Frame */}
              <div className="absolute inset-0 border-2 border-red-700/30 transform rotate-45 animate-pulse" />
              <div className="absolute inset-0 border-2 border-red-700/30 transform -rotate-45 animate-pulse" />

              {/* Corner Accents */}
              <div className="absolute -left-2 -top-2 w-6 h-6 border-l-2 border-t-2 border-red-700 animate-pulse" />
              <div className="absolute -right-2 -top-2 w-6 h-6 border-r-2 border-t-2 border-red-700 animate-pulse" />
              <div className="absolute -left-2 -bottom-2 w-6 h-6 border-l-2 border-b-2 border-red-700 animate-pulse" />
              <div className="absolute -right-2 -bottom-2 w-6 h-6 border-r-2 border-b-2 border-red-700 animate-pulse" />

              {/* Logo Container */}
              <div className="absolute inset-4 bg-gray-900 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(220,0,0,0.3)]">
                <img
                  src="/hash-red.png"
                  alt="HASH 2025 Logo"
                  className="w-full h-full object-cover transform transition-all duration-700 hover:scale-110 hover:brightness-125"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-600/10 to-transparent animate-scan" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-600/5 to-transparent animate-pulse" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-600/5 rounded-full blur-2xl animate-pulse" />
    </div>
  );
};

export default AboutContent;
