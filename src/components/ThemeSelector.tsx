import React from "react";

interface ThemeColor {
  name: string;
  variable: string;
}

interface ThemeSelectorProps {
  themeColors: ThemeColor[];
  activeThemeIndex: number;
  setActiveThemeIndex: (idx: number) => void;
  updatePrimaryColor: (idx: number) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themeColors,
  activeThemeIndex,
  setActiveThemeIndex,
  updatePrimaryColor,
}) => (
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
);
