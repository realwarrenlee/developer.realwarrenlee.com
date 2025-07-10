import { useState, useCallback, useRef, useEffect } from 'react';
import { TerminalState, OutputLine } from '../types/filesystem';
import { fileSystem } from '../data/filesystem';
import { executeCommand } from '../utils/commands';

export const useTerminal = () => {
  const [state, setState] = useState<TerminalState>({
    currentPath: [],
    history: [],
    historyIndex: -1,
    output: [
      {
        id: '0',
        type: 'output',
        content: 'Terminal Shell - Welcome to the Digital Realm',
        timestamp: new Date()
      },
      {
        id: '1',
        type: 'output',
        content: 'Type "help" to get started or "ls" to explore.',
        timestamp: new Date()
      },
      {
        id: '2',
        type: 'output',
        content: ''
      }
    ]
  });

  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addOutput = useCallback((content: string, type: 'output' | 'error' = 'output') => {
    setState(prev => ({
      ...prev,
      output: [...prev.output, {
        id: Date.now().toString(),
        type,
        content,
        timestamp: new Date()
      }]
    }));
  }, []);

  const executeCommandHandler = useCallback(async (command: string) => {
    if (!command.trim()) return;

    setIsProcessing(true);

    // Add command to output
    setState(prev => ({
      ...prev,
      output: [...prev.output, {
        id: Date.now().toString(),
        type: 'command',
        content: `${getPrompt(prev.currentPath)} ${command}`,
        timestamp: new Date()
      }],
      history: [...prev.history, command],
      historyIndex: -1
    }));

    // Execute command
    const result = await executeCommand(command, state.currentPath, fileSystem);
    
    if (result.output) {
      addOutput(result.output, result.error ? 'error' : 'output');
    }

    if (result.newPath !== undefined) {
      setState(prev => ({
        ...prev,
        currentPath: result.newPath!
      }));
    }

    if (result.clear) {
      setState(prev => ({
        ...prev,
        output: []
      }));
    }

    setIsProcessing(false);
    setInput('');
  }, [state.currentPath, addOutput]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommandHandler(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setState(prev => {
        const newIndex = Math.min(prev.historyIndex + 1, prev.history.length - 1);
        if (newIndex >= 0 && newIndex < prev.history.length) {
          setInput(prev.history[prev.history.length - 1 - newIndex]);
          return { ...prev, historyIndex: newIndex };
        }
        return prev;
      });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setState(prev => {
        const newIndex = Math.max(prev.historyIndex - 1, -1);
        if (newIndex === -1) {
          setInput('');
        } else {
          setInput(prev.history[prev.history.length - 1 - newIndex]);
        }
        return { ...prev, historyIndex: newIndex };
      });
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Auto-complete logic would go here
    }
  }, [input, executeCommandHandler]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  return {
    state,
    input,
    setInput,
    isProcessing,
    handleKeyDown,
    focusInput,
    inputRef
  };
};

const getPrompt = (currentPath: string[]): string => {
  const path = currentPath.length === 0 ? '~' : `~/${currentPath.join('/')}`;
  return `user@terminal:${path}$`;
};

export { getPrompt };