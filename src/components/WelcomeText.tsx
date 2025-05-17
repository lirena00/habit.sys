import React from "react";

export const WelcomeText: React.FC<{ text: string }> = ({ text }) => (
  <div className="text-primary/80 mb-4 h-4 font-mono text-xs">{text}</div>
);
