import React, { useState } from 'react';
import {
  Tag,
  Library,
  GitFork,
  Layers,
  Terminal,
  GitCommit,
  Eye,
  ToggleLeft,
  Scissors,
  Home,
} from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { VariableLabels } from './components/VariableLabels';
import { ContainerChameleon } from './components/ContainerChameleon';
import { FlowSandbox } from './components/FlowSandbox';
import { IndentationSteps } from './components/IndentationSteps';
import { ChainInterpreter } from './components/ChainInterpreter';
import { BracketLens } from './components/BracketLens';
import { LogicToggles } from './components/LogicToggles';
import { SlicingLab } from './components/SlicingLab';
import { ConsoleBar } from './components/ConsoleBar';

const PORTAL_URL = 'https://ai-trainer-porama-system.vercel.app/';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [consoleMsg, setConsoleMsg] = useState<string>('系统就绪 (System Ready)');

  const renderContent = () => {
    const content = () => {
      switch (activeTab) {
        case 0:
          return <BracketLens setConsole={setConsoleMsg} />;
        case 1:
          return <VariableLabels setConsole={setConsoleMsg} />;
        case 2:
          return <ContainerChameleon setConsole={setConsoleMsg} />;
        case 3:
          return <LogicToggles setConsole={setConsoleMsg} />;
        case 4:
          return <FlowSandbox setConsole={setConsoleMsg} />;
        case 5:
          return <IndentationSteps setConsole={setConsoleMsg} />;
        case 6:
          return <ChainInterpreter setConsole={setConsoleMsg} />;
        case 7:
          return <SlicingLab setConsole={setConsoleMsg} />;
        default:
          return <BracketLens setConsole={setConsoleMsg} />;
      }
    };

    return (
      <ErrorBoundary
        fallback={
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Terminal className="mx-auto text-pve-red mb-4" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">实验室加载失败</h3>
              <p className="text-slate-400 text-sm">请尝试切换其他实验室或刷新页面</p>
            </div>
          </div>
        }
      >
        {content()}
      </ErrorBoundary>
    );
  };

  const navItems = [
    { id: 0, label: '透视镜 (Syntax)', icon: <Eye size={18} />, color: 'hover:text-pve-blue' },
    { id: 1, label: '变量 (Vars)', icon: <Tag size={18} />, color: 'hover:text-pve-amber' },
    { id: 2, label: '容器 (Data)', icon: <Library size={18} />, color: 'hover:text-pve-green' },
    { id: 3, label: '逻辑 (Logic)', icon: <ToggleLeft size={18} />, color: 'hover:text-pve-amber' },
    { id: 4, label: '流程 (Flow)', icon: <GitFork size={18} />, color: 'hover:text-pve-red' },
    { id: 5, label: '函数 (Func)', icon: <Layers size={18} />, color: 'hover:text-pve-blue' },
    { id: 6, label: '链式 (Chain)', icon: <GitCommit size={18} />, color: 'hover:text-pve-purple' },
    { id: 7, label: '切片 (Slice)', icon: <Scissors size={18} />, color: 'hover:text-pink-500' },
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-pve-blue selection:text-white overflow-hidden relative">
        {/* Top Navigation Bar */}
        <header className="bg-slate-950 border-b border-slate-800 shrink-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                <Terminal size={24} className="text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight">
                  Python Vision Engine{' '}
                  <span className="text-xs text-slate-500 font-normal">v1.2</span>
                </h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                  物理逻辑实验室
                </p>
              </div>
            </div>

            <nav className="hidden md:flex gap-1 overflow-x-auto">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                  flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-300 text-sm font-medium whitespace-nowrap
                  ${
                    activeTab === item.id
                      ? 'bg-slate-800 text-white shadow-inner border border-slate-700'
                      : `text-slate-400 hover:bg-slate-900 ${item.color}`
                  }
                `}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </header>

        {/* Mobile Nav */}
        <div className="md:hidden flex overflow-x-auto gap-2 p-2 bg-slate-950 border-b border-slate-800 no-scrollbar shrink-0">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded text-xs font-bold border ${activeTab === item.id ? 'bg-slate-800 border-slate-600 text-white' : 'border-transparent text-slate-500'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <main className="flex-1 container mx-auto p-4 md:p-6 max-w-6xl overflow-hidden flex flex-col">
          <div className="flex-1 bg-slate-900/50 rounded-t-2xl border-x border-t border-slate-800/50 backdrop-blur-sm shadow-2xl overflow-hidden relative">
            {renderContent()}
          </div>

          {/* Global Console Bar */}
          <div className="rounded-b-2xl overflow-hidden border-x border-b border-slate-800/50">
            <ConsoleBar message={consoleMsg} />
          </div>
        </main>

        {/* Portal Button */}
        <a
          href={PORTAL_URL}
          className="fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-[0_0_20px_rgba(99,102,241,0.4)] backdrop-blur-md transition-all duration-300 hover:scale-110 hover:-translate-y-1 group flex items-center gap-0 hover:gap-2 overflow-hidden border border-white/20"
          title="返回备考系统门户"
        >
          <Home className="w-6 h-6" />
          <span className="max-w-0 group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap opacity-0 group-hover:opacity-100 text-sm font-bold">
            返回门户
          </span>
        </a>
      </div>
    </ErrorBoundary>
  );
};

export default App;
