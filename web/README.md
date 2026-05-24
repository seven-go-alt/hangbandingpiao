# Hangban Dingpiao Web

基于 Vue 3 + Vite 重构的航班订票系统前端，当前作为原 Java Web 项目的独立前端子项目存在于 `hangbandingpiao/web`。

## 技术栈

- Vue 3
- Vite
- TypeScript
- Vue Router
- Pinia
- Axios
- Element Plus（按需使用）

## 当前范围

### 用户端

已覆盖：

- 首页
- 登录 / 注册
- 航班列表 / 航班详情
- 新闻列表 / 新闻详情
- 下单页 / 订单列表 / 订单详情
- 收藏列表
- 留言列表 / 提交留言
- 个人中心 / 资料编辑
- 充值说明页
- 余额感知下单流程

### 后台管理端

已覆盖：

- 后台布局与导航
- 仪表盘统计与最近订单
- 用户管理：筛选 / 分页 / 详情
- 航班管理：筛选 / 分页 / 详情
- 订单管理：筛选 / 分页 / 详情
- 后台基础登录守卫

后台当前以只读能力为主，暂不接新增、编辑、删除、退款等写操作。

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

- 保留现有 Java 后端接口，不重写后端。
- 用户端充值没有独立后端 API，因此当前充值页为说明页。
- 后台管理端当前只接查询与详情接口，写操作需要后续确认权限、接口语义和表单校验后再开放。
- 后台权限目前为基础 token 守卫，角色级管理员权限仍需结合后端登录方案进一步确认。
