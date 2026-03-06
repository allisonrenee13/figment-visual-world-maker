import { useProject } from "@/context/ProjectContext";

const ProjectSwitcher = () => {
  const { currentProject, allProjects, setCurrentProjectId } = useProject();

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {allProjects.map((p) => (
        <button
          key={p.id}
          onClick={() => setCurrentProjectId(p.id)}
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
  );
};

export default ProjectSwitcher;
