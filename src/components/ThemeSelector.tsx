import React from "react";
import { motion } from "motion/react";

interface ThemeColor {
  name: string;
  variable: string;
}

interface ThemeSelectorProps {
  themeColors: ThemeColor[];
  activeThemeIndex: number;
  setActiveThemeIndex: (index: number) => void;
  updatePrimaryColor: (index: number) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themeColors,
  activeThemeIndex,
  setActiveThemeIndex,
  updatePrimaryColor,
}) => (
  <motion.div
    className="border-primary/20 mt-2 mb-1 border-t pt-2"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.6, duration: 0.4 }}
  >
    <div className="flex items-center justify-between">
      <motion.span
        className="text-primary/50 text-xs"
        animate={{ opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        theme.color:
      </motion.span>
      <div className="flex gap-2">
        {themeColors.map((color, index) => (
          <motion.button
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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={
              activeThemeIndex === index
                ? { borderWidth: "2px", y: [0, -2, 0] }
                : { borderWidth: "1px" }
            }
            transition={{ duration: activeThemeIndex === index ? 0.3 : 0.1 }}
          >
            <motion.div
              className="h-4 w-4"
              style={{
                backgroundColor: `var(${color.variable})`,
              }}
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{
                scale: activeThemeIndex === index ? 1 : 0.8,
                opacity: activeThemeIndex === index ? 1 : 0.8,
              }}
              transition={{ duration: 0.2 }}
            />
          </motion.button>
        ))}
      </div>
    </div>
  </motion.div>
);
