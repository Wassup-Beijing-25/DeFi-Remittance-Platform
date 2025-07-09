import React from "react";

const TestimonialPill = () => {
  const avatars = [
    "https://framerusercontent.com/images/3zMWhu9nc1jUygZFpWSCgodJC4.png",
    "https://framerusercontent.com/images/wCsIqSasTfw507K1v47Z752Yk.png",
    "https://framerusercontent.com/images/nRFAR3C2ibMODISGGbdAeeARYLY.png",
    "https://framerusercontent.com/images/nRFAR3C2ibMODISGGbdAeeARYLY.png",
  ];

  return (
    <div className="flex z-[100] mb-5 mt-20 flex items-center space-x-3 bg-[#21211f] backdrop-blur-md text-white pl-2 pr-6 py-1 rounded-full">
      {/* Avatar Group */}
      <div className="flex -space-x-2">
        {avatars.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`avatar-${index}`}
            className="w-8 h-8 rounded-full border-2 border-[#a4ff4c] bg-white"
          />
        ))}
      </div>

      {/* Text */}
      <span className="text-xs sm:text-sm font-medium text-gray-200">
        Where productivity meets simplicity.
      </span>
    </div>
  );
};

export default TestimonialPill;
