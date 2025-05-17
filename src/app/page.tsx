"use client";

import { useState, useEffect, useRef } from "react";

interface Habit {
  id: string;
  name: string;
  progress: number;
}

// Theme color options
const themeColors = [
  { name: "green", variable: "--color-tgreen" },
  { name: "blue", variable: "--color-tblue" },
  { name: "yellow", variable: "--color-tyellow" },
  { name: "red", variable: "--color-tred" },
  { name: "pink", variable: "--color-tpink" },
  { name: "purple", variable: "--color-tpurple" },
];

// Function to update the primary color based on theme selection
const updatePrimaryColor = (index: number) => {
  const themeColor = getComputedStyle(
    document.documentElement,
  ).getPropertyValue(themeColors[index].variable);
  document.documentElement.style.setProperty("--color-primary", themeColor);
};

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
  const [activeThemeIndex, setActiveThemeIndex] = useState(0);
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

    // Load theme from localStorage
    const savedThemeIndex = localStorage.getItem("habitThemeIndex");
    if (savedThemeIndex !== null) {
      setActiveThemeIndex(parseInt(savedThemeIndex, 10));
      updatePrimaryColor(parseInt(savedThemeIndex, 10));
    }

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
      // Ctrl+K to show command help
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        setShowCommandHelp(true);
      }
      // Alt+T to cycle through themes
      if (e.altKey && e.key === "t") {
        e.preventDefault();
        setActiveThemeIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % themeColors.length;
          updatePrimaryColor(nextIndex);
          localStorage.setItem("habitThemeIndex", nextIndex.toString());
          return nextIndex;
        });
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
    <main className="text-primary flex min-h-screen flex-col items-center justify-center bg-[#111111] p-5 font-mono">
      <div className="w-full max-w-md">
        {/* Typewriter Welcome Text */}
        <div className="text-primary/80 mb-4 h-4 font-mono text-xs">
          {welcomeText}
        </div>

        {/* Help Modal Popup */}
        {showCommandHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
            <div className="border-primary/40 relative w-[90%] max-w-md border-2 bg-[#0a0a0a] p-5">
              <button
                onClick={() => setShowCommandHelp(false)}
                className="text-primary/80 hover:text-primary absolute top-2 right-2 text-lg"
              >
                ×
              </button>

              <h2 className="border-primary/20 text-primary mb-4 border-b pb-2 text-lg font-bold">
                Command Reference
              </h2>

              <div className="mb-4">
                <div className="text-primary/90 mb-2 font-bold">
                  Available Commands:
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                  <div>
                    <span className="text-primary font-bold">/add</span>{" "}
                    habit_name
                  </div>
                  <div>Add a new habit</div>
                  <div>
                    <span className="text-primary font-bold">/rm</span>{" "}
                    habit_name
                  </div>
                  <div>Remove a habit</div>
                  <div>
                    <span className="text-primary font-bold">/p</span>{" "}
                    habit_name value
                  </div>
                  <div>Set progress value (0-100)</div>
                  <div>
                    <span className="text-primary font-bold">/export</span>
                  </div>
                  <div>Export habits to JSON</div>
                  <div>
                    <span className="text-primary font-bold">/clear</span>
                  </div>
                  <div>Clear command history</div>
                  <div>
                    <span className="text-primary font-bold">/stats</span>
                  </div>
                  <div>Show habit statistics</div>
                </div>
              </div>

              <div className="border-primary/20 mt-4 border-t pt-4">
                <div className="text-primary/90 mb-2 font-bold">
                  Keyboard Shortcuts:
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                  <div>
                    <span className="text-primary font-bold">Alt+N</span>
                  </div>
                  <div>Focus new habit input</div>
                  <div>
                    <span className="text-primary font-bold">Alt+C</span>
                  </div>
                  <div>Focus command input</div>
                  <div>
                    <span className="text-primary font-bold">Ctrl+K</span>
                  </div>
                  <div>Show command help</div>
                  <div>
                    <span className="text-primary font-bold">Alt+T</span>
                  </div>
                  <div>Cycle through themes</div>
                  <div>
                    <span className="text-primary font-bold">Esc</span>
                  </div>
                  <div>Close help panel</div>
                </div>
              </div>

              <div className="text-primary/50 mt-6 text-center text-xs">
                Press <span className="text-primary">Esc</span> to close
              </div>
            </div>
          </div>
        )}

        {/* Header and Overall Progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-widest">HABIT.SYS</h1>
            <code className="border-primary/20 border px-2 py-1 font-mono text-xs">
              {overallProgress}%
            </code>
          </div>

          {/* Overall Progress Bar */}
          <div className="border-primary/30 h-1.5 w-full border bg-[#111111]">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="text-primary/50 mt-1 text-right text-xs">
            _progress
          </div>
        </div>

        {/* Habits List */}
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

        {/* Add New Habit */}
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
            onClick={() => addHabit()}
            className="border-primary/20 hover:bg-primary/10 border-l px-4 text-sm"
          >
            +
          </button>
        </div>

        {/* Command Terminal */}
        <div className="border-primary/20 mb-6 border bg-[#0a0a0a]">
          {/* Command History */}
          <div className="border-primary/20 text-primary/70 h-20 overflow-y-auto border-b p-2 text-xs">
            {commandHistory.length === 0 ? (
              <div className="text-primary/50">
                Press Ctrl+K for help with available commands
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

          {/* Command Input */}
          <form onSubmit={handleCommandSubmit} className="relative flex">
            <span className="text-primary/60 flex items-center pl-2">
              root@habits:~$
            </span>
            <input
              id="command-input"
              ref={commandInputRef}
              placeholder="type command or press Ctrl+K for help"
              className="text-primary placeholder:text-primary/30 flex-1 bg-transparent px-2 py-2 pl-2 font-mono text-sm focus:outline-none"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              autoComplete="off"
            />

            {/* Command suggestions */}
            {suggestions.length > 0 && (
              <div className="border-primary/20 absolute bottom-full left-0 z-10 w-full border bg-[#0a0a0a]">
                {suggestions.map((suggestion, i) => (
                  <div
                    key={i}
                    className="hover:bg-primary/10 cursor-pointer px-2 py-1 text-xs"
                    onClick={() => setCommand(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}

            {/* Cursor animation */}
            <span className="bg-primary/80 absolute top-1/2 right-2 h-4 w-1.5 -translate-y-1/2 transform animate-pulse"></span>
          </form>
        </div>

        {/* Status and Date Display */}
        <div className="flex flex-col gap-1">
          {/* System Stats Line */}
          <div className="border-primary/20 text-primary/50 flex justify-between border-t pt-2 text-xs">
            <span>sys.uptime: {systemUptime}s</span>
            <span>mem: {habits.length * 128}kb</span>
            <span>v1.0.3</span>
          </div>

          {/* Theme Color Selector */}
          <div className="border-primary/20 mt-2 mb-1 border-t pt-2">
            <div className="flex items-center justify-between">
              <span className="text-primary/50 text-xs">theme.color:</span>
              <div className="flex gap-2">
                {themeColors.map((color, index) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      setActiveThemeIndex(index);
                      updatePrimaryColor(index);
                      localStorage.setItem("habitThemeIndex", index.toString());
                    }}
                    className={`flex h-6 w-6 items-center justify-center border transition-all ${
                      activeThemeIndex === index
                        ? "border-primary/80"
                        : "border-primary/20 hover:border-primary/40"
                    }`}
                    title={`${color.name} (Alt+T to cycle)`}
                  >
                    <div
                      className="h-4 w-4"
                      style={{
                        backgroundColor: `var(${color.variable})`,
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Date Display */}
          <div className="text-primary/40 flex justify-between font-mono text-xs tracking-wide">
            <span>sys.{currentDate}</span>
            <span>{habits.length} tasks_active</span>
          </div>
        </div>
      </div>
    </main>
  );
}
