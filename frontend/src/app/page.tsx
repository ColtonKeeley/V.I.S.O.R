"use client";

import { useCallback, useEffect, useState } from "react";
import { api, type Project, type Stats, type VisorMeta } from "@/lib/api";
import { CreateProjectDialog } from "@/components/create-project-dialog";
import { ProjectCard } from "@/components/project-card";
import { StatsBar } from "@/components/stats-bar";
import { ConnectionStatus } from "@/components/connection-status";
import { Search, Scan, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [visors, setVisors] = useState<VisorMeta[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [p, s, v] = await Promise.all([
        api.listProjects(),
        api.getStats(),
        api.listVisors().catch(() => []),
      ]);
      setProjects(p);
      setStats(s);
      setVisors(v);
    } catch {
      // API might be offline
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.visor_type.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-1 flex-col">
      {/* ── Ambient background glow ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-[40%] left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-primary/[0.04] blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-primary/[0.03] blur-[100px]" />
      </div>

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-3.5">
            {/* Concentric-ring logo mark */}
            <div className="relative flex h-9 w-9 items-center justify-center">
              <div className="absolute inset-0 rounded-full visor-ring opacity-60" />
              <div className="absolute inset-[3px] rounded-full bg-background" />
              <Scan className="relative h-4 w-4 text-primary" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-[15px] font-semibold tracking-tight leading-tight">
                V.I.S.O.R.
              </h1>
              <p className="text-[10px] tracking-wide text-muted-foreground/70 uppercase leading-none">
                Visual Ingestion &middot; Semantic Ops &middot; Relational Labeling
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ConnectionStatus />
            <CreateProjectDialog onCreated={refresh} visors={visors} />
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="relative mx-auto w-full max-w-5xl flex-1 px-6 py-10 space-y-10">
        {/* Hero section with stats */}
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="text-[11px] font-medium uppercase tracking-widest">
                  Pipeline Overview
                </span>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Your projects
              </h2>
            </div>

            {projects.length > 0 && (
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                  placeholder="Search..."
                  className="h-9 pl-9 text-sm bg-card/60 border-border/50 focus:border-primary/40"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            )}
          </div>

          <StatsBar stats={stats} />
        </section>

        {/* ── Project Grid ── */}
        <section>
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 animate-pulse rounded-2xl border border-border/40 bg-card/40"
                />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  visor={visors.find((v) => v.id === project.visor_type)}
                  onDeleted={refresh}
                />
              ))}
            </div>
          ) : projects.length > 0 && search ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Search className="h-8 w-8 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                No projects match &ldquo;{search}&rdquo;
              </p>
            </div>
          ) : (
            /* ── Empty state ── */
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 py-24 text-center">
              <div className="relative mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/[0.08]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/[0.12]">
                    <Scan className="h-6 w-6 text-primary" />
                  </div>
                </div>
                {/* Orbital ring decoration */}
                <div className="absolute inset-[-8px] rounded-full border border-primary/10 animate-[spin_12s_linear_infinite]" />
                <div className="absolute inset-[-8px] h-2 w-2 rounded-full bg-primary/40 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h3 className="text-lg font-semibold">Start a new pipeline</h3>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground leading-relaxed">
                Create a project to collect source files, render them through a
                Visor, and export labeled datasets for VLM training.
              </p>
              <div className="mt-8">
                <CreateProjectDialog onCreated={refresh} visors={visors} />
              </div>
            </div>
          )}
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/40 py-4">
        <div className="mx-auto max-w-5xl px-6 flex items-center justify-between text-[11px] text-muted-foreground/60">
          <span>V.I.S.O.R. Framework</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
            <span className="font-mono">local-only</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
