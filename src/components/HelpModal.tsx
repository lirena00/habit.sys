import React from "react";

interface HelpModalProps {
  show: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ show, onClose }) =>
  !show ? null : (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
      <div className="border-primary/40 relative w-[90%] max-w-md border-2 bg-[#0a0a0a] p-5">
        <button
          onClick={onClose}
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
              <span className="text-primary font-bold">/add</span> habit_name
            </div>
            <div>Add a new habit</div>
            <div>
              <span className="text-primary font-bold">/rm</span> habit_name
            </div>
            <div>Remove a habit</div>
            <div>
              <span className="text-primary font-bold">/p</span> habit_name
              value
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
  );
