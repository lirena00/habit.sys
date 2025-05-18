import React, { type RefObject } from "react";

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
  <div className="border-primary/20 mb-6 flex border">
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
    <button
      onClick={addHabit}
      className="border-primary/20 hover:bg-primary/10 border-l px-4 text-sm"
    >
      +
    </button>
  </div>
);
