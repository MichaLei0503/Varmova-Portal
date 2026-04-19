import { OfferStatus } from "@prisma/client";
import { Badge } from "@/components/ui";
import { offerStatusColors, offerStatusLabels } from "@/lib/utils";

export function StatusBadge({ status }: { status: OfferStatus }) {
  return <Badge className={offerStatusColors[status]}>{offerStatusLabels[status]}</Badge>;
}
