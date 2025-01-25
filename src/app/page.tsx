"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-zeBEVWFqbrKfqhKMzzXSVtyOiuFWMH.png"
          alt="Background"
          fill
          className="object-cover object-center opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* Main Content */}
      <div
        className={`relative z-10 text-center transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        {/* HASH 2.0 Logo */}
        <div className="relative w-[240px] h-[120px] md:w-[400px] md:h-[200px] mx-auto mb-12">
          <div className="absolute inset-0 blur-3xl bg-red-600/20 rounded-full group-hover:bg-red-600/30 transition-all duration-700" />
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-itGw10jfCgJJLiSl5XXuzs07SiyJ70.png"
            alt="HASH 2.0"
            fill
            className="object-contain drop-shadow-[0_0_30px_rgba(220,38,38,0.4)] group-hover:drop-shadow-[0_0_40px_rgba(220,38,38,0.5)] transition-all duration-700"
            priority
          />
        </div>

        {/* Redesigned Bottom Section */}
        <div className="space-y-10 relative">
          {/* Coming Soon with Darker Glitch Effect */}
          <div className="glitch-container">
            <h2
              className="text-4xl md:text-7xl text-gray-200 font-bold tracking-widest glitch layers"
              data-text="COMING SOON"
            >
              COMING SOON
            </h2>
          </div>

          {/* Improved Date Display */}
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-red-600/20 blur-md"></div>
            <p className="relative text-white text-xl md:text-3xl font-bold tracking-[0.2em] px-6 py-3 bg-black/50 backdrop-blur-sm border-t-2 border-b-2 border-red-600/50">
              FEBRUARY 15, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Binary Marquee */}
      <div className="absolute bottom-16 left-0 right-0 overflow-hidden">
        <div className="relative h-16">
          <div className="absolute bottom-0 left-0 right-0 h-full flex items-center bg-gradient-to-t from-black via-black/90 to-transparent">
            <div className="animate-scroll whitespace-nowrap flex items-center">
              <BinaryText />
              <BinaryText />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 bg-black py-4 text-center">
        <p className="text-white text-sm md:text-base">Annual Techno-Cultural fest of CSE department - MBCCET</p>
      </footer>
    </main>
  )
}

const BinaryText = () => (
  <>
    <span className="binary-text text-red-500/70">{"01001000 01000001 01010011 01001000 ".repeat(3)}</span>
    <span className="binary-text text-white/40">{"00100000 00110010 00101110 00110000 ".repeat(3)}</span>
  </>
)

  