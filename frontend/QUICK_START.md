# 🚀 Quest System 快速启动指南

## 立即测试

### 1️⃣ 启动应用
```bash
cd frontend
npm run dev
```

### 2️⃣ 访问以下任一 URL

#### 🐛 调试页面（推荐）
查看所有 30 个 Quest，一键测试 View Details
```
http://localhost:5173/debug-quests
```

#### 🏠 首页
查看任务列表、Today's Mission、地图等
```
http://localhost:5173/
```

#### 🗺️ Explore 页面
带过滤和搜索的完整 Quest 地图
```
http://localhost:5173/explore
```

#### 📍 Quest Detail（直接访问）
```
http://localhost:5173/quests/explore-1
http://localhost:5173/quests/nature-1
http://localhost:5173/quests/food-1
```

---

## 🎯 核心功能测试

### 首页功能
- [x] 用户问候和等级显示
- [x] XP 进度条
- [x] **My Task List**（在 header 下方）
  - [x] 显示添加的任务
  - [x] 删除按钮（X）
  - [x] View Details 按钮
- [x] Today's Mission（最高优先级）
- [x] Nearby Quests（3 个）
- [x] Quest Map（带用户红旗 🚩）
- [x] XP & Progress
- [x] Community Feed
- [x] Leaderboard

### Explore 页面功能
- [x] 搜索框
- [x] 筛选按钮
  - [x] Category（6 个类别）
  - [x] Difficulty（Easy/Medium/Hard）
  - [x] XP Range
  - [x] Distance
  - [x] Status
- [x] 排序选项（5 种）
  - [x] Recommended
  - [x] Nearest
  - [x] Highest XP
  - [x] Most Popular
  - [x] Recently Added
- [x] 交互式地图（带用户红旗 🚩）
- [x] Quest List（右侧边栏）
  - [x] **"+" 按钮**添加到任务列表
  - [x] "✓" 按钮表示已添加
  - [x] View Details 按钮

### Quest Detail 页面功能
- [x] Header Card
  - [x] 类别、难度、状态标签
  - [x] Quest 标题和描述
  - [x] 4 个统计卡片（Reward, Likes, Time, Difficulty）
  - [x] 操作按钮
    - [x] Check In & Complete
    - [x] Like
    - [x] Share
    - [x] Add to Tasks
- [x] **Photo Gallery**（3 张示例图片）
- [x] Tab 切换
  - [x] Details（描述、提示、位置）
  - [x] Comments（评论列表和添加）
  - [x] Tips（提示列表和添加）
- [x] 侧边栏
  - [x] **地图**（带用户红旗 🚩）
  - [x] 完成表单（照片上传 + 体验分享）

---

## 🚩 用户位置红旗

### 所有显示红旗的地图
1. ✅ 首页 - Today's Mission 地图
2. ✅ 首页 - Quest Map 全局地图
3. ✅ Explore 页面 - 交互式地图
4. ✅ Quest Detail 页面 - 位置地图

### 启用位置访问
1. 浏览器会请求位置权限
2. 点击地址栏的位置图标 📍
3. 选择 "允许" 或 "Allow"
4. 刷新页面

---

## 📋 任务列表功能

### 添加任务
1. 访问 Explore 页面
2. 找到喜欢的 Quest
3. 点击蓝色 **"+" 按钮**
4. 看到 ✅ 提示消息

### 查看任务
1. 返回首页（/）
2. 在 Header 下方看到 **"My Task List"** 区域
3. 显示所有添加的任务

### 删除任务
1. 在任务卡片右上角
2. 点击 **"X" 按钮**
3. 任务立即从列表移除

### 查看任务详情
1. 点击任务卡片的 **"View Details"** 按钮
2. 跳转到 Quest Detail 页面

---

## 🎨 30 个官方 Quest

### 分类统计
- 🏙️ Explore Auckland: 5 个
- 🌳 Nature & Parks: 5 个
- 🎨 Culture & History: 5 个
- ☕ Food & Coffee: 5 个
- 🎓 University Explorer: 5 个
- 👥 Community Challenge: 5 个

### Quest ID 格式
```
explore-1, explore-2, ..., explore-5
nature-1, nature-2, ..., nature-5
culture-1, culture-2, ..., culture-5
food-1, food-2, ..., food-5
uni-1, uni-2, ..., uni-5
community-1, community-2, ..., community-5
```

---

## 🔍 调试技巧

### 浏览器开发者工具（F12）

#### Console（查看错误）
```javascript
// 应该没有红色错误
// 可能有黄色警告（正常）
```

#### Network（查看请求）
```
GET /api/quests/{id}  // 可能失败（正常，有本地后备）
```

#### Application > Local Storage
```json
{
  "auth-storage": {...},        // 用户认证
  "quest-store": {...},          // Quest 数据
  "task-list-storage": {...}     // 任务列表（新增）
}
```

---

## ✅ 验证清单

运行以下测试确保一切正常：

### 基本功能
- [ ] 应用启动无错误
- [ ] 可以登录/注册
- [ ] 首页正常显示

### 任务列表
- [ ] 可以在 Explore 添加任务（+ 按钮）
- [ ] 首页显示任务列表
- [ ] 可以删除任务（X 按钮）
- [ ] 可以查看任务详情（View Details）

### 地图功能
- [ ] 所有地图显示 Quest 标记
- [ ] **用户位置显示红旗 🚩**
- [ ] 地图可以缩放和拖动

### Quest Detail
- [ ] 可以访问任何 Quest 详情页
- [ ] 显示完整信息（标题、描述、统计）
- [ ] 图库显示图片
- [ ] Tab 切换正常
- [ ] 所有按钮可点击

---

## 📞 遇到问题？

### Quest Detail 打不开
1. 访问 `/debug-quests` 查看所有 Quest
2. 确认 Quest ID 格式正确
3. 检查浏览器控制台错误

### 地图不显示
1. 确认网络连接（需要加载 OpenStreetMap）
2. 检查 Leaflet CSS 是否加载
3. 刷新页面（Ctrl+R 或 Cmd+R）

### 用户位置红旗不显示
1. 允许浏览器位置访问
2. 点击地址栏位置图标
3. 刷新页面

### 任务列表不显示
1. 确认已登录
2. 在 Explore 页面添加至少一个任务
3. 返回首页查看

---

## 🎉 成功标志

如果看到以下内容，说明一切正常：

1. ✅ 首页显示用户问候和等级
2. ✅ 任务列表区域在 header 下方（如有任务）
3. ✅ 所有地图显示用户位置红旗 🚩
4. ✅ Quest Detail 页面完整显示
5. ✅ 可以添加/删除任务
6. ✅ 筛选和搜索正常工作

---

**准备好了吗？** 🚀

```bash
npm run dev
```

然后访问：`http://localhost:5173/debug-quests`

开始探索吧！🗺️✨
