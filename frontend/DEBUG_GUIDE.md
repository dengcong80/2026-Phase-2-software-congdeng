# Quest Detail 页面调试指南

## 问题诊断

如果 Quest Detail 页面打不开，可能的原因：

### 1. 后端 API 未连接 ❌
官方 Quest 数据是静态的，不需要后端 API。现在页面已经修复，会自动使用本地数据作为后备。

### 2. Quest ID 不匹配 ⚠️
确保使用正确的 Quest ID 格式。官方 Quest 使用以下格式：
- `explore-1`, `explore-2`, ..., `explore-5`
- `nature-1`, `nature-2`, ..., `nature-5`
- `culture-1`, `culture-2`, ..., `culture-5`
- `food-1`, `food-2`, ..., `food-5`
- `uni-1`, `uni-2`, ..., `uni-5`
- `community-1`, `community-2`, ..., `community-5`

### 3. 路由问题 🔗
URL 格式应该是：`/quests/{id}`

例如：
- `/quests/explore-1` - Mission Bay Explorer
- `/quests/nature-1` - Mt Eden Summit
- `/quests/food-1` - Hidden Café Hunt

---

## 测试方法

### 方法 1: 使用调试页面 🐛

访问以下 URL 查看所有可用的官方 Quest：

```
http://localhost:5173/debug-quests
```

这个页面会显示：
- 所有 30 个官方 Quest
- 每个 Quest 的 ID
- 直接点击 "View Details" 按钮测试

### 方法 2: 从 Explore 页面导航 🗺️

1. 访问 `/explore` 页面
2. 查看 Quest List（右侧边栏）
3. 点击任何 Quest 的 "View Details" 按钮

### 方法 3: 从首页任务列表 📋

1. 在 Explore 页面添加 Quest 到任务列表（点击 + 按钮）
2. 返回首页 `/`
3. 在 "My Task List" 区域点击 "View Details"

### 方法 4: 直接 URL 访问 🔗

在浏览器地址栏输入：
```
http://localhost:5173/quests/explore-1
```

---

## 已修复的问题 ✅

### 之前的问题
- ❌ 页面依赖后端 API 才能显示
- ❌ 如果 API 失败，页面一直加载

### 修复后
- ✅ 使用官方 Quest 数据作为后备
- ✅ 即使没有后端也能查看详情
- ✅ 显示 "Quest not found" 错误而不是无限加载

---

## Quest Detail 页面功能测试清单

访问任何 Quest Detail 页面后，确认以下功能：

### 基本信息 ✅
- [ ] Quest 标题显示
- [ ] 描述显示
- [ ] 类别标签（explore/nature/food 等）
- [ ] 难度标签（Easy/Medium/Hard）
- [ ] 状态标签（Active）

### 统计卡片 ✅
- [ ] Reward (+XP)
- [ ] Likes 数量
- [ ] Estimated Time (30-45m)
- [ ] Difficulty

### 操作按钮 ✅
- [ ] "Check In & Complete" 按钮（未完成时）
- [ ] "Like" 按钮
- [ ] "Share" 按钮
- [ ] "Add to Tasks" 按钮

### 图库 ✅
- [ ] 显示 3 张示例图片
- [ ] 上传照片后显示

### Tab 切换 ✅
- [ ] Details 标签
  - [ ] 描述
  - [ ] Completion Hint（如果有）
  - [ ] 位置坐标
  - [ ] "Get Directions" 按钮
- [ ] Comments 标签
  - [ ] 评论列表
  - [ ] 添加评论输入框
  - [ ] Post Comment 按钮
- [ ] Tips 标签
  - [ ] 提示列表
  - [ ] 添加提示输入框
  - [ ] Add Tip 按钮

### 地图 ✅
- [ ] 显示 Quest 位置标记
- [ ] 显示用户位置（红旗 🚩）
- [ ] 可缩放和拖动

### 签到表单 ✅
- [ ] 照片上传
- [ ] 体验分享文本框

---

## 浏览器控制台调试

打开浏览器开发者工具（F12），查看：

### 1. Console（控制台）
检查是否有 JavaScript 错误：
```javascript
// 应该没有红色错误
// 可能有黄色警告（可以忽略）
```

### 2. Network（网络）
查看 API 请求：
```
GET /api/quests/{id}  -> 可能失败（正常，会使用本地数据）
```

### 3. React DevTools
查看组件状态：
```
<QuestDetail>
  - quest: {...}  // 应该有数据
  - officialQuest: {...}  // 应该有数据
```

---

## 常见问题

### Q1: 点击 "View Details" 后页面空白
**A**: 检查浏览器控制台是否有错误。尝试刷新页面（Ctrl+R 或 Cmd+R）。

### Q2: 地图不显示
**A**: 确认 Leaflet CSS 已加载。检查网络连接（OpenStreetMap 需要联网）。

### Q3: 用户位置红旗不显示
**A**: 浏览器需要授权位置访问。点击地址栏的位置图标允许访问。

### Q4: "Add to Tasks" 按钮点击后没反应
**A**: 检查是否已经添加过。已添加的 Quest 不会再次添加。

### Q5: 评论和提示添加后消失
**A**: 这些是本地状态，刷新页面会重置。未来需要连接后端 API 持久化。

---

## 快速测试命令

```bash
# 1. 启动开发服务器
cd frontend
npm run dev

# 2. 访问调试页面
# 打开浏览器：http://localhost:5173/debug-quests

# 3. 测试特定 Quest
# 打开浏览器：http://localhost:5173/quests/explore-1

# 4. 检查 Lint
npm run lint

# 5. 类型检查
npx tsc --noEmit
```

---

## 成功标志 🎉

如果一切正常，你应该能够：

1. ✅ 访问 `/debug-quests` 看到 30 个 Quest
2. ✅ 点击任何 "View Details" 进入详情页
3. ✅ 看到完整的 Quest 信息和图库
4. ✅ 切换 Details/Comments/Tips 标签
5. ✅ 看到地图上的 Quest 标记和用户位置红旗
6. ✅ 点击操作按钮有反馈消息

---

**最后更新**: 2026-07-18  
**状态**: ✅ 所有功能正常，页面可以独立运行
