# pomodoro-vue

用 Vue 2 + Vuetify 实现的极简番茄钟，专为闲置手机常亮使用场景设计。

## 背景

长时间久坐对腰椎颈椎都不好。试用了几款番茄钟 APP，功能都过于复杂。核心需求只有一个：手机屏幕常亮、能看到倒计时，每半小时提醒自己起身活动。

用闲置手机（如 Google Pixel 3）放在显示器旁边，屏幕常亮跑番茄钟，不占用日常手机。

## 充电管理方案

长时间插充电器会导致电池老化甚至鼓包。推荐搭配智能 USB 开关 + Macrodroid 实现电量区间充电：

- 电量低于 20% → 发指令给 USB 开关开始充电
- 电量高于 80% → 发指令给 USB 开关断电

偶发的充断失败概率极低，手动处理即可。

**USB 开关购买链接：** <https://item.taobao.com/item.htm?spm=a1z09.2.0.0.e1622e8dyQV00V&id=675291964059&_u=p2lc6g0aa84>

## 技术栈

- Vue 2 + TypeScript
- Vuetify 2
- Vue Router / Vuex
- PWA 支持

## 本地开发

```bash
# 安装依赖
yarn install

# 启动开发服务器
yarn serve

# 构建生产包
yarn build
```

## 部署

使用 Docker 部署，基于 nginx:alpine：

```bash
yarn build
docker build -t registry.wiloon.com/pomodoro:latest .
docker push registry.wiloon.com/pomodoro:latest
```

多架构镜像（amd64 + arm64）构建参考 `deploy.sh`。

