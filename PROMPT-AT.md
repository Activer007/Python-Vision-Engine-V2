# Python Vision Engine (PVE) 协作提示词集 (v1.0)

> **文档使用说明**：
> 1. **场景化调用**：本模板分为五大模块，请根据当前开发阶段（如"刚接手任务"、"正在写代码"、"准备提 PR"）选择对应的提示词块。
> 2. **占位符替换**：在使用提示词前，请将方括号内的内容（如 `[任务 ID]`、`[分支名称]`）替换为实际的业务信息。
> 3. **上下文依赖**：本提示词集深度依赖 `CLAUDE.md` 项目文档。执行前请确保已理解项目架构和开发规范。
> 4. **复制即用**：你可以直接复制对应的代码块发送给 AI 助手，它将自动进入预设的角色和工作流。

---

## 1. 初始化：理解与对齐 (Discovery)
**用途**：接手新模块或功能时，确保模型理解 PVE 的可视化教学架构。
**参考**：@CLAUDE.md @README.md

```markdown
你现在是 Python Vision Engine 的资深前端开发者，请执行"理解与对齐"：
1. **文档地图**：阅读 `CLAUDE.md`，理解 "物理逻辑实验室" 的核心隐喻和设计原则（教学优先、渐进式学习）。
2. **架构摘要**：
   - **导航**：分析 `App.tsx` 中的 Tab-based 导航和 `activeTab` 状态管理。
   - **交互**：理解全局控制台模式 (`ConsoleBar` + `setConsole`) 的工作流。
   - **数据**：阅读 `types.ts` 掌握核心类型 (`Student`, `ViewMode`, `BracketToken` 等) 和 `constants.ts` 中的教学数据。
3. **样式系统**：确认 `index.html` 中的 Tailwind 配置，特别是自定义主题色 (`pve-blue`, `pve-purple` 等)。
4. **行动清单**：输出"Top-5 前端工程任务列表"，按教学价值/实现难度排序，并关联组件路径。
*注意：此阶段严禁修改代码。*
```

---

## 2. 执行：全自动开发循环 (Auto-Pilot)
**用途**：任务执行的核心逻辑，严格遵循"理解-计划-执行-验证"闭环。
**参考**：@CLAUDE.md

```markdown
请启动 **Auto-Pilot 模式** 执行任务 [任务 ID]：

### 🔄 循环步骤：
1. **分支策略 (Stacked & Async)** (Crucial)：
   - **任务 1 (首发)**：基于 `master` 创建分支 -> 提交 PR -> **不等待合并**。
   - **任务 2 (堆叠)**：直接基于 `feature/task-1` 创建 `feature/task-2` (形成依赖链)。
   - **禁止操作**：严禁在本地执行 `git merge master`，一切合并交由远程 PR 处理。

2. **上下文加载**：
   - 读取 `CLAUDE.md` 获取开发规范（React 19, Vite, Tailwind）。
   - 读取 `types.ts` 和相关组件 (`components/`) 代码。

3. **任务规划 (Todo)**：
   - 使用 `TodoWrite` 创建细粒度任务清单。
   - 明确交互设计：用户操作 -> `setConsole` 反馈 -> UI 视觉变化。

4. **代码实施**：
   - **组件开发**：使用 React 19 + TypeScript。确保所有交互都有明确的视觉反馈。
   - **样式应用**：严格使用 `pve-*` 主题色（如 `text-pve-blue`）和 Lucide 图标。
   - **类型安全**：优先复用 `types.ts` 中的定义，避免 `any`。

5. **验证环节 (Verification)**：
   - **静态检查**：执行 `npx tsc -b` (类型检查) 确保无 TS 错误。
   - **构建验证**：执行 `npm run build` 验证生产环境构建完整性。
   - **交互检查**：(自我审查) 确认每个操作是否都触发了正确的 `setConsole` 提示。
   - *错误处理*：若构建失败，分析原因并重试，超过 3 次标记为阻塞。

6. **Git 提交**：
   - 格式：`type(scope): description` (如 `feat(bracket-lens): enhance hover effect`)
   - 内容：简述变更，并在 Body 中列出通过的检查项。

7. **上下文压缩 (Compression)**：
   - 总结当前循环的变更点和遗留问题。
   - 清理不必要的临时文件。

**输出要求**：每完成一个子任务，输出当前循环进度摘要（N/M 子任务完成）。
```

---

## 3. 验收：交付与 PR 规范 (Shipping)
**用途**：完成阶段性任务或重大变更时，发起合并请求。
**参考**：@CLAUDE.md

```markdown
请执行 **功能验收与 PR 发起**：
1. **文档归档**：
   - 如有新引入的 npm 包或环境变量，同步更新 `README.md`。
   - 确保 `constants.ts` 中的教学数据与 UI 表现一致。
2. **远程推送 (Remote Push)**：
   - 执行 `git push origin [当前分支名]`。
   - **禁止本地合并**：绝不执行 `git merge` 到 master。
3. **PR 描述**：生成 PR 描述，包含：
   - 关联任务 ID。
   - **核心变更**：列出修改的组件和逻辑。
   - **视觉验证**：描述 UI 变更点或交互优化点。
```

---

## 4. 纠偏：异常处理 (RCA)
**用途**：遇到构建报错或逻辑 Bug 时的系统化分析。

```markdown
针对问题 [描述/报错日志]，请执行：
1. **应然 vs 实然**：定位 `CLAUDE.md` 中的设计原则，对比当前代码实现。
2. **根因定位**：
   - 检查 TypeScript 类型定义 (`types.ts`) 是否与组件 Props 匹配。
   - 检查 Import Maps 或 CDN 依赖是否加载正常。
   - 分析 React 状态逻辑 (`useState`, `useEffect`) 是否存在闭包陷阱或渲染循环。
3. **修复计划**：给出最小 Diff 方案，优先考虑类型修复而非强制断言 (`as`)。
4. **同步更新**：如果是文档缺失导致的误解，同步修正 `CLAUDE.md`。
输出：Root cause、Fix diff、Doc note。
```

---

## 5. 巡检：健康检查 (Maintenance)
**用途**：快速获取进度快照或记录技术债。

```markdown
请提供 **项目状态快照**：
1. **进度审计**：读取 `CLAUDE.md` 和最近 5 条提交，计算当前分支真实完成度。
2. **代码健康度**：
   - 检查 `components/` 下是否存在过大的组件（建议拆分）。
   - 检查 `constants.ts` 是否有冗余数据。
3. **环境检查**：
   - 验证 `package.json` 依赖版本。
   - 检查 `vite.config.ts` 中的别名配置和构建选项。
```

---

## 💡 开发禁令 (Must Follow)
- **TEACHING FIRST**: 所有交互必须服务于教学目的，拒绝炫技式的无效动画。
- **FEEDBACK LOOP**: 用户的每个点击/悬停操作，都**必须**通过 `setConsole` 提供即时反馈。
- **STACKED BRANCHING**: 连续开发时，**直接基于上一 Feature 分支创建新分支**。
- **NO LOCAL MERGE**: 严禁在本地执行 `git merge master`。
- **STRICT TYPES**: 严禁使用 `any`，所有类型必须在 `types.ts` 或组件内明确定义。
- **THEME COMPLIANCE**: 必须使用 `index.html` 定义的 `pve-*` 颜色变量，保持视觉一致性。
- **CONTEXT COMPRESSION**: 完成任务后，清理临时文件，保持工作区整洁。