"use client";

import type { Stats } from "@/lib/api";
import { FolderOpen, FileText, Image, Cpu } from "lucide-react";

interface StatsBarProps {
  stats: Stats | null;
}

export function StatsBar({ stats }: StatsBarProps) {
  const items = [
    {
      label: "Projects",
      value: stats?.total_projects ?? 0,
      icon: <FolderOpen className="h-4 w-4" />,
    },
    {
      label: "Source Files",
      value: stats?.total_files ?? 0,
      icon: <FileText className="h-4 w-4" />,
    },
    {
      label: "Renders",
      value: stats?.total_renders ?? 0,
      icon: <Image className="h-4 w-4" />,
    },
    {
      label: "Visor Types",
      value: stats ? Object.keys(stats.visor_counts).length : 0,
      icon: <Cpu className="h-4 w-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="group flex items-center gap-3 rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm px-4 py-3 transition-all hover:surface-glow"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/[0.07] text-primary transition-colors group-hover:bg-primary/[0.12]">
            {item.icon}
          </div>
          <div>
            <p className="text-xl font-semibold leading-none tracking-tight tabular-nums">
              {item.value}
            </p>
            <p className="text-[11px] text-muted-foreground/70 mt-1">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
