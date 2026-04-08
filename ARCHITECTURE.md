# Qorex Web App 架构设计

## 📱 移动端优先设计

### 响应式断点
```css
/* 手机竖屏 */
@media (max-width: 375px) { }

/* 手机横屏/小平板 */
@media (min-width: 376px) and (max-width: 768px) { }

/* 平板 */
@media (min-width: 769px) and (max-width: 1024px) { }

/* 桌面 */
@media (min-width: 1025px) { }
```

### 核心尺寸规范
- **状态栏高度**: 44px (iOS) / 24px (Android)
- **导航栏高度**: 56px
- **底部导航**: 60px (包含安全区域)
- **卡片间距**: 16px
- **按钮高度**: 44px (最小触控区域)
- **字体大小**: 14px (正文) / 12px (辅助) / 16px (标题)

---

## 🌍 国际化架构 (i18n)

### 支持语言
| 代码 | 语言 | 方向 |
|------|------|------|
| zh-CN | 简体中文 | LTR |
| zh-TW | 繁體中文 | LTR |
| en-US | English | LTR |
| ja-JP | 日本語 | LTR |
| ko-KR | 한국어 | LTR |

### 语言包结构
```
locales/
├── zh-CN.json
├── zh-TW.json
├── en-US.json
├── ja-JP.json
└── ko-KR.json
```

### 语言检测优先级
1. 用户手动选择（localStorage 存储）
2. URL 参数（`?lang=en`）
3. 浏览器语言（`navigator.language`）
4. 默认语言（zh-CN）

### 切换方案
```javascript
// 轻量级 i18n 实现
const i18n = {
  currentLang: 'zh-CN',
  messages: {},
  
  async setLang(lang) {
    this.currentLang = lang;
    this.messages = await loadMessages(lang);
    this.updateDOM();
    localStorage.setItem('lang', lang);
  },
  
  t(key) {
    return key.split('.').reduce((obj, k) => obj?.[k], this.messages) || key;
  }
}
```

---

## 🎠 轮播图组件

### 功能需求
- ✅ 自动轮播（5 秒间隔）
- ✅ 触摸滑动
- ✅ 指示器（圆点）
- ✅ 无缝循环
- ✅ 懒加载
- ✅ 点击跳转

### 数据结构
```javascript
const swiperItems = [
  {
    id: 1,
    image: '/static/banner1.png',
    title: '新用户专享',
    subtitle: '注册即送 100 USDT 体验金',
    link: '/activity/new-user'
  },
  {
    id: 2,
    image: '/static/banner2.png',
    title: '量化策略大赛',
    subtitle: '赢取 10,000 USDT 奖金池',
    link: '/activity/contest'
  }
]
```

---

## 📊 核心页面架构

### 1. 首页 (Dashboard)
**功能模块:**
- [x] 顶部导航（Logo + 通知 + 用户）
- [x] 收益卡片（今日收益 + 曲线图）
- [x] 轮播图（活动/公告）
- [x] 金刚区（8 个功能入口）
- [x] 机器人状态（启停开关 + 核心数据）
- [x] 公告栏
- [x] 行情列表
- [x] 底部导航（4 个 Tab）

### 2. 收益中心 (Revenue)
**功能模块:**
- [x] 累计收益卡片
- [x] 胜率展示
- [x] 分段控制器（全部/个人/集成）
- [x] 收益统计表格
- [x] 收益曲线图
- [x] 收益记录列表

### 3. 机器人控制台 (Robot)
**功能模块:**
- [x] 启停开关
- [x] 状态显示
- [x] 仓位信息
- [x] 策略配置表单
- [x] 任务记录

### 4. 个人中心 (Profile)
**功能模块:**
- [x] 用户信息卡片
- [x] 功能列表
- [x] 设置选项
- [x] 语言切换

---

## 🎨 设计规范

### 颜色系统
```css
:root {
  /* 主色 */
  --primary: #409EFF;
  --primary-light: #66B1FF;
  --primary-dark: #008AFF;
  
  /* 功能色 */
  --success: #10B981;  /* 涨/盈利 */
  --danger: #EF4444;   /* 跌/亏损 */
  --warning: #F59E0B;  /* 警告 */
  --info: #3B82F6;     /* 信息 */
  
  /* 中性色 */
  --text-primary: #1F2937;
  --text-regular: #4B5563;
  --text-secondary: #6B7280;
  --text-placeholder: #9CA3AF;
  --border: #E5E7EB;
  --background: #F5F7FA;
  
  /* 阴影 */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 25px rgba(0,0,0,0.1);
}
```

### 字体系统
```css
/* 字体大小 */
--text-xs: 12px;
--text-sm: 14px;
--text-base: 16px;
--text-lg: 18px;
--text-xl: 20px;
--text-2xl: 24px;

/* 字重 */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### 间距系统
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
```

---

## 📱 移动端适配

### Viewport 设置
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
```

### 安全区域适配
```css
/* iOS 安全区域 */
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
padding-left: env(safe-area-inset-left);
padding-right: env(safe-area-inset-right);

/* 底部导航 */
bottom: env(safe-area-inset-bottom);
```

### 触控优化
```css
/* 禁止长按菜单 */
-webkit-touch-callout: none;

/* 禁止选中文本 */
-webkit-user-select: none;
user-select: none;

/* 点击高亮 */
-webkit-tap-highlight-color: transparent;
```

---

## 🚀 性能优化

### 图片优化
- WebP 格式优先
- 懒加载（IntersectionObserver）
- 响应式图片（srcset）
- CDN 加速

### 代码优化
- CSS 变量（主题切换）
- 组件化（可复用）
- 按需加载
- 缓存策略

### 加载优化
- 骨架屏（Skeleton）
- 渐进式加载
- 预加载关键资源

---

**版本：** v1.0  
**最后更新：** 2026-04-08  
**设计原则：** 移动端优先、性能优先、用户体验优先
