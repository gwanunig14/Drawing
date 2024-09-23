import React, { useMemo } from "react";

interface RoundIslandProps {
  seed: number;
  fill?: string;
  regenerateTrigger?: number;
  size?: number;
}

const RoundIsland: React.FC<RoundIslandProps> = ({
  seed = 1,
  fill = "#4A5568",
  regenerateTrigger = 0,
  size = 1,
}) => {
  const circleProps = useMemo(() => {
    const random = (min: number, max: number) => {
      const x = Math.sin(seed * 9999 + regenerateTrigger) * 10000;
      return (x - Math.floor(x)) * (max - min) + min;
    };

    // Random radius between 40 and 60 for large islands, scaled down for small islands
    const baseRadius = random(40, 60);
    const radius = baseRadius * size;

    return {
      cx: 150,
      cy: 150,
      r: radius,
    };
  }, [seed, regenerateTrigger, size]);

  return (
    <svg
      width="300"
      height="300"
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx={circleProps.cx}
        cy={circleProps.cy}
        r={circleProps.r}
        fill={fill}
      />
    </svg>
  );
};

export default RoundIsland;
