# Hangban Dingpiao Web

基于 Vue 3 + Vite 重构的航班订票系统前端，当前作为原 Java Web 项目的独立前端子项目存在于 `hangbandingpiao/web`。

## 技术栈

- Vue 3
- Vite
- TypeScript
- Vue Router
- Pinia
- Axios
- Element Plus

## 当前范围

已完成首版用户端主流程：

- 首页
- 登录 / 注册
- 航班列表 / 航班详情
- 新闻列表 / 新闻详情
- 下单页 / 订单列表
- 个人中心
- 充值占位页

## 启动方式

### 1. 安装依赖

```bash
cd web
npm install
```

### 2. 启动开发环境

```bash
npm run dev
```

默认接口地址：

```env
VITE_API_BASE_URL=http://localhost:8080/hangbandingpiao
```

如需修改，请编辑：

- `.env.development`
- `.env.production`

### 3. 生产构建

```bash
npm run build
```

## 目录说明

```bash
src/
  api/          # 接口调用封装
  assets/       # 样式与资源
  components/   # 公共/业务组件
  layouts/      # 页面布局
  router/       # 路由
  stores/       # Pinia 状态管理
  types/        # TS 类型
  utils/        # 工具函数
  views/        # 页面视图
```

## 当前约束

- 暂时保留现有 Java 后端接口，不重写后端。
- 现阶段优先重构用户端，后台管理端后续迁移。
- 部分旧页面能力（如完整充值、收藏、留言）仍在逐步补齐。
