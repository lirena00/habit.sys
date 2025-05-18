import React from "react";
import { motion } from "motion/react";

export const WelcomeText: React.FC<{ text: string }> = ({ text }) => (
  <motion.div
    className="text-primary/80 mb-4 h-4 font-mono text-xs"
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.8 }}
    transition={{ duration: 0.5 }}
  >
    {text}
  </motion.div>
);
