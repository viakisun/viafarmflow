/**
 * Waypoint-related Commands
 */

import { BaseCommand } from './ICommand';
import type { Waypoint } from '../../../types/greenhouse';

/**
 * Add Waypoint Command
 */
export class AddWaypointCommand extends BaseCommand {
  waypoint: Waypoint;
  addFn: (waypoint: Waypoint) => void;
  deleteFn: (waypointId: string) => void;

  constructor(
    waypoint: Waypoint,
    addFn: (waypoint: Waypoint) => void,
    deleteFn: (waypointId: string) => void
  ) {
    super(`Add waypoint ${waypoint.order}`);
    this.waypoint = waypoint;
    this.addFn = addFn;
    this.deleteFn = deleteFn;
  }

  execute(): void {
    this.addFn(this.waypoint);
  }

  undo(): void {
    this.deleteFn(this.waypoint.id);
  }
}

/**
 * Delete Waypoint Command
 */
export class DeleteWaypointCommand extends BaseCommand {
  waypoint: Waypoint;
  addFn: (waypoint: Waypoint) => void;
  deleteFn: (waypointId: string) => void;

  constructor(
    waypoint: Waypoint,
    addFn: (waypoint: Waypoint) => void,
    deleteFn: (waypointId: string) => void
  ) {
    super(`Delete waypoint ${waypoint.order}`);
    this.waypoint = waypoint;
    this.addFn = addFn;
    this.deleteFn = deleteFn;
  }

  execute(): void {
    this.deleteFn(this.waypoint.id);
  }

  undo(): void {
    this.addFn(this.waypoint);
  }
}

/**
 * Update Waypoint Command
 */
export class UpdateWaypointCommand extends BaseCommand {
  waypointId: string;
  oldData: Partial<Waypoint>;
  newData: Partial<Waypoint>;
  updateFn: (waypointId: string, data: Partial<Waypoint>) => void;

  constructor(
    waypointId: string,
    oldData: Partial<Waypoint>,
    newData: Partial<Waypoint>,
    updateFn: (waypointId: string, data: Partial<Waypoint>) => void
  ) {
    super(`Update waypoint`);
    this.waypointId = waypointId;
    this.oldData = oldData;
    this.newData = newData;
    this.updateFn = updateFn;
  }

  execute(): void {
    this.updateFn(this.waypointId, this.newData);
  }

  undo(): void {
    this.updateFn(this.waypointId, this.oldData);
  }
}
