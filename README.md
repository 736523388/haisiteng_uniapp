# My Hastens Client

My Hastens 的 uni-app 客户端，服务于品牌用户与门店人员。项目覆盖品牌内容、商品商城、购物袋、订单支付、积分优惠、床具保养，以及门店客户和服务管理等业务。

## 技术栈

- [uni-app](https://uniapp.dcloud.net.cn/) + Vue 2
- Vuex + `vuex-persistedstate`
- uView UI 2.0.37、ColorUI、DCloud `uni-*` 组件
- `luch-request` HTTP 客户端
- npm 依赖管理

项目以微信小程序为主要运行目标，同时保留 H5、App 等 uni-app 平台配置。

## 开始开发

### 环境准备

- 安装 [HBuilderX](https://www.dcloud.io/hbuilderx.html)，并启用 uni-app/Vue 相关插件
- 安装 Node.js 和 npm
- 如需运行微信小程序，安装微信开发者工具并配置相应的小程序开发权限

### 安装依赖

```bash
npm install
```

### 运行项目

1. 使用 HBuilderX 打开本仓库目录。
2. 在 HBuilderX 中选择“运行”。
3. 选择目标平台，例如“运行到小程序模拟器 → 微信开发者工具”或“运行到浏览器”。

仓库当前没有 `npm run dev` 或 `npm run build` 脚本，构建与发布由 HBuilderX/uni-app 工具链负责。

## 环境与接口

统一请求实例位于 [`utils/request.js`](utils/request.js)。

| 环境 | API 地址 |
| --- | --- |
| 默认开发环境 | `https://api-dev.myhastens.com` |
| 微信体验版 | `https://api-dev.myhastens.com` |
| 微信正式版 | `https://api.myhastens.com` |

请求拦截器会从 Vuex 注入登录 Token；接口返回 `401` 时会清理本地登录状态。接口响应在响应拦截器中统一解包为 `response.data`。

## 项目结构

```text
.
├── App.vue                 # 根组件及应用启动逻辑
├── main.js                 # Vue、Vuex、uView 和全局组件注册
├── pages.json              # 页面路由、窗口样式和底部导航
├── manifest.json           # uni-app 平台与应用配置
├── components/             # 项目级公共组件
├── pages/                  # 页面与页面内业务逻辑
│   ├── index/              # 品牌首页、活动、优惠券及床具入口
│   ├── shop/               # 商城、商品、积分商品及礼品
│   └── my/                 # 用户中心、订单、售后和门店服务
├── store/                  # Vuex Store 及业务模块
├── utils/                  # 请求封装和通用工具
├── static/                 # 图片、字体、图标和公共样式
├── uni_modules/            # uView 与 DCloud 组件
└── docs/agents/            # 工程技能的仓库级协作约定
```

## 核心模块

### 页面导航

底部导航由 [`pages.json`](pages.json) 配置，包含：

- Hastens：首页与品牌服务入口
- 商城：商品分类及详情
- 购物袋：购物车管理与结算入口
- 我的：账户、订单、积分、床具和门店服务

### 状态管理

Vuex 入口位于 [`store/index.js`](store/index.js)，状态通过 `vuex-persistedstate` 写入 `uni` 本地存储。

| 模块 | 职责 |
| --- | --- |
| `user` | Token、有效期、用户资料与登录状态 |
| `global` | 广告、轮播、Logo 和公共配置 |
| `goods_cart` | 购物袋数量及角标 |
| `user_address` | 用户订单地址选择 |
| `store_user_address` | 门店相关地址选择 |
| `admin_beds` | 门店床具选择状态 |

### 应用启动

[`App.vue`](App.vue) 在应用启动时加载首页广告、轮播和公共配置，并在用户已登录时同步购物袋数量。页面组件通过统一请求实例直接调用后端 API，再将需要跨页面共享的数据写入 Vuex。

### 登录

登录页位于 [`pages/login/login.vue`](pages/login/login.vue)，支持：

- 手机号与短信验证码登录
- 微信小程序手机号授权登录
- 用户协议和隐私政策确认

需要登录的页面可通过 `checkLogin` 或全局 `$globalJump2View(path, true)` 进行登录拦截。

## 主要业务

- 商品浏览、购物袋、订单创建与微信支付
- 积分明细、优惠券领取和礼品兑换
- 订单查询、物流、退款售后和发票申请
- 用户床具绑定与保养服务预约
- 门店客户、床具、服务订单、优惠券及业绩管理
- 品牌活动、视频内容和网页跳转

## 测试与质量检查

项目目前没有自动化测试、Lint 或持续集成配置。`npm test` 是 `package.json` 的默认占位命令，会直接失败。提交改动前至少应在目标平台中验证相关页面、登录状态以及对应接口流程。

## 协作约定

- 工程技能配置见 [`AGENTS.md`](AGENTS.md)。
- 本地需求和工单放在 `.scratch/<feature>/`。
- 领域文档采用 single-context 布局：根目录 `CONTEXT.md` 与 `docs/adr/` 按需创建。
- 更改页面路径时，应同步检查 `pages.json`、页面跳转代码和平台条件编译分支。

## 许可证

`package.json` 当前声明为 ISC。若项目不计划公开分发，发布前应根据实际授权策略更新此字段并补充正式许可证文件。
