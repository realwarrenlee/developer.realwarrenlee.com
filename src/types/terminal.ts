export interface FileSystemNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: { [key: string]: FileSystemNode };
  executable?: boolean;
  size?: string;
  modified?: string;
}

export interface Command {
  name: string;
  description: string;
  usage: string;
  execute: (args: string[], currentPath: string[], fileSystem: FileSystemNode) => CommandResult;
}

export interface CommandResult {
  output: string;
  newPath?: string[];
  error?: boolean;
  clear?: boolean;
}

export interface TerminalState {
  currentPath: string[];
  history: string[];
  historyIndex: number;
  output: string[];
}