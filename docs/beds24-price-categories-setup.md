# Beds24 Price Categories 配置指引 — 富士山ガーデンホテル (propid 323430)

每个房型下挂多个 Price Category（价格类别），让客人在 Beds24 widget 里看到并列的几个可选价（例如「朝食付き」「素泊まり」「不可取消」）。

---

## 3 个 Price Categories（每个房型都开同样 3 条）

| Cat# | 名称（JP / ZH / EN） | 含义 | 相对价格 | 取消政策 |
|---|---|---|---|---|
| 1 | **素泊まり・不可取消** / 不含餐・不可取消 / Room Only · Non-Refundable | 不含餐，下单即扣款不可退 | 基准价 −10% | **不可取消、不可退款** |
| 2 | **朝食付き** / 含早餐 / Breakfast Included | 含和洋ブッフェ朝食 | 基准价 + ¥1,500/名 | 标准（10日前免费） |
| 3 | **朝夕食付き** / 含早晚餐 / Breakfast + Dinner | 含和洋ブッフェ朝食・夕食 | 基准价 + ¥4,500/名 | 标准（10日前免费） |

> 设计意图：
> - 第 1 条做「最低价钩子」（−10%），但用不可取消锁定收入
> - 第 2、3 条做「升单」，差异 ¥3,000/名（晚餐价格）— 客人会在「朝食 vs 朝夕食」之间犹豫，转化率高
> - 没有「素泊・可取消」选项是故意的：不想让客人既享低价又能自由取消

---

## 后台操作步骤

### Step 1 — 登录与定位
1. 登录 https://beds24.com/
2. 顶部菜单 → **Settings** → **Properties** → 选 **Fujisan Garden Hotel (323430)**
3. 侧栏 → **Rooms** → 选第一个房型（例如 Double Room, roomid=672188）

### Step 2 — 创建 Price Categories
1. 在 Room 编辑页找 **Prices** tab（或 **Price Categories**）
2. 默认通常已经有 1 条 "Standard" — 把它改名为 **「朝食付き」**
3. **+ Add Price Category** 添加第 2 条：**「素泊まり」**
4. **+ Add Price Category** 添加第 3 条：**「早割30・不可取消」**

每条 Price Category 设置：
- **Name (Multilingual)**：填日中英三种
- **Description**：客人在 widget 里看到的简短说明（"和洋ブッフェ朝食付き" 等）
- **Daily Rate** / Override：参考下面价格策略
- **Min nights / Max nights**：通常都 1 / 30
- **Cancellation Policy**：标准 vs 不可取消
- **Cutoff (Booking Window)**：例如「早割30」设最少 30 天前预订
- **Booking Rules → Refundable**：toggle off 对于不可取消方案

### Step 3 — 价格联动方案（已选定）

**主类别 = 「朝食付き」**（最常见选择，作为基准），另两个用公式联动：

| Category | 联动公式 | 示例（朝食付 ¥13,200/泊）|
|---|---|---|
| **朝食付き** （主） | 自由设定 | ¥13,200 |
| **素泊まり・不可取消** | `(parent − 4500) × 0.9` | (13200 − 4500) × 0.9 = **¥7,830** |
| **朝夕食付き** | `parent + 9000` | 13200 + 9000 = **¥22,200** |

**公式中的常数说明（per room, 假设 3 名満員）：**
- `4500` = 朝食 ¥1,500 × 3 名（从含早餐价里减去）
- `9000` = 夕食 ¥3,000 × 3 名（朝食的价格 + 晚餐 = 朝夕食）

> ⚠ **关于「1〜3 名同料金」与餐费冲突**：
> 站点首页和预约页都宣传「全室定額・1～3名同料金」（[BookingContent](src/components/BookingContent.astro)：`booking.hero.lead`）。
> Price Category 模式下房价是定额，但餐费是按人数实计。两种处理方式：
>
> 1. **接受 max-occupancy 折中**：上面公式假设 3 名（房间被填满），1-2 人预订会多付。简单但客户体验略差。
> 2. **餐改为 Upsell Item（推荐补充）**：Price Categories 只做「素泊不可取消 vs 素泊可取消 vs Standard」三档，餐通过 *Properties → Upsell Items* 提供，Beds24 会按人数自动计算 ¥1,500×N。
>
> 你目前选了方式 1（餐入 Price Category）— 如果后续 1-2 人预订投诉，可平滑迁移到方式 2。

