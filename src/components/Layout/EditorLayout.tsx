import type { ReactNode } from "react";
import "./EditorLayout.css";

interface EditorLayoutProps {
  toolbar: ReactNode;
  sidebar: ReactNode;
  viewport: ReactNode;
  statusbar: ReactNode;
}

export function EditorLayout({ toolbar, sidebar, viewport, statusbar }: EditorLayoutProps) {
  return (
    <div className="editor-layout">
      <div className="editor-toolbar">{toolbar}</div>
      <div className="editor-body">
        <div className="editor-sidebar">{sidebar}</div>
        <div className="editor-viewport">{viewport}</div>
      </div>
      <div className="editor-statusbar">{statusbar}</div>
    </div>
  );
}
