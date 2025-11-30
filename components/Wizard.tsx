import React from 'react';
import { FlowNode } from '../types';
import { HistoryItem } from '../App';

interface WizardProps {
  node: FlowNode;
  onOptionSelect: (nextId: string, label: string) => void;
  history: HistoryItem[];
  onJumpToHistory: (index: number) => void;
}

const Wizard: React.FC<WizardProps> = ({ node, onOptionSelect, history, onJumpToHistory }) => {
  const isResult = node.type === 'result';

  return (
    <div className="w-full h-full flex flex-col md:flex-row overflow-hidden">
      
      {/* SIDEBAR: History (Visible on md+) */}
      <div className={`
          flex-shrink-0 bg-slate-900/95 border-r border-slate-800 p-6 flex flex-col overflow-y-auto
          ${history.length === 0 ? 'hidden md:flex md:w-0 md:p-0 md:opacity-0' : 'w-full md:w-80 transition-all duration-300'}
        `}>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">Your Journey</h3>
        
        <div className="space-y-6 relative">
          {/* Vertical Line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-800 z-0"></div>

          {history.map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => onJumpToHistory(idx)}
              className="relative z-10 pl-8 cursor-pointer group"
            >
              {/* Dot */}
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-600 group-hover:border-indigo-500 group-hover:bg-indigo-900 transition-colors flex items-center justify-center">
                 <div className="w-2 h-2 rounded-full bg-slate-400 group-hover:bg-indigo-400"></div>
              </div>
              
              {/* Content */}
              <div>
                <div className="text-xs text-slate-500 font-medium group-hover:text-indigo-300 transition-colors">
                  {item.questionTitle.split(':')[1] || item.questionTitle}
                </div>
                <div className="text-sm font-bold text-slate-200 mt-0.5 group-hover:text-white group-hover:underline decoration-indigo-500 underline-offset-4 transition-all">
                  {item.answerLabel}
                </div>
              </div>
            </div>
          ))}

          {/* Current Step Marker */}
          <div className="relative z-10 pl-8">
            <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-indigo-600 border-2 border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)] flex items-center justify-center animate-pulse">
            </div>
            <div className="text-xs text-indigo-400 font-bold uppercase tracking-wide mt-2">
              Current Step
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CARD AREA */}
      <div className="flex-grow p-4 md:p-8 overflow-y-auto custom-scrollbar flex items-start justify-center">
        <div className="w-full max-w-3xl bg-slate-800/80 backdrop-blur-md border border-slate-700 shadow-2xl rounded-2xl p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Card Header */}
          <div className="mb-6 border-b border-slate-700 pb-4">
            <span className={`text-sm font-bold tracking-wider uppercase px-2 py-1 rounded ${isResult ? 'bg-emerald-900/30 text-emerald-400' : 'bg-indigo-900/30 text-indigo-400'}`}>
              {isResult ? 'Recommendation' : 'Diagnostic Question'}
            </span>
          </div>

          {/* Title & Content */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            {node.title}
          </h2>
          <p className="text-slate-300 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl">
            {node.content}
          </p>

          {/* --- RESULT SECTION: ANALYSIS --- */}
          {isResult && node.analysis && (
             <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-900/20 border border-emerald-800/50 rounded-xl p-5">
                   <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                     Why this path?
                   </h3>
                   <p className="text-emerald-100/80 text-sm leading-relaxed">
                     {node.analysis.why}
                   </p>
                </div>
                <div className="bg-slate-700/30 border border-slate-700 rounded-xl p-5">
                   <h3 className="text-slate-400 font-bold text-sm uppercase tracking-wide mb-3">
                     Why not others?
                   </h3>
                   <ul className="space-y-2">
                     {node.analysis.whyNot.map((reason, idx) => (
                       <li key={idx} className="text-slate-400 text-sm flex items-start gap-2">
                         <span className="text-red-400 mt-1">×</span>
                         <span>{reason}</span>
                       </li>
                     ))}
                   </ul>
                </div>
             </div>
          )}

          {/* --- RESULT SECTION: ROADMAP --- */}
          {isResult && node.roadmap && (
            <div className="mb-10">
               <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                 <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-sm">🚀</span>
                 Progression Roadmap
               </h3>
               <div className="space-y-4">
                  {node.roadmap.map((step, idx) => (
                    <div key={idx} className="group flex gap-4 p-4 rounded-xl bg-slate-700/30 border border-slate-700 hover:bg-slate-700/50 hover:border-indigo-500/30 transition-all">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-800 border-2 border-indigo-500/50 text-indigo-400 font-bold flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1">{step.title}</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* --- ACTION BUTTONS --- */}
          <div className="grid gap-4 md:grid-cols-1">
            {node.options && node.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => onOptionSelect(option.nextId, option.label)}
                className="w-full text-left group bg-slate-700 hover:bg-indigo-600 border border-slate-600 hover:border-indigo-500 text-white p-5 rounded-xl transition-all duration-200 flex justify-between items-center shadow-md hover:shadow-xl hover:-translate-y-1"
              >
                <span className="font-semibold text-lg">{option.label}</span>
                <span className="text-slate-400 group-hover:text-white transition-colors transform group-hover:translate-x-1">→</span>
              </button>
            ))}

            {isResult && (
              <div className="flex flex-col gap-4 mt-4 pt-6 border-t border-slate-700">
                 {node.progressionLink && (
                    <button
                    onClick={() => onOptionSelect(node.progressionLink!.nextId, node.progressionLink!.label)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2 group hover:-translate-y-0.5"
                  >
                    <span>{node.progressionLink.label}</span>
                    <span className="group-hover:translate-x-1 transition-transform">↠</span>
                  </button>
                 )}
                 <button
                  onClick={() => onOptionSelect('root', 'Restart')}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  Start Over ↺
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Wizard;