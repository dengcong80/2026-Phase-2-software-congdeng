# Quest Photo Gallery - 相关图片说明

## 功能实现 ✅

每个 Quest 的 Photo Gallery 现在会显示与该 Quest 描述相关的真实图片。

### 示例

#### 🏛️ Auckland War Memorial Museum (culture-1)
**图片内容**:
- 博物馆外观建筑
- 博物馆内部展厅
- 历史文物展品

#### ☕ Best Flat White Challenge (food-2)
**图片内容**:
- 精美的 Flat White 咖啡
- 咖啡拉花艺术
- 咖啡杯特写

#### 🏔️ Mt Eden Summit (nature-1)
**图片内容**:
- 山顶全景视图
- 登山景色
- 奥克兰城市景观

---

## 所有 Quest 图片分类

### ① Explore Auckland（城市探索）

| Quest ID | 标题 | 图片主题 |
|----------|------|---------|
| explore-1 | Mission Bay Explorer | 海滩、海景、海岸线 |
| explore-2 | Auckland Waterfront Walk | 港口、码头、滨水区 |
| explore-3 | Britomart Discovery | 钟楼、历史建筑、城市建筑 |
| explore-4 | Wynyard Quarter Explorer | 现代艺术、城市艺术、公共雕塑 |
| explore-5 | Auckland Night Lights | 天际线夜景、城市灯光、夜景 |

### ② Nature & Parks（自然公园）

| Quest ID | 标题 | 图片主题 |
|----------|------|---------|
| nature-1 | Mt Eden Summit | 山顶景观、全景视图 |
| nature-2 | Cornwall Park Picnic | 公园野餐、绿地、自然 |
| nature-3 | One Tree Hill Explorer | 山丘景观、纪念碑 |
| nature-4 | Auckland Domain Adventure | 花园、公园小径、自然步道 |
| nature-5 | Western Springs Wildlife | 鸟类、本地鸟类、野生动物 |

### ③ Culture & History（文化历史）

| Quest ID | 标题 | 图片主题 |
|----------|------|---------|
| culture-1 | Auckland War Memorial Museum | 博物馆外观、内部、文物 |
| culture-2 | Auckland Art Gallery | 艺术画廊、内部、展览 |
| culture-3 | Albert Park History Walk | 历史公园、纪念碑、雕像 |
| culture-4 | High Street Heritage Hunt | 遗产建筑、历史建筑、老建筑 |
| culture-5 | Learn a Māori Greeting | 毛利文化、传统艺术、新西兰 |

### ④ Food & Coffee（美食咖啡）

| Quest ID | 标题 | 图片主题 |
|----------|------|---------|
| food-1 | Hidden Café Hunt | 舒适咖啡馆、咖啡店内部、氛围 |
| food-2 | Best Flat White Challenge | Flat White 咖啡、咖啡艺术、咖啡杯 |
| food-3 | Auckland Night Market | 夜市、街头食品、小吃摊 |
| food-4 | Eat Fish & Chips by the Sea | 炸鱼薯条、海边美食、海边餐饮 |
| food-5 | Try a Kiwi Pie | 肉派、咸派、烘焙食品 |

### ⑤ University Explorer（大学探索）

| Quest ID | 标题 | 图片主题 |
|----------|------|---------|
| uni-1 | Old Arts Building - UoA | 大学建筑、历史校园、建筑 |
| uni-2 | General Library - UoA | 图书馆内部、书架、学习空间 |
| uni-3 | Clock Tower - UoA | 钟楼、校园、校园地标 |
| uni-4 | AUT City Campus | 现代校园、大学建筑、校园景观 |
| uni-5 | Massey Albany Explorer | 校园外观、大学场地、学术建筑 |

### ⑥ Community Challenge（社区挑战）

| Quest ID | 标题 | 图片主题 |
|----------|------|---------|
| community-1 | Recommend Your Favourite Study Spot | 学习地点、舒适学习区、图书馆角落 |
| community-2 | Hidden Street Art | 街头艺术、涂鸦艺术、城市艺术 |
| community-3 | Sunset Photo Challenge | 日落城市景观、奥克兰日落、黄金时刻 |
| community-4 | Favourite Weekend Walk | 步行道、自然小径、风景步道 |
| community-5 | Local Secret Challenge | 隐藏地点、秘密景观、本地宝藏 |

---

## 技术实现

### 数据结构
```typescript
export interface OfficialQuest {
  // ... 其他字段
  images?: string[];  // 新增：图片 URL 数组
}
```

### Quest Detail 页面
```typescript
// 使用 Quest 特定的图片，或者使用默认图片
const galleryImages = officialQuest?.images || [
  // 默认图片...
];
```

### 图片来源
所有图片来自 **Unsplash**（免费高质量图片）：
- 格式：`https://images.unsplash.com/photo-{id}?w=800&h=600&fit=crop`
- 尺寸：800x600（优化加载速度）
- 裁剪：`fit=crop`（自动裁剪适配）

---

## 用户体验

### 优势 ✅
1. **相关性强** - 每个 Quest 的图片都与描述匹配
2. **视觉吸引力** - 高质量专业图片
3. **加载优化** - 使用 CDN + 优化尺寸
4. **响应式** - 自动适配不同屏幕
5. **Hover 效果** - 鼠标悬停图片放大

### 展示方式
```
Gallery Section:
┌────────────────────────────────────┐
│  Photo Gallery                     │
│  ┌──────┐  ┌──────┐  ┌──────┐    │
│  │ IMG 1│  │ IMG 2│  │ IMG 3│    │
│  │ 相关 │  │ 相关 │  │ 相关 │    │
│  └──────┘  └──────┘  └──────┘    │
│                                    │
│  + 用户上传的照片（如有）          │
└────────────────────────────────────┘
```

---

## 测试方法

### 1. 访问任意 Quest Detail
```
http://localhost:5173/quests/culture-1
```

### 2. 检查 Photo Gallery
- 应该显示 3 张图片
- 图片应该与 Quest 主题相关
- 例如：Auckland War Memorial Museum 应该显示博物馆相关图片

### 3. 不同 Quest 对比
```bash
# 博物馆 Quest
/quests/culture-1  → 博物馆图片

# 咖啡 Quest
/quests/food-2  → 咖啡相关图片

# 自然 Quest
/quests/nature-1  → 山景图片
```

---

## 示例对比

### Before（之前）❌
所有 Quest 显示相同的通用图片：
- 奥克兰天际线
- 随机自然景观
- 随机海景

### After（现在）✅
每个 Quest 显示相关图片：
- **Auckland War Memorial Museum** → 博物馆外观、内部、文物
- **Best Flat White** → 咖啡、拉花、咖啡杯
- **Mt Eden Summit** → 山顶景观、全景

---

## 图片质量

### Unsplash 图片特点
- ✅ 高分辨率（原图更大，但我们裁剪到 800x600）
- ✅ 专业摄影
- ✅ 免费使用
- ✅ 无水印
- ✅ CDN 加速

### 加载性能
```
图片大小：约 50-150 KB/张
3 张图片：150-450 KB
加载时间：< 1 秒（快速网络）
```

---

## 未来扩展

### 可能的改进
- [ ] 添加更多图片（每个 Quest 5-10 张）
- [ ] 支持图片轮播
- [ ] 添加图片灯箱（点击放大）
- [ ] 用户上传图片审核
- [ ] 社区投票最佳图片
- [ ] 季节性图片（春夏秋冬）

---

**更新时间**: 2026-07-18  
**图片总数**: 90 张（30 个 Quest × 3 张）  
**图片来源**: Unsplash  
**状态**: ✅ 完成
