import React, { type RefObject } from "react";
import { motion } from "motion/react";

interface AddHabitInputProps {
  newHabit: string;
  setNewHabit: (val: string) => void;
  addHabit: () => void;
  newHabitInputRef: RefObject<HTMLInputElement | null>;
}

export const AddHabitInput: React.FC<AddHabitInputProps> = ({
  newHabit,
  setNewHabit,
  addHabit,
  newHabitInputRef,
}) => (
  <motion.div
    className="border-primary/20 mb-6 flex border"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.2 }}
    whileFocus={{ borderColor: "var(--color-primary)" }}
  >
    <input
      id="new-habit-input"
      ref={newHabitInputRef}
      type="text"
      value={newHabit}
      onChange={(e) => setNewHabit(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && addHabit()}
      placeholder="_new_habit"
      className="text-primary placeholder:text-primary/30 flex-1 bg-transparent px-3 py-2 font-mono text-sm focus:outline-none"
    />
    <motion.button
      onClick={addHabit}
      className="border-primary/20 hover:bg-primary/10 border-l px-4 text-sm"
      whileHover={{ backgroundColor: "rgba(var(--color-primary), 0.15)" }}
      whileTap={{ scale: 0.95 }}
    >
      +
    </motion.button>
  </motion.div>
);
