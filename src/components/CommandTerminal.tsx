import React, { type RefObject, useState, useEffect } from "react";

interface CommandTerminalProps {
  command: string;
  setCommand: (val: string) => void;
  handleCommandSubmit: (e: React.FormEvent) => void;
  commandInputRef: RefObject<HTMLInputElement | null>;
  commandHistory: string[];
  suggestions: string[];
  setCommandFromSuggestion: (cmd: string) => void;
}

export const CommandTerminal: React.FC<CommandTerminalProps> = ({
  command,
  setCommand,
  handleCommandSubmit,
  commandInputRef,
  commandHistory,
  suggestions,
  setCommandFromSuggestion,
}) => {
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] =
    useState<number>(-1);

  // Reset selection index when suggestions change
  useEffect(() => {
    setSelectedSuggestionIndex(-1);
  }, [suggestions]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        );
      } else if (e.key === "Enter") {
        // If there's only one suggestion, select it automatically
        if (suggestions.length === 1) {
          e.preventDefault();
          setCommandFromSuggestion(suggestions[0] ?? "");
          return;
        }
        // Otherwise, use the selected suggestion if one is selected
        if (selectedSuggestionIndex >= 0) {
          e.preventDefault();
          setCommandFromSuggestion(suggestions[selectedSuggestionIndex] ?? "");
          setSelectedSuggestionIndex(-1);
        }
      }
    }
  };

  return (
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
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />

        {/* Command suggestions */}
        {suggestions.length > 0 && (
          <div className="border-primary/20 absolute bottom-full left-0 z-10 w-full border bg-[#0a0a0a]">
            {suggestions.map((suggestion, i) => (
              <div
                key={i}
                className={`cursor-pointer px-2 py-1 text-xs ${
                  i === selectedSuggestionIndex
                    ? "bg-primary/20 text-primary"
                    : "hover:bg-primary/10"
                }`}
                onClick={() => setCommandFromSuggestion(suggestion)}
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
  );
};
