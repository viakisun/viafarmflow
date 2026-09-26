/**
 * Robot-related Commands
 * Commands for robot CRUD operations
 */

import { BaseCommand } from './ICommand';
import type { Robot } from '../../../types/greenhouse';

/**
 * Add Robot Command
 */
export class AddRobotCommand extends BaseCommand {
  robot: Robot;
  addFn: (robot: Robot) => void;
  deleteFn: (robotId: string) => void;

  constructor(
    robot: Robot,
    addFn: (robot: Robot) => void,
    deleteFn: (robotId: string) => void
  ) {
    super(`Add robot "${robot.name}"`);
    this.robot = robot;
    this.addFn = addFn;
    this.deleteFn = deleteFn;
  }

  execute(): void {
    this.addFn(this.robot);
  }

  undo(): void {
    this.deleteFn(this.robot.id);
  }
}

/**
 * Delete Robot Command
 */
export class DeleteRobotCommand extends BaseCommand {
  robot: Robot;
  addFn: (robot: Robot) => void;
  deleteFn: (robotId: string) => void;

  constructor(
    robot: Robot,
    addFn: (robot: Robot) => void,
    deleteFn: (robotId: string) => void
  ) {
    super(`Delete robot "${robot.name}"`);
    this.robot = robot;
    this.addFn = addFn;
    this.deleteFn = deleteFn;
  }

  execute(): void {
    this.deleteFn(this.robot.id);
  }

  undo(): void {
    this.addFn(this.robot);
  }
}

/**
 * Update Robot Command
 */
export class UpdateRobotCommand extends BaseCommand {
  robotId: string;
  oldData: Partial<Robot>;
  newData: Partial<Robot>;
  updateFn: (robotId: string, data: Partial<Robot>) => void;

  constructor(
    robotId: string,
    oldData: Partial<Robot>,
    newData: Partial<Robot>,
    updateFn: (robotId: string, data: Partial<Robot>) => void,
    description?: string
  ) {
    super(description || `Update robot`);
    this.robotId = robotId;
    this.oldData = oldData;
    this.newData = newData;
    this.updateFn = updateFn;
  }

  execute(): void {
    this.updateFn(this.robotId, this.newData);
  }

  undo(): void {
    this.updateFn(this.robotId, this.oldData);
  }
}

/**
 * Move Robot Command
 */
export class MoveRobotCommand extends BaseCommand {
  robotId: string;
  oldPosition: { x: number; y: number; z: number };
  newPosition: { x: number; y: number; z: number };
  updateFn: (robotId: string, data: Partial<Robot>) => void;

  constructor(
    robotId: string,
    oldPosition: { x: number; y: number; z: number },
    newPosition: { x: number; y: number; z: number },
    updateFn: (robotId: string, data: Partial<Robot>) => void,
    robotName?: string
  ) {
    super(`Move robot ${robotName || robotId}`);
    this.robotId = robotId;
    this.oldPosition = oldPosition;
    this.newPosition = newPosition;
    this.updateFn = updateFn;
  }

  execute(): void {
    this.updateFn(this.robotId, { position: this.newPosition });
  }

  undo(): void {
    this.updateFn(this.robotId, { position: this.oldPosition });
  }
}
