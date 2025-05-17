"use client";

import { useState, useEffect, useRef } from "react";
import { HabitList } from "@/components/HabitList";
import { AddHabitInput } from "@/components/AddHabitInput";
import { CommandTerminal } from "@/components/CommandTerminal";
import { HelpModal } from "@/components/HelpModal";
import { ThemeSelector } from "@/components/ThemeSelector";
import { HeaderProgress } from "@/components/HeaderProgress";
import { StatusBar } from "@/components/StatusBar";
import { WelcomeText } from "@/components/WelcomeText";

interface Habit {
  id: string;
  name: string;
  progress: number;
}

const themeColors = [
  { name: "green", variable: "--color-tgreen" },
  { name: "blue", variable: "--color-tblue" },
  { name: "yellow", variable: "--color-tyellow" },
  { name: "red", variable: "--color-tred" },
  { name: "pink", variable: "--color-tpink" },
  { name: "purple", variable: "--color-tpurple" },
];

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

  // Initialization (only once)
  useEffect(() => {
    const initialHabits = [
      { id: "1", name: "Meditate", progress: 70 },
      { id: "2", name: "Read a book", progress: 45 },
      { id: "3", name: "Exercise", progress: 30 },
    ];
    setHabits(initialHabits);

    const savedThemeIndex = localStorage.getItem("habitThemeIndex");
    if (savedThemeIndex !== null) {
      setActiveThemeIndex(parseInt(savedThemeIndex, 10));
      updatePrimaryColor(parseInt(savedThemeIndex, 10));
    }

    calculateOverallProgress(initialHabits);

    const now = new Date();
    setCurrentDate(
      now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    );
  }, []);

  // Typewriter effect
  useEffect(() => {
    const message = "Initializing HABIT.SYS v1.0.3...";
    let index = 0;
    const typeEffect = setInterval(() => {
      setWelcomeText(message.substring(0, index));
      index++;
      if (index > message.length) clearInterval(typeEffect);
    }, 50);
    return () => clearInterval(typeEffect);
  }, []);

  // System uptime
  useEffect(() => {
    const uptimeInterval = setInterval(() => {
      setSystemUptime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(uptimeInterval);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "n") {
        e.preventDefault();
        newHabitInputRef.current?.focus();
      }
      if (e.altKey && e.key === "c") {
        e.preventDefault();
        commandInputRef.current?.focus();
      }
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        setShowCommandHelp(true);
      }
      if (e.altKey && e.key === "t") {
        e.preventDefault();
        setActiveThemeIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % themeColors.length;
          updatePrimaryColor(nextIndex);
          localStorage.setItem("habitThemeIndex", nextIndex.toString());
          return nextIndex;
        });
      }
      if (e.key === "Escape" && showCommandHelp) {
        setShowCommandHelp(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
    setCommandHistory((prev) => [...prev.slice(-4), cmd]);
    const parts = cmd.split(" ");
    const commandType = parts[0]?.toLowerCase() ?? "";
    if (commandType === "/add" && parts.length > 1) {
      const habitName = parts.slice(1).join(" ");
      addHabit(habitName);
      return true;
    }
    if (
      (commandType === "/rm" || commandType === "/remove") &&
      parts.length > 1
    ) {
      const habitName = parts.slice(1).join(" ");
      return removeHabitByName(habitName);
    }
    if (
      (commandType === "/progress" || commandType === "/p") &&
      parts.length > 2
    ) {
      const progressValue = parseInt(parts[parts.length - 1] ?? "0", 10);
      if (isNaN(progressValue)) return false;
      const habitName = parts.slice(1, parts.length - 1).join(" ");
      return setHabitProgress(habitName, progressValue);
    }
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
    if (commandType === "/clear") {
      setCommandHistory([]);
      return true;
    }
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
        <WelcomeText text={welcomeText} />
        <HelpModal
          show={showCommandHelp}
          onClose={() => setShowCommandHelp(false)}
        />
        <HeaderProgress overallProgress={overallProgress} />
        <HabitList
          habits={habits}
          updateProgress={updateProgress}
          deleteHabit={deleteHabit}
        />
        <AddHabitInput
          newHabit={newHabit}
          setNewHabit={setNewHabit}
          addHabit={addHabit}
          newHabitInputRef={newHabitInputRef}
        />
        <CommandTerminal
          command={command}
          setCommand={setCommand}
          handleCommandSubmit={handleCommandSubmit}
          commandInputRef={commandInputRef}
          commandHistory={commandHistory}
          suggestions={suggestions}
          setCommandFromSuggestion={setCommand}
        />
        <StatusBar
          systemUptime={systemUptime}
          habitsCount={habits.length}
          currentDate={currentDate}
        />
        <ThemeSelector
          themeColors={themeColors}
          activeThemeIndex={activeThemeIndex}
          setActiveThemeIndex={setActiveThemeIndex}
          updatePrimaryColor={updatePrimaryColor}
        />
      </div>
    </main>
  );
}
