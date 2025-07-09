import React from "react";
import InteractiveGrid from "../shared/InteractiveGrid";
import Navbar from "../shared/navbar/Navbar";
import TestimonialPill from "../shared/testimonialPill/TestimonialPill";
import RemittanceCard from "../shared/remittanceCard/RemittanceCard";

export const HeroSection = () => {
  return (
    <div className="relative bg-[#0e0e0c] w-full hidecroll h-screen overflow-y-scroll overflow-hidden">
      <Navbar />
      {/* Grid in the background */}
      <div className="absolute inset-0 z-50 w-full h-[120vh] hidecroll overflow-y-scroll">
        <InteractiveGrid />
      </div>

      {/* Hero text */}
      <div className="relative mt-32 sm:mt-28 flex flex-col items-center justify-center h-full text-[#eaece5] text-center px-4">
        <TestimonialPill />
        <div className="z-[100] text-4xl md:text-[4.2rem] font-bold leading-tight">
          Empowering global transfers <br />
          <span className="text-[#a4ff4c]">with every transaction</span>
        </div>

        <div className="z-[100] text-xl mt-4 text-gray-300 max-w-xl">
          Help your team effectively align tasks for remote work.
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button className="px-6 py-3 rounded-full bg-[#a4ff4c] text-black font-semibold hover:bg-lime-300 transition">
            Get Started
          </button>
          <button className="px-6 py-3 rounded-full border border-white hover:bg-white hover:text-black transition">
            Book A Demo
          </button>
        </div>
        <RemittanceCard />
      </div>
    </div>
  );
};
