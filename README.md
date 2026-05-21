# ✈️ 航班订票系统 (Hangban Dingpiao)

基于 **Spring MVC + MyBatis-Plus + MySQL** 构建的航班管理与在线订票系统，支持前后台分离管理、用户注册、航班查询、机票预订及留言互动等功能。

## 📋 功能模块

### 用户端
- **用户注册/登录** — 支持新用户注册、登录验证
- **航班浏览** — 查看航班详情、价格、余票信息
- **机票预订** — 在线选座下单（支持收藏、评论）
- **个人中心** — 查看/修改个人信息、订单管理
- **新闻公告** — 查看系统发布的新闻与通知
- **在线充值** — 模拟账户充值、支付流程

### 管理端
- **用户管理** — 查看和管理注册用户信息
- **航班管理** — 添加、编辑、上下架航班信息
- **订单管理** — 查看和管理用户预订订单
- **字典管理** — 航班类型、新闻分类等数据字典维护
- **公告管理** — 发布和管理系统新闻公告

## 🛠 技术栈

| 技术 | 版本 |
|------|------|
| Java | 1.7+ |
| Spring | 5.0.0.RELEASE |
| Spring MVC | 5.0.0.RELEASE |
| MyBatis-Plus | 2.3 |
| MySQL | 8.0.26 |
| Druid | 1.1.0 |
| FastJson | 1.2.8 |
| Tomcat (嵌入式) | 9.0.29 |
| 前端 | JSP + LayUI + ElementUI + Vue.js |
| 富文本 | TinyMCE / UEditor |

## 🚀 快速开始

### 环境要求
- JDK 1.7+
- Maven 3+
- MySQL 8.0
- Git

### 安装步骤

```bash
# 1. 克隆项目
git clone git@github.com:seven-alt-go/hangbandingpiao.git
cd hangbandingpiao

# 2. 创建数据库
mysql -u root -p
source src/main/resources/doc/sys_user.sql

# 3. 修改数据库配置
# 编辑 src/main/resources/config.properties，修改数据库连接信息

# 4. 编译打包
mvn clean package

# 5. 部署运行
# 将 target/hangbandingpiao.war 部署到 Tomcat，或 IDE 中直接运行
```

### 数据库配置

编辑 `src/main/resources/config.properties`:

```properties
jdbc.url=jdbc:mysql://localhost:3306/hangbandingpiao?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
jdbc.username=root
jdbc.password=your_password
```

## 📁 项目结构

```
hangbandingpiao/
├── pom.xml                          # Maven 依赖配置
├── src/main/
│   ├── java/com/
│   │   ├── annotation/              # 自定义注解（登录验证等）
│   │   ├── config/                  # 配置类
│   │   ├── controller/              # 控制器层
│   │   ├── dao/                     # 数据访问层
│   │   ├── entity/                  # 实体类（含 VO/View/Model）
│   │   ├── interceptor/             # 拦截器
│   │   ├── model/enums/             # 枚举类型
│   │   ├── service/                 # 业务逻辑层
│   │   ├── ServletContextListener/  # 上下文监听器
│   │   └── utils/                   # 工具类
│   ├── resources/
│   │   ├── config.properties        # 数据库等配置文件
│   │   ├── mapper/                  # MyBatis XML 映射
│   │   ├── mybatis/                 # MyBatis 配置
│   │   ├── spring/                  # Spring 配置（MVC + 事务）
│   │   └── doc/sys_user.sql         # 数据库初始化脚本
│   └── webapp/
│       ├── front/                   # 前端页面（用户端）
│       ├── jsp/                     # 后端管理页面
│       ├── resources/               # 静态资源（CSS/JS/图片）
│       └── WEB-INF/                 # Web 配置
```

## 🔑 核心实体

- **用户 (Yonghu)** — 注册用户信息管理
- **航班 (Feiji)** — 航班基本信息、价格、库存
- **订单 (FeijiOrder)** — 用户机票预订记录
- **收藏 (FeijiCollection)** — 用户收藏的航班
- **留言 (FeijiLiuyan)** — 航班评论与留言
- **新闻 (News)** — 系统公告与新闻
- **字典 (Dictionary)** — 数据字典（分类/类型）

## 📄 License

MIT License
