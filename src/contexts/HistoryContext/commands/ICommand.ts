/**
 * ICommand Interface
 * Base interface for Command Pattern implementation
 */

export interface ICommand {
  /**
   * Execute the command
   */
  execute(): void;

  /**
   * Undo the command
   */
  undo(): void;

  /**
   * Redo the command (default implementation calls execute)
   */
  redo(): void;

  /**
   * Check if the command can be executed
   */
  canExecute(): boolean;

  /**
   * Human-readable description of the command
   */
  readonly description: string;

  /**
   * Timestamp when the command was created
   */
  readonly timestamp: number;
}

/**
 * Abstract base class for commands
 */
export abstract class BaseCommand implements ICommand {
  readonly timestamp: number;
  readonly description: string;

  constructor(description: string) {
    this.description = description;
    this.timestamp = Date.now();
  }

  abstract execute(): void;
  abstract undo(): void;

  redo(): void {
    this.execute();
  }

  canExecute(): boolean {
    return true;
  }
}
