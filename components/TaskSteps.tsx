"use client";

import { TaskStep } from "@/lib/types";

interface TaskStepsProps {
  steps: TaskStep[];
}

export default function TaskSteps({ steps }: TaskStepsProps) {
  if (steps.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 py-2 px-3 bg-gray-50 border-2 border-gray-200 mb-3">
      <span className="font-mono text-[10px] uppercase tracking-wider text-gray-400 mb-1">
        Execution
      </span>
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          {step.status === "done" ? (
            <span className="text-green-600 text-xs shrink-0">✓</span>
          ) : step.status === "active" ? (
            <span className="text-brutal-yellow text-xs shrink-0 animate-pulse-dot">●</span>
          ) : (
            <span className="text-gray-300 text-xs shrink-0">○</span>
          )}
          <span
            className={`font-mono text-[11px] ${
              step.status === "done"
                ? "text-gray-400 line-through"
                : step.status === "active"
                ? "text-brutal-black font-bold"
                : "text-gray-400"
            }`}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}
