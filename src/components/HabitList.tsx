import React, { useState, useEffect } from "react";
import Confetti from "@/components/Confetti";

interface Habit {
  id: string;
  name: string;
  daysCompleted: number;
}

interface HabitListProps {
  habits: Habit[];
  updateProgress: (id: string, increment: boolean) => void;
  deleteHabit: (id: string) => void;
  overallProgress?: number;
}

export const HabitList: React.FC<HabitListProps> = ({
  habits,
  updateProgress,
  deleteHabit,
  overallProgress = 0,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedHabitName, setCompletedHabitName] = useState("");
  const [isOverallComplete, setIsOverallComplete] = useState(false);

  // Track previously completed habits to avoid repeated confetti
  const [completedHabits, setCompletedHabits] = useState<Set<string>>(
    new Set(),
  );

  // Check if overall progress reached 100%
  useEffect(() => {
    if (overallProgress === 100 && !isOverallComplete) {
      setIsOverallComplete(true);
      setShowConfetti(true);
      setCompletedHabitName("All habits");
    }
  }, [overallProgress, isOverallComplete]);

  // Wrapper for updateProgress to check for completion
  const handleUpdateProgress = (id: string, increment: boolean) => {
    // Call the original updateProgress function
    updateProgress(id, increment);

    // Check if this update completed a habit
    if (increment) {
      const habit = habits.find((h) => h.id === id);

      // If habit will reach 21 days and hasn't been celebrated yet
      if (habit && habit.daysCompleted === 20 && !completedHabits.has(id)) {
        setCompletedHabitName(habit.name);
        setShowConfetti(true);
        setCompletedHabits((prev) => new Set([...prev, id]));
      }
    }
  };

  // Reset confetti state
  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };

  return (
    <div className="relative mb-6 space-y-3">
      {showConfetti && (
        <>
          <Confetti active={showConfetti} onComplete={handleConfettiComplete} />
          <div className="text-primary animate-fade-in fixed top-1/4 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-black/80 px-4 py-2 text-center shadow-lg">
            <p className="text-lg font-bold">
              {completedHabitName === "All habits"
                ? "Congratulations!"
                : `${completedHabitName} completed!`}
            </p>
            <p className="mt-1 text-sm">
              {completedHabitName === "All habits"
                ? "You've reached 100% on all your habits!"
                : "You've successfully completed 21 days!"}
            </p>
          </div>
        </>
      )}

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
                className={`h-full transition-all duration-300 ${
                  habit.daysCompleted === 21 ? "bg-secondary" : "bg-primary"
                }`}
                style={{ width: `${(habit.daysCompleted / 21) * 100}%` }}
              />
            </div>
            <span
              className={`w-16 text-right text-xs whitespace-nowrap ${
                habit.daysCompleted === 21
                  ? "text-secondary font-bold"
                  : "text-primary/70"
              }`}
            >
              {habit.daysCompleted}/21 days
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdateProgress(habit.id, false)}
                className="border-primary/20 hover:bg-primary/10 flex h-5 w-5 items-center justify-center border"
                title="Remove a day"
                disabled={habit.daysCompleted === 0}
              >
                -
              </button>
              <button
                onClick={() => handleUpdateProgress(habit.id, true)}
                className="border-primary/20 hover:bg-primary/10 flex h-5 w-5 items-center justify-center border"
                title="Add a day"
                disabled={habit.daysCompleted === 21}
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
};
