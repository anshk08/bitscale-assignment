"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { FileCheckCorner } from "lucide-react";

const initialItems = [
  { id: "1", label: "Create your data list", done: true },
  { id: "2", label: "Learn about BitAgent", done: true },
  { id: "3", label: "Connect an integration", done: true },
  { id: "4", label: "Customise waterfall providers", done: false },
];

export function ProductDemo() {
  const [items, setItems] = useState(initialItems);

  const toggle = (id: string) =>
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    );

  const progress = Math.round(
    (items.filter((i) => i.done).length / items.length) * 100,
  );

  return (
    <div className="bg-blue-50 border border-slate-200 h-40 w-full rounded-2xl flex flex-col gap-3 p-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-600 flex items-center justify-center shrink-0">
          <FileCheckCorner className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-sm font-semibold text-slate-800 leading-tight">
            Complete product demo
          </p>
          <p className="text-xs text-slate-500 leading-tight">
            92% of users nailed BitScale after this walkthrough
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Progress
          value={progress}
          className="flex-1 h-1.5 bg-slate-100 [&>div]:bg-green-500"
        />
        <span className="text-xs font-medium text-slate-500 shrink-0">
          {progress}%
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => toggle(item.id)}
            className="flex items-center gap-2 text-left group"
          >
            {item.done ? (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" fill="#3b82f6" />
                <path
                  d="M5 8l2 2 4-4"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 16 16" fill="none">
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                />
              </svg>
            )}
            <span className="text-xs text-slate-600 leading-tight truncate">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
