# hangbandingpiao 前端重构计划

## 目标
将 `~/github/hangbandingpiao` 的 JSP + Vue/jQuery/LayUI 混合前端重构为现代化 Vue 3 工程化前端，优先完成用户端（front）重写，保留现有 Java 后端接口，采用渐进式迁移。

## 当前状态
- [in_progress] 项目结构与技术栈摸底
- [pending] 产出 Vue 重构方案
- [pending] 产出页面映射清单与迁移优先级
- [pending] 给出可开工的目录结构与实施步骤

## 阶段

### 阶段 1：现状分析
- 确认前端目录、页面规模、主要依赖
- 识别用户端与后台端边界
- 梳理接口控制器与主要实体模块

### 阶段 2：方案设计
- 选定 Vue 3 + Vite + Router + Pinia + Axios + Element Plus
- 设计目录结构、路由结构、状态管理策略
- 设计接口适配层和鉴权方案

### 阶段 3：迁移优先级
- 用户端页面映射
- 后台管理端页面映射
- 明确 MVP 首批页面

### 阶段 4：实施建议
- 制定初始化步骤
- 制定渐进替换策略
- 定义验证方式

## 已知事实
- 现有项目是 Spring MVC + MyBatis 后端
- 用户端页面位于 `src/main/webapp/front/pages`
- 后台管理页面位于 `src/main/webapp/jsp/modules`
- 前端存在大量 JSP、全局脚本、重复资源引入、混合技术栈

## 风险
- 部分业务逻辑可能散落在 JSP 页面的脚本中
- 现有接口返回结构可能不统一
- 登录态与权限依赖 localStorage / 全局 menu 配置，需要重新抽象

## 输出物
- Vue 重构技术方案
- 页面映射与迁移顺序
- 推荐目录结构
- 开工建议
