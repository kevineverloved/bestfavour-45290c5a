import { Loader2 } from "lucide-react";

export function ProfileLoading() {
  return (
    <div className="container mx-auto py-8 flex items-center justify-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}