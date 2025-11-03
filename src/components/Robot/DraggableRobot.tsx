import { useRef, useState, useEffect } from "react";
import { Group, Vector3, Vector2, Raycaster, Plane, Camera } from "three";
import { useThree } from "@react-three/fiber";
import { Robot } from "./Robot";
import type { Robot as RobotType } from "../../types/greenhouse";
import { useEditor } from "../../contexts";

interface DraggableRobotProps {
  robot: RobotType;
  isSelected: boolean;
  onClick: () => void;
}

export function DraggableRobot({ robot, isSelected, onClick }: DraggableRobotProps) {
  const groupRef = useRef<Group>(null);
  const { camera, gl } = useThree();
  const { updateRobot, editorState } = useEditor();
  const [isDragging, setIsDragging] = useState(false);
  const [dragPlane] = useState(() => new Plane(new Vector3(0, 1, 0), 0));
  const [dragPoint] = useState(() => new Vector3());
  const [dragOffset] = useState(() => new Vector3());

  const canDrag = editorState.mode === "robot" || editorState.mode === "edit";

  useEffect(() => {
    if (!canDrag || !isSelected) return;

    const raycaster = new Raycaster();
    const mouse = new Vector2();

    const handleMouseDown = (event: MouseEvent) => {
      if (!groupRef.current || !isSelected) return;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera as Camera);

      // 로봇과의 교차점 확인
      const intersects = raycaster.intersectObject(groupRef.current, true);

      if (intersects.length > 0) {
        setIsDragging(true);

        // 드래그 평면을 로봇의 Y 위치에 설정
        dragPlane.constant = -robot.position.y;

        // 드래그 시작 지점 계산
        if (raycaster.ray.intersectPlane(dragPlane, dragPoint)) {
          dragOffset
            .copy(dragPoint)
            .sub(new Vector3(robot.position.x, robot.position.y, robot.position.z));
        }

        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging || !groupRef.current) return;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera as Camera);

      if (raycaster.ray.intersectPlane(dragPlane, dragPoint)) {
        const newPosition = dragPoint.clone().sub(dragOffset);

        // 온실 경계 내로 제한
        const bounds = {
          x: { min: -20, max: 20 },
          z: { min: -50, max: 50 },
        };

        newPosition.x = Math.max(bounds.x.min, Math.min(bounds.x.max, newPosition.x));
        newPosition.z = Math.max(bounds.z.min, Math.min(bounds.z.max, newPosition.z));

        updateRobot(robot.id, {
          position: {
            x: newPosition.x,
            y: robot.position.y,
            z: newPosition.z,
          },
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    // 이벤트 리스너 등록
    if (isSelected && canDrag) {
      gl.domElement.addEventListener("mousedown", handleMouseDown);
      gl.domElement.addEventListener("mousemove", handleMouseMove);
      gl.domElement.addEventListener("mouseup", handleMouseUp);
      gl.domElement.addEventListener("mouseleave", handleMouseUp);

      // 드래그 중 커서 변경
      if (isDragging) {
        gl.domElement.style.cursor = "grabbing";
      } else {
        gl.domElement.style.cursor = "grab";
      }
    }

    return () => {
      gl.domElement.removeEventListener("mousedown", handleMouseDown);
      gl.domElement.removeEventListener("mousemove", handleMouseMove);
      gl.domElement.removeEventListener("mouseup", handleMouseUp);
      gl.domElement.removeEventListener("mouseleave", handleMouseUp);
      gl.domElement.style.cursor = "auto";
    };
  }, [
    isSelected,
    isDragging,
    robot,
    updateRobot,
    camera,
    gl,
    canDrag,
    dragOffset,
    dragPlane,
    dragPoint,
  ]);

  return (
    <group ref={groupRef}>
      <Robot
        robot={robot}
        isSelected={isSelected}
        onClick={onClick}
      />
    </group>
  );
}
