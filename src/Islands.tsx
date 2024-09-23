import React, { useMemo } from "react";
import RoundIsland from "./RoundIsland";
import OvalIsland from "./OvalIsland";

interface IslandData {
  x: number;
  y: number;
  seed: number;
  type: string;
  size: number;
  rx: number;
  ry: number;
  rotation: number;
}

interface IslandsProps {
  numLargeIslands?: number;
  numSmallIslands?: number;
  centerX?: number;
  centerY?: number;
  regenerateTrigger?: number;
}

const Islands: React.FC<IslandsProps> = ({
  numLargeIslands = 9,
  numSmallIslands = 80,
  centerX = 1100,
  centerY = 1100,
  regenerateTrigger = 0,
}) => {
  const seaRadius = 750; // Radius for 1500px diameter
  const topLimitLarge = centerY - seaRadius + seaRadius * 2 * 0.35; // 35% from the top for large islands

  const random = (min: number, max: number, seed: number) => {
    const x = Math.sin(seed) * 10000;
    return (x - Math.floor(x)) * (max - min) + min;
  };

  const isIntersecting = (island1: IslandData, island2: IslandData) => {
    const dx = island1.x - island2.x;
    const dy = island1.y - island2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const radius1 = Math.max(island1.rx, island1.ry);
    const radius2 = Math.max(island2.rx, island2.ry);

    return distance < radius1 + radius2 + 10; // Small buffer
  };

  const islandData = useMemo(() => {
    const data: IslandData[] = [];
    const islandTypes = ["round", "oval"];
    const totalAttempts = 1000;
    let attemptCount = 0;

    const generateIsland = (isLarge: boolean): IslandData | null => {
      const seed = Math.floor(Math.random() * 1000000);
      const type = islandTypes[Math.floor(Math.random() * islandTypes.length)];

      // Set minimum and maximum sizes for large and small islands
      const minSize = isLarge ? 0.8 : 0.2;
      const maxSize = isLarge ? 1 : 0.5;
      const size = random(minSize, maxSize, seed);

      let x: number, y: number;
      do {
        x = random(
          centerX - seaRadius,
          centerX + seaRadius,
          seed + attemptCount
        );
        y = random(
          centerY - seaRadius,
          centerY + seaRadius,
          seed + attemptCount + 1
        );
        attemptCount++;

        if (attemptCount > totalAttempts) return null;
      } while (
        Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2) >
          seaRadius * seaRadius ||
        (isLarge && y < topLimitLarge)
      );

      // Adjust base size range
      const minBaseSize = isLarge ? 40 : 10;
      const maxBaseSize = isLarge ? 60 : 30;
      const baseSize = random(minBaseSize, maxBaseSize, seed) * size;

      const ratio = random(1.5, 3, seed);
      const rx = baseSize * Math.sqrt(ratio);
      const ry = baseSize / Math.sqrt(ratio);
      const rotation = random(0, 360, seed);

      return { x, y, seed, type, size, rx, ry, rotation };
    };

    // Generate large islands
    for (let i = 0; i < numLargeIslands && attemptCount <= totalAttempts; i++) {
      let island = generateIsland(true);
      if (
        island &&
        !data.some((existingIsland) => isIntersecting(existingIsland, island!))
      ) {
        data.push(island);
      }
    }

    // Generate small islands
    for (let i = 0; i < numSmallIslands && attemptCount <= totalAttempts; i++) {
      let island = generateIsland(false);
      if (
        island &&
        !data.some((existingIsland) => isIntersecting(existingIsland, island!))
      ) {
        data.push(island);
      }
    }

    console.log(`Generated ${data.length} islands in ${attemptCount} attempts`);
    return data;
  }, [numLargeIslands, numSmallIslands, centerX, centerY, regenerateTrigger]);

  const renderIsland = (island: IslandData) => {
    const props = {
      seed: island.seed,
      regenerateTrigger: regenerateTrigger,
      size: island.size,
      rx: island.rx,
      ry: island.ry,
      rotation: island.rotation,
    };

    switch (island.type) {
      case "round":
        return <RoundIsland {...props} />;
      case "oval":
        return <OvalIsland {...props} />;
      default:
        return null;
    }
  };

  return (
    <g>
      {islandData.map((island, index) => (
        <g
          key={`${index}-${regenerateTrigger}`}
          transform={`translate(${island.x - 150}, ${island.y - 150})`}
        >
          {renderIsland(island)}
        </g>
      ))}
    </g>
  );
};

export default Islands;
