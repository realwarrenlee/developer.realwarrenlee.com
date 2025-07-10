import React, { useEffect, useRef } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
import { useTerminal } from '../hooks/useTerminal';
import { MatrixEffect } from './MatrixEffect';
import { FireEffect } from './FireEffect';
import { DonutEffect } from './DonutEffect';

export const Terminal: React.FC = () => {
  const { state, input, setInput, isTyping, executeCommand, showMatrix, setShowMatrix, showFire, setShowFire, showDonut, setShowDonut } = useTerminal();
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [state.output]);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const currentDir = state.currentPath.length === 0 ? '~' : `~/${state.currentPath.join('/')}`;
  const prompt = `developer@realwarrenlee.com:${currentDir}$ `;

  return (
    <>
      {showMatrix && (
        <MatrixEffect onComplete={() => setShowMatrix(false)} />
      )}
      {showFire && (
        <FireEffect onComplete={() => setShowFire(false)} />
      )}
      {showDonut && (
        <DonutEffect onComplete={() => setShowDonut(false)} />
      )}
      <div className="min-h-screen bg-black text-green-400 font-mono cursor-text" onClick={handleClick}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-green-800 bg-gray-900">
        <div className="flex items-center gap-2">
          <TerminalIcon size={20} />
          <span className="text-green-300">Terminal</span>
        </div>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-4 h-[calc(100vh-64px)] overflow-y-auto" ref={outputRef}>
        {/* Output History */}
        <div className="space-y-1">
          {state.output.map((line, index) => (
            <div key={index} className="whitespace-pre-wrap">
              {line.includes('developer@realwarrenlee.com:') ? (
                <span className="text-green-300">{line}</span>
              ) : (
                <span dangerouslySetInnerHTML={{
                  __html: line
                    .replace(/\x1b\[34m/g, '<span class="text-blue-400">')
                    .replace(/\x1b\[0m/g, '</span>')
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Current Input Line */}
        <div className="flex items-center mt-2">
          <span className="text-green-300 mr-1">{prompt}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                executeCommand(input);
                setInput('');
              }
            }}
            className="flex-1 bg-transparent outline-none text-green-400 caret-green-400"
            disabled={isTyping}
            autoFocus
          />
          {isTyping && (
            <div className="ml-2 flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Helper */}
      <div className="fixed bottom-4 right-4 sm:hidden">
        <button
          onClick={() => inputRef.current?.focus()}
          className="bg-green-900 text-green-300 p-3 rounded-full shadow-lg border border-green-700 hover:bg-green-800 transition-colors"
        >
          <TerminalIcon size={20} />
        </button>
      </div>
      </div>
    </>
  );
};