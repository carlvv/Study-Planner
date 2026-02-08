export interface WeeklyData {
  Montag: number;
  Dienstag: number;
  Mittwoch: number;
  Donnerstag: number;
  Freitag: number;
  Samstag: number;
  Sonntag: number;
}

function displayValue(value: number, short: boolean = true) {
  if (value == 0) {
    return "0";
  }
  if (value == 60) {
    return "1h";
  }
  if (value < 90) {
    return value + (short ? "m" : "min");
  }

  if (value % 60 == 0) {
    return (value / 60).toFixed(0) + "h";
  }
  return (value / 60).toFixed(1) + "h";
}

function Line({
  height,
  y,
  offset,
  value,
}: {
  y: number;
  height: number;
  offset: number;
  value: number;
}) {
  let relativeHeight = 2 * offset + (y * height) / 100;

  return (
    <div
      className="absolute left-[3%] z-0 w-[93%]"
      style={{ bottom: `${relativeHeight}px` }}
    >
      <p className="h-2.5 text-sm text-gray-400 font-semibold">{displayValue(value)}</p>
      <div className="md:ml-[6%] ml-[10%] w-[90%] md:w-[97%] h-px bg-gray-400"></div>
    </div>
  );
}
export function WeeklyDiagramm({ data }: { data: WeeklyData }) {
  const max = Object.entries(data).reduce(
    (acc, val) => (acc > val[1] ? acc : val[1]),
    0,
  );
  const extendedData = Object.entries(data).map(([label, value]) => {
    return {
      label,
      value,
      percent: max === 0 ? 0 : value / max,
    };
  });

  const HEIGHT = 120;
  const OFFSET = 23.5;
  const bgColors = {
    0: "bg-green-300", // sehr wenig
    100: "bg-green-400",
    200: "bg-green-500",
    300: "bg-lime-500",
    400: "bg-yellow-400",
    500: "bg-yellow-500",
    600: "bg-orange-400",
    700: "bg-orange-500",
    800: "bg-red-500",
    900: "bg-red-600",
    1000: "bg-red-700", // sehr viel
  };

  return (
    <>
      {/* Spalten und Label */}
      <div className={`grid grid-cols-11 z-10 h-[${HEIGHT + OFFSET}px] `}>
        <div className="col-span-1 " />
        <div className={`col-span-10 grid grid-cols-7 relative `}>
          {extendedData.map((a) => (
            <div
              key={a.label}
              className="flex flex-col justify-end items-center w-full"
            >
              <p className="hidden md:block">{displayValue(a.value)}</p>
              <div
                className={`${(bgColors[Math.round(a.percent * 10) * 100])} w-6/8`}
                style={{
                  height: `${(a.percent * HEIGHT).toFixed(0)}px`,
                }}
              />
            </div>
          ))}

          {extendedData.map((a, i) => (
            <p className={`text-xm text-center mt-2 h-[${OFFSET}px]`} key={i}>
              {a.label.substring(0, 2)}
            </p>
          ))}
        </div>
      </div>
      {/* Background */}
      <Line y={0} height={HEIGHT} offset={OFFSET} value={0} />
      <Line y={25} height={HEIGHT} offset={OFFSET} value={(max * 1) / 4} />
      <Line y={50} height={HEIGHT} offset={OFFSET} value={(max * 2) / 4} />
      <Line y={75} height={HEIGHT} offset={OFFSET} value={(max * 3) / 4} />
      <Line y={100} height={HEIGHT} offset={OFFSET} value={max} />
    </>
  );
}
