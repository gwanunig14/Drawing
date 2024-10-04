import { mapColors } from "colors";
import CrescentSea from "CreascentSea";
import Inlet from "Inlet";
import Islands from "Islands";
import React, {
  MouseEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

const Map = () => {
  const generateCoastline = () => {
    const radius = 900;
    const center = { x: 1100, y: 1100 };
    const points = 200;
    const maxDeviation = 20; // Reduced to 20 pixels

    let path = `M${center.x + radius},${center.y} `; // Start at rightmost point

    for (let i = 1; i <= points; i++) {
      const angle = (i / points) * 2 * Math.PI;
      const baseX = center.x + radius * Math.cos(angle);
      const baseY = center.y + radius * Math.sin(angle);

      // Create subtle angular deviations
      const deviation = (Math.random() * 2 - 1) * maxDeviation;
      const deviationAngle = angle + ((Math.random() - 0.5) * Math.PI) / 2;
      const deviatedX = baseX + deviation * Math.cos(deviationAngle);
      const deviatedY = baseY + deviation * Math.sin(deviationAngle);

      // Use straight lines for angularity
      path += `L${deviatedX},${deviatedY} `;

      // Occasionally add an extra point for more angularity (with reduced deviation)
      if (Math.random() < 0.2) {
        const extraDeviation = (Math.random() * 2 - 1) * maxDeviation * 0.5;
        const extraX =
          deviatedX + extraDeviation * Math.cos(angle + Math.PI / 2);
        const extraY =
          deviatedY + extraDeviation * Math.sin(angle + Math.PI / 2);
        path += `L${extraX},${extraY} `;
      }
    }

    path += "Z"; // Close the path
    return path;
  };

  const coastlinePath =
    "M2000,1100 L1988.2249822492313,1136.5721203825665 L1989.0440344295955,1161.1301584596076 L2010.2859499641443,1178.6408454222922 L1977.3669755608078,1201.0343512742577 L1976.2551671150375,1209.8352213445914 L1995.405996076139,1245.5202266821018 L1994.775360427496,1249.5019034639295 L1997.360140423706,1267.5189548532721 L1982.0425215017337,1297.161787551218 L1982.8656030153031,1329.9193632182462 L1967.220259640372,1350.012720579387 L1962.7474870247847,1389.0578411879953 L1934.5904166235537,1404.931218993666 L1926.8085503267191,1429.7312127306398 L1921.3540625056253,1455.9505706389914 L1909.2741059237744,1485.0063873044746 L1896.8165835549912,1506.1627830134428 L1894.0844804830458,1546.5778437046256 L1872.5461114210818,1558.3498250066514 L1859.6700099550203,1581.9998023010755 L1825.6789305418415,1602.6632122179287 L1816.2696402846411,1618.3821075545561 L1826.1285082529937,1659.8255960009546 L1797.2786860531326,1680.8813320271622 L1773.2267283754763,1692.5884498024982 L1769.6372250203847,1716.857811541336 L1763.082711328185,1723.8376596894568 L1734.4327501433818,1722.728984891899 L1729.337125033702,1727.8246100015788 L1716.5961126536718,1759.114309390361 L1705.2899580875414,1776.7901058228301 L1673.6811618021425,1776.6391642029623 L1650.243868895083,1824.195358404238 L1624.128448787315,1824.3481192030617 L1609.1935571206188,1848.2308335648745 L1607.8878034442525,1849.1182228469872 L1588.2765471477476,1865.652505069226 L1552.7522785824053,1862.6943748767171 L1533.552251372467,1889.016662658533 L1508.8891109732617,1887.6926400392217 L1481.950661165053,1913.2685090920604 L1450.364600195993,1918.0096731377307 L1435.207024204956,1945.5461786056064 L1414.9528165867355,1955.483284538308 L1387.0317838996014,1971.8224338944651 L1351.0522792343188,1972.898829409826 L1321.2301524231673,1979.0263263917755 L1323.6934021550226,1978.3938713559476 L1299.8235424023708,1983.2430779147344 L1266.5780310611922,1989.713247355896 L1261.5810824502644,1990.6664662833925 L1235.794864039755,1981.461693499759 L1209.4356960419793,1998.1558642239852 L1192.6056718359007,2003.959165629342 L1156.8076166346764,1985.3131659300354 L1124.4499566284198,1983.2987776134362 L1098.7876255656834,1985.87262066974 L1106.109824027529,1985.87262066974 L1072.4143824335065,2018.5680828085385 L1042.3175590748267,1990.8623199452916 L1007.8397932784065,2007.642368962834 L1015.5853116835639,2008.3745360190328 L986.7869826209761,1997.0686812864433 L952.8516318681299,1975.0128541378967 L928.7328663078159,1977.5546546636529 L915.4927396694447,1967.6615661571307 L876.4067367999089,1983.8988715412652 L843.6174067288958,1976.919881011371 L817.8899778560924,1945.3317158089385 L795.5227934580812,1951.6953904963786 L799.8033395532243,1953.2364819179777 L766.9626348092997,1938.6970795974514 L738.7335542176849,1937.1445515368202 L717.624189987997,1913.827611833137 L687.3069629004542,1904.9310568591327 L665.6396134125473,1889.0309081964772 L644.6283319550571,1872.4444426668656 L638.97366985909,1869.1002848255896 L627.3965763145492,1854.8253800912462 L598.3764621733176,1839.161135205972 L572.8662805696638,1827.627913722974 L570.9177319906915,1826.2122103124661 L538.971024795856,1824.8211697761633 L531.4177560245835,1785.0978184422536 L499.6399853359685,1781.5307995595917 L493.6227832533927,1747.9265029716826 L495.8476433664496,1750.015785684543 L469.01670326248535,1723.656853417768 L443.4458593982485,1719.9584201736268 L420.894841085323,1700.3671189238294 L422.67434415695254,1702.3855689509091 L395.48547182025726,1685.4014381072518 L397.04614443533546,1687.287967225852 L406.86044379390415,1652.8534277799474 L383.09620086802363,1630.5104744410264 L369.1079493208202,1601.8935300148325 L347.6852096669219,1564.753515432045 L313.6078364606373,1571.5297759090863 L313.8917806600656,1529.8125212668367 L312.9020638627138,1502.228226865259 L310.26676715334827,1497.0561658583351 L271.7165854594567,1483.3952283998308 L290.155503953876,1456.065744577362 L270.0105363651845,1431.4652216305763 L259.1892853969846,1397.1725164996446 L259.15534257137074,1397.0782366745784 L241.23538127405857,1382.9379889037737 L250.97001257788315,1343.5720508307743 L253.6547445636913,1352.812958938232 L231.78920361987844,1318.9982106623033 L222.9685990489338,1294.8661397422359 L199.5452541412651,1269.0173264938746 L201.31060386445952,1253.0396720176232 L214.4084174427614,1210.0075289938102 L194.50880584577632,1185.8782648362753 L217.6501768429846,1164.3985487142197 L200.2794856479736,1128.3365671819147 L208.5988344791048,1103.4800886124328 L211.25560872650692,1073.6342406347294 L211.04411683531941,1080.3640217323555 L199.93179054270735,1041.8243516326045 L199.97545365807514,1041.1303462873684 L221.70945126966726,1007.0213395640918 L204.3671932840855,987.939807207804 L194.1990853653802,967.6448752104441 L232.11750293002407,930.0836689683073 L224.21978014546644,904.659327513422 L219.60190016831996,870.6420537837105 L218.16786784364376,876.2272409339815 L225.78459902362133,844.9067943009412 L250.9043925157861,825.7519838779046 L240.74474827965736,793.0400106944173 L242.19683929527184,789.0066727369382 L265.51822675523,770.1271847005363 L282.0714985765902,750.6960583621873 L283.58376738067653,715.5632213475845 L297.535170972861,691.1651717575144 L306.5007399182503,666.6433361532131 L307.9765425034884,663.9588612163451 L320.28662802737506,626.7746257712216 L347.1009022301076,632.636284275892 L359.01678783320096,595.9015719701765 L382.6771022117025,570.6319850925953 L387.58857479385347,563.8719230276329 L397.4858497820873,549.4947337309081 L395.87170690238594,551.5756741924104 L394.2948198014922,525.6574644723469 L430.9290865311498,521.5934833340604 L444.03752950002905,483.97759623464333 L468.57298384490923,464.5509538065971 L478.3015313884081,433.31588967299126 L497.5279307503346,417.6789370290236 L493.87843662782126,420.8963989001515 L536.6200976172127,417.4677620904655 L537.9779284760082,385.617806441777 L583.7310532752574,382.8272388685531 L591.4948582154244,340.2720960968888 L610.7205475026474,335.78375726541316 L611.0971030998155,335.544787816852 L638.2403430783116,319.5593908169853 L660.729415032771,299.865962568154 L652.4679279755633,304.4077535118843 L694.7144665351544,283.9830189042401 L716.296048845747,283.54186684550194 L741.2923766764355,272.55543452794745 L757.4572725158237,250.8318446363069 L795.9804773769976,256.31334602904593 L818.3816850044745,240.9582328524425 L822.9160422034149,239.4849308887513 L854.7375103685403,239.3771926601203 L879.8716995246108,219.95656265124202 L899.4682542193123,205.90652953648546 L931.9028400762627,208.844595017455 L922.310520241789,210.67442788882434 L964.416742314094,201.5242298308407 L988.8709792766022,219.66205369742008 L997.0356587386811,218.63061481576392 L1005.4640500028567,220.15471244115184 L1043.0816329889656,203.25423729961108 L1075.6042924312196,214.2901673170823 L1099.9594234984747,199.62031137307116 L1125.7881778112146,207.16680886333754 L1160.195473468327,192.35589884879604 L1180.3591358096219,213.8287734204749 L1204.0422924744755,218.05469369133758 L1241.9440634133316,201.12146377558787 L1249.0949591237697,202.25405439050473 L1267.0634374636215,219.61130190804846 L1263.0108731495357,218.83823391998968 L1296.3504215715466,221.47732582157272 L1290.7554298624216,220.22669700299332 L1322.5298481221491,229.27698342266783 L1359.58758539924,219.83837342481954 L1389.5503392976946,237.871559039136 L1389.1919201127148,263.6464586718859 L1433.32233699942,260.0529114538918 L1444.6889420600198,287.62803450881484 L1481.5850466063546,289.67730324468266 L1502.0402474719203,311.90595724717707 L1532.6142438591958,324.52956783918034 L1556.5500848301485,342.8432218407677 L1564.4119518013495,347.49271700645784 L1578.9906542184358,344.46990595235155 L1585.0019185077317,348.2847702729767 L1606.0188308439558,354.87426755336105 L1619.84919494434,374.10043116032796 L1614.2206867443313,370.0110805837947 L1643.5090319687451,398.629193571763 L1686.093816957793,401.5850011289817 L1695.2178718442592,410.3853084779132 L1689.303719808055,405.17128208473287 L1722.8421570174269,433.5059401297253 L1742.7034014580004,461.42537660332954 L1750.4669363510166,490.64509096144536 L1755.393855623434,504.5702433511799 L1780.8372944685657,526.8821624241718 L1807.5595096032694,557.8200800609064 L1828.824083826978,569.1209884119576 L1833.797798553676,595.8419584459859 L1852.0573053662063,633.7608014980326 L1883.7885499044107,629.2441306122814 L1895.5325158173785,649.4566683153189 L1893.6499427116835,696.0391892202659 L1903.073537053648,721.4614244497204 L1927.3364208865921,741.0072322394058 L1924.2604001615223,733.8989677472528 L1923.6666102921752,773.9745999295824 L1926.005857018908,779.8828627317929 L1952.2385883567881,795.6082418243848 L1951.9287203020504,794.7475501917357 L1958.4955338904074,818.8233354938263 L1964.8048586506854,848.3577246658465 L1990.4043415074664,876.8377876122937 L1978.1133702318416,903.8564003674637 L1997.5350703264257,929.8658788962802 L1973.450534778741,959.279630678679 L1973.7928978211362,961.4412258561704 L1985.0224824360255,985.9423319967674 L1984.2110425050375,979.5191235477993 L1987.6228464355179,1021.641234855885 L2007.1769734733427,1044.3140683260895 L2007.03340822246,1071.9926402497708 L1998.0029063648756,1099.9843402901408 Z";

  const [regenerateTrigger, setRegenerateTrigger] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef<SVGSVGElement>(null);

  const handleRegenerate = () => {
    setRegenerateTrigger((prev) => prev + 1);
  };

  const handleCopyToClipboard = () => {
    if (mapRef.current) {
      const svgCode = mapRef.current.outerHTML;
      navigator.clipboard
        .writeText(svgCode)
        .then(() => {
          alert("Map SVG code copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          alert("Failed to copy to clipboard. See console for details.");
        });
    }
  };

  const handleZoom = useCallback((direction: "in" | "out") => {
    setZoomLevel((prevZoom) => {
      const newZoom =
        direction === "in"
          ? Math.min(prevZoom * 1.5, 5)
          : Math.max(prevZoom / 1.5, 0.25);

      // Adjust pan position when zooming to keep the center point fixed
      setPanPosition((prevPan) => ({
        x: prevPan.x * (newZoom / prevZoom),
        y: prevPan.y * (newZoom / prevZoom),
      }));

      return newZoom;
    });
  }, []);

  const handleMouseDown = (e: MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    setPanPosition((prevPan) => ({
      x: prevPan.x - dx / zoomLevel,
      y: prevPan.y - dy / zoomLevel,
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const viewBox = useMemo(() => {
    const size = 2040;
    const scaledSize = size / zoomLevel;
    const maxPan = size - scaledSize;

    const clampedX = Math.max(0, Math.min(panPosition.x, maxPan));
    const clampedY = Math.max(0, Math.min(panPosition.y, maxPan));

    return `${clampedX} ${clampedY} ${scaledSize} ${scaledSize}`;
  }, [zoomLevel, panPosition]);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <svg
        ref={mapRef}
        width="100%"
        height="100%"
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        {/* Water background */}
        <rect width="2040" height="2040" fill={mapColors.water} />

        {/* Island */}
        <path d={coastlinePath} fill={mapColors.mountain} />
        <CrescentSea />
        <Inlet />
        <Islands
          numLargeIslands={9}
          numSmallIslands={500}
          centerX={1100}
          centerY={1100}
          regenerateTrigger={regenerateTrigger}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <button onClick={handleRegenerate}>Regenerate Islands</button>
        <button onClick={handleCopyToClipboard}>Copy Map to Clipboard</button>
        <button onClick={() => handleZoom("in")} disabled={zoomLevel >= 5}>
          Zoom In
        </button>
        <button onClick={() => handleZoom("out")} disabled={zoomLevel <= 0.25}>
          Zoom Out
        </button>
        <div>Zoom Level: {zoomLevel.toFixed(2)}x</div>
      </div>
    </div>
  );
};

export default Map;
