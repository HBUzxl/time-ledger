
# TimeLedger API 接口文档

## 项目概述

TimeLedger 是一个基于柳比歇夫时间管理法的时间记录应用，支持多平台（Web / App / Telegram Bot）。

## 技术栈

- 后端：Golang + Gin
- 数据库：PostgreSQL
- ORM：sqlc + pgx

---

## 当前已完成

### 认证模块 ✅

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/v1/auth/register | 用户注册 |
| POST | /api/v1/auth/login | 用户登录 |
| POST | /api/v1/auth/refresh | 刷新 token |

### 分类模块 (部分完成)

| 方法 | 路径 | 描述 | 状态 |
|------|------|------|------|
| GET | /api/v1/categories | 获取分类列表 | ✅ |
| POST | /api/v1/categories | 创建分类 | ✅ |
| PUT | /api/v1/categories/:uuid | 更新分类 | ✅ |
| DELETE | /api/v1/categories/:uuid | 删除分类 | ✅ |

### 记录模块 (部分完成)

| 方法 | 路径 | 描述 | 状态 |
|------|------|------|------|
| POST | /api/v1/records | 创建记录 | ✅ |
| GET | /api/v1/records | 获取记录列表 | ✅ |
| PUT | /api/v1/records/:uuid | 更新记录 | ✅ |
| DELETE | /api/v1/records/:uuid | 删除记录 | ⬜ |

---

## 待实现接口 (TODO List)

### 1. 分类模块补充

#### 1.1 更新分类
```
PUT /api/v1/categories/:uuid
```
请求体：
```json
{
  "name": "阅读",
  "color_code": "#FF5733",
  "parent_id": 1,
  "sort_order": 0
}
```

#### 1.2 删除分类
```
DELETE /api/v1/categories/:uuid
```
响应：204 No Content

---

### 2. 记录模块

#### 2.1 获取记录列表
```
GET /api/v1/records
```
查询参数：
- `start_date` (可选) - 开始日期，格式：2024-01-01
- `end_date` (可选) - 结束日期，格式：2024-01-31
- `category_id` (可选) - 分类ID筛选
- `page` (可选) - 页码，默认 1
- `page_size` (可选) - 每页数量，默认 20

#### 2.2 获取单条记录
```
GET /api/v1/records/:uuid
```

#### 2.3 更新记录
```
PUT /api/v1/records/:uuid
```
请求体：
```json
{
  "start_time": "2024-01-01T10:00:00Z",
  "end_time": "2024-01-01T11:30:00Z",
  "category_id": 1,
  "note": "阅读《xxx》"
}
```

#### 2.4 删除记录
```
DELETE /api/v1/records/:uuid
```

#### 2.5 时间冲突检测
创建/更新记录时，如果时间重叠返回警告：
```json
{
  "warning": "time_conflict",
  "conflicting_records": [
    {
      "uuid": "xxx",
      "start_time": "2024-01-01T10:00:00Z",
      "end_time": "2024-01-01T11:30:00Z",
      "category": "阅读"
    }
  ]
}
```

---

### 3. 统计模块

#### 3.1 日统计
```
GET /api/v1/statistics/daily
```
查询参数：
- `date` (必填) - 日期，格式：2024-01-01

响应：
```json
{
  "date": "2024-01-01",
  "total_minutes": 480,
  "by_category": [
    {
      "category_id": 1,
      "category_name": "工作",
      "minutes": 240,
      "percentage": 50
    }
  ],
  "timeline": [
    {
      "start_time": "09:00",
      "end_time": "10:00",
      "category": "工作",
      "duration_minutes": 60
    }
  ]
}
```

#### 3.2 周统计
```
GET /api/v1/statistics/weekly
```
查询参数：
- `year` (必填) - 年份
- `week` (必填) - 周数 (1-53)

#### 3.3 月统计
```
GET /api/v1/statistics/monthly
```
查询参数：
- `year` (必填) - 年份
- `month` (必填) - 月份 (1-12)

#### 3.4 任意时间段统计
```
GET /api/v1/statistics/range
```
查询参数：
- `start_date` (必填)
- `end_date` (必填)

#### 3.5 分类趋势图数据
```
GET /api/v1/statistics/category/:category_id/trend
```
查询参数：
- `start_date` (必填)
- `end_date` (必填)

---

### 4. 统计配置模块

用户自定义统计维度（有效时间、无效时间等）

#### 4.1 获取配置列表
```
GET /api/v1/statistics-configs
```

#### 4.2 创建配置
```
POST /api/v1/statistics-configs
```
请求体：
```json
{
  "config_name": "有效时间",
  "category_ids": [1, 2, 3]
}
```

#### 4.3 更新配置
```
PUT /api/v1/statistics-configs/:id
```

#### 4.4 删除配置
```
DELETE /api/v1/statistics-configs/:id
```

---

### 5. Telegram Bot 模块

#### 5.1 Webhook 处理
```
POST /api/v1/bot/webhook
```
Telegram 服务器推送消息到此接口

#### 5.2 解析预览（测试接口）
```
POST /api/v1/bot/parse
```
请求体：
```json
{
  "message_text": "10:00-11:30 阅读 XXX"
}
```
响应（预览）：
```json
{
  "preview": {
    "start_time": "2024-01-01T10:00:00Z",
    "end_time": "2024-01-01T11:30:00Z",
    "category": "阅读",
    "note": "XXX",
    "confidence": 0.95
  },
  "buttons": ["confirm", "cancel", "edit"]
}
```

#### 5.3 确认保存
```
POST /api/v1/bot/confirm
```
请求体：
```json
{
  "action": "confirm",  // confirm | cancel | edit
  "preview_id": "xxx",
  "edited_data": { ... }  // 如果 action 是 edit
}
```

---

### 6. 导出模块

#### 6.1 JSON 导出
```
GET /api/v1/export/json
```
查询参数：
- `start_date` (必填)
- `end_date` (必填)
- `category_id` (可选)

#### 6.2 CSV 导出
```
GET /api/v1/export/csv
```

#### 6.3 HTML 静态页面数据
```
GET /api/v1/export/html
```
返回用于渲染静态页面的 JSON 数据

#### 6.4 自动导出配置
```
POST /api/v1/export/schedule
```
- 开启后每月自动导出到用户邮箱

---

### 7. 用户设置模块

#### 7.1 获取设置
```
GET /api/v1/settings
```
响应：
```json
{
  "time_granularity": 5,  // 分钟，1/5/15/30
  "export_email": "user@example.com",
  "auto_export_enabled": false
}
```

#### 7.2 更新设置
```
PUT /api/v1/settings
```
请求体：
```json
{
  "time_granularity": 5,
  "export_email": "user@example.com",
  "auto_export_enabled": true
}
```

---

### 8. 原始消息模块（Bot 历史）

#### 8.1 获取原始消息列表
```
GET /api/v1/raw-messages
```
查询参数：
- `processed` (可选) - 是否已处理
- `page`

#### 8.2 手动解析消息
```
POST /api/v1/raw-messages/:id/parse
```

---

## 数据库表

### users
用户表

### categories
分类表（支持两层嵌套）

### time_records
时间记录表

### statistics_configs
统计配置表（有效/无效时间维度）

### raw_messages
原始消息表（Telegram Bot）

---

## 实现优先级

1. **P0 - 核心功能**
   - 记录 CRUD + 冲突检测
   - 分类 CRUD
   - 日/周/月统计

2. **P1 - 重要功能**
   - 导出模块
   - 统计配置
   - Telegram Bot 基本解析

3. **P2 - 增强功能**
   - 用户设置
   - 自动导出
   - 静态页面生成
