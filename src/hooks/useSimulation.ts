import { useEffect, useRef } from "react";
import { useEditor } from "../contexts";

export function useSimulation() {
  const { editorState, robots, waypoints, updateRobot } = useEditor();
  const { isPlaying } = editorState;
  const animationRef = useRef<number | undefined>(undefined);
  const progressRef = useRef(new Map<string, number>());

  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    // 각 로봇의 경로 따라 이동
    const animate = () => {
      robots.forEach((robot) => {
        const robotWaypoints = waypoints
          .filter((wp) => wp.robotId === robot.id)
          .sort((a, b) => a.order - b.order);

        if (robotWaypoints.length === 0) return;

        // 현재 진행도 가져오기 또는 초기화
        let progress = progressRef.current.get(robot.id) || 0;
        progress += 0.005; // 속도 조절

        if (progress >= robotWaypoints.length - 1) {
          progress = 0; // 처음으로 돌아가기
        }

        progressRef.current.set(robot.id, progress);

        // 현재와 다음 웨이포인트 사이 보간
        const currentIndex = Math.floor(progress);
        const nextIndex = Math.min(currentIndex + 1, robotWaypoints.length - 1);
        const t = progress - currentIndex;

        const current = robotWaypoints[currentIndex];
        const next = robotWaypoints[nextIndex];

        // 위치 보간
        const x = current.position.x + (next.position.x - current.position.x) * t;
        const z = current.position.z + (next.position.z - current.position.z) * t;

        // 방향 계산
        const dx = next.position.x - current.position.x;
        const dz = next.position.z - current.position.z;
        const rotation = Math.atan2(dx, dz);

        // 로봇 상태 업데이트
        updateRobot(robot.id, {
          position: { x, y: robot.position.y, z },
          rotation,
          status: "moving",
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // 시뮬레이션 종료시 상태 초기화
      robots.forEach((robot) => {
        updateRobot(robot.id, { status: "idle" });
      });
    };
  }, [isPlaying, robots, waypoints, updateRobot]);
}
