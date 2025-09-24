"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import clsx from "clsx";

interface SelectOption {
  value: string;
  label: string;
  icon?: string;
}

interface ShadcnSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function ShadcnSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  disabled = false
}: ShadcnSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(option => option.value === value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={clsx("relative", className)} ref={wrapperRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={clsx(
          "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
          "placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "hover:bg-gray-50",
          "transition-colors duration-200",
          isOpen && "ring-2 ring-rose-500 ring-offset-2"
        )}
      >
        <span className="flex items-center space-x-2 truncate">
          {selectedOption?.icon && <span className="text-base">{selectedOption.icon}</span>}
          <span className={clsx(
            selectedOption ? "text-gray-900" : "text-gray-500"
          )}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
            <ChevronDown className={clsx(
          "h-4 w-4 opacity-50 transition-transform duration-200",
          isOpen ? "rotate-180" : "rotate-0"
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border bg-white p-1 shadow-md"
          >
            <div className="max-h-60 overflow-y-auto">
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={clsx(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
                    "hover:bg-gray-50",
                    "focus:bg-gray-100",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    "transition-colors duration-150",
                    option.value === value && "bg-rose-100 text-rose-900"
                  )}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    {option.value === value && (
                      <Check className="h-4 w-4" />
                    )}
                  </span>
                  <div className="flex items-center space-x-2">
                    {option.icon && <span className="text-base">{option.icon}</span>}
                    <span>{option.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
