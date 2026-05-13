# Beds24 3 Price Categories — 逐字段填写内容

每个房型（Double / Twin / Triple / Suite / TBW）都建这 3 条 Price Category。日文为主，英文/中文备用（Beds24 多语言字段一并填）。

> 配置入口：Settings → Properties → Fujisan Garden Hotel (323430) → Rooms → 选房型 → Price Categories → + Add

---

## ▌ Category 1（这条作为 parent / 主类别）：朝食付き

### Basic
| Beds24 字段 | 填入值 |
|---|---|
| **Internal Name** | `breakfast` |
| **Name (Japanese)** | 朝食付き |
| **Name (English)** | Breakfast Included |
| **Name (Chinese Simplified)** | 含早餐 |
| **Name (Chinese Traditional)** | 含早餐 |
| **Name (Korean)** | 조식 포함 |
| **Active** | Yes |

### Description (multilingual)
| Lang | 内容 |
|---|---|
| **JP** | 和洋ブッフェ朝食付き。山中湖の朝を満喫いただけます。 |
| **EN** | Japanese & Western buffet breakfast included. Enjoy a Lake Yamanaka morning. |
| **ZH-CN** | 含和洋自助早餐，享受山中湖之晨。 |
| **ZH-TW** | 含和洋自助早餐，享受山中湖之晨。 |
| **KO** | 일・양식 뷔페 조식 포함. |

### Pricing
| 字段 | 值 |
|---|---|
| **Pricing Type** | Standard / Manual (本类别作为 parent，不要选 Linked) |
| **Daily Rate** | 填入实际房价，例：Double ¥13,200 / Twin ¥13,000 / Triple ¥16,500 |
| **Linked to** | — (this is the parent) |

### Booking Rules
| 字段 | 值 |
|---|---|
| **Min Nights** | 1 |
| **Max Nights** | 30 |
| **Cutoff (Booking Window)** | 0（当日可订） |
| **Refundable** | Yes |
| **Cancellation Policy** | Standard（共用 property 默认：10日前無料 / 2-9日前 20% / 前日 50% / 当日 100%）|

---

## ▌ Category 2：素泊まり・不可取消

### Basic
| Beds24 字段 | 填入值 |
|---|---|
| **Internal Name** | `room_only_nr` |
| **Name (Japanese)** | 素泊まり・不可取消 |
| **Name (English)** | Room Only · Non-Refundable |
| **Name (Chinese Simplified)** | 不含餐·不可取消 |
| **Name (Chinese Traditional)** | 不含餐・不可取消 |
| **Name (Korean)** | 식사 불포함・취소 불가 |
| **Active** | Yes |

### Description (multilingual)
| Lang | 内容 |
|---|---|
| **JP** | お食事なし。10%OFFの最安値。ご予約後の変更・キャンセル不可。 |
| **EN** | No meals. 10% OFF lowest rate. No changes or cancellation after booking. |
| **ZH-CN** | 不含餐，享 10% 优惠最低价。预订后不可变更与取消。 |
| **ZH-TW** | 不含餐，享 10% 優惠最低價。預訂後不可變更與取消。 |
| **KO** | 식사 없음. 10% OFF 최저가. 예약 후 변경・취소 불가. |

### Pricing
| 字段 | 值 |
|---|---|
| **Pricing Type** | **Linked** |
| **Linked to** | `breakfast`（Category 1） |
| **Formula** | `(parent − 4500) × 0.9` |
| **Beds24 formula 输入框写法** | `parent*0.9 - 4500*0.9` 或 `(parent-4500)*0.9` |

> 数学：parent ¥13,200 → (13200−4500)×0.9 = **¥7,830**

### Booking Rules
| 字段 | 值 |
|---|---|
| **Min Nights** | 1 |
| **Max Nights** | 30 |
| **Cutoff** | 0 |
| **Refundable** | **No** |
| **Cancellation Policy** | **Non-Refundable**（专用规则：取消即收 100%）|

---

## ▌ Category 3：朝夕食付き

### Basic
| Beds24 字段 | 填入值 |
|---|---|
| **Internal Name** | `breakfast_dinner` |
| **Name (Japanese)** | 朝夕食付き |
| **Name (English)** | Breakfast + Dinner |
| **Name (Chinese Simplified)** | 含早晚餐 |
| **Name (Chinese Traditional)** | 含早晚餐 |
| **Name (Korean)** | 조・석식 포함 |
| **Active** | Yes |

### Description (multilingual)
| Lang | 内容 |
|---|---|
| **JP** | 和洋ブッフェ朝食＋夕食付き。郷土料理もお楽しみいただけます。 |
| **EN** | Japanese & Western buffet breakfast + dinner. Includes regional Yamanashi cuisine. |
| **ZH-CN** | 含和洋自助早晚餐，品尝山梨乡土料理。 |
| **ZH-TW** | 含和洋自助早晚餐，品嚐山梨鄉土料理。 |
| **KO** | 일・양식 뷔페 조・석식 포함. 향토 요리도. |

### Pricing
| 字段 | 值 |
|---|---|
| **Pricing Type** | **Linked** |
| **Linked to** | `breakfast`（Category 1） |
| **Formula** | `parent + 9000` |
| **Beds24 formula 输入框写法** | `parent + 9000` |

> 数学：parent ¥13,200 → 13200+9000 = **¥22,200**

### Booking Rules
| 字段 | 值 |
|---|---|
| **Min Nights** | 1 |
| **Max Nights** | 30 |
| **Cutoff** | 0 |
| **Refundable** | Yes |
| **Cancellation Policy** | Standard |

---

## ▌ 全 property 默认取消政策（Settings → Cancellation Policy）

应该已经存在，确认或新建为以下 4 档：

| Days before check-in | Fee % |
|---|---|
| **≥ 10 days** | 0% |
| **2 – 9 days** | 20% |
| **1 day** | 50% |
| **0 day / no-show** | 100% |

> "Allow Cancellations" 已建议你改为 **10 days before check in**，跟这个 0% 档对齐。

---

## ▌ 配置后必须验证

1. 在 Beds24 后台开启 **Pricing Strategy → Allow Linked Categories** 开关（默认可能关）
2. Save 后**先用 Double Room 一个房型试**，访问 booking2.php?propid=323430 看：
   - 同一房型下出现 3 个 offer 价格
   - 素泊不可取消价 = (朝食付 − 4500) × 0.9
   - 朝夕食付价 = 朝食付 + 9000
3. 验证 ok 再用 Beds24 的 **Copy Price Categories** 功能，把这 3 条复制到剩下 4 个房型（Twin / Triple / Suite / TBW）

---

## ▌ 拿到 priceId 后回来填官网代码

每条 Category 建好后，Beds24 会给一个数字 ID（例如 12345）。把这 3 个 ID 告诉我，我去更新：
- [src/components/HomeBookingBar.astro:10-12](src/components/HomeBookingBar.astro#L10-L12) — 3 个 `PRICE_ID_*` 常量
- [docs/beds24-body-top.html](docs/beds24-body-top.html) — 3 个 radio 的 `value=""` 占位符

填完后，客人点「素泊・不可取消」radio 后提交，Beds24 widget 会**自动预选该 offer 不让客人手动选**，转化率会更好。
