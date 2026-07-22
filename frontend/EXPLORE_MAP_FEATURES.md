# Explore Map Page - Feature Documentation

## 功能概览

新的 Explore Map 页面提供了完整的地图探索体验，包含 **30 个官方 Quest**，分为 6 个主题类别。

## 核心功能

### 1. 交互式 Leaflet 地图
- ✅ OpenStreetMap 地图瓦片
- ✅ 可滚动和缩放
- ✅ Quest 标记点击选择
- ✅ 自定义弹出窗口显示 Quest 详情

### 2. 浏览器地理定位
- ✅ 自动请求用户位置
- ✅ "Use My Location" 按钮手动刷新
- ✅ 显示当前坐标
- ✅ 基于位置的距离计算

### 3. Quest 标记
- ✅ 30 个官方 Quest 标记在地图上
- ✅ 点击标记显示 Quest 信息
- ✅ 标记弹出窗口包含标题、描述、XP、链接

### 4. 高级过滤系统

#### Category Filter（类别）
- All
- Explore Auckland（城市探索）
- Nature & Parks（自然公园）
- Food & Coffee（美食咖啡）
- University Explorer（大学探索）
- Culture & History（文化历史）
- Community Challenge（社区挑战）

#### Difficulty Filter（难度）
- Easy
- Medium
- Hard

#### XP Range Filter（XP 范围）
- 0-50
- 50-100
- 100+

#### Distance Filter（距离）
- Nearby (<2km)
- Within 5km
- Within 10km

#### Status Filter（完成状态）
- All
- Not Completed
- Completed

### 5. 搜索功能
- ✅ 实时搜索 Quest 标题和描述
- ✅ 搜索示例："Mission Bay"

### 6. 排序选项

支持 5 种智能排序方式：

1. **Recommended**（推荐）
   - 算法：`(10 - distance) × 0.4 + XP × 0.6`
   - 综合考虑：位置 + 兴趣 + 流行度

2. **Nearest**（最近）
   - 按距离从近到远

3. **Highest XP**（最高 XP）
   - 按 XP 从高到低

4. **Most Popular**（最受欢迎）
   - 按流行度排序（当前使用 XP 作为代理）

5. **Recently Added**（最新添加）
   - 最新的 Quest 优先

### 7. Quest 卡片列表
- ✅ 侧边栏滚动列表
- ✅ 显示 Quest 信息：
  - 标题 + 描述
  - 类别标签
  - 难度标签（颜色编码）
  - XP 奖励
  - 距离徽章
  - 完成状态图标
- ✅ 点击卡片跳转详情页

### 8. 距离徽章
- ✅ 自动计算与用户的距离
- ✅ 显示格式："2.3 km away"
- ✅ 基于浏览器地理定位

### 9. 响应式设计
- ✅ 桌面端：地图 + 侧边栏布局
- ✅ 移动端：垂直堆叠
- ✅ 平板：自适应布局

## 30 个官方 Quest 列表

### ① Explore Auckland（5 个）
| Quest | Difficulty | XP | Description |
|-------|-----------|-----|-------------|
| Mission Bay Explorer | Easy | 80 | Visit Mission Bay and upload a photo |
| Auckland Waterfront Walk | Easy | 70 | Walk along Viaduct Harbour |
| Britomart Discovery | Easy | 60 | Find the Britomart Clock Tower |
| Wynyard Quarter Explorer | Medium | 90 | Visit public art installations |
| Auckland Night Lights | Hard | 120 | Share Auckland skyline photo after sunset |

### ② Nature & Parks（5 个）
| Quest | Difficulty | XP |
|-------|-----------|-----|
| Mt Eden Summit | Medium | 120 |
| Cornwall Park Picnic | Easy | 70 |
| One Tree Hill Explorer | Medium | 100 |
| Auckland Domain Adventure | Easy | 80 |
| Western Springs Wildlife | Medium | 100 |

### ③ Culture & History（5 个）
| Quest | Difficulty | XP |
|-------|-----------|-----|
| Auckland War Memorial Museum | Medium | 120 |
| Auckland Art Gallery | Easy | 80 |
| Albert Park History Walk | Easy | 70 |
| High Street Heritage Hunt | Medium | 90 |
| Learn a Māori Greeting | Easy | 60 |

**特殊 Quest**：Learn a Māori Greeting
- 完成方式：输入 "Kia ora" 即可
- 非常适合国际学生，老师喜欢！

### ④ Food & Coffee（5 个）
| Quest | Difficulty | XP |
|-------|-----------|-----|
| Hidden Café Hunt | Easy | 80 |
| Best Flat White Challenge | Easy | 90 |
| Auckland Night Market | Medium | 110 |
| Eat Fish & Chips by the Sea | Easy | 70 |
| Try a Kiwi Pie | Easy | 60 |

**最受用户欢迎**：需要上传照片 + 评价

### ⑤ University Explorer（5 个）

**UoA（奥克兰大学）**
- Old Arts Building: 60 XP
- General Library: 70 XP
- Clock Tower: 80 XP

**AUT**
- AUT City Campus: 60 XP

**Massey**
- Massey Albany Explorer: 100 XP

**特色**：国际学生最喜欢，独特卖点！

### ⑥ Community Challenge（5 个）
| Quest | XP |
|-------|-----|
| Recommend Your Favourite Study Spot | 80 |
| Hidden Street Art | 100 |
| Sunset Photo Challenge | 120 |
| Favourite Weekend Walk | 90 |
| Local Secret Challenge | 150 |

**全部 UGC 导向**：鼓励用户生成内容

## Quest 完成类型

每个 Quest 支持不同的完成方式：

1. **photo** - 上传照片
2. **checkin** - 签到
3. **text** - 输入文本（如 "Kia ora"）
4. **review** - 照片 + 评价

## 技术实现

### 数据结构
```typescript
interface OfficialQuest {
  id: string;
  title: string;
  description: string;
  category: 'explore' | 'nature' | 'culture' | 'food' | 'university' | 'community';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rewardXp: number;
  latitude: number;
  longitude: number;
  completionType: 'photo' | 'checkin' | 'text' | 'review';
  completionHint?: string;
}
```

### 推荐算法
```typescript
// Location + Interest + Popularity
const score = (10 - distance) * 0.4 + rewardXp * 0.6;
```

### 距离计算
```typescript
// 使用欧几里得距离 × 111（近似 km）
const distance = Math.sqrt(dx * dx + dy * dy) * 111;
```

## 用户体验亮点

1. **个性化推荐**：基于位置和兴趣
2. **即时反馈**：实时搜索和过滤
3. **视觉层次**：颜色编码难度和类别
4. **便捷导航**：从地图、列表、搜索多种方式发现 Quest
5. **激励机制**：清晰的 XP 显示和完成状态

## 未来扩展

- [ ] 添加更多 Quest 类别
- [ ] 实现真实流行度统计
- [ ] 添加 Quest 评分系统
- [ ] 支持自定义地图图层
- [ ] 添加 Quest 路线规划
- [ ] 实现多语言支持

---

**构建时间**: 2026-07-18  
**Quest 总数**: 30  
**类别数量**: 6  
**特色**: 大学探索 + 文化融合
