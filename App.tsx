import React, { useState } from 'react';
import { flowLogic } from './data/logic';
import Wizard from './components/Wizard';
import Visualizer from './components/Visualizer';

export interface HistoryItem {
  nodeId: string;
  questionTitle: string;
  answerLabel: string;
}

export default function App() {
  const [currentNodeId, setCurrentNodeId] = useState<string>('root');
  const [viewMode, setViewMode] = useState<'wizard' | 'map'>('wizard');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleNext = (nextId: string, answerLabel: string) => {
    // If resetting
    if (nextId === 'root') {
      setHistory([]);
      setCurrentNodeId('root');
      return;
    }

    const currentNode = flowLogic[currentNodeId];
    
    // Add to history
    setHistory(prev => [
      ...prev,
      {
        nodeId: currentNodeId,
        questionTitle: currentNode?.title || 'Question',
        answerLabel: answerLabel
      }
    ]);
    
    setCurrentNodeId(nextId);
  };

  const handleJumpToHistory = (index: number) => {
    // Revert state to the clicked history item
    const targetItem = history[index];
    const newHistory = history.slice(0, index);
    setHistory(newHistory);
    setCurrentNodeId(targetItem.nodeId);
  };

  const handleJumpFromMap = (id: string) => {
    setCurrentNodeId(id);
    setViewMode('wizard');
  };

  const handleRestart = () => {
    setHistory([]);
    setCurrentNodeId('root');
  };

  const currentNode = flowLogic[currentNodeId] || flowLogic['root'];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans flex flex-col">
      {/* Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleRestart}>
            <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              Foil Flow
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <button
              onClick={handleRestart}
              className="text-slate-400 hover:text-white px-3 py-1 text-sm font-medium transition-colors hidden sm:block"
            >
              Restart
            </button>
            <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
              <button
                onClick={() => setViewMode('wizard')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'wizard' 
                  ? 'bg-indigo-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Wizard
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === 'map' 
                  ? 'bg-indigo-600 text-white shadow' 
                  : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Logic Map
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow relative flex flex-col overflow-hidden">
        {viewMode === 'wizard' ? (
          <div className="flex-grow flex bg-[url('https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative">
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-slate-900/90"></div>
            
            <div className="relative z-10 w-full h-full flex flex-col">
              <Wizard 
                node={currentNode} 
                onOptionSelect={handleNext} 
                history={history}
                onJumpToHistory={handleJumpToHistory}
              />
            </div>
          </div>
        ) : (
          <div className="flex-grow h-[calc(100vh-64px)]">
             <Visualizer 
              data={flowLogic} 
              currentNodeId={currentNodeId} 
              onNodeClick={handleJumpFromMap} 
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Foil Flow. Logic based on community progression corpus.</p>
        </div>
      </footer>
    </div>
  );
}