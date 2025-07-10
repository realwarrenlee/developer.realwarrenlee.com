import React from 'react';
import { Terminal } from './components/Terminal';
import { MatrixRain } from './components/MatrixRain';

function App() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <MatrixRain />
      <div className="relative z-10">
        <Terminal />
      </div>
    </div>
  );
}

export default App;