import React from "react";

interface OvalIslandProps {
  seed: number;
  fill?: string;
  regenerateTrigger?: number;
  size?: number;
  rx: number;
  ry: number;
  rotation: number;
}

const OvalIsland: React.FC<OvalIslandProps> = ({
  seed = 1,
  fill = "#4A5568",
  regenerateTrigger = 0,
  size = 1,
  rx,
  ry,
  rotation,
}) => {
  return (
    <svg
      width="300"
      height="300"
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx={150}
        cy={150}
        rx={rx}
        ry={ry}
        fill={fill}
        transform={`rotate(${rotation} 150 150)`}
      />
    </svg>
  );
};

export default OvalIsland;
