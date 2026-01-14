import React, { useState, useEffect } from 'react';
import { Scissors, ArrowRightLeft, MousePointerClick } from 'lucide-react';

interface Props {
  setConsole: (msg: string) => void;
}

const SAMPLE_TEXT = 'PYTHON_LAB';

export const SlicingLab: React.FC<Props> = ({ setConsole }) => {
  const [start, setStart] = useState<number | ''>(0);
  const [stop, setStop] = useState<number | ''>(6);
  const [step, setStep] = useState<number>(1);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Convert empty inputs to Python defaults for calculation
  const effStart = start === '' ? (step > 0 ? 0 : SAMPLE_TEXT.length - 1) : Number(start);
  const effStop =
    stop === '' ? (step > 0 ? SAMPLE_TEXT.length : -SAMPLE_TEXT.length - 1) : Number(stop);
  const effStep = step === 0 ? 1 : step; // Prevent infinite loop if 0

  useEffect(() => {
    setConsole(
      "Level 7: 切片实验室 (Slicing Lab)。掌握 Python 独特的 <span class='text-pve-amber font-bold'>[start : stop : step]</span> 语法。注意观察上方(正)和下方(负)的索引编号。"
    );
  }, []);

  const calculateSlice = () => {
    const res = [];
    const len = SAMPLE_TEXT.length;

    // Normalize indices for loop logic similar to Python
    const s = effStart < 0 ? effStart + len : effStart;
    const e = effStop < 0 ? effStop + len : effStop;

    if (effStep > 0) {
      for (let i = s; i < e && i < len; i += effStep) {
        if (i >= 0) res.push(SAMPLE_TEXT[i]);
      }
    } else {
      for (let i = s; i > e && i >= 0; i += effStep) {
        if (i < len) res.push(SAMPLE_TEXT[i]);
      }
    }
    return res;
  };

  useEffect(() => {
    const result = calculateSlice().join('');
    setConsole(
      `🤖 切片结果：<span class="text-pve-amber font-bold">"${result}"</span>。<br/>规则：从索引 ${effStart} 开始，切到 ${effStop} 之前 (不含)，步长为 ${effStep}。`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, stop, step]);

  const isSelected = (idx: number) => {
    const len = SAMPLE_TEXT.length;
    const s = effStart < 0 ? effStart + len : effStart;
    const e = effStop < 0 ? effStop + len : effStop;

    if (effStep > 0) {
      if (idx >= s && idx < e) {
        return (idx - s) % effStep === 0;
      }
    } else {
      if (idx <= s && idx > e) {
        return (s - idx) % Math.abs(effStep) === 0;
      }
    }
    return false;
  };

  const getCode = () => {
    const s = start === '' ? '' : start;
    const e = stop === '' ? '' : stop;
    const st = step === 1 ? '' : ` : ${step}`;
    return `text[${s} : ${e}${st}]`;
  };

  return (
    <div className="flex flex-col h-full space-y-6 p-4">
      {/* Header & Controls */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-pve-amber">
            <Scissors /> Level 7: 切片实验室 (Slicing Lab)
          </h2>
          <div className="bg-slate-950 px-4 py-2 rounded border border-slate-600 font-mono text-xl text-pve-green shadow-inner">
            {getCode()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Start Control */}
          <div className="bg-slate-900 p-3 rounded border border-slate-700 flex flex-col gap-2">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Start (起)</span>
              <span className="font-mono text-white">{start === '' ? 'Default' : start}</span>
            </div>
            <input
              type="range"
              min={-SAMPLE_TEXT.length}
              max={SAMPLE_TEXT.length}
              value={start === '' ? 0 : start}
              onChange={e => setStart(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-pve-amber [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>

          {/* Stop Control */}
          <div className="bg-slate-900 p-3 rounded border border-slate-700 flex flex-col gap-2">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Stop (终 - 不包含)</span>
              <span className="font-mono text-white">{stop === '' ? 'Default' : stop}</span>
            </div>
            <input
              type="range"
              min={-SAMPLE_TEXT.length}
              max={SAMPLE_TEXT.length}
              value={stop === '' ? SAMPLE_TEXT.length : stop}
              onChange={e => setStop(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-pve-red [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>

          {/* Step Control */}
          <div className="bg-slate-900 p-3 rounded border border-slate-700 flex flex-col gap-2">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Step (步长)</span>
              <span className="font-mono text-white">{step}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStep(-1)}
                className="px-2 py-1 bg-slate-700 text-xs rounded hover:bg-slate-600"
              >
                Reverse
              </button>
              <input
                type="range"
                min="-3"
                max="3"
                step="1"
                value={step}
                onChange={e => setStep(Number(e.target.value))}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Stage */}
      <div className="flex-1 bg-slate-900 rounded-xl border border-slate-700 relative overflow-hidden flex flex-col items-center justify-center p-2 md:p-8">
        {/* Container for the characters */}
        <div className="flex gap-1 md:gap-2 overflow-x-auto max-w-full pb-8 pt-8 px-4">
          {SAMPLE_TEXT.split('').map((char, idx) => {
            const active = isSelected(idx);
            return (
              <div key={idx} className="relative flex flex-col items-center group">
                {/* Positive Index (Top) */}
                <div
                  className={`text-xs font-mono mb-2 transition-colors ${active || hoverIndex === idx ? 'text-white font-bold' : 'text-slate-600'}`}
                >
                  {idx}
                </div>

                {/* Character Block */}
                <div
                  onMouseEnter={() => setHoverIndex(idx)}
                  onMouseLeave={() => setHoverIndex(null)}
                  className={`
                                w-10 h-14 md:w-14 md:h-20 rounded-lg flex items-center justify-center text-xl md:text-3xl font-bold font-mono border-2 transition-all duration-300 z-10
                                ${
                                  active
                                    ? 'bg-pve-amber text-slate-900 border-pve-amber shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-110 -translate-y-2'
                                    : 'bg-slate-800 text-slate-500 border-slate-700'
                                }
                            `}
                >
                  {char}
                </div>

                {/* Negative Index (Bottom) */}
                <div
                  className={`text-xs font-mono mt-2 transition-colors ${active || hoverIndex === idx ? 'text-pve-red font-bold' : 'text-slate-700'}`}
                >
                  {idx - SAMPLE_TEXT.length}
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Ruler Metaphor */}
        <div className="absolute bottom-8 flex flex-col items-center text-slate-500 gap-2 opacity-50">
          <div className="flex items-center gap-4 text-xs uppercase tracking-widest">
            <div className="flex items-center gap-1">
              <ArrowRightLeft size={14} /> 正负索引对照
            </div>
            <div className="flex items-center gap-1">
              <MousePointerClick size={14} /> 悬停查看
            </div>
          </div>
          <div className="w-64 h-1 bg-gradient-to-r from-transparent via-slate-500 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};
