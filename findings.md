# 调研发现

## 项目结构
- 根项目为 Maven Web 工程，不是前后端分离仓库。
- 前端主要分两块：
  - 用户端：`src/main/webapp/front`
  - 管理端：`src/main/webapp/jsp/modules`
- 现有前端文件规模较大，`src/main/webapp` 下约 661 个 jsp/html/js/css 文件。

## 技术栈现状
- 用户端：JSP + Vue（页面内挂载）+ jQuery + LayUI + 自定义 http 模块。
- 管理端：JSP + LayUI/ElementUI + Vue + 大量 DOM 拼接。
- 页面资源引用重复，缺少模块化构建、组件化、统一状态管理。

## 用户端页面清单
- home/home.jsp
- login/login.jsp
- feiji/list.jsp、detail.jsp、center.jsp、add.jsp、register.jsp
- news/list.jsp、detail.jsp、center.jsp、add.jsp、register.jsp
- feijiOrder/list.jsp、detail.jsp、center.jsp、add.jsp、register.jsp
- feijiCollection/list.jsp、detail.jsp、center.jsp、add.jsp、register.jsp
- feijiLiuyan/list.jsp、detail.jsp、center.jsp、add.jsp、register.jsp
- recharge/recharge.jsp
- config/*、users/*、yonghu/*、dictionary/*（其中部分偏模板化）

## 管理端页面清单
- home/home.jsp
- center/info.jsp、updatePassword.jsp
- config/list/info/add-or-update/graph
- users/list/info/add-or-update/graph
- yonghu/list/info/add-or-update/register
- feiji/list/info/add-or-update
- feijiOrder/list/info/add-or-update
- feijiCollection/list/info/add-or-update
- feijiLiuyan/list/info/add-or-update
- news/list/info/add-or-update
- dictionary/list/info/add-or-update
- dictionaryFeiji/list/info/add-or-update
- dictionaryFeijiLeixing/list/info/add-or-update
- dictionaryNews/list/info/add-or-update

## 接口/控制器
存在以下主要控制器：
- CommonController
- ConfigController
- DictionaryController
- FeijiController
- FeijiCollectionController
- FeijiLiuyanController
- FeijiOrderController
- FileController
- NewsController
- UserController
- YonghuController

## 代码层观察
- `front/index.jsp` 采用 iframe 作为主内容容器，并通过 localStorage 保存 iframeUrl。
- `front/js/config.js` 中存在全局配置、菜单配置、权限判断函数；甚至残留与当前业务不一致的菜单数据，说明模板生成痕迹明显。
- `front/pages/home/home.jsp` 和 `front/pages/feiji/list.jsp` 中混合了大量样式、脚本、模板、请求逻辑，属于典型的页面耦合模式。
- `front/modules/config.js` 通过 `layui.extend` 扩展 http 模块，说明前端请求层可以被独立替换成 Axios。

## 结论
- 最适合采用“保留 Java 后端，前端独立新建 Vue 3 项目”的渐进式重构路径。
- 优先重构用户端最稳，因为用户端更强调体验与可维护性；后台端虽然可重构，但更适合放在第二阶段。

## 后台 Vue 化补充发现
- `/yonghu/page`、`/feiji/page`、`/feijiOrder/page` 可支撑后台只读列表与分页。
- `/yonghu/detail/{id}`、`/feiji/detail/{id}`、`/feijiOrder/detail/{id}` 可支撑详情弹层。
- 当前 Vue 后台刻意只接查询与详情，暂不接新增/编辑/删除/退款等写接口，避免在未确认权限和业务语义前引入破坏性操作。
- 后台路由目前使用基础 token 守卫；角色级管理员权限仍需后端登录/角色方案进一步确认后再细化。
