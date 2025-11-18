"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/app/context/ToastContext";
import { Check, X, AlertCircle, Info } from "lucide-react";

const getToastPosition = (type) => {
  switch (type) {
    case "success":
      return {
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      };
    case "error":
      return {
        left: "50%",
        bottom: "2rem",
        transform: "translateX(-50%)",
      };
    case "warning":
      return { right: "2rem", left: "auto", top: "2rem" };
    case "info":
      return { right: "2rem", left: "auto", top: "2rem" };
    default:
      return { right: "2rem", left: "auto", top: "2rem" };
  }
};

const getToastStyles = (type) => {
  const baseClasses =
    "rounded-lg shadow-lg px-6 py-4 flex items-center gap-3 pointer-events-auto";

  const typeClasses = {
    success: "bg-green-50 border border-green-200",
    error: "bg-red-50 border border-red-200",
    warning: "bg-yellow-50 border border-yellow-200",
    info: "bg-blue-50 border border-blue-200",
  };

  return `${baseClasses} ${typeClasses[type]}`;
};

const getIconColor = (type) => {
  const colors = {
    success: "text-green-600",
    error: "text-red-600",
    warning: "text-yellow-600",
    info: "text-blue-600",
  };
  return colors[type];
};

const getIcon = (type) => {
  const icons = {
    success: <Check className={`w-5 h-5 ${getIconColor(type)}`} />,
    error: <X className={`w-5 h-5 ${getIconColor(type)}`} />,
    warning: <AlertCircle className={`w-5 h-5 ${getIconColor(type)}`} />,
    info: <Info className={`w-5 h-5 ${getIconColor(type)}`} />,
  };
  return icons[type];
};

const getTextColor = (type) => {
  const colors = {
    success: "text-green-800",
    error: "text-red-800",
    warning: "text-yellow-800",
    info: "text-blue-800",
  };
  return colors[type];
};

const getAnimationVariants = (type) => {
  const baseVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.3 },
  };

  if (type === "success") {
    return {
      ...baseVariants,
      initial: { opacity: 0, y: -50 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -50 },
    };
  }

  if (type === "error") {
    return {
      ...baseVariants,
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 50 },
    };
  }

  return {
    ...baseVariants,
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };
};

export default function Toast() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {toasts.map((toast) => {
          const position = getToastPosition(toast.type);
          const variants = getAnimationVariants(toast.type);

          return (
            <motion.div
              key={toast.id}
              className="fixed"
              style={position}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={variants.transition}
            >
              <div className={getToastStyles(toast.type)}>
                {getIcon(toast.type)}
                <span className={`font-medium ${getTextColor(toast.type)}`}>
                  {toast.message}
                </span>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="ml-auto opacity-50 hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
