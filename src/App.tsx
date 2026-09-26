import { useState } from "react";
import { ProjectProvider, useProject } from "./contexts/ProjectContext";
import { HistoryProvider } from "./contexts/HistoryContext";
import { EditorProvider } from "./contexts/EditorContext";
import { EditorLayout } from "./components/Layout/EditorLayout";
import { NewToolbar } from "./components/EditorV2/NewToolbar";
import { NewSidebar } from "./components/EditorV2/NewSidebar";
import { NewStatusBar } from "./components/EditorV2/NewStatusBar";
import { Scene } from "./components/Scene";
import { ProjectListLayout } from "./components/Projects/ProjectListLayout";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useSimulation } from "./hooks/useSimulation";
import "./App.css";

interface EditorAppProps {
  onBackToProjects: () => void;
}

function EditorApp({ onBackToProjects }: EditorAppProps) {
  useKeyboardShortcuts();
  useSimulation();

  return (
    <EditorLayout
      toolbar={<NewToolbar onBackToProjects={onBackToProjects} />}
      sidebar={<NewSidebar />}
      viewport={<Scene />}
      statusbar={<NewStatusBar />}
    />
  );
}

function AppContent() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { loadProject, state } = useProject();

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
  };

  const handleProjectSelect = async (projectId: string) => {
    try {
      await loadProject(projectId);
      setSelectedProjectId(projectId);
    } catch (error) {
      console.error('Failed to load project:', error);
    }
  };

  // Keep providers mounted to prevent re-initialization
  return (
    <HistoryProvider>
      <EditorProvider>
        {!selectedProjectId ? (
          <ProjectListLayout onProjectSelect={handleProjectSelect} />
        ) : state.isLoading ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            color: 'var(--color-gray-600)'
          }}>
            Loading project...
          </div>
        ) : (
          <EditorApp onBackToProjects={handleBackToProjects} />
        )}
      </EditorProvider>
    </HistoryProvider>
  );
}

function App() {
  return (
    <ProjectProvider>
      <AppContent />
    </ProjectProvider>
  );
}

export default App;
