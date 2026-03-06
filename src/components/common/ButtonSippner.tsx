import React from "react";

interface ButtonSpinnerProps {
  size?: number;
  className?: string;
  color?: string;
}

const ButtonSpinner: React.FC<ButtonSpinnerProps> = ({
  size = 24,
  className = "",
  color = "text-white",
}) => {
  return (
    <span
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer dashed ring */}
      <svg
        viewBox="0 0 24 24"
        className="absolute inset-0 w-full h-full animate-spin-slow"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
      </svg>

      {/* Inner arc */}
      {/* <svg
        viewBox="0 0 24 24"
        className="absolute inset-0 w-full h-full animate-spin-reverse"
      >
        <circle
          cx="12"
          cy="12"
          r="7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="22 22"
          strokeLinecap="round"
        />
      </svg> */}

      {/* Orbiting plane */}
      <svg
        viewBox="0 0 24 24"
        className="absolute inset-0 w-full h-full animate-spin-slow"
      >
        <text
          x="12"
          y="4"
          textAnchor="middle"
          fontSize="12"
          fill="currentColor"
          className={color}
          style={{
            transformOrigin: "12px 4px",
            transform: "rotate(100deg)",
          }}
        >
          ✈
        </text>
      </svg>

      {/* Center plane */}
      {/* <span className={`relative z-10 text-xs leading-none ${color}`}>
        ✈
      </span> */}
    </span>
  );
};

export default ButtonSpinner;
