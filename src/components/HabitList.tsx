import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  overallProgress: number;
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  };

  const handleUpdateProgress = (id: string, increment: boolean) => {
    updateProgress(id, increment);

    if (increment) {
      const habit = habits.find((h) => h.id === id);
      if (habit && habit.daysCompleted === 20 && !completedHabits.has(id)) {
        setCompletedHabits((prev) => new Set([...prev, id]));
        setShowConfetti(true);
        setCompletedHabitName(habit.name);
      }
    }
  };

  return (
    <div className="mb-6 space-y-2">
      <Confetti
        active={showConfetti}
        onComplete={() => {
          setShowConfetti(false);
        }}
      />

      {showConfetti && (
        <motion.div
          className="border-primary/30 bg-primary/10 mb-2 border p-2 text-center text-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          🎉 Completed: {completedHabitName}!
        </motion.div>
      )}

      <motion.div
        className="space-y-2"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence>
          {habits.map((habit) => (
            <motion.div
              key={habit.id}
              id={`habit-${habit.id}`}
              className="border-primary/20 flex flex-col items-start gap-2 border p-2 sm:flex-row sm:items-center"
              variants={itemVariants}
              exit="exit"
              layout
              whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
            >
              <div className="flex-1">{habit.name}</div>
              <div className="flex items-center gap-2">
                <span className="text-primary/50 text-xs">
                  {habit.daysCompleted}/21
                </span>
                <div className="border-primary/20 flex h-1.5 w-full items-center border sm:w-24">
                  <motion.div
                    className={`h-full ${
                      habit.daysCompleted === 21
                        ? "bg-primary"
                        : "bg-primary/70"
                    }`}
                    initial={{ width: "0%" }}
                    animate={{ width: `${(habit.daysCompleted / 21) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <motion.button
                  onClick={() => handleUpdateProgress(habit.id, false)}
                  className="border-primary/20 hover:bg-primary/10 flex h-5 w-5 items-center justify-center border"
                  title="Remove a day"
                  whileTap={{ scale: 0.9 }}
                  disabled={habit.daysCompleted === 0}
                >
                  -
                </motion.button>
                <motion.button
                  onClick={() => handleUpdateProgress(habit.id, true)}
                  className="border-primary/20 hover:bg-primary/10 flex h-5 w-5 items-center justify-center border"
                  title="Add a day"
                  whileTap={{ scale: 0.9 }}
                  disabled={habit.daysCompleted === 21}
                >
                  +
                </motion.button>
                <motion.button
                  onClick={() => deleteHabit(habit.id)}
                  className="border-primary/20 hover:bg-primary/10 flex h-5 w-5 items-center justify-center border text-xs"
                  title="Delete habit"
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
