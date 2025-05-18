import React from "react";
import { motion, AnimatePresence } from "motion/react";

interface HelpModalProps {
  show: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ show, onClose }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.07,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -10, opacity: 0 },
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="border-primary/40 relative w-[90%] max-w-md border-2 bg-[#0a0a0a] p-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              onClick={onClose}
              className="text-primary/80 hover:text-primary absolute top-2 right-2 text-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>

            <motion.h2
              className="border-primary/20 text-primary mb-4 border-b pb-2 text-lg font-bold"
              variants={itemVariants}
            >
              Command Reference
            </motion.h2>

            <motion.div className="mb-4" variants={itemVariants}>
              <div className="text-primary/90 mb-2 font-bold">
                Available Commands:
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                <motion.div variants={itemVariants}>
                  <span className="text-primary font-bold">/add</span>{" "}
                  habit_name
                </motion.div>
                <motion.div variants={itemVariants}>Add a new habit</motion.div>
                <motion.div variants={itemVariants}>
                  <span className="text-primary font-bold">/rm</span> habit_name
                </motion.div>
                <motion.div variants={itemVariants}>Remove a habit</motion.div>
                <motion.div variants={itemVariants}>
                  <span className="text-primary font-bold">/p</span> habit_name
                  value
                </motion.div>
                <motion.div variants={itemVariants}>
                  Set progress value (0-21)
                </motion.div>
                <motion.div variants={itemVariants}>
                  <span className="text-primary font-bold">/export</span>
                </motion.div>
                <motion.div variants={itemVariants}>
                  Export habits to JSON
                </motion.div>
                <motion.div variants={itemVariants}>
                  <span className="text-primary font-bold">/clear</span>
                </motion.div>
                <motion.div variants={itemVariants}>
                  Clear command history
                </motion.div>
                <motion.div variants={itemVariants}>
                  <span className="text-primary font-bold">/stats</span>
                </motion.div>
                <motion.div variants={itemVariants}>
                  Show habit statistics
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="border-primary/20 mt-4 border-t pt-4"
              variants={itemVariants}
            >
              <div className="text-primary/90 mb-2 font-bold">
                Keyboard Shortcuts:
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                <motion.div variants={itemVariants}>
                  <span className="text-primary font-bold">Alt+N</span>
                </motion.div>
                <motion.div variants={itemVariants}>
                  Focus new habit input
                </motion.div>
                <motion.div variants={itemVariants}>
                  <span className="text-primary font-bold">Alt+C</span>
                </motion.div>
                <motion.div variants={itemVariants}>
                  Focus command input
                </motion.div>
                <motion.div variants={itemVariants}>
                  <span className="text-primary font-bold">Ctrl+K</span>
                </motion.div>
                <motion.div variants={itemVariants}>
                  Show command help
                </motion.div>
                <motion.div variants={itemVariants}>
                  <span className="text-primary font-bold">Alt+T</span>
                </motion.div>
                <motion.div variants={itemVariants}>
                  Cycle through themes
                </motion.div>
                <motion.div variants={itemVariants}>
                  <span className="text-primary font-bold">Esc</span>
                </motion.div>
                <motion.div variants={itemVariants}>
                  Close help panel
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="text-primary/50 mt-6 text-center text-xs"
              variants={itemVariants}
            >
              Press <span className="text-primary">Esc</span> to close
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
