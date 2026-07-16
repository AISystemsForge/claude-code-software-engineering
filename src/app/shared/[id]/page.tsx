import { SharedExportView } from "@/components/cloud/SharedExportView";

export default function SharedExportPage({ params }: { params: { id: string } }) {
  return <SharedExportView shareId={params.id} />;
}
