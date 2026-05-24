# Vue 前端重构 MR 说明

## 推荐合并顺序

当前远端分支建议按以下顺序合并：

1. `feat/frontend-cleanup` → `main`
   - 作用：引入独立 Vue 3 前端子项目基线。
   - 远端头：`37d2e70 chore: complete cleanup branch runnable skeleton`

2. `develop` → `main`
   - 作用：合入完整用户端 MVP、后台管理端 MVP、体验优化和工程优化。
   - 当前远端头：`a57d06f feat: polish admin dashboard and guards`

不建议单独合并：

- `feat/frontend-ui-polish`
  - 内容已被 `develop` 覆盖，且远端头停在较早提交 `b9ae5f8`。
- `feat/frontend-user-flows`
  - 无真实独立远端增量价值。

## 建议 merge 方式

推荐使用：

- `Create a merge commit`

原因：本次是阶段性重构，保留 `cleanup` 与 `develop` 的合入边界更清楚。

如团队更偏好干净主线，也可使用 `Squash and merge`，但会压平阶段性历史。

## 本次 `develop` 主要内容

### 用户端 Vue MVP

- 首页
- 登录 / 注册
- 航班列表 / 航班详情
- 新闻列表 / 新闻详情
- 订单创建 / 订单列表 / 订单详情 / 退款入口
- 个人中心
- 收藏列表 / 取消收藏 / 跳转航班详情
- 留言列表 / 提交留言 / 按航班过滤
- 充值说明页
- 余额感知下单流程
- 下单成功后跳转订单详情

### 工程化优化

- Vue 3 + Vite + TypeScript
- Vue Router
- Pinia
- Axios 请求封装
- API 统一解包
- 路由懒加载
- vendor chunk 拆分
- 移除 Element Plus 全量注册，仅按需保留实际使用能力

### 后台管理端 Vue MVP

- 后台布局与导航
- 仪表盘统计
- 最近订单
- 后台基础登录守卫
- 用户管理：筛选 / 分页 / 详情
- 航班管理：筛选 / 分页 / 详情
- 订单管理：筛选 / 分页 / 详情

后台当前安全边界：

- 只接分页查询和详情接口。
- 暂不接新增、编辑、删除、退款等写接口。
- 后续开放写操作前，需要逐个确认接口语义、权限和表单校验。

## 已验证

在 `web/` 下执行：

```bash
npm run build
```

结果：构建成功。

已知非阻塞警告：

- `@vueuse/core` 依赖中的 Rolldown `INVALID_ANNOTATION` pure annotation 警告。
- 该警告来自依赖包注释位置，不影响当前构建产物生成。

## 合并后建议保留分支

- `main`
- `develop`

## 合并后建议删除分支

远端：

```bash
git push origin --delete feat/frontend-cleanup
git push origin --delete feat/frontend-ui-polish
```

本地：

```bash
git branch -d feat/frontend-cleanup
git branch -d feat/frontend-ui-polish
git branch -d feat/frontend-user-flows
```

如果本地删除提示未合并但你已确认远端 MR 已合并，可改用：

```bash
git branch -D feat/frontend-cleanup
git branch -D feat/frontend-ui-polish
git branch -D feat/frontend-user-flows
```

清理远端追踪引用：

```bash
git fetch --prune origin
```

## MR 测试清单

### 构建

- [ ] `cd web && npm install`
- [ ] `cd web && npm run build`

### 用户端冒烟

- [ ] 首页可打开
- [ ] 登录 / 注册页面可打开
- [ ] 航班列表可查询
- [ ] 航班详情可打开
- [ ] 登录后可进入订单、收藏、留言、个人中心
- [ ] 余额不足下单有提示

### 后台端冒烟

- [ ] 未登录访问 `/admin` 会跳登录
- [ ] 登录后 `/admin` 可打开仪表盘
- [ ] `/admin/users` 可筛选、分页、查看详情
- [ ] `/admin/flights` 可筛选、分页、查看详情
- [ ] `/admin/orders` 可筛选、分页、查看详情

## 风险与后续

- 现有 Java 后端未重写，Vue 前端依赖现有接口返回结构。
- 充值没有独立后端 API，因此当前充值页是说明页，余额变化来自下单扣款、退款返款、后台修改。
- 后台权限目前只有基础 token 守卫，角色级管理员权限需要结合后端登录方案进一步确认。
- 后台写操作暂未接入，后续应单模块、单接口确认后再实现。
