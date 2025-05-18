import React, { useEffect, useCallback } from "react";
import confetti from "canvas-confetti";

interface ConfettiProps {
  active: boolean;
  duration?: number; // Duration in milliseconds
  onComplete?: () => void;
}

const Confetti: React.FC<ConfettiProps> = ({
  active,
  duration = 3000,
  onComplete,
}) => {
  const fireConfetti = useCallback(() => {
    const end = Date.now() + duration;

    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
    };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = end - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        if (onComplete) onComplete();
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      void confetti({
        ...defaults,
        particleCount,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2,
        },
      });

      void confetti({
        ...defaults,
        particleCount,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2,
        },
      });
    }, 250);
  }, [duration, onComplete]);

  useEffect(() => {
    if (active) {
      fireConfetti();
    }
  }, [active, fireConfetti]);

  return null;
};

export default Confetti;
