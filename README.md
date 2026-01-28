# Website Favicons

一个开源的流行品牌 SVG 图标库，提供在线浏览、编辑和下载功能。

## ✨ 功能特性

### 🎨 图标展示
- **丰富的图标库**：收录流行品牌的 SVG 图标
- **实时搜索**：快速查找目标图标
- **多种布局**：支持网格布局和紧凑布局
- **响应式设计**：完美适配各种设备

### 🎨 颜色自定义
- **颜色选择器**：可视化选择图标颜色
- **实时预览**：修改颜色后立即查看效果
- **颜色重置**：一键恢复原始颜色

### 📋 复制功能
- **一键复制 SVG**：直接复制 SVG 代码到剪贴板
- **一键复制 PNG**：复制 PNG 图片到剪贴板
- **智能提示**：复制成功/失败都有友好提示

### 💾 下载功能
- **SVG 下载**：下载应用颜色后的 SVG 文件
- **PNG 下载**：导出高质量 PNG 图片（透明背景）
- **自定义尺寸**：PNG 导出支持自定义尺寸（16-512px）

### ✏️ 在线编辑
- **SVG 编辑器**：在线编辑 SVG 代码
- **实时预览**：编辑时实时查看效果
- **颜色修改**：在编辑器中修改图标颜色
- **格式验证**：自动检测 SVG 格式错误

### 🌓 主题切换
- **亮色模式**：适合日间使用
- **暗色模式**：保护眼睛，适合夜间使用
- **自动模式**：跟随系统主题设置

### 🌍 多语言支持
- **中文**：完整的中文界面
- **English**：Full English interface

## 🚀 快速开始

### 环境要求

- Node.js 18+
- pnpm (推荐) 或 npm/yarn

### 安装依赖

```bash
pnpm install
# 或
npm install
```

### 开发模式

```bash
pnpm dev
# 或
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

### 构建生产版本

```bash
pnpm build
# 或
npm run build
```

### 部署到 GitHub Pages

项目已配置 GitHub Actions 自动部署。确保设置环境变量 `NEXT_PUBLIC_BASE_PATH` 为你的仓库路径（如果不是 `username.github.io`）。

## 📁 项目结构

```
website-favicons/
├── components/          # React 组件
│   ├── IconCard.tsx    # 图标卡片组件
│   ├── Navigation.tsx  # 导航栏组件
│   ├── Toast.tsx       # 消息提示组件
│   └── ...
├── pages/              # Next.js 页面
│   ├── index.tsx       # 首页
│   └── tools.tsx      # SVG 编辑器
├── public/             # 静态资源
│   └── icons/         # SVG 图标文件
├── styles/            # CSS 样式文件
├── utils/             # 工具函数
│   ├── svg.ts        # SVG 处理工具
│   ├── clipboard.ts  # 剪贴板工具
│   └── ...
├── locales/           # 国际化文件
└── data/              # 数据文件
    └── icons.json     # 图标数据
```

## 🛠️ 技术栈

- **框架**: [Next.js](https://nextjs.org/) 16
- **UI 库**: React 19
- **语言**: TypeScript
- **样式**: CSS Modules
- **构建工具**: Next.js Build System

## 📝 使用说明

### 浏览图标

1. 在首页浏览所有可用图标
2. 使用搜索框快速查找目标图标
3. 切换布局模式查看不同展示效果

### 自定义颜色

1. 点击图标卡片上的颜色显示区域
2. 使用颜色选择器选择新颜色
3. 实时预览颜色效果
4. 点击"重置"恢复原始颜色

### 复制图标

1. 将鼠标悬停在图标预览区域
2. 点击"SVG"或"PNG"按钮
3. 图标已复制到剪贴板，可直接粘贴使用

### 下载图标

1. 选择下载格式（SVG 或 PNG）
2. 自定义颜色（可选）
3. 点击"下载"按钮
4. 文件将自动下载到本地

### 编辑 SVG

1. 点击图标卡片上的"编辑"按钮
2. 在新标签页打开 SVG 编辑器
3. 修改 SVG 代码或颜色
4. 实时预览效果
5. 下载或复制修改后的 SVG

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 开源协议

本项目采用 **CC BY-NC 4.0** (Creative Commons Attribution-NonCommercial 4.0 International) 协议。

### 您可以：

- ✅ **分享**：在任何媒介以任何形式复制和重新分发材料
- ✅ **改编**：修改、转换或以本材料为基础进行创作
- ✅ **署名**：必须给出适当的署名，提供指向本许可协议的链接，同时标明是否（对原始作品）作了修改

### 您不可以：

- ❌ **商业使用**：不得将本材料用于商业目的

### 完整协议

本作品采用 [知识共享署名-非商业性使用 4.0 国际许可协议](https://creativecommons.org/licenses/by-nc/4.0/deed.zh) 进行许可。

查看完整协议内容：[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/legalcode)

## ⚠️ 版权声明

### 关于图标版权

本项目中的图标资源来源于公开渠道，仅用于学习和个人非商业用途。

**重要声明**：

- 本项目不拥有这些图标的版权，所有图标版权归其原始所有者所有
- 本项目仅提供图标浏览、编辑和下载的技术服务
- 如果您是图标版权所有者，发现本项目中使用了您的图标，请及时联系我们
- 我们会在收到通知后立即处理，包括但不限于删除相关图标

### 侵权处理

如遇侵权问题，请通过以下方式联系我们：

- 📧 邮箱：[plutavian@gmail.com]
- 🐛 GitHub Issues：[提交 Issue](https://github.com/AsukaCC/website-favicons/issues)

我们承诺在收到侵权通知后 **24 小时内** 响应并处理。

### 使用建议

- ✅ 仅用于个人学习和非商业项目
- ✅ 使用前请确认图标的版权归属
- ✅ 商业项目请使用官方提供的图标或购买授权
- ❌ 禁止用于任何商业用途
- ❌ 禁止将图标用于可能侵犯商标权的场景

## 📧 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](https://github.com/AsukaCC/website-favicons/issues)

## 🙏 致谢

感谢所有贡献者和使用本项目的开发者！

---

**注意**：本项目仅供学习和个人使用，不得用于商业用途。
