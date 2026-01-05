'use client';

import * as React from 'react';
import { useLayoutStore } from '../../store/useLayoutStore';
import { LightPuck } from '../../types';

export default function SoffitCanvas() {
  const { config, results } = useLayoutStore();
  const isPeak = config.mode === 'peak';

  // 1. Calculate Dimensions
  const PPI = 10; // Pixels Per Inch
  const PADDING = 60;
  const ROOF_ANGLE = 30 * (Math.PI / 180); // 30 degrees in radians

  const getX = (inches: number) => inches * PPI;

  const formatPosition = (rawInches: number) => {
    let feet = Math.floor(rawInches / 12);
    let inches = Math.round(rawInches % 12);
    if (inches === 12) { feet += 1; inches = 0; }
    return `${feet}' ${inches}"`;
  };

  let viewBox = "";
  let soffitY = 120;

  // --- STRAIGHT MODE CALCS ---
  const totalRunInches = (config.runLengthFeet * 12) + config.runLengthInches;

  if (!isPeak) {
    const canvasWidth = Math.max(800, totalRunInches * PPI + 200);
    const canvasHeight = 300;
    viewBox = `0 0 ${canvasWidth} ${canvasHeight}`;
  }
  // --- PEAK MODE CALCS ---
  else {
    const leftLen = (config.peakConfig.leftLengthFt * 12) + config.peakConfig.leftLengthIn;
    const rightLen = (config.peakConfig.rightLengthFt * 12) + config.peakConfig.rightLengthIn;

    // Project lengths onto X/Y axes
    const leftProj = getX(leftLen) * Math.cos(ROOF_ANGLE);
    const rightProj = getX(rightLen) * Math.cos(ROOF_ANGLE);
    const maxDrop = Math.max(getX(leftLen), getX(rightLen)) * Math.sin(ROOF_ANGLE);

    // Calculate ViewBox to center the Apex (0,0)
    // Min X is negative left projection minus padding
    const minX = -leftProj - PADDING;
    const minY = -PADDING; // Start slightly above apex
    const width = leftProj + rightProj + (PADDING * 2);
    const height = maxDrop + (PADDING * 2) + 100; // Extra height for labels

    viewBox = `${minX} ${minY} ${width} ${height}`;
  }

  // --- RENDER HELPERS ---

  const renderPuck = (puck: LightPuck, x: number, y: number) => (
    <g key={puck.id} transform={`translate(${x}, ${y})`}>
      {/* Puck Visual */}
      <circle r={9} fill="white" stroke={puck.hasConnector ? "#ef4444" : "#2563eb"} strokeWidth={puck.hasConnector ? 3 : 2} />
      <circle r={4} fill={puck.hasConnector ? "#ef4444" : "#fbbf24"} />

      {/* Index (Top) */}
      <text y={-18} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#4b5563">
        #{puck.index + 1}
      </text>

      {/* Position (Bottom) */}
      <text
        y={28}
        textAnchor="middle"
        fontSize="11"
        fontWeight="500"
        fontFamily="monospace"
        fill="#374151"
      >
        {formatPosition(Math.abs(puck.xPosition))}
      </text>
    </g>
  );

  const renderWire = (puck: LightPuck, nextPuck: LightPuck, x1: number, y1: number, x2: number, y2: number, keyOverride?: string) => {
    const slack = results.wireSlackAmount;
    const hasSlack = slack > 0.1;
    const isConnectorWire = nextPuck.hasConnector;

    // Midpoint for curve
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    // Drop for slack
    const dropHeight = hasSlack ? Math.min(100, slack * 12) : 0;
    const controlX = midX;
    const controlY = midY + dropHeight;

    return (
      <path
        key={keyOverride || `wire-${puck.id}`}
        d={`M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`}
        fill="none"
        stroke={isConnectorWire ? "#ef4444" : (hasSlack ? "#eab308" : "#374151")}
        strokeWidth={isConnectorWire ? 3 : 2}
        strokeDasharray={hasSlack && !isConnectorWire ? "4 3" : "none"}
        style={{ vectorEffect: 'non-scaling-stroke' }}
      />
    );
  };

  return (
    <div className="flex-1 bg-background relative flex flex-col items-center justify-center p-8">
      <div className="relative w-full h-full max-w-6xl max-h-[80vh] bg-white rounded-lg shadow-sm border border-border flex items-center justify-center overflow-hidden">
        <svg
          viewBox={viewBox}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
        >
          {/* --- STRAIGHT MODE RENDER --- */}
          {!isPeak && (
            <g transform="translate(40, 0)">
              {/* Global Group with Padding to fix Left Clipping */}

              {/* 1. Soffit Background (Thicker & Centered) */}
              {/* Centered on soffitY. Height 80 means y = center - 40 */}
              <rect
                x={-20} // Start slightly negative to cover the left edge gap visually
                y={soffitY - 40}
                width={getX(totalRunInches) + 40}
                height={80}
                fill="#e5e7eb"
                stroke="#d1d5db"
              />

              {/* 2. Ruler Ticks (Moved DOWN below the thicker soffit bar) */}
              {Array.from({ length: Math.ceil(totalRunInches / 12) + 1 }).map((_, i) => (
                <g key={`tick-${i}`} transform={`translate(${getX(i * 12)}, ${soffitY + 50})`}>
                  <line y1={-10} y2={0} stroke="#9ca3af" /> {/* Tick mark */}
                  <text x={0} y={15} textAnchor="middle" fontSize="10" fill="#6b7280" fontFamily="monospace">
                    {i}'
                  </text>
                </g>
              ))}

              {/* 3. Wires */}
              {results.pucks.map((puck, i) => {
                if (i === results.pucks.length - 1) return null;
                const nextPuck = results.pucks[i + 1];
                const x1 = getX(puck.xPosition);
                const x2 = getX(nextPuck.xPosition);
                return renderWire(puck, nextPuck, x1, soffitY, x2, soffitY);
              })}

              {/* 4. Pucks & Labels */}
              {results.pucks.map((puck) => (
                renderPuck(puck, getX(puck.xPosition), soffitY)
              ))}
            </g>
          )}

          {/* --- PEAK MODE RENDER --- */}
          {isPeak && results.peakData && (
            <g>
              {/* Roof Backgrounds */}
              {/* Left Arm Background */}
              <rect
                x={0} y={-40} width={getX((config.peakConfig.leftLengthFt * 12) + config.peakConfig.leftLengthIn) + 40} height={80}
                fill="#e5e7eb" stroke="#d1d5db"
                transform={`scale(-1, 1) rotate(${30})`}
              />
              {/* Right Arm Background */}
              <rect
                x={0} y={-40} width={getX((config.peakConfig.rightLengthFt * 12) + config.peakConfig.rightLengthIn) + 40} height={80}
                fill="#e5e7eb" stroke="#d1d5db"
                transform={`rotate(${30})`}
              />

              {/* Apex Marker */}
              <circle cx={0} cy={0} r={4} fill="#9ca3af" />

              {/* Bridge Wire: Connects the first puck of Left Arm to first puck of Right Arm */}
              {results.peakData!.leftPucks.length > 0 && results.peakData!.rightPucks.length > 0 && (() => {
                const leftPuck = results.peakData!.leftPucks[0];
                const rightPuck = results.peakData!.rightPucks[0];

                const lDist = Math.abs(leftPuck.xPosition * PPI);
                const lx = -lDist * Math.cos(ROOF_ANGLE);
                const ly = lDist * Math.sin(ROOF_ANGLE);

                const rDist = Math.abs(rightPuck.xPosition * PPI);
                const rx = rDist * Math.cos(ROOF_ANGLE);
                const ry = rDist * Math.sin(ROOF_ANGLE);

                // We treat the connection as going from Left -> Right for consistency
                return renderWire(leftPuck, rightPuck, lx, ly, rx, ry, "wire-bridge");
              })()}

              {/* Draw Wires & Pucks - Left */}
              {results.peakData!.leftPucks.map((puck, i) => {
                const dist = Math.abs(puck.xPosition * PPI);
                // Left arm goes negative X, positive Y
                const x = -dist * Math.cos(ROOF_ANGLE);
                const y = dist * Math.sin(ROOF_ANGLE);

                // Wire to next
                if (i < results.peakData!.leftPucks.length - 1) {
                  const nextPuck = results.peakData!.leftPucks[i + 1];
                  const nextDist = Math.abs(nextPuck.xPosition * PPI);
                  const nx = -nextDist * Math.cos(ROOF_ANGLE);
                  const ny = nextDist * Math.sin(ROOF_ANGLE);
                  return <React.Fragment key={`g-${puck.id}`}>{renderWire(puck, nextPuck, x, y, nx, ny)}{renderPuck(puck, x, y)}</React.Fragment>;
                }
                return renderPuck(puck, x, y);
              })}

              {/* Draw Wires & Pucks - Right */}
              {results.peakData!.rightPucks.map((puck, i) => {
                const dist = Math.abs(puck.xPosition * PPI);
                // Right arm goes positive X, positive Y
                const x = dist * Math.cos(ROOF_ANGLE);
                const y = dist * Math.sin(ROOF_ANGLE);

                // Wire to next
                if (i < results.peakData!.rightPucks.length - 1) {
                  const nextPuck = results.peakData!.rightPucks[i + 1];
                  const nextDist = Math.abs(nextPuck.xPosition * PPI);
                  const nx = nextDist * Math.cos(ROOF_ANGLE);
                  const ny = nextDist * Math.sin(ROOF_ANGLE);
                  return <React.Fragment key={`g-${puck.id}`}>{renderWire(puck, nextPuck, x, y, nx, ny)}{renderPuck(puck, x, y)}</React.Fragment>;
                }
                return renderPuck(puck, x, y);
              })}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
