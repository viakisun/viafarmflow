import { useContext } from "react";
import { EditorContext } from "./EditorContextDefinition";

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within EditorProvider");
  }
  return context;
}
