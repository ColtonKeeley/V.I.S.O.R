"use client";

import type { Project, VisorMeta } from "@/lib/api";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileText, Image, MoreVertical, Trash2 } from "lucide-react";
import { VisorIcon } from "@/components/visor-icon";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-muted/60 text-muted-foreground",
  collecting: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  augmenting: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  filtering: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  exporting: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  complete: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

interface ProjectCardProps {
  project: Project;
  visor?: VisorMeta;
  onDeleted: () => void;
}

export function ProjectCard({ project, visor, onDeleted }: ProjectCardProps) {
  const created = new Date(project.created_at);
  const relativeTime = getRelativeTime(created);

  async function handleDelete() {
    try {
      await api.deleteProject(project.id);
      onDeleted();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  return (
    <div className="group relative flex flex-col rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm transition-all duration-200 hover:surface-glow-hover overflow-hidden">
      {/* Top accent line */}
      <div className="h-[2px] bg-gradient-to-r from-primary/50 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex-1 p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/[0.08] text-primary transition-colors group-hover:bg-primary/[0.12]">
              <VisorIcon name={visor?.icon ?? "folder-open"} className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold leading-tight tracking-tight">
                {project.name}
              </h3>
              <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                {relativeTime}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                />
              }
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive rounded-lg"
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
            {project.description}
          </p>
        )}

        {/* Visor label */}
        {visor && (
          <p className="text-[11px] text-muted-foreground/60 font-mono mb-3">
            {visor.name}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 px-5 pb-4 pt-0 flex-wrap">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_COLORS[project.status] || STATUS_COLORS.new}`}>
          {project.status}
        </span>

        <div className="flex-1" />

        <Tooltip>
          <TooltipTrigger render={<Badge variant="secondary" className="gap-1 font-mono text-[11px] rounded-lg border-0 bg-muted/50" />}>
            <FileText className="h-3 w-3" />
            {project.file_count ?? 0}
          </TooltipTrigger>
          <TooltipContent>Source files</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={<Badge variant="secondary" className="gap-1 font-mono text-[11px] rounded-lg border-0 bg-muted/50" />}>
            <Image className="h-3 w-3" />
            {project.render_count ?? 0}
          </TooltipTrigger>
          <TooltipContent>Renders</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}
