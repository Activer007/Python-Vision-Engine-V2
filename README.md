<div align="center">
  <img width="1200" height="auto" alt="Python Vision Engine Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
  
  <br />
  <br />

  # Python Vision Engine (PVE) v1.2
  ### 物理逻辑实验室 (Physical Logic Laboratory)

  <p align="center">
    <b>An interactive visualization tool to "see" Python execution logic.</b>
  </p>
</div>

---

## 📖 Introduction

**Python Vision Engine (PVE)** is a React-based educational tool designed to demystify Python concepts through interactive, visual metaphors. By treating code execution as "physical" interactions, it helps learners build a mental model of how the Python interpreter works.

Built with **React 19**, **Vite**, and **Tailwind CSS**, PVE provides a suite of specialized laboratories to explore different aspects of the language.

## 🚀 Features / Modules

The application is divided into 8 core "laboratories," each focusing on a specific Python concept:

| Module | Icon | Description |
| :--- | :---: | :--- |
| **透视镜 (Syntax)** | 👁️ | Visualize code structure, nesting, and scope boundaries. (`BracketLens`) |
| **变量 (Vars)** | 🏷️ | Track variable assignments, references, and type changes. (`VariableLabels`) |
| **容器 (Data)** | 📚 | Interactive exploration of lists, dictionaries, sets, and tuples. (`ContainerChameleon`) |
| **逻辑 (Logic)** | 🎚️ | Boolean logic gates and modification states visualization. (`LogicToggles`) |
| **流程 (Flow)** | 🔱 | Visualize control flow, branches, and loops. (`FlowSandbox`) |
| **函数 (Func)** | 🥞 | Understand indentation, blocks, and call stacks. (`IndentationSteps`) |
| **链式 (Chain)** | 🔗 | Visualize method chaining and object transformations. (`ChainInterpreter`) |
| **切片 (Slice)** | ✂️ | Interactive array and string slicing explorer. (`SlicingLab`) |

## 🛠️ Technology Stack

- **Core:** React 19, TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS, Lucide React (Icons)
- **Deployment:** Vercel (Ready)

## 💻 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Python-Vision-Engine-V2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173` (or the port shown in your terminal).

## 🧩 Project Structure

```
Python-Vision-Engine-V2/
├── components/          # Individual visualization modules (labs)
│   ├── BracketLens.tsx
│   ├── VariableLabels.tsx
│   ├── ...
│   └── ConsoleBar.tsx
├── App.tsx             # Main application layout and routing
├── main.tsx            # Entry point
├── index.html          # HTML template
├── tailwind.config.js  # Styling configuration
└── package.json        # Dependencies and scripts
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private/proprietary.

---

<div align="center">
  <small>Powered by React & Vite</small>
</div>
