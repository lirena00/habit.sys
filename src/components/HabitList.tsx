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
  <div className="mb-6 space-y-3">
    {habits.map((habit) => (
      <div
        key={habit.id}
        className="border-primary/20 flex flex-col items-start gap-2 border p-2 sm:flex-row sm:items-center"
      >
        <span className="max-w-full flex-1 truncate font-mono text-sm">
          {habit.name}
        </span>
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
          <div className="border-primary/20 flex h-1.5 w-full items-center border sm:w-24">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${habit.progress}%` }}
            />
          </div>
          <span className="text-primary/70 w-8 text-right text-xs">
            {habit.progress}%
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => updateProgress(habit.id, false)}
              className="border-primary/20 hover:bg-primary/10 flex h-5 w-5 items-center justify-center border"
            >
              -
            </button>
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
      </div>
    ))}
  </div>
);
