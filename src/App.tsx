import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { EditorProvider } from "./contexts";
import { MapListPage } from "./pages/MapListPage";
import { EditorPage } from "./pages/EditorPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MapListPage />} />
        <Route
          path="/editor/:mapId"
          element={
            <EditorProvider>
              <EditorPage />
            </EditorProvider>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
