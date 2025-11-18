"use client";

import { motion } from "framer-motion";

/**
 * Global loading indicator component
 */
export default function LoadingIndicator() {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-slate-800 rounded-lg p-8 shadow-2xl"
      >
        {/* Spinner */}
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-slate-600 border-t-blue-500 rounded-full"
          />
          <p className="text-slate-400 font-medium">Loading...</p>
        </div>
      </motion.div>
    </div>
  );
}
