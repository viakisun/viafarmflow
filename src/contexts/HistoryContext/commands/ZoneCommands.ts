/**
 * Zone-related Commands
 */

import { BaseCommand } from './ICommand';
import type { WorkZone } from '../../../types/greenhouse';

/**
 * Add Zone Command
 */
export class AddZoneCommand extends BaseCommand {
  zone: WorkZone;
  addFn: (zone: WorkZone) => void;
  deleteFn: (zoneId: string) => void;

  constructor(
    zone: WorkZone,
    addFn: (zone: WorkZone) => void,
    deleteFn: (zoneId: string) => void
  ) {
    super(`Add zone "${zone.name}"`);
    this.zone = zone;
    this.addFn = addFn;
    this.deleteFn = deleteFn;
  }

  execute(): void {
    this.addFn(this.zone);
  }

  undo(): void {
    this.deleteFn(this.zone.id);
  }
}

/**
 * Delete Zone Command
 */
export class DeleteZoneCommand extends BaseCommand {
  zone: WorkZone;
  addFn: (zone: WorkZone) => void;
  deleteFn: (zoneId: string) => void;

  constructor(
    zone: WorkZone,
    addFn: (zone: WorkZone) => void,
    deleteFn: (zoneId: string) => void
  ) {
    super(`Delete zone "${zone.name}"`);
    this.zone = zone;
    this.addFn = addFn;
    this.deleteFn = deleteFn;
  }

  execute(): void {
    this.deleteFn(this.zone.id);
  }

  undo(): void {
    this.addFn(this.zone);
  }
}

/**
 * Update Zone Command
 */
export class UpdateZoneCommand extends BaseCommand {
  zoneId: string;
  oldData: Partial<WorkZone>;
  newData: Partial<WorkZone>;
  updateFn: (zoneId: string, data: Partial<WorkZone>) => void;

  constructor(
    zoneId: string,
    oldData: Partial<WorkZone>,
    newData: Partial<WorkZone>,
    updateFn: (zoneId: string, data: Partial<WorkZone>) => void
  ) {
    super(`Update zone`);
    this.zoneId = zoneId;
    this.oldData = oldData;
    this.newData = newData;
    this.updateFn = updateFn;
  }

  execute(): void {
    this.updateFn(this.zoneId, this.newData);
  }

  undo(): void {
    this.updateFn(this.zoneId, this.oldData);
  }
}
