"use client";

import React, { useEffect, useMemo, useState } from "react";

interface Step {
  at: number;
  label: string;
}

interface PageLoaderProps {
  onDone?: () => void;
  duration?: number; // total duration in ms (default 3000ms)
  subtitle?: string;
  steps?: Step[];
}

const defaultSteps: Step[] = [
  { at: 0, label: "Searching available flights…" },
  { at: 30, label: "Checking seat availability…" },
  { at: 60, label: "Comparing best prices…" },
  { at: 85, label: "Almost there…" },
  { at: 98, label: "Done! Showing results ✓" },
];

const PageLoader: React.FC<PageLoaderProps> = ({
  onDone,
  duration = 3000,
  subtitle = "Please wait while we load your content",
  steps = defaultSteps,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [done, setDone] = useState<boolean>(false);

  const intervalTime = 30;
  const increment = 100 / (duration / intervalTime);

  useEffect(() => {
    let value = 0;

    const interval = setInterval(() => {
      value += increment;
      const newProgress = Math.min(value, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        setDone(true);
        setTimeout(() => {
          onDone?.();
        }, 500);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [increment, onDone]);

  const currentStep = useMemo(() => {
    return [...steps].reverse().find((s) => progress >= s.at);
  }, [progress, steps]);

  return (
    <div className=" flex flex-col justify-center items-center h-[200px]">
      {/* Top Floating Plane */}
      <div className="relative w-20 h-20 mb-8 flex justify-center items-center">
        <div className="w-20 h-20 rounded-full bg-[#7854B8]/20 flex items-center justify-center mx-auto">
          <span
            className="text-4xl text-[#7854B8]"
            style={{
              display: "inline-block",
              animation: "gentleFloat 2s ease-in-out infinite",
              filter: "drop-shadow(0 4px 12px rgba(59,130,246,0.3))",
            }}
          >
            ✈
          </span>
        </div>

        <div
          className="absolute inset-0 rounded-full border-2 border-[#7854B8]/80"
          style={{ animation: "pulseRing 1.8s ease-out infinite" }}
        />
      </div>

      <p className="text-slate-400 text-sm mb-8">{subtitle}</p>

      <style>{`
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(5deg); }
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;
