"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ConnectionStatus() {
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    async function check() {
      try {
        await api.health();
        if (mounted) setConnected(true);
      } catch {
        if (mounted) setConnected(false);
      }
    }

    check();
    const interval = setInterval(check, 10_000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const dotColor = connected
    ? "bg-emerald-400"
    : connected === false
      ? "bg-red-400"
      : "bg-muted-foreground/40";

  const label = connected
    ? "Connected"
    : connected === false
      ? "Offline"
      : "Checking";

  return (
    <Tooltip>
      <TooltipTrigger className="inline-flex cursor-default">
        <div className="flex items-center gap-2 rounded-full border border-border/40 bg-card/60 px-3 py-1.5 text-[11px] text-muted-foreground backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            {connected && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
            )}
            <span className={`relative inline-flex h-2 w-2 rounded-full ${dotColor}`} />
          </span>
          {label}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {connected
          ? "Python API is running on 127.0.0.1:8000"
          : "Run: python3 -m api.run"}
      </TooltipContent>
    </Tooltip>
  );
}
