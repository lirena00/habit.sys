"use client";

import { useState, useEffect, useRef } from "react";

interface Habit {
  id: string;
  name: string;
  progress: number;
}

export default function HomePage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [overallProgress, setOverallProgress] = useState(0);
  const [command, setCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [showCommandHelp, setShowCommandHelp] = useState(false);
  const [welcomeText, setWelcomeText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [systemUptime, setSystemUptime] = useState(0);
  const commandInputRef = useRef<HTMLInputElement>(null);
  const newHabitInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize with sample habits
    const initialHabits = [
      { id: "1", name: "Meditate", progress: 70 },
      { id: "2", name: "Read a book", progress: 45 },
      { id: "3", name: "Exercise", progress: 30 },
    ];
    setHabits(initialHabits);

    // Calculate initial overall progress
    calculateOverallProgress(initialHabits);

    // Set current date
    const now = new Date();
    setCurrentDate(
      now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    );

    // Typewriter effect
    const message = "Initializing HABIT.SYS v1.0.3...";
    let index = 0;

    const typeEffect = setInterval(() => {
      setWelcomeText(message.substring(0, index));
      index++;

      if (index > message.length) {
        clearInterval(typeEffect);
      }
    }, 50);

    // Set up system uptime counter
    const uptimeInterval = setInterval(() => {
      setSystemUptime((prev) => prev + 1);
    }, 1000);

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+N to add new habit
      if (e.altKey && e.key === "n") {
        e.preventDefault();
        newHabitInputRef.current?.focus();
      }
      // Alt+C to focus command input
      if (e.altKey && e.key === "c") {
        e.preventDefault();
        commandInputRef.current?.focus();
      }
      // Escape to close help panel
      if (e.key === "Escape" && showCommandHelp) {
        setShowCommandHelp(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(typeEffect);
      clearInterval(uptimeInterval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showCommandHelp]);

  // Command auto-completion
  useEffect(() => {
    if (command.startsWith("/")) {
      const commands = [
        "/add",
        "/rm",
        "/remove",
        "/p",
        "/progress",
        "/help",
        "/?",
        "/close",
        "/export",
        "/clear",
        "/stats",
      ];
      setSuggestions(commands.filter((cmd) => cmd.startsWith(command)));
    } else {
      setSuggestions([]);
    }
  }, [command]);

  const calculateOverallProgress = (habitsList: Habit[]) => {
    if (habitsList.length === 0) {
      setOverallProgress(0);
      return;
    }

    const total = habitsList.reduce((sum, habit) => sum + habit.progress, 0);
    setOverallProgress(Math.round(total / habitsList.length));
  };

  const addHabit = (habitName: string = newHabit) => {
    if (habitName.trim() === "") return;

    const habit: Habit = {
      id: Date.now().toString(),
      name: habitName,
      progress: 0,
    };

    const updatedHabits = [...habits, habit];
    setHabits(updatedHabits);
    calculateOverallProgress(updatedHabits);
    setNewHabit("");
  };

  const updateProgress = (id: string, increment: boolean) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === id) {
        const newProgress = increment
          ? Math.min(habit.progress + 10, 100)
          : Math.max(habit.progress - 10, 0);
        return { ...habit, progress: newProgress };
      }
      return habit;
    });

    setHabits(updatedHabits);
    calculateOverallProgress(updatedHabits);
  };

  const setHabitProgress = (habitName: string, progressValue: number) => {
    const habitNameLower = habitName.toLowerCase();
    const updatedHabits = habits.map((habit) => {
      if (habit.name.toLowerCase() === habitNameLower) {
        return {
          ...habit,
          progress: Math.max(0, Math.min(100, progressValue)),
        };
      }
      return habit;
    });

    setHabits(updatedHabits);
    calculateOverallProgress(updatedHabits);
    return updatedHabits.some((h) => h.name.toLowerCase() === habitNameLower);
  };

  const deleteHabit = (id: string) => {
    const updatedHabits = habits.filter((habit) => habit.id !== id);
    setHabits(updatedHabits);
    calculateOverallProgress(updatedHabits);
  };

  const removeHabitByName = (habitName: string) => {
    const habitNameLower = habitName.toLowerCase();
    const habitToRemove = habits.find(
      (h) => h.name.toLowerCase() === habitNameLower,
    );

    if (habitToRemove) {
      deleteHabit(habitToRemove.id);
      return true;
    }
    return false;
  };

  const processCommand = (cmd: string) => {
    if (!cmd.startsWith("/")) return false;

    // Add to command history
    setCommandHistory((prev) => [...prev.slice(-4), cmd]);

    const parts = cmd.split(" ");
    const commandType = parts[0]?.toLowerCase() ?? "";

    // Help command
    if (commandType === "/help" || commandType === "/?") {
      setShowCommandHelp(true);
      return true;
    }

    // Close help
    if (commandType === "/close") {
      setShowCommandHelp(false);
      return true;
    }

    // Add habit command: /add habitName
    if (commandType === "/add" && parts.length > 1) {
      const habitName = parts.slice(1).join(" ");
      addHabit(habitName);
      return true;
    }

    // Remove habit command: /rm habitName or /remove habitName
    if (
      (commandType === "/rm" || commandType === "/remove") &&
      parts.length > 1
    ) {
      const habitName = parts.slice(1).join(" ");
      return removeHabitByName(habitName);
    }

    // Set progress command: /progress habitName percentage or /p habitName percentage
    if (
      (commandType === "/progress" || commandType === "/p") &&
      parts.length > 2
    ) {
      const progressValue = parseInt(parts[parts.length - 1] ?? "0", 10);
      if (isNaN(progressValue)) return false;

      const habitName = parts.slice(1, parts.length - 1).join(" ");
      return setHabitProgress(habitName, progressValue);
    }

    // Export command
    if (commandType === "/export") {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(habits));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "habits_export.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      setCommandHistory((prev) => [
        ...prev.slice(-4),
        "Habits exported to habits_export.json",
      ]);
      return true;
    }

    // Clear command history
    if (commandType === "/clear") {
      setCommandHistory([]);
      return true;
    }

    // Stats command
    if (commandType === "/stats") {
      const completed = habits.filter((h) => h.progress === 100).length;
      const avgProgress = overallProgress;
      setCommandHistory((prev) => [
        ...prev.slice(-4),
        `Stats: ${habits.length} habits, ${completed} completed, ${avgProgress}% average progress`,
      ]);
      return true;
    }

    return false;
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim() === "") return;

    const success = processCommand(command);
    if (!success && command.startsWith("/")) {
      // Add error feedback to history
      setCommandHistory((prev) => [
        ...prev.slice(-4),
        `Error: Unknown command "${command}"`,
      ]);
    }

    setCommand("");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#111111] p-5 font-mono text-[#32dfa0]">
      <div className="w-full max-w-md">
        {/* Typewriter Welcome Text */}
        <div className="mb-4 h-4 font-mono text-xs text-[#32dfa0]/80">
          {welcomeText}
        </div>

        {/* Header and Overall Progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-widest">HABIT.SYS</h1>
            <code className="border border-[#32dfa0]/20 px-2 py-1 font-mono text-xs">
              {overallProgress}%
            </code>
          </div>

          {/* Overall Progress Bar */}
          <div className="h-1.5 w-full border border-[#32dfa0]/30 bg-[#111111]">
            <div
              className="h-full bg-[#32dfa0] transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="mt-1 text-right text-xs text-[#32dfa0]/50">
            _progress
          </div>
        </div>

        {/* Habits List */}
        <div className="mb-8 space-y-4">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="flex items-center justify-between border border-[#32dfa0]/20 px-3 py-2"
            >
              <span className="font-mono text-sm">{habit.name}</span>
              <div className="flex space-x-3 text-xs">
                <button
                  onClick={() => updateProgress(habit.id, false)}
                  className="flex h-5 w-5 items-center justify-center border border-[#32dfa0]/20 hover:bg-[#32dfa0]/10"
                >
                  -
                </button>
                <code className="w-10 text-center tabular-nums">
                  {habit.progress}%
                </code>
                <button
                  onClick={() => updateProgress(habit.id, true)}
                  className="flex h-5 w-5 items-center justify-center border border-[#32dfa0]/20 hover:bg-[#32dfa0]/10"
                >
                  +
                </button>
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="flex h-5 w-5 items-center justify-center border border-[#32dfa0]/20 hover:border-red-500 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Habit */}
        <div className="mb-6 flex border border-[#32dfa0]/20">
          <input
            id="new-habit-input"
            ref={newHabitInputRef}
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addHabit()}
            placeholder="_new_habit"
            className="flex-1 bg-transparent px-3 py-2 font-mono text-sm text-[#32dfa0] placeholder:text-[#32dfa0]/30 focus:outline-none"
          />
          <button
            onClick={() => addHabit()}
            className="border-l border-[#32dfa0]/20 px-4 text-sm hover:bg-[#32dfa0]/10"
          >
            +
          </button>
        </div>

        {/* Command Terminal */}
        <div className="mb-6 border border-[#32dfa0]/20 bg-[#0a0a0a]">
          {/* Command History */}
          <div className="h-20 overflow-y-auto border-b border-[#32dfa0]/20 p-2 text-xs text-[#32dfa0]/70">
            {commandHistory.length === 0 ? (
              <div className="text-[#32dfa0]/50">
                Type /help for available commands
              </div>
            ) : (
              commandHistory.map((cmd, i) => (
                <div key={i} className="font-mono">
                  {cmd.startsWith("Error:") ? (
                    <span className="text-red-400">{cmd}</span>
                  ) : (
                    <span>{`> ${cmd}`}</span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Command Help Panel */}
          {showCommandHelp && (
            <div className="border-b border-[#32dfa0]/20 bg-[#0c0c0c] p-2 text-xs">
              <div className="mb-1 font-bold text-[#32dfa0]/90">
                Available Commands:
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                <div>
                  <span className="text-[#32dfa0]">/add</span> habit_name
                </div>
                <div>Add a new habit</div>
                <div>
                  <span className="text-[#32dfa0]">/rm</span> habit_name
                </div>
                <div>Remove a habit</div>
                <div>
                  <span className="text-[#32dfa0]">/p</span> habit_name value
                </div>
                <div>Set progress value (0-100)</div>
                <div>
                  <span className="text-[#32dfa0]">/help</span> or{" "}
                  <span className="text-[#32dfa0]">/?</span>
                </div>
                <div>Show this help</div>
                <div>
                  <span className="text-[#32dfa0]">/close</span>
                </div>
                <div>Close help panel</div>
                <div>
                  <span className="text-[#32dfa0]">/export</span>
                </div>
                <div>Export habits to JSON</div>
                <div>
                  <span className="text-[#32dfa0]">/clear</span>
                </div>
                <div>Clear command history</div>
                <div>
                  <span className="text-[#32dfa0]">/stats</span>
                </div>
                <div>Show habit statistics</div>
              </div>

              <div className="mt-2 border-t border-[#32dfa0]/20 pt-2">
                <div className="mb-1 font-bold text-[#32dfa0]/90">
                  Keyboard Shortcuts:
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  <div>
                    <span className="text-[#32dfa0]">Alt+N</span>
                  </div>
                  <div>Focus new habit input</div>
                  <div>
                    <span className="text-[#32dfa0]">Alt+C</span>
                  </div>
                  <div>Focus command input</div>
                  <div>
                    <span className="text-[#32dfa0]">Esc</span>
                  </div>
                  <div>Close help panel</div>
                </div>
              </div>
            </div>
          )}

          {/* Command Input */}
          <form onSubmit={handleCommandSubmit} className="relative flex">
            <span className="flex items-center pl-2 text-[#32dfa0]/60">
              root@habits:~$
            </span>
            <input
              id="command-input"
              ref={commandInputRef}
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="type /help for commands"
              className="flex-1 bg-transparent px-2 py-2 pl-2 font-mono text-sm text-[#32dfa0] placeholder:text-[#32dfa0]/30 focus:outline-none"
              autoComplete="off"
            />

            {/* Command suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute bottom-full left-0 z-10 w-full border border-[#32dfa0]/20 bg-[#0a0a0a]">
                {suggestions.map((suggestion, i) => (
                  <div
                    key={i}
                    className="cursor-pointer px-2 py-1 text-xs hover:bg-[#32dfa0]/10"
                    onClick={() => setCommand(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}

            {/* Cursor animation */}
            <span className="absolute top-1/2 right-2 h-4 w-1.5 -translate-y-1/2 transform animate-pulse bg-[#32dfa0]/80"></span>
          </form>
        </div>

        {/* Status and Date Display */}
        <div className="flex flex-col gap-1">
          {/* System Stats Line */}
          <div className="flex justify-between border-t border-[#32dfa0]/20 pt-2 text-xs text-[#32dfa0]/50">
            <span>sys.uptime: {systemUptime}s</span>
            <span>mem: {habits.length * 128}kb</span>
            <span>v1.0.3</span>
          </div>

          {/* Date Display */}
          <div className="flex justify-between font-mono text-xs tracking-wide text-[#32dfa0]/40">
            <span>sys.{currentDate}</span>
            <span>{habits.length} tasks_active</span>
          </div>
        </div>
      </div>
    </main>
  );
}
