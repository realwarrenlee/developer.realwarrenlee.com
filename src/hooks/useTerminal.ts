import { useState, useCallback, useEffect } from 'react';
import { TerminalState, CommandResult } from '../types/terminal';
import { fileSystem } from '../data/filesystem';
import { commands } from '../utils/commands';

export const useTerminal = () => {
  const [state, setState] = useState<TerminalState>({
    currentPath: [],
    history: [],
    historyIndex: -1,
    output: [
      'Welcome to the Terminal, Developer',
      '',
      'Type "help" to get started or "ls" to explore.',
      ''
    ]
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [showFire, setShowFire] = useState(false);
  const [showDonut, setShowDonut] = useState(false);

  const executeCommand = useCallback((commandLine: string) => {
    if (!commandLine.trim()) return;

    const parts = commandLine.trim().split(' ');
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    setState(prev => ({
      ...prev,
      history: [...prev.history, commandLine],
      historyIndex: -1,
      output: [...prev.output, `developer@realwarrenlee.com:~${prev.currentPath.join('/')}$ ${commandLine}`]
    }));

    const command = commands[commandName];
    if (!command) {
      // Special case for matrix command
      if (commandName === 'matrix') {
        setShowMatrix(true);
        setState(prev => ({
          ...prev,
          output: [...prev.output, 'Entering the Matrix...', '']
        }));
      } else if (commandName === 'fire') {
        setShowFire(true);
        setState(prev => ({
          ...prev,
          output: [...prev.output, 'Igniting the flames...', '']
        }));
      } else if (commandName === 'donut') {
        setShowDonut(true);
        setState(prev => ({
          ...prev,
          output: [...prev.output, 'Spinning the donut...', '']
        }));
      } else {
        setState(prev => ({
          ...prev,
          output: [...prev.output, `bash: ${commandName}: command not found`, '']
        }));
      }
      return;
    }

    setIsTyping(true);
    
    // Simulate typing delay for realism
    setTimeout(() => {
      const result: CommandResult = command.execute(args, state.currentPath, fileSystem);
      
      setState(prev => ({
        ...prev,
        currentPath: result.newPath || prev.currentPath,
        output: result.clear ? [] : [...prev.output, result.output, '']
      }));
      
      setIsTyping(false);
    }, 100 + Math.random() * 200);
  }, [state.currentPath]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (state.history.length > 0) {
        const newIndex = state.historyIndex === -1 
          ? state.history.length - 1
          : Math.max(0, state.historyIndex - 1);
        setState(prev => ({ ...prev, historyIndex: newIndex }));
        setInput(state.history[newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (state.historyIndex > -1) {
        const newIndex = state.historyIndex + 1;
        if (newIndex >= state.history.length) {
          setState(prev => ({ ...prev, historyIndex: -1 }));
          setInput('');
        } else {
          setState(prev => ({ ...prev, historyIndex: newIndex }));
          setInput(state.history[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Basic autocomplete for commands
      const commandNames = Object.keys(commands);
      const matches = commandNames.filter(cmd => cmd.startsWith(input.toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0]);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      executeCommand('clear');
    }
  }, [input, executeCommand, state.history, state.historyIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    state,
    input,
    setInput,
    isTyping,
    executeCommand,
    showMatrix,
    setShowMatrix,
    showFire,
    setShowFire,
    showDonut,
    setShowDonut
  };
};