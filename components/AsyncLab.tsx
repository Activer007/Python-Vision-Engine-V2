import React, { useState, useEffect } from 'react';
import { Timer, Zap, PlayCircle, StopCircle, Clock, AlertCircle } from 'lucide-react';

interface Props {
  setConsole: (msg: string) => void;
}

type TaskStatus = 'pending' | 'running' | 'awaiting' | 'completed' | 'error';

interface AsyncTask {
  id: number;
  name: string;
  duration: number;
  status: TaskStatus;
  startTime: number;
  currentTime: number;
}

export const AsyncLab: React.FC<Props> = ({ setConsole }) => {
  const [mode, setMode] = useState<'SIMPLE' | 'CONCURRENT'>('SIMPLE');
  const [tasks, setTasks] = useState<AsyncTask[]>([
    {
      id: 1,
      name: 'fetch_user()',
      duration: 2000,
      status: 'pending',
      startTime: 0,
      currentTime: 0,
    },
    {
      id: 2,
      name: 'fetch_posts()',
      duration: 3000,
      status: 'pending',
      startTime: 0,
      currentTime: 0,
    },
    {
      id: 3,
      name: 'fetch_comments()',
      duration: 1500,
      status: 'pending',
      startTime: 0,
      currentTime: 0,
    },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [timeoutDuration, setTimeoutDuration] = useState(5000);

  useEffect(() => {
    if (mode === 'SIMPLE') {
      setConsole(
        'Level 9: 异步编程实验室 🚦 | Async/Await 可视化：红灯 = await 等待，绿灯 = 继续执行。'
      );
    } else {
      setConsole('Level 9: 并发模式 🏊 | 多泳道图：所有任务同时启动，观察并发执行的时序关系。');
    }
  }, [mode, setConsole]);

  const resetTasks = () => {
    setTasks(tasks.map(t => ({ ...t, status: 'pending', startTime: 0, currentTime: 0 })));
    setIsRunning(false);
  };

  const runSequential = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setConsole('🔄 顺序执行：await 会阻塞，每个任务完成后才开始下一个...');

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];

      // Mark as running
      setTasks(prev =>
        prev.map((t, idx) => (idx === i ? { ...t, status: 'running', startTime: Date.now() } : t))
      );
      setConsole(`▶️ 开始执行 ${task.name}...`);

      // Simulate await
      setTasks(prev => prev.map((t, idx) => (idx === i ? { ...t, status: 'awaiting' } : t)));
      setConsole(`🚦 await ${task.name} - 红灯等待中 (${task.duration}ms)...`);

      await new Promise(resolve => setTimeout(resolve, task.duration));

      // Mark as completed
      setTasks(prev => prev.map((t, idx) => (idx === i ? { ...t, status: 'completed' } : t)));
      setConsole(`✅ ${task.name} 完成！绿灯通行，继续下一个任务。`);
    }

    setConsole('🎉 所有任务顺序执行完毕！总耗时约 6.5 秒。');
    setIsRunning(false);
  };

  const runConcurrent = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setConsole('⚡ 并发执行：所有任务同时启动，无需等待...');

    const startTime = Date.now();

    // Start all tasks simultaneously
    const promises = tasks.map((task, idx) => {
      setTasks(prev =>
        prev.map((t, i) => (i === idx ? { ...t, status: 'running', startTime: Date.now() } : t))
      );

      return new Promise<void>(resolve => {
        const interval = setInterval(() => {
          setTasks(prev =>
            prev.map((t, i) => {
              if (i === idx) {
                const elapsed = Date.now() - startTime;
                if (elapsed >= task.duration) {
                  clearInterval(interval);
                  return { ...t, status: 'completed', currentTime: task.duration };
                }
                return { ...t, status: 'awaiting', currentTime: elapsed };
              }
              return t;
            })
          );
        }, 100);

        setTimeout(() => {
          clearInterval(interval);
          setTasks(prev =>
            prev.map((t, i) =>
              i === idx ? { ...t, status: 'completed', currentTime: task.duration } : t
            )
          );
          setConsole(`✅ ${task.name} 完成 (${task.duration}ms)!`);
          resolve();
        }, task.duration);
      });
    });

    await Promise.all(promises);

    const totalTime = Date.now() - startTime;
    setConsole(
      `🚀 所有任务并发完成！总耗时约 ${(totalTime / 1000).toFixed(1)} 秒 (取最长任务时间)。`
    );
    setIsRunning(false);
  };

  const runWithTimeout = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setConsole(`⏱️ 超时控制：设置 ${timeoutDuration}ms 超时，超时则中断...`);

    let timedOut = false;

    const timeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => {
        timedOut = true;
        reject(new Error('Timeout'));
      }, timeoutDuration);
    });

    const taskPromises = tasks.map(task => {
      setTasks(prev =>
        prev.map(t => (t.id === task.id ? { ...t, status: 'running', startTime: Date.now() } : t))
      );

      return new Promise<void>(resolve => {
        setTimeout(() => {
          if (!timedOut) {
            setTasks(prev => prev.map(t => (t.id === task.id ? { ...t, status: 'completed' } : t)));
            setConsole(`✅ ${task.name} 完成!`);
          }
          resolve();
        }, task.duration);
      });
    });

    try {
      await Promise.race([Promise.all(taskPromises), timeoutPromise]);
      setConsole('✅ 所有任务在超时前完成！');
    } catch {
      setTasks(prev =>
        prev.map(t =>
          t.status === 'running' || t.status === 'awaiting' ? { ...t, status: 'error' } : t
        )
      );
      setConsole(`⚠️ 超时！任务被中断 (${timeoutDuration}ms)。`);
    }

    setIsRunning(false);
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-slate-700 border-slate-600';
      case 'running':
        return 'bg-blue-600/20 border-pve-blue animate-pulse';
      case 'awaiting':
        return 'bg-pve-red/20 border-pve-red';
      case 'completed':
        return 'bg-pve-green/20 border-pve-green';
      case 'error':
        return 'bg-pve-amber/20 border-pve-amber';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-slate-500" />;
      case 'running':
        return <Zap size={16} className="text-pve-blue" />;
      case 'awaiting':
        return <StopCircle size={16} className="text-pve-red" />;
      case 'completed':
        return <PlayCircle size={16} className="text-pve-green" />;
      case 'error':
        return <AlertCircle size={16} className="text-pve-amber" />;
    }
  };

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'running':
        return 'Running';
      case 'awaiting':
        return 'Awaiting (🚦 Red)';
      case 'completed':
        return 'Completed (✅ Green)';
      case 'error':
        return 'Timeout Error';
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6 p-4 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
        <h2 className="text-xl font-bold flex items-center gap-2 text-pve-purple">
          <Timer /> Level 9: 异步编程实验室 (Async Lab)
        </h2>
        <div className="bg-slate-900 p-1 rounded-lg flex">
          <button
            onClick={() => {
              setMode('SIMPLE');
              resetTasks();
            }}
            className={`px-4 py-2 rounded text-sm ${mode === 'SIMPLE' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}
          >
            🚦 信号灯模式
          </button>
          <button
            onClick={() => {
              setMode('CONCURRENT');
              resetTasks();
            }}
            className={`px-4 py-2 rounded text-sm ${mode === 'CONCURRENT' ? 'bg-slate-700 text-white' : 'text-slate-500'}`}
          >
            🏊 多泳道模式
          </button>
        </div>
      </div>

      {/* Code Display */}
      <div className="bg-slate-900 rounded-xl border border-slate-700 p-6">
        <div className="font-mono text-sm text-slate-300 space-y-2">
          {mode === 'SIMPLE' ? (
            <>
              <div className="text-pve-purple">async def sequential_tasks():</div>
              <div className="ml-4 text-pve-blue">
                user = await fetch_user() <span className="text-slate-500"># 🚦 Wait</span>
              </div>
              <div className="ml-4 text-pve-blue">
                posts = await fetch_posts() <span className="text-slate-500"># 🚦 Wait</span>
              </div>
              <div className="ml-4 text-pve-blue">
                comments = await fetch_comments() <span className="text-slate-500"># 🚦 Wait</span>
              </div>
              <div className="ml-4 text-pve-green">return user, posts, comments</div>
            </>
          ) : (
            <>
              <div className="text-pve-purple">async def concurrent_tasks():</div>
              <div className="ml-4 text-slate-400"># 并发启动所有任务</div>
              <div className="ml-4 text-pve-blue">async with asyncio.TaskGroup() as tg:</div>
              <div className="ml-8">task1 = tg.create_task(fetch_user())</div>
              <div className="ml-8">task2 = tg.create_task(fetch_posts())</div>
              <div className="ml-8">task3 = tg.create_task(fetch_comments())</div>
              <div className="ml-4 text-pve-green">return await task1, task2, task3</div>
            </>
          )}
        </div>
      </div>

      {/* Swimlane Visualization */}
      <div className="bg-slate-900 rounded-xl border border-slate-700 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          {mode === 'SIMPLE' ? '🚦 信号灯隐喻' : '🏊 多泳道图'} - 任务执行时序
        </h3>

        {tasks.map(task => (
          <div key={task.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(task.status)}
                <span className="font-mono text-sm text-white">{task.name}</span>
                <span className="text-xs text-slate-500">({task.duration}ms)</span>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {getStatusLabel(task.status)}
              </span>
            </div>

            {/* Progress Bar */}
            <div
              className={`h-8 rounded border-2 ${getStatusColor(task.status)} overflow-hidden relative`}
            >
              <div
                className="h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-300"
                style={{
                  width:
                    task.status === 'completed'
                      ? '100%'
                      : task.status === 'awaiting' || task.status === 'running'
                        ? `${(task.currentTime / task.duration) * 100}%`
                        : '0%',
                }}
              />
              {task.status === 'awaiting' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-pve-red animate-pulse shadow-[0_0_10px_red]" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mode === 'SIMPLE' && (
          <button
            onClick={() => {
              void runSequential();
            }}
            disabled={isRunning}
            className="bg-pve-blue hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <PlayCircle /> 运行顺序执行
          </button>
        )}

        {mode === 'CONCURRENT' && (
          <button
            onClick={() => {
              void runConcurrent();
            }}
            disabled={isRunning}
            className="bg-pve-purple hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <Zap /> 运行并发执行
          </button>
        )}

        <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
          <Timer size={20} className="text-pve-amber" />
          <div className="flex-1">
            <label className="text-xs text-slate-400 block">超时设置 (Timeout)</label>
            <input
              type="range"
              min="1000"
              max="10000"
              step="500"
              value={timeoutDuration}
              onChange={e => setTimeoutDuration(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-xs text-white">{timeoutDuration}ms</span>
          </div>
        </div>

        <button
          onClick={() => {
            void runWithTimeout();
          }}
          disabled={isRunning}
          className="bg-pve-amber hover:bg-amber-600 text-black px-6 py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          <AlertCircle /> 测试超时控制
        </button>

        <button
          onClick={resetTasks}
          disabled={isRunning}
          className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          重置 (Reset)
        </button>
      </div>

      {/* Legend */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <h4 className="text-sm font-bold text-white mb-3">图例 (Legend)</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-slate-500" />
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-pve-blue" />
            <span>Running</span>
          </div>
          <div className="flex items-center gap-2">
            <StopCircle size={14} className="text-pve-red" />
            <span>Awaiting (🚦)</span>
          </div>
          <div className="flex items-center gap-2">
            <PlayCircle size={14} className="text-pve-green" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle size={14} className="text-pve-amber" />
            <span>Timeout Error</span>
          </div>
        </div>
      </div>
    </div>
  );
};
