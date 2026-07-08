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

  const mapBounds = { minLat: 43, maxLat: 53, minLng: -1, maxLng: 8 };
  const width = 800;
  const height = 500;
  const padding = 40;

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

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSelectMode("origin")}
          className={`px-4 py-2 rounded-[9999px] text-[15px] transition-colors ${
            selectMode === "origin"
              ? "bg-[var(--color-primary)] text-white"
              : "bg-white text-[var(--color-neutral-700)] border border-[var(--color-neutral-300)]"
          }`}
        >
          Select Departure
        </button>
        <button
          onClick={() => setSelectMode("destination")}
          className={`px-4 py-2 rounded-[9999px] text-[15px] transition-colors ${
            selectMode === "destination"
              ? "bg-[var(--color-neutral-900)] text-white"
              : "bg-white text-[var(--color-neutral-700)] border border-[var(--color-neutral-300)]"
          }`}
        >
          Select Arrival
        </button>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full border border-[var(--color-neutral-200)] rounded-[var(--radius-card)] bg-[var(--color-neutral-50)]"
      >
        <rect width={width} height={height} fill="#f9fafb" rx={12} />

        {routes.map(([from, to]) => {
          const f = EUROSTAR_STATIONS.find((s) => s.uic === from);
          const t = EUROSTAR_STATIONS.find((s) => s.uic === to);
          if (!f || !t) return null;
          return (
            <line key={`${from}-${to}`}
              x1={toSvgX(f.lng)} y1={toSvgY(f.lat)}
              x2={toSvgX(t.lng)} y2={toSvgY(t.lat)}
              stroke="#d1d6dc" strokeWidth={2} strokeDasharray="6 3"
            />
          );
        })}

        {EUROSTAR_STATIONS.map((station) => {
          const x = toSvgX(station.lng);
          const y = toSvgY(station.lat);
          const isOrigin = selectedOrigin === station.uic;
          const isDestination = selectedDestination === station.uic;

          let fill = "#8a95a0";
          let radius = 6;
          if (isOrigin) { fill = "#ff6000"; radius = 10; }
          else if (isDestination) { fill = "#191f28"; radius = 10; }

          return (
            <g key={station.uic}>
              <circle cx={x} cy={y} r={radius} fill={fill} stroke="white" strokeWidth={2}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleStationClick(station)}
              />
              {(isOrigin || isDestination) && (
                <circle cx={x} cy={y} r={radius + 4} fill="none" stroke={fill} strokeWidth={2} opacity={0.3} />
              )}
              <text x={x} y={y - radius - 6} textAnchor="middle" fontSize={11}
                fill="#333d4b" fontWeight={isOrigin || isDestination ? 600 : 400}
                className="pointer-events-none select-none"
              >
                {station.name.replace(/ (Centraal|Hbf|International|St Pancras|Gare du Nord|Part-Dieu|St Charles|Europe|Station|TGV|Midi\/Zuid)/, "")}
              </text>
            </g>
          );
        })}

        {selectedOrigin && selectedDestination && (() => {
          const from = EUROSTAR_STATIONS.find((s) => s.uic === selectedOrigin);
          const to = EUROSTAR_STATIONS.find((s) => s.uic === selectedDestination);
          if (!from || !to) return null;
          return (
            <line
              x1={toSvgX(from.lng)} y1={toSvgY(from.lat)}
              x2={toSvgX(to.lng)} y2={toSvgY(to.lat)}
              stroke="#ff6000" strokeWidth={3} markerEnd="url(#arrow)"
            />
          );
        })()}

        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth={6} markerHeight={6} orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ff6000" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
