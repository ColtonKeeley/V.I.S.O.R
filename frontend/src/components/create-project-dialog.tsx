"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Scan, Check } from "lucide-react";
import { api, type VisorMeta } from "@/lib/api";
import { VisorIcon } from "@/components/visor-icon";

interface CreateProjectDialogProps {
  onCreated: () => void;
  visors: VisorMeta[];
}

export function CreateProjectDialog({ onCreated, visors }: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visorType, setVisorType] = useState(visors[0]?.id ?? "email");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await api.createProject({ name: name.trim(), description, visor_type: visorType });
      setOpen(false);
      setName("");
      setDescription("");
      setVisorType(visors[0]?.id ?? "email");
      onCreated();
    } catch (err) {
      console.error("Failed to create project:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="lg" className="gap-2 rounded-xl" />}>
        <Plus className="h-4 w-4" />
        New Project
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px] rounded-2xl border-border/50 bg-card">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Scan className="h-4 w-4 text-primary" />
            </div>
            <DialogTitle className="text-lg">New pipeline</DialogTitle>
          </div>
          <DialogDescription>
            Configure a dataset construction pipeline. The Visor determines how
            source files are rendered into pixel-space.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-5">
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Project Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Invoice Classification"
              className="bg-background/60"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Description
            </Label>
            <Input
              id="description"
              placeholder="What is this dataset for?"
              className="bg-background/60"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Visor Picker — card-style selection */}
          <div className="grid gap-2">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Visor Type
            </Label>

            {visors.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {visors.map((v) => {
                  const selected = visorType === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVisorType(v.id)}
                      className={`
                        group relative flex items-center gap-3.5 rounded-xl border px-4 py-3
                        text-left transition-all duration-150
                        ${selected
                          ? "border-primary/40 bg-primary/[0.06] shadow-sm shadow-primary/5"
                          : "border-border/50 bg-background/40 hover:border-border hover:bg-background/60"
                        }
                      `}
                    >
                      <div className={`
                        flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors
                        ${selected ? "bg-primary/15 text-primary" : "bg-muted/60 text-muted-foreground"}
                      `}>
                        <VisorIcon name={v.icon} className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${selected ? "text-foreground" : "text-foreground/80"}`}>
                          {v.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {v.description}
                        </p>
                        {v.file_extensions.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {v.file_extensions.map((ext) => (
                              <span
                                key={ext}
                                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground"
                              >
                                {ext}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {selected && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-3 text-center rounded-xl border border-dashed border-border/50">
                No visors discovered. Check that Backend/Visors/ contains visor implementations.
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={loading || !name.trim()}
            className="rounded-xl gap-2"
          >
            {loading ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                Creating...
              </>
            ) : (
              "Create Pipeline"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
