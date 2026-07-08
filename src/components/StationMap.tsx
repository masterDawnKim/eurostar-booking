"use client";

import { useState } from "react";
import { EUROSTAR_STATIONS, type StationWithCoords } from "@/lib/stations";

interface StationMapProps {
  onSelectOrigin: (station: StationWithCoords) => void;
  onSelectDestination: (station: StationWithCoords) => void;
  selectedOrigin?: string;
  selectedDestination?: string;
}

export default function StationMap({
  onSelectOrigin,
  onSelectDestination,
  selectedOrigin,
  selectedDestination,
}: StationMapProps) {
  const [selectMode, setSelectMode] = useState<"origin" | "destination">("origin");
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);

  const mapBounds = { minLat: 43, maxLat: 53, minLng: -2, maxLng: 9 };
  const width = 800;
  const height = 480;
  const padding = 50;

  function toSvgX(lng: number) {
    return padding + ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * (width - 2 * padding);
  }
  function toSvgY(lat: number) {
    return height - padding - ((lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat)) * (height - 2 * padding);
  }

  function handleStationClick(station: StationWithCoords) {
    if (selectMode === "origin") {
      onSelectOrigin(station);
      setSelectMode("destination");
    } else {
      onSelectDestination(station);
      setSelectMode("origin");
    }
  }

  const routes: [string, string][] = [
    ["7015400", "8727100"], ["7015400", "8800004"], ["7015400", "8400058"],
    ["8727100", "8718206"], ["8718206", "8800004"], ["8800004", "8400530"],
    ["8400530", "8400058"], ["8727100", "8772319"], ["8772319", "8775800"],
    ["8775800", "8775625"], ["8800004", "8000085"], ["8000085", "8008094"],
  ];

  const originStation = EUROSTAR_STATIONS.find((s) => s.uic === selectedOrigin);
  const destStation = EUROSTAR_STATIONS.find((s) => s.uic === selectedDestination);

  return (
    <div className="w-full">
      {/* Mode toggle + selected info */}
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectMode("origin")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectMode === "origin"
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-200)]"
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-current mr-1.5 opacity-70" />
            From
          </button>
          <button
            onClick={() => setSelectMode("destination")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectMode === "destination"
                ? "bg-[var(--color-neutral-900)] text-white shadow-sm"
                : "bg-[var(--color-neutral-100)] text-[var(--color-neutral-600)] hover:bg-[var(--color-neutral-200)]"
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-current mr-1.5 opacity-70" />
            To
          </button>
        </div>
        {(originStation || destStation) && (
          <div className="text-sm text-[var(--color-neutral-600)]">
            {originStation && (
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                {originStation.name.split(" ")[0]}
              </span>
            )}
            {originStation && destStation && <span className="mx-2 text-[var(--color-neutral-400)]">&rarr;</span>}
            {destStation && (
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[var(--color-neutral-900)]" />
                {destStation.name.split(" ")[0]}
              </span>
            )}
          </div>
        )}
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full rounded-xl overflow-hidden"
      >
        {/* Sea background */}
        <rect width={width} height={height} fill="#e8eef4" rx={12} />

        {/* Simplified land masses */}
        {/* Great Britain */}
        <path d={`M${toSvgX(-1.5)} ${toSvgY(50.5)} L${toSvgX(-0.5)} ${toSvgY(50.8)} L${toSvgX(0.5)} ${toSvgY(51)} L${toSvgX(1.2)} ${toSvgY(51.3)} L${toSvgX(1)} ${toSvgY(52)} L${toSvgX(0.5)} ${toSvgY(52.8)} L${toSvgX(-0.5)} ${toSvgY(53)} L${toSvgX(-1.8)} ${toSvgY(53)} L${toSvgX(-2)} ${toSvgY(52)} L${toSvgX(-1.8)} ${toSvgY(51)} Z`}
          fill="#f5f3ef" stroke="#d4cfc6" strokeWidth={1} />

        {/* Continental Europe */}
        <path d={`M${toSvgX(1)} ${toSvgY(51)} L${toSvgX(2)} ${toSvgY(51.2)} L${toSvgX(3.5)} ${toSvgY(51.5)} L${toSvgX(5)} ${toSvgY(51.8)} L${toSvgX(6.5)} ${toSvgY(52)} L${toSvgX(8)} ${toSvgY(52)} L${toSvgX(9)} ${toSvgY(51.5)} L${toSvgX(9)} ${toSvgY(50)} L${toSvgX(8)} ${toSvgY(49)} L${toSvgX(7.5)} ${toSvgY(48)} L${toSvgX(7)} ${toSvgY(47)} L${toSvgX(6)} ${toSvgY(46)} L${toSvgX(5.5)} ${toSvgY(44)} L${toSvgX(5)} ${toSvgY(43)} L${toSvgX(4)} ${toSvgY(43)} L${toSvgX(3)} ${toSvgY(43.5)} L${toSvgX(2)} ${toSvgY(44)} L${toSvgX(0.5)} ${toSvgY(45)} L${toSvgX(-0.5)} ${toSvgY(46)} L${toSvgX(-1)} ${toSvgY(47)} L${toSvgX(-1.5)} ${toSvgY(48)} L${toSvgX(-1.8)} ${toSvgY(48.8)} L${toSvgX(-1)} ${toSvgY(49)} L${toSvgX(0)} ${toSvgY(49.5)} L${toSvgX(1)} ${toSvgY(50)} Z`}
          fill="#f5f3ef" stroke="#d4cfc6" strokeWidth={1} />

        {/* Channel Tunnel hint */}
        <line x1={toSvgX(0.5)} y1={toSvgY(51)} x2={toSvgX(1.5)} y2={toSvgY(50.8)}
          stroke="var(--color-primary)" strokeWidth={2} strokeDasharray="4 3" opacity={0.3} />

        {/* Grid lines */}
        {[44, 46, 48, 50, 52].map((lat) => (
          <line key={`lat-${lat}`}
            x1={padding} y1={toSvgY(lat)}
            x2={width - padding} y2={toSvgY(lat)}
            stroke="#ccd3da" strokeWidth={0.5} strokeDasharray="4 6"
          />
        ))}

        {/* Route lines */}
        {routes.map(([from, to]) => {
          const f = EUROSTAR_STATIONS.find((s) => s.uic === from);
          const t = EUROSTAR_STATIONS.find((s) => s.uic === to);
          if (!f || !t) return null;
          return (
            <line key={`${from}-${to}`}
              x1={toSvgX(f.lng)} y1={toSvgY(f.lat)}
              x2={toSvgX(t.lng)} y2={toSvgY(t.lat)}
              stroke="#b8c0cc" strokeWidth={1.5} strokeDasharray="8 4"
            />
          );
        })}

        {/* Selected route highlight */}
        {selectedOrigin && selectedDestination && (() => {
          const from = EUROSTAR_STATIONS.find((s) => s.uic === selectedOrigin);
          const to = EUROSTAR_STATIONS.find((s) => s.uic === selectedDestination);
          if (!from || !to) return null;
          return (
            <>
              <line
                x1={toSvgX(from.lng)} y1={toSvgY(from.lat)}
                x2={toSvgX(to.lng)} y2={toSvgY(to.lat)}
                stroke="var(--color-primary)" strokeWidth={3} opacity={0.2}
              />
              <line
                x1={toSvgX(from.lng)} y1={toSvgY(from.lat)}
                x2={toSvgX(to.lng)} y2={toSvgY(to.lat)}
                stroke="var(--color-primary)" strokeWidth={2.5}
                markerEnd="url(#arrow)"
              />
            </>
          );
        })()}

        {/* Station dots */}
        {EUROSTAR_STATIONS.map((station) => {
          const x = toSvgX(station.lng);
          const y = toSvgY(station.lat);
          const isOrigin = selectedOrigin === station.uic;
          const isDestination = selectedDestination === station.uic;
          const isHovered = hoveredStation === station.uic;
          const isSelected = isOrigin || isDestination;

          let fill = "#8a95a0";
          let radius = 5;
          if (isOrigin) { fill = "#ff6000"; radius = 9; }
          else if (isDestination) { fill = "#191f28"; radius = 9; }
          else if (isHovered) { fill = selectMode === "origin" ? "#ff6000" : "#191f28"; radius = 7; }

          const shortName = station.name.replace(/ (Centraal|Hbf|International|St Pancras|Gare du Nord|Part-Dieu|St Charles|Europe|Station|TGV|Midi\/Zuid)/, "");

          return (
            <g key={station.uic}
              onMouseEnter={() => setHoveredStation(station.uic)}
              onMouseLeave={() => setHoveredStation(null)}
              className="cursor-pointer"
              onClick={() => handleStationClick(station)}
            >
              {/* Hit area */}
              <circle cx={x} cy={y} r={18} fill="transparent" />

              {/* Glow for selected */}
              {isSelected && (
                <circle cx={x} cy={y} r={radius + 6} fill={fill} opacity={0.12} />
              )}

              {/* Dot */}
              <circle cx={x} cy={y} r={radius} fill={fill} stroke="white" strokeWidth={2}
                className="transition-all duration-150"
              />

              {/* Label */}
              {(isSelected || isHovered) && (
                <>
                  <rect
                    x={x - shortName.length * 3.5 - 6}
                    y={y - radius - 22}
                    width={shortName.length * 7 + 12}
                    height={18}
                    rx={4}
                    fill={isSelected ? fill : "#333d4b"}
                    opacity={0.9}
                  />
                  <text x={x} y={y - radius - 10} textAnchor="middle" fontSize={10}
                    fill="white" fontWeight={600} className="pointer-events-none select-none"
                  >
                    {shortName}
                  </text>
                </>
              )}
              {!isSelected && !isHovered && (
                <text x={x} y={y - radius - 6} textAnchor="middle" fontSize={10}
                  fill="#6b7280" fontWeight={400} className="pointer-events-none select-none"
                >
                  {shortName}
                </text>
              )}
            </g>
          );
        })}

        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth={6} markerHeight={6} orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ff6000" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
