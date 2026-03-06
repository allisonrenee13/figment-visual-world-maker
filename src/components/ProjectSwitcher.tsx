import { useState } from "react";
import { useProject } from "@/context/ProjectContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLocation } from "react-router-dom";

const ProjectSwitcher = () => {
  const { currentProject, allProjects, setCurrentProjectId } = useProject();
  const location = useLocation();
  const [pendingProjectId, setPendingProjectId] = useState<string | null>(null);

  const isOnMapPage = location.pathname === "/map";
  const isEditing = isOnMapPage && currentProject && !currentProject.mapConfirmed;

  const handleSwitch = (id: string) => {
    if (id === currentProject.id) return;
    if (isEditing) {
      setPendingProjectId(id);
    } else {
      setCurrentProjectId(id);
    }
  };

  const confirmSwitch = () => {
    if (pendingProjectId) {
      setCurrentProjectId(pendingProjectId);
      setPendingProjectId(null);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1.5 flex-wrap">
        {allProjects.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSwitch(p.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              currentProject.id === p.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      <AlertDialog open={!!pendingProjectId} onOpenChange={(open) => !open && setPendingProjectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Switch project?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes in the map builder. Switching projects will discard your current progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Editing</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSwitch}>Switch Project</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProjectSwitcher;
