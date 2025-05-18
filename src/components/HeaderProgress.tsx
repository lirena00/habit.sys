import React from "react";
import { motion } from "motion/react";

interface HeaderProgressProps {
  overallProgress: number;
}

export const HeaderProgress: React.FC<HeaderProgressProps> = ({
  overallProgress,
}) => (
  <motion.div
    className="mb-8"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <div className="mb-2 flex items-center justify-between">
      <motion.h1
        className="text-xl font-bold tracking-widest"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        HABIT.SYS
      </motion.h1>
      <motion.code
        className="border-primary/20 border px-2 py-1 font-mono text-xs"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {overallProgress}%
      </motion.code>
    </div>
    <div className="border-primary/30 h-1.5 w-full border bg-[#111111]">
      <motion.div
        className="bg-primary h-full"
        initial={{ width: 0 }}
        animate={{ width: `${overallProgress}%` }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
      />
    </div>
    <motion.div
      className="text-primary/50 mt-1 text-right text-xs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.3 }}
    >
      _progress
    </motion.div>
  </motion.div>
);