**后台操作：**
1. 进 *Room → 朝食付き* → Daily Rate 填入实际日历价
2. 进 *Room → 素泊まり・不可取消* → 勾选 **Linked Pricing** → 填公式：
   ```
   parent.price * 0.9 - 4500 * 0.9
   ```
   或 Beds24 提供的可视化界面里：`(parent - 4500) × 0.9`
3. 进 *Room → 朝夕食付き* → 勾选 **Linked Pricing** → `parent + 9000`

> 在 Beds24 后台的 *Pricing Strategy* 里需先开启「Allow Linked Categories」开关。

**好处**：以后调价只改「朝食付き」一条，另两条自动跟随。季节性涨价、平日/周末浮动、特价日全部一行搞定。

### Step 4 — 库存联动（Linked Inventory）
所有 3 个 Price Category **共用同一库存池**（避免超卖）：
- 在每个 Price Category 编辑页 → **Inventory** 字段
- 全部填房型本身的 totalUnit（例如 Double Room 总 30 间，3 个 category 都填 30）
- Beds24 会以「最早到达 totalUnit 为止」的逻辑自动扣减

### Step 5 — 复制到其他房型
重复 Step 2–4，把同样 3 个 Price Categories 在 5 个房型（Double / Twin / Triple / Suite / TBW）都开一遍。

> 加速技巧：Beds24 有 **Copy Price Categories** 按钮（房型列表右侧菜单），可以一次复制 1 个房型的全部 categories 到另一个。

---

## 验证

### A. 直接访问 Beds24 landing
```
https://beds24.com/booking2.php?propid=323430&numnight=1
```
应看到每个房型卡片下方并列显示 3 个价位，类似：
```
Double Room
  ├─ 朝食付き      ¥13,200/泊
  ├─ 素泊まり      ¥11,700/泊
  └─ 早割30・不可取消  ¥11,880/泊
```

### B. 通过官网 /booking iframe
```
https://fuji-garden.com/booking/
```
表单一致显示，但被 Astro Header / Footer 包裹。

### C. 通过 URL 预选某个 offer（deep link）
Beds24 支持 `priceId=<categoryId>` 参数预选：
```
https://fuji-garden.com/booking/?roomid=672188&priceId=12345
```
（需要你在 Beds24 admin 拿到具体 Price Category 的 ID）

---

## 关于官网集成的影响

**完全无需改前端代码**，因为：
- 官网 [HomeBookingBar.astro](src/components/HomeBookingBar.astro) 只传 `roomid` / `numroom` / `promo` 等参数，Beds24 widget 在表单里自动展开 Price Categories
- 官网 [BookingContent.astro](src/components/BookingContent.astro) 也只是嵌 iframe，Beds24 完成全部 UI

**若要让官网"主动推销"特定方案**（例如首页 banner「素泊まり ¥11,700〜」点击直达），需要：
- 在 HomeBookingBar 加可选的 `priceId` 输入或 hidden field
- 在 booking URL 构造里加 `params.set('priceId', priceId)`

是否需要现在加这个 deep-link 支持？

---

## 常见陷阱

1. **多 Price Category 不显示在 widget**：Beds24 V3 Bootstrap template 需要在 *Properties → Booking Page → Template* 里勾选「Show Price Categories」选项，否则只显示主价格。
2. **不可取消方案显示「Free Cancellation」**：把该 category 的 *Cancellation Policy* 单独配置成「Non-Refundable」并解绑全 property 默认政策。
3. **OTA 也卖到「早割30」**：Channel Manager → 每个 channel 的 Rate Strategy 里把这条 category mark as **Direct Only** 或 Disabled。
4. **Linked 公式不生效**：必须在 Beds24 后台的 *Pricing Strategy* 里开启「Allow Linked Categories」。
