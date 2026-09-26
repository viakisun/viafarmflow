import { useEffect, useRef } from "react";
import { useEditor } from "../contexts";

/**
 * useSimulation Hook - 로봇 시뮬레이션
 *
 * 좌표계:
 * - X축: 좌우 (Width)
 * - Y축: 전후 (Length/Depth)
 * - Z축: 높이 (Height)
 * - 로봇 이동: XY 평면
 * - rotation: Z축 회전 (바닥 평면)
 */

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

        // 위치 보간 (XY 평면)
        const x = current.position.x + (next.position.x - current.position.x) * t;
        const y = current.position.y + (next.position.y - current.position.y) * t;

        // 방향 계산 (XY 평면에서 Z축 회전)
        const dx = next.position.x - current.position.x;
        const dy = next.position.y - current.position.y;
        const rotation = Math.atan2(dy, dx); // Z축 회전

        // 로봇 상태 업데이트
        updateRobot(robot.id, {
          position: { x, y, z: robot.position.z }, // Z축 높이 유지
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
