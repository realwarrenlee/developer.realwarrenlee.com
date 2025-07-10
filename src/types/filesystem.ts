export interface FileSystemNode {
  type: 'file' | 'directory';
  content?: string;
  children?: Record<string, FileSystemNode>;
  executable?: boolean;
  size?: number;
  modified?: string;
}

export interface FileSystem {
  [key: string]: FileSystemNode;
}

export interface TerminalState {
  currentPath: string[];
  history: string[];
  historyIndex: number;
  output: OutputLine[];
}

export interface OutputLine {
  id: string;
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp?: Date;
}