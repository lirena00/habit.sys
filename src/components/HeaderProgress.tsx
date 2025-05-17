import React from "react";

interface HeaderProgressProps {
  overallProgress: number;
}

export const HeaderProgress: React.FC<HeaderProgressProps> = ({
  overallProgress,
}) => (
  <div className="mb-8">
    <div className="mb-2 flex items-center justify-between">
      <h1 className="text-xl font-bold tracking-widest">HABIT.SYS</h1>
      <code className="border-primary/20 border px-2 py-1 font-mono text-xs">
        {overallProgress}%
      </code>
    </div>
    <div className="border-primary/30 h-1.5 w-full border bg-[#111111]">
      <div
        className="bg-primary h-full transition-all duration-300"
        style={{ width: `${overallProgress}%` }}
      />
    </div>
    <div className="text-primary/50 mt-1 text-right text-xs">_progress</div>
  </div>
);
