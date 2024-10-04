import React, { useMemo } from "react";
import { mapColors } from "./colors";

interface IslandData {
  x: number;
  y: number;
  seed: number;
  type: string;
  size: number;
  rx: number;
  ry: number;
  rotation: number;
  terrainType: string;
  label: number;
}

interface IslandsProps {
  numLargeIslands?: number;
  numSmallIslands?: number;
  centerX?: number;
  centerY?: number;
  regenerateTrigger?: number;
  maxVolcanic?: number;
  maxDesert?: number;
  maxRock?: number;
}

const Islands: React.FC<IslandsProps> = ({
  numLargeIslands = 9,
  numSmallIslands = 80,
  centerX = 1100,
  centerY = 1100,
  regenerateTrigger = 0,
  maxVolcanic = 17,
  maxDesert = 29,
  maxRock = 10,
}) => {
  const seaRadius = 700;
  const topLimitLarge = centerY - seaRadius + seaRadius * 2 * 0.35;

  const random = (min: number, max: number, seed: number) => {
    const x = Math.sin(seed) * 10000;
    return (x - Math.floor(x)) * (max - min) + min;
  };

  const isIntersecting = (
    island1: Omit<IslandData, "label">,
    island2: IslandData
  ) => {
    const dx = island1.x - island2.x;
    const dy = island1.y - island2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const radius1 = Math.max(island1.rx, island1.ry);
    const radius2 = Math.max(island2.rx, island2.ry);

    return distance < radius1 + radius2 + 10;
  };

  const islandData = useMemo(() => {
    const data: IslandData[] = [];
    const islandTypes = ["round", "oval"];
    const totalAttempts = 10000;
    let attemptCount = 0;
    let labelCounter = 1; // Initialize label counter

    const terrainCounts = {
      volcanic: 0,
      desert: 0,
      rock: 0,
    };

    const getRandomTerrainType = (seed: number): string => {
      const availableTypes = ["plain", "forest"];
      if (terrainCounts.volcanic < maxVolcanic) availableTypes.push("volcanic");
      if (terrainCounts.desert < maxDesert) availableTypes.push("desert");
      if (terrainCounts.rock < maxRock) availableTypes.push("rock");

      const index = Math.floor(random(0, availableTypes.length, seed));
      const terrainType = availableTypes[index];

      if (terrainType in terrainCounts) {
        terrainCounts[terrainType as keyof typeof terrainCounts]++;
      }

      return terrainType;
    };

    const generateIsland = (
      isLarge: boolean,
      relaxConstraints: boolean = false
    ): Omit<IslandData, "label"> | null => {
      const seed = Math.floor(Math.random() * 1000000);
      const type = islandTypes[Math.floor(Math.random() * islandTypes.length)];

      const minSize = isLarge ? 0.8 : 0.2;
      const maxSize = isLarge ? 1 : 0.4;
      const size = random(minSize, maxSize, seed);

      let x: number, y: number;
      let placementAttempts = 0;
      const maxPlacementAttempts = relaxConstraints ? 1000 : 100;

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
        placementAttempts++;

        if (placementAttempts > maxPlacementAttempts) {
          if (relaxConstraints) return null;
          return generateIsland(isLarge, true);
        }
      } while (
        (Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2) >
          seaRadius * seaRadius ||
          (isLarge && y < topLimitLarge)) &&
        !relaxConstraints
      );

      const minBaseSize = isLarge ? 50 : 10;
      const maxBaseSize = isLarge ? 70 : 30;
      const baseSize = random(minBaseSize, maxBaseSize, seed) * size;

      const ratio = random(1.5, 3, seed);
      const rx = baseSize * Math.sqrt(ratio);
      const ry = baseSize / Math.sqrt(ratio);
      const rotation = random(0, 360, seed);
      const terrainType = isLarge ? "forest" : getRandomTerrainType(seed);

      return {
        x,
        y,
        seed,
        type,
        size,
        rx,
        ry,
        rotation,
        terrainType,
      };
    };

    // Generate large islands
    while (
      data.filter((island) => island.size >= 0.8).length < numLargeIslands &&
      attemptCount <= totalAttempts
    ) {
      let island = generateIsland(true);
      if (
        island &&
        !data.some((existingIsland) => isIntersecting(island, existingIsland))
      ) {
        data.push({ ...island, label: labelCounter++ });
      }
    }

    // Generate small islands
    while (
      data.length < numLargeIslands + numSmallIslands &&
      attemptCount <= totalAttempts
    ) {
      let island = generateIsland(false);
      if (
        island &&
        !data.some((existingIsland) => isIntersecting(island, existingIsland))
      ) {
        data.push({ ...island, label: labelCounter++ });
      }
    }

    console.log(
      `Generated ${data.length} islands (${
        data.filter((island) => island.size >= 0.8).length
      } large) in ${attemptCount} attempts`
    );
    console.log(`Terrain counts:`, terrainCounts);
    return data;
  }, [
    numLargeIslands,
    numSmallIslands,
    centerX,
    centerY,
    regenerateTrigger,
    maxVolcanic,
    maxDesert,
    maxRock,
  ]);

  const renderIsland = (island: IslandData) => {
    const props = {
      cx: 150,
      cy: 150,
      rx: island.rx,
      ry: island.ry,
      fill: mapColors[island.terrainType as keyof typeof mapColors],
      transform: `rotate(${island.rotation} 150 150)`,
    };

    return (
      <g>
        {island.type === "round" ? (
          <circle {...props} r={island.rx} />
        ) : (
          <ellipse {...props} />
        )}
        <text
          x="150"
          y="150"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={island.size >= 0.8 ? "20" : "10"}
          fontWeight="bold"
          transform={`rotate(-${island.rotation} 150 150)`}
        >
          {island.label}
        </text>
      </g>
    );
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
