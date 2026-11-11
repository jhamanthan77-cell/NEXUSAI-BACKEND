import { Suspense } from "react";
import WorkspaceContent from "./WorkspaceContent";

export default function WorkspacePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#080808] flex items-center justify-center text-amber-400">
          Loading MANTRIX Workspace...
        </main>
      }
    >
      <WorkspaceContent />
    </Suspense>
  );
}