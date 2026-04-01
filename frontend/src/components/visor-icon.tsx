"use client";

import {
  Mail,
  FileText,
  Table,
  Image,
  FolderOpen,
  Scan,
  FileCode,
  type LucideProps,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  mail: Mail,
  "file-text": FileText,
  table: Table,
  image: Image,
  "folder-open": FolderOpen,
  scan: Scan,
  "file-code": FileCode,
};

interface VisorIconProps extends LucideProps {
  name: string;
}

export function VisorIcon({ name, ...props }: VisorIconProps) {
  const Icon = ICON_MAP[name] || FolderOpen;
  return <Icon {...props} />;
}
