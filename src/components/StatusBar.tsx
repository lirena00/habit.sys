import React from "react";

interface StatusBarProps {
  systemUptime: number;
  habitsCount: number;
  currentDate: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  systemUptime,
  habitsCount,
  currentDate,
}) => (
  <div className="flex flex-col gap-1">
    <div className="border-primary/20 text-primary/50 flex justify-between border-t pt-2 text-xs">
      <span>sys.uptime: {systemUptime}s</span>
      <span>mem: {habitsCount * 128}kb</span>
      <span>v1.0.3</span>
    </div>
    <div className="text-primary/40 flex justify-between font-mono text-xs tracking-wide">
      <span>sys.{currentDate}</span>
      <span>{habitsCount} tasks_active</span>
    </div>
  </div>
);
