import React from "react";

interface Habit {
  id: string;
  name: string;
  progress: number;
}

interface HabitListProps {
  habits: Habit[];
  updateProgress: (id: string, increment: boolean) => void;
  deleteHabit: (id: string) => void;
}

export const HabitList: React.FC<HabitListProps> = ({
  habits,
  updateProgress,
  deleteHabit,
}) => (
  <div className="mb-8 space-y-4">
    {habits.map((habit) => (
      <div
        key={habit.id}
        className="border-primary/20 flex items-center justify-between border px-3 py-2"
      >
        <span className="font-mono text-sm">{habit.name}</span>
        <div className="flex space-x-3 text-xs">
          <button
            onClick={() => updateProgress(habit.id, false)}
            className="border-primary/20 hover:bg-primary/10 flex h-5 w-5 items-center justify-center border"
          >
            -
          </button>
          <code className="w-10 text-center tabular-nums">
            {habit.progress}%
          </code>
          <button
            onClick={() => updateProgress(habit.id, true)}
            className="border-primary/20 hover:bg-primary/10 flex h-5 w-5 items-center justify-center border"
          >
            +
          </button>
          <button
            onClick={() => deleteHabit(habit.id)}
            className="border-primary/20 flex h-5 w-5 items-center justify-center border hover:border-red-500 hover:text-red-500"
          >
            ×
          </button>
        </div>
      </div>
    ))}
  </div>
);
