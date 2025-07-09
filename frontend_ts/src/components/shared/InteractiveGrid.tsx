import React from "react";

const InteractiveGrid = () => {
  const rows = 30;
  const cols = 16;
  const totalBoxes = rows * cols;

  return (
    <div className="w-full h-[120vh] hidecroll flex items-center justify-center overflow-hidden">
      <div
        className="grid gap-[0.2px] bg-neutral-900"
        style={{
          gridTemplateColumns: `repeat(${cols}, 6.5rem)`, // 112px
          gridTemplateRows: `repeat(${rows}, 6.5rem)`,
        }}
      >
        {[...Array(totalBoxes)].map((_, i) => (
          <div
            key={i}
            className="w-28 h-28 bg-[#0e0e0c] hover:bg-neutral-800 transition duration-200 border border-neutral-800"
          />
        ))}
      </div>
    </div>
  );
};

export default InteractiveGrid;
