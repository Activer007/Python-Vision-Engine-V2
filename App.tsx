import React, { useState, lazy, Suspense } from 'react';
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
  Loader2,
} from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ConsoleBar } from './components/ConsoleBar';

// Error fallback component for lazy loading failures
const LazyLoadErrorFallback: React.FC<{ componentName: string }> = ({ componentName }) => (
  <div className="flex items-center justify-center min-h-[500px]">
    <div className="text-center">
      <Terminal className="mx-auto text-pve-red mb-4" size={48} />
      <h3 className="text-xl font-bold text-white mb-2">组件加载失败</h3>
      <p className="text-slate-400 text-sm mb-2">无法加载 {componentName} 组件</p>
      <p className="text-slate-500 text-xs">请检查网络连接或刷新页面重试</p>
    </div>
  </div>
);

// Lazy load all lab components for code splitting
const BracketLens = lazy(() =>
  import('./components/BracketLens')
    .then(m => ({ default: m.BracketLens }))
    .catch(() => ({
      default: () => <LazyLoadErrorFallback componentName="透视镜 (BracketLens)" />,
    }))
);
const VariableLabels = lazy(() =>
  import('./components/VariableLabels')
    .then(m => ({ default: m.VariableLabels }))
    .catch(() => ({
      default: () => <LazyLoadErrorFallback componentName="变量 (VariableLabels)" />,
    }))
);
const ContainerChameleon = lazy(() =>
  import('./components/ContainerChameleon')
    .then(m => ({ default: m.ContainerChameleon }))
    .catch(() => ({
      default: () => <LazyLoadErrorFallback componentName="容器 (ContainerChameleon)" />,
    }))
);
const LogicToggles = lazy(() =>
  import('./components/LogicToggles')
    .then(m => ({ default: m.LogicToggles }))
    .catch(() => ({ default: () => <LazyLoadErrorFallback componentName="逻辑 (LogicToggles)" /> }))
);
const FlowSandbox = lazy(() =>
  import('./components/FlowSandbox')
    .then(m => ({ default: m.FlowSandbox }))
    .catch(() => ({ default: () => <LazyLoadErrorFallback componentName="流程 (FlowSandbox)" /> }))
);
const IndentationSteps = lazy(() =>
  import('./components/IndentationSteps')
    .then(m => ({ default: m.IndentationSteps }))
    .catch(() => ({
      default: () => <LazyLoadErrorFallback componentName="函数 (IndentationSteps)" />,
    }))
);
const ChainInterpreter = lazy(() =>
  import('./components/ChainInterpreter')
    .then(m => ({ default: m.ChainInterpreter }))
    .catch(() => ({
      default: () => <LazyLoadErrorFallback componentName="链式 (ChainInterpreter)" />,
    }))
);
const SlicingLab = lazy(() =>
  import('./components/SlicingLab')
    .then(m => ({ default: m.SlicingLab }))
    .catch(() => ({ default: () => <LazyLoadErrorFallback componentName="切片 (SlicingLab)" /> }))
);
const AsyncLab = lazy(() =>
  import('./components/AsyncLab')
    .then(m => ({ default: m.AsyncLab }))
    .catch(() => ({ default: () => <LazyLoadErrorFallback componentName="异步 (AsyncLab)" /> }))
);

const PORTAL_URL = 'https://ai-trainer-porama-system.vercel.app/';

// Loading skeleton component
const LabSkeleton: React.FC = () => (
  <div className="flex items-center justify-center min-h-[500px] p-8">
    <div className="text-center">
      <Loader2 className="mx-auto text-pve-blue animate-spin mb-4" size={48} />
      <h3 className="text-xl font-bold text-white mb-2">加载实验室中...</h3>
      <p className="text-slate-400 text-sm">正在准备可视化组件</p>
    </div>
  </div>
);

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
        case 8:
          return <AsyncLab setConsole={setConsoleMsg} />;
        default:
          return <BracketLens setConsole={setConsoleMsg} />;
      }
    };

    return (
      <ErrorBoundary
        fallback={
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center">
              <Terminal className="mx-auto text-pve-red mb-4" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">实验室加载失败</h3>
              <p className="text-slate-400 text-sm">请尝试切换其他实验室或刷新页面</p>
            </div>
          </div>
        }
      >
        <Suspense fallback={<LabSkeleton />}>{content()}</Suspense>
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
    { id: 8, label: '异步 (Async)', icon: <Terminal size={18} />, color: 'hover:text-pve-purple' },
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans selection:bg-pve-blue selection:text-white overflow-hidden relative">
        {/* Sidebar Navigation (Desktop) */}
        <aside className="hidden md:flex w-64 flex-col bg-slate-950 border-r border-slate-800 shrink-0 z-50">
          <div className="p-4 border-b border-slate-800 flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
              <Terminal size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight leading-tight">Python Vision</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Engine v1.0</p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 custom-scrollbar">
            <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Laboratories
            </div>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-200 text-sm font-medium text-left
                  ${
                    activeTab === item.id
                      ? 'bg-slate-800 text-white shadow-inner border border-slate-700/50'
                      : `text-slate-400 hover:bg-slate-900 ${item.color}`
                  }
                `}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <div className="text-xs text-slate-500 text-center">© 2024 Python Vision Engine</div>
          </div>
        </aside>

        {/* Mobile Header (visible only on mobile) */}
        <header className="md:hidden bg-slate-950 border-b border-slate-800 shrink-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                <Terminal size={24} className="text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight">Python Vision Engine</h1>
              </div>
            </div>
          </div>

          {/* Mobile Nav Scroller */}
          <div className="flex overflow-x-auto gap-2 p-2 bg-slate-950 border-t border-slate-800 no-scrollbar">
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
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <div className="flex-1 overflow-hidden flex flex-col p-4 md:p-6 relative">
            <div className="flex-1 bg-slate-900/50 rounded-t-2xl border-x border-t border-slate-800/50 backdrop-blur-sm shadow-2xl overflow-hidden relative">
              {renderContent()}
            </div>

            {/* Global Console Bar */}
            <div className="rounded-b-2xl overflow-hidden border-x border-b border-slate-800/50 shrink-0">
              <ConsoleBar message={consoleMsg} />
            </div>
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
