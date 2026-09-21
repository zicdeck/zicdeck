import React from "react";

interface CubeProps {
  className?: string;
  size?: number;
  rotation?: number;
  opacity?: number;
  variant?: "solid" | "glass" | "wireframe";
}

export function IsometricCube({
  size = 80,
  rotation = 0,
  opacity = 1,
  variant = "solid",
  className = "",
}: CubeProps) {
  const width = size;
  const height = size * 1.15;

  return (
    <div
      className={`pointer-events-none select-none transition-transform duration-700 ${className}`}
      style={{
        width,
        height,
        transform: `rotate(${rotation}deg)`,
        opacity,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 115"
        className="h-full w-full drop-shadow-[0_8px_16px_rgba(20,21,26,0.04)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Top Face Gradient */}
          <linearGradient id={`topGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#ECEBE6" />
          </linearGradient>

          {/* Left Face Gradient */}
          <linearGradient id={`leftGrad-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E6E5DF" />
            <stop offset="100%" stopColor="#D5D4CC" />
          </linearGradient>

          {/* Right Face Gradient */}
          <linearGradient id={`rightGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D8D7CF" />
            <stop offset="100%" stopColor="#C4C3BA" />
          </linearGradient>

          {/* Glass Face Gradients */}
          <linearGradient id="glassTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ECEBE6" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="glassLeft" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E4E3DD" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#D2D1C8" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="glassRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D0CFC6" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#BCBBB2" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Soft ground shadow */}
        <ellipse
          cx="50"
          cy="106"
          rx="38"
          ry="7"
          fill="rgba(20, 21, 26, 0.04)"
          className="blur-[2px]"
        />

        {variant === "solid" && (
          <>
            {/* Top Face */}
            <polygon
              points="50,15 90,38 50,61 10,38"
              fill={`url(#topGrad-${variant})`}
              stroke="#DCDAD3"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            {/* Left Face */}
            <polygon
              points="10,38 50,61 50,105 10,82"
              fill={`url(#leftGrad-${variant})`}
              stroke="#D0CEC6"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            {/* Right Face */}
            <polygon
              points="50,61 90,38 90,82 50,105"
              fill={`url(#rightGrad-${variant})`}
              stroke="#C4C2B9"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </>
        )}

        {variant === "glass" && (
          <>
            {/* Top Face */}
            <polygon
              points="50,15 90,38 50,61 10,38"
              fill="url(#glassTop)"
              stroke="rgba(220, 218, 211, 0.8)"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            {/* Left Face */}
            <polygon
              points="10,38 50,61 50,105 10,82"
              fill="url(#glassLeft)"
              stroke="rgba(208, 206, 198, 0.8)"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            {/* Right Face */}
            <polygon
              points="50,61 90,38 90,82 50,105"
              fill="url(#glassRight)"
              stroke="rgba(196, 194, 185, 0.8)"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </>
        )}

        {variant === "wireframe" && (
          <>
            {/* Background faces / internal lines */}
            <line x1="50" y1="15" x2="50" y2="61" stroke="#D5D3CB" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="10" y1="82" x2="50" y2="61" stroke="#D5D3CB" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="90" y1="82" x2="50" y2="61" stroke="#D5D3CB" strokeWidth="1" strokeDasharray="3 3" />

            {/* Outer edges */}
            <polygon
              points="50,15 90,38 90,82 50,105 10,82 10,38"
              fill="rgba(255, 255, 255, 0.3)"
              stroke="#C0BEB5"
              strokeWidth="1.25"
              strokeLinejoin="round"
            />
            <line x1="50" y1="61" x2="50" y2="105" stroke="#C0BEB5" strokeWidth="1.25" />
            <line x1="50" y1="61" x2="10" y2="38" stroke="#C0BEB5" strokeWidth="1.25" />
            <line x1="50" y1="61" x2="90" y2="38" stroke="#C0BEB5" strokeWidth="1.25" />
          </>
        )}
      </svg>
    </div>
  );
}

export function AuthBackgroundCubes() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* 1. Top-Left Floating Cube (Large) */}
      <div className="absolute -top-6 left-[6%] sm:left-[10%] lg:left-[14%] animate-fade-in delay-100">
        <IsometricCube
          size={105}
          rotation={-14}
          opacity={0.8}
          variant="solid"
          className="hover:scale-105 transition-transform"
        />
      </div>

      {/* 2. Top-Right Floating Cube (Medium) */}
      <div className="absolute top-12 right-[5%] sm:right-[11%] lg:right-[15%] animate-fade-in delay-200">
        <IsometricCube
          size={78}
          rotation={12}
          opacity={0.75}
          variant="glass"
          className="hover:scale-105 transition-transform"
        />
      </div>

      {/* 3. Bottom-Right Floating Cube (Large) */}
      <div className="absolute bottom-10 right-[6%] sm:right-[10%] lg:right-[13%] animate-fade-in delay-300">
        <IsometricCube
          size={115}
          rotation={-8}
          opacity={0.7}
          variant="solid"
          className="hover:scale-105 transition-transform"
        />
      </div>

      {/* 4. Bottom-Left Floating Cube (Medium-Small) */}
      <div className="absolute bottom-16 left-[5%] sm:left-[9%] lg:left-[12%] animate-fade-in delay-200">
        <IsometricCube
          size={68}
          rotation={16}
          opacity={0.75}
          variant="solid"
          className="hover:scale-105 transition-transform"
        />
      </div>

      {/* 5. Subtle accent wireframe cube (Distant Top-Center-Right) */}
      <div className="hidden md:block absolute top-[28%] right-[22%] opacity-30 animate-fade-in delay-400">
        <IsometricCube
          size={46}
          rotation={-22}
          opacity={0.5}
          variant="wireframe"
        />
      </div>

      {/* 6. Subtle accent wireframe cube (Distant Bottom-Center-Left) */}
      <div className="hidden md:block absolute bottom-[26%] left-[21%] opacity-30 animate-fade-in delay-400">
        <IsometricCube
          size={42}
          rotation={25}
          opacity={0.5}
          variant="wireframe"
        />
      </div>
    </div>
  );
}
