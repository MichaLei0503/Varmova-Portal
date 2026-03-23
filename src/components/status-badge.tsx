import { ProjectStatus } from "@prisma/client";
import { Badge } from "@/components/ui";
import { projectStatusColors, projectStatusLabels } from "@/lib/utils";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return <Badge className={projectStatusColors[status]}>{projectStatusLabels[status]}</Badge>;
}
