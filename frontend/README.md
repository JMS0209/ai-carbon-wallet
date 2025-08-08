# AI Carbon Wallet Frontend

这是AI Carbon Wallet的前端应用，基于Next.js 14构建，集成了zkLogin认证系统。

## 功能特性

- ✅ **zkLogin认证**: 使用Google OAuth和零知识证明进行隐私保护登录
- ✅ **受保护路由**: 只有认证用户才能访问仪表板和其他功能页面
- ✅ **响应式设计**: 支持桌面和移动设备
- ✅ **多页面架构**: 仪表板、NFT管理、碳偏移、设置等页面
- ✅ **Sui区块链集成**: 连接Sui测试网络

## 快速开始

### 1. 安装依赖
```bash
cd frontend
npm install
```

### 2. 配置环境变量
复制环境变量示例文件：
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，设置必要的环境变量：
```env
NEXT_PUBLIC_SUI_NETWORK_URL=https://fullnode.testnet.sui.io:443
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. 启动开发服务器
```bash
npm run dev
```

应用将在 http://localhost:3000 启动

## 页面结构

### 首页 (`/`)
- 美观的欢迎页面
- zkLogin登录入口
- 功能介绍和特性展示

### 认证页面 (`/auth`)
- 处理Google OAuth回调
- 生成零知识证明
- 完成用户认证流程

### 仪表板 (`/dashboard`)
- 系统状态监控
- 各模块连接测试
- 用户信息展示

### NFT管理 (`/nfts`)
- Carbon-AI Pack NFT展示
- NFT集合管理
- 铸造状态跟踪

### 碳偏移 (`/offsets`)
- 碳偏移组合管理
- 自动化偏移设置
- 支付历史记录

### 设置 (`/settings`)
- 账户信息管理
- 平台偏好设置
- 隐私控制选项

## 技术架构

### 认证系统
- **AuthContext**: React Context管理认证状态
- **ProtectedRoute**: 路由保护组件
- **zkLogin集成**: Sui区块链零知识登录

### 状态管理
- React Context用于全局状态
- localStorage用于持久化存储
- 自动认证状态检查

### 样式系统
- Tailwind CSS用于样式
- DaisyUI组件库
- 响应式设计

### API集成
- Next.js API路由
- Sui客户端连接
- SQLite本地数据存储

## 开发指南

### 添加新页面
1. 在 `app/` 目录创建新的页面文件
2. 使用 `ProtectedRoute` 包装需要认证的页面
3. 在 `Navbar` 组件中添加导航链接

### 修改认证流程
1. 更新 `AuthContext` 的认证逻辑
2. 修改 `api/` 路由处理认证请求
3. 调整 `ProtectedRoute` 的保护逻辑

### 添加新的服务集成
1. 在 `services/` 目录创建新服务文件
2. 在仪表板添加对应的状态卡片
3. 实现连接测试功能

## 故障排除

### 认证问题
- 检查 `NEXT_PUBLIC_GOOGLE_CLIENT_ID` 是否正确配置
- 确认回调URL设置为 `http://localhost:3000/auth`
- 清除浏览器缓存和localStorage

### Sui连接问题
- 验证 `NEXT_PUBLIC_SUI_NETWORK_URL` 配置
- 检查网络连接和防火墙设置
- 确认Sui测试网络状态

### 数据库问题
- 确保 `data/` 目录有写入权限
- 检查SQLite数据库文件创建
- 查看控制台错误信息

## 后续开发

1. **实时数据集成**: 连接能源收集器API
2. **NFT功能完善**: 实现真实的NFT铸造和管理
3. **支付系统**: 集成USDC支付和自动化偏移
4. **图表和分析**: 添加数据可视化组件
5. **移动应用**: 开发React Native移动端

## 相关文档

- [Sui zkLogin文档](https://docs.sui.io/concepts/cryptography/zklogin)
- [Next.js文档](https://nextjs.org/docs)
- [Tailwind CSS文档](https://tailwindcss.com/docs)
- [DaisyUI组件库](https://daisyui.com/)
