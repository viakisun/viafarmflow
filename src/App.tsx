import { EditorProvider } from "./contexts/EditorContext";
import { EditorLayout } from "./components/Layout/EditorLayout";
import { Toolbar } from "./components/Toolbar/Toolbar";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { StatusBar } from "./components/StatusBar/StatusBar";
import { Scene } from "./components/Scene";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useSimulation } from "./hooks/useSimulation";
import "./App.css";

function EditorApp() {
  useKeyboardShortcuts();
  useSimulation();

  return (
    <EditorLayout
      toolbar={<Toolbar />}
      sidebar={<Sidebar />}
      viewport={<Scene />}
      statusbar={<StatusBar />}
    />
  );
}

function App() {
  return (
    <EditorProvider>
      <EditorApp />
    </EditorProvider>
  );
}

export default App;
