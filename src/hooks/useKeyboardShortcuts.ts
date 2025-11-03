import { useEffect } from "react";
import { useEditor } from "../contexts";

export function useKeyboardShortcuts() {
  const {
    setEditorMode,
    selectedRobot,
    deleteRobot,
    selectedZone,
    deleteZone,
    editorState,
    setPlaying,
  } = useEditor();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 입력 필드에서는 단축키 비활성화
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      // 모드 전환 단축키
      switch (event.key.toLowerCase()) {
        case "v":
          if (!event.ctrlKey && !event.metaKey) {
            setEditorMode("view");
          }
          break;
        case "e":
          if (!event.ctrlKey && !event.metaKey) {
            setEditorMode("edit");
          }
          break;
        case "r":
          if (!event.ctrlKey && !event.metaKey) {
            setEditorMode("robot");
          }
          break;
        case "p":
          if (!event.ctrlKey && !event.metaKey) {
            setEditorMode("path");
          }
          break;
        case "z":
          if (!event.ctrlKey && !event.metaKey) {
            setEditorMode("zone");
          }
          break;

        // Delete 키로 선택된 항목 삭제
        case "delete":
        case "backspace":
          if (selectedRobot && (editorState.mode === "robot" || editorState.mode === "edit")) {
            deleteRobot(selectedRobot.id);
          } else if (selectedZone && editorState.mode === "zone") {
            deleteZone(selectedZone.id);
          }
          break;

        // Space 키로 시뮬레이션 시작/정지
        case " ":
          event.preventDefault();
          setPlaying(!editorState.isPlaying);
          break;

        // Escape 키로 선택 해제
        case "escape":
          // 선택 해제는 null 선택으로 처리
          break;
      }

      // Ctrl/Cmd 단축키
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case "s":
            // 저장 (향후 구현)
            event.preventDefault();
            console.log("Save triggered");
            break;
          case "o":
            // 열기 (향후 구현)
            event.preventDefault();
            console.log("Open triggered");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    setEditorMode,
    selectedRobot,
    deleteRobot,
    selectedZone,
    deleteZone,
    editorState,
    setPlaying,
  ]);
}
