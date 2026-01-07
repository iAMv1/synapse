
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import clsx from 'clsx';

interface GlassDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const GlassDialog: React.FC<GlassDialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          
          {/* Dialog Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className={clsx(
                "pointer-events-auto",
                "w-full max-w-md",
                "bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl",
                "rounded-2xl overflow-hidden",
                "flex flex-col",
                className
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white/90">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="p-4 border-t border-white/10 bg-black/5">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
