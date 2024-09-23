import { mapColors } from "colors";
import React, { useMemo } from "react";

const Inlet = () => {
  const generateInlet = () => {
    const centerX = 1100;
    const centerY = 1100;
    const baseAngle = (90 + 17) * (Math.PI / 180); // 107 degrees in radians
    const innerRadius = 800;
    const outerRadius = 900;
    const extension = 20; // Extend the inlet by this many pixels on each end

    // Generate different angles for start and end points
    const startAngle = baseAngle + (Math.random() - 0.5) * 0.2;
    const endAngle = baseAngle + (Math.random() - 0.5) * 0.2;

    // Calculate start and end points with different angles
    const startX = centerX + (innerRadius - extension) * Math.cos(startAngle);
    const startY = centerY + (innerRadius - extension) * Math.sin(startAngle);
    const endX = centerX + (outerRadius + extension) * Math.cos(endAngle);
    const endY = centerY + (outerRadius + extension) * Math.sin(endAngle);

    // Generate a natural winding path
    const generateWindingPath = () => {
      const numPoints = 15;
      let path = `M${startX},${startY} `;

      const points = [[startX, startY]];
      const dx = endX - startX;
      const dy = endY - startY;
      let prevOffsetY = 0;

      for (let i = 1; i < numPoints - 1; i++) {
        const progress = i / (numPoints - 1);
        const x = startX + dx * progress;

        // Create a more natural winding effect
        const maxOffset = 80 * Math.sin(progress * Math.PI); // Max offset varies along the path
        const offsetY = prevOffsetY + (Math.random() - 0.5) * maxOffset;
        prevOffsetY = offsetY * 0.7; // Smooth out drastic changes

        const y = startY + dy * progress + offsetY;
        points.push([x, y]);
      }
      points.push([endX, endY]);

      // Create a smooth curve through the points
      for (let i = 1; i < points.length; i++) {
        const [x, y] = points[i];
        const [prevX, prevY] = points[i - 1];
        const midX = (prevX + x) / 2;
        const midY = (prevY + y) / 2;

        if (i === 1) {
          path += `Q${prevX},${prevY} ${midX},${midY} `;
        } else {
          path += `T${midX},${midY} `;
        }
      }
      path += `T${endX},${endY}`;

      return path;
    };

    const path = generateWindingPath();

    // Generate varying widths
    const numSegments = 50;
    const widths = Array(numSegments)
      .fill(0)
      .map(() => Math.random() * 8 + 4); // Random widths between 4 and 12

    const dashArray = widths.flatMap((width) => [width, 0]).join(" ");

    return { path, dashArray };
  };

  const { path, dashArray } = useMemo(generateInlet, []);

  return (
    <svg
      width="2200"
      height="2200"
      viewBox="0 0 2200 2200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={
          "M920.8384132853529,1859.1449965888532 Q920.8384132853529,1859.1449965888532 917.6566686539742,1861.2137964078124 T911.2931793912169,1872.9976692753826 T904.9296901284595,1897.934791313966 T898.5662008657021,1918.4739666570429 T892.2027116029446,1930.7837156402757 T885.8392223401873,1932.2213319348814 T879.47573307743,1934.5185897177266 T873.1122438146726,1938.5259413654567 T866.7487545519152,1929.0395536042313 T860.3852652891578,1921.912664812235 T854.0217760264005,1923.2421401910624 T847.6582867636431,1930.3458938279714 T841.2947975008858,1941.2582194066335 T834.9313082381284,1963.9526875044785 T831.7495636067497,1980.0236947803342"
        }
        stroke={mapColors.water}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="50"
        strokeDasharray={
          "9.965872491026042 0 7.662601004706016 0 6.107977422543771 0 5.240225858746214 0 5.578646027935404 0 11.257450092913581 0 9.730339459723774 0 5.653999729289831 0 5.419274981505765 0 9.710626301273583 0 9.681318454834672 0 9.352530152417089 0 9.486729327967112 0 9.660754866668928 0 5.707956478235653 0 6.88367259415425 0 9.982958635618113 0 4.226813213682499 0 10.779567125311742 0 6.211118316062301 0 8.416564060018393 0 7.3164078060856195 0 9.161117800801449 0 9.207511341729214 0 10.229046601108518 0 7.349771539779994 0 7.211254874822892 0 11.131112015833121 0 9.04978288487628 0 10.625244683235012 0 7.088159647884691 0 8.963719517089212 0 10.704127470216351 0 10.2566885963326 0 5.434021187443383 0 7.53555734814203 0 6.0766297530375954 0 5.917520575411157 0 4.080954066368989 0 10.249909371896532 0 4.7961300465091306 0 10.495388095688392 0 9.583781615101554 0 5.137492511683762 0 11.289720056770074 0 7.224894352857255 0 8.461478981701953 0 6.067197486062794 0 5.86982437677098 0 7.1032563252119 0"
        }
      />
    </svg>
  );
};

export default Inlet;
