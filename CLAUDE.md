# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Python Vision Engine v1.2 是一个基于 React + TypeScript 的交互式 Python 概念可视化教学工具。该应用通过"物理逻辑实验室"的形式,将 Python 编程中的抽象概念(如语法结构、变量、数据容器、逻辑控制等)转化为可视化交互界面,帮助学生直观理解编程概念。

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器 (默认运行在 http://localhost:3000)
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 环境配置

- API Key 配置: 在 `.env.local` 文件中设置 `GEMINI_API_KEY` (虽然当前版本主要使用本地交互式组件,未来可能集成 AI 功能)
- Vite 配置: 环境变量通过 `vite.config.ts` 中的 `define` 选项注入到 `process.env.GEMINI_API_KEY`

## 架构概览

### 核心设计模式

1. **Tab-based 导航架构**
   - `App.tsx` 是主入口,管理 `activeTab` 状态 (0-7)
   - 每个标签页对应一个独立的教学模块组件
   - 所有组件共享一个全局控制台 (`ConsoleBar`)

2. **全局控制台模式**
   - `App.tsx` 维护 `consoleMsg` 状态
   - 每个子组件接收 `setConsole(msg: string) => void` prop
   - 子组件通过 `setConsole` 向用户输出教学反馈/提示信息
   - `ConsoleBar` 组件使用 `dangerouslySetInnerHTML` 支持富文本输出

3. **组件类型定义**
   - 所有 TypeScript 类型定义集中在 `types.ts`
   - 核心类型: `Student`, `ViewMode`, `IndentLine`, `VariableLabel`, `DataBlock`, `BracketToken`, `ChainStep`, `FunctionDef`

4. **教学数据常量**
   - `constants.ts` 包含颜色主题 (`COLORS`) 和函数库定义 (`FUNCTIONS`)
   - `FUNCTIONS` 数组定义了 5 个 Tier 的 Python/Pandas/NumPy 函数,每个函数包含: `id`, `name`, `category`, `description`, `businessLogic`, `codePrototype`

### 模块组件说明

每个组件都是独立的教学模块,接收 `setConsole` prop:

- **BracketLens** (透视镜): 通过鼠标悬停交互解析 Python 括号嵌套结构,提供语法实时解说
- **VariableLabels** (变量): 可视化变量赋值和类型系统
- **ContainerChameleon** (容器): 演示 List/Tuple/Dict/DataFrame 等数据结构转换
- **LogicToggles** (逻辑): 交互式演示 if/else、布尔运算
- **FlowSandbox** (流程): 可视化 for/while 循环和流程控制
- **IndentationSteps** (函数): 展示 Python 缩进规则和函数定义
- **ChainInterpreter** (链式): 演示方法链式调用 (`.groupby().mean()`)
- **SlicingLab** (切片): 交互式学习索引、切片、iloc/loc 操作

### 技术栈特性

- **React 19.2.3**: 使用最新 React,启用 `React.StrictMode`
- **Vite 6.2**: 开发服务器和构建工具,配置了路径别名 `@/*` → 项目根目录
- **Tailwind CSS**: 通过 CDN 引入 (见 `index.html`),自定义颜色主题 (`pve-blue`, `pve-purple`, 等)
- **lucide-react**: 图标库,用于 UI 元素
- **Import Maps**: 使用 esm.sh CDN 进行模块导入,无需 node_modules 打包 React 核心库

### 样式系统

- 主色调: 深色主题 (`bg-slate-900`, `bg-slate-950`)
- 自定义颜色变量 (定义在 `index.html` 的 `tailwind.config`):
  - `pve-blue`: 逻辑相关 (`#3b82f6`)
  - `pve-purple`: 方法相关 (`#a855f7`)
  - `pve-green`: 成功/数据 (`#22c55e`)
  - `pve-red`: 错误/删除 (`#ef4444`)
  - `pve-amber`: 警告/未知 (`#f59e0b`)
- 自定义滚动条样式 (深色主题优化)
- 字体: 使用 Fira Code 等等宽字体用于代码显示

## 关键设计原则

1. **教学优先**: 所有交互都应服务于教学目的,提供清晰的视觉反馈和解释
2. **渐进式学习**: 从简单概念 (括号) 到复杂概念 (链式调用)
3. **双语界面**: UI 标签和提示使用中文 + 英文对照
4. **交互反馈**: 每个操作都应通过 `setConsole` 提供即时反馈

## 外部链接

- AI Studio 应用: https://ai.studio/apps/drive/1G9jQ7HailIyghW03iwAnIXNDXqYgRnlC
- 门户链接: https://ai-trainer-porama-system.vercel.app/ (右下角悬浮按钮)
- GitHub 仓库: https://github.com/Activer007/Python-Vision-Engine-V2
