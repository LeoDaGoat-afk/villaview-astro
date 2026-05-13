# Beds24 admin — paste-ready content

富士山ガーデンホテル（propid 323430）— Beds24 admin 里需要手动填的文案。
全部 JA / EN / ZH 三语已经写好，**复制 → 粘贴 → 保存**即可。

Beds24 V3 admin → **Settings → Properties → Fujisan Garden Hotel**
下面的 "Where" 字段是在该 property 下的子菜单。如果菜单名跟版本略有差异，
按"找跟 confirmation / email / guest details / cancellation 关键词最接近的"原则定位。

---

## ▌ 1. Confirmation Text（页面上的「予約完了」文案）

**Where**: Booking Engine → **Confirmation Text** / Thank You Message

> 说明：我们的 `beds24-body-top.js` 已经在确认页顶部叠了一个品牌 banner
> （teal 背景 + 予約番号 + 4 个 CTA 按钮）。Beds24 自己这块文字显示在
> 我们 banner 的下面，作为补充说明。所以这里写"详情/温馨提示"即可，
> 不必再重复"ご予約ありがとうございました"。

### 日本語

```
このたびは富士山ガーデンホテルにご予約をいただき、誠にありがとうございます。

ご予約番号と詳細は、上記の予約番号と、ご登録のメールアドレス宛に送信される確認メールをご確認ください。確認メールが10分以内に届かない場合は、迷惑メールフォルダをご確認のうえ、それでも届かない場合はお手数ですが下記までご連絡ください。

■ チェックイン   15:00 〜 21:00
■ チェックアウト  10:00 まで
■ 駐車場     無料（先着順）
■ お問合せ    TEL 0555-65-8888（9:00〜21:00）

ご到着を心よりお待ちしております。
```

### English

```
Thank you for booking Fujisan Garden Hotel.

Your reservation reference is shown above. A confirmation email has also been sent to your registered email address — please check your inbox (and spam folder). If you do not receive it within 10 minutes, please contact us using the details below.

▌ Check-in    15:00 – 21:00
▌ Check-out   by 10:00
▌ Parking     Complimentary (first-come, first-served)
▌ Contact     TEL +81-555-65-8888 (9:00 – 21:00 JST)

We look forward to welcoming you.
```

### 中文（简体）

```
感谢您预订富士山花园酒店。

您的预约编号显示在上方。确认邮件已发送至您注册的邮箱，请查收（并确认垃圾邮件文件夹）。如10分钟内仍未收到，请通过以下方式联系我们。

▌ 入住时间   15:00 – 21:00
▌ 退房时间   10:00 前
▌ 停车场    免费（先到先得）
▌ 联系方式   TEL +81-555-65-8888（日本时间 9:00–21:00）

期待您的光临。
```

---

## ▌ 2. Booking Confirmation Email（发给客人的确认邮件）

**Where**: Email Templates → **Booking Confirmation Email** / Guest Confirmation

> Beds24 邮件模板支持 merge tag（方括号变量），保存前请确认它们没被
> 编辑器自动转义。常用 tag：`[BOOKID] [FIRSTNAME] [LASTNAME] [CHECKIN]
> [CHECKOUT] [NUMNIGHT] [ROOM] [NUMADULT] [NUMCHILD] [TOTAL] [STATUS]`。

### Subject（件名）

```
【富士山ガーデンホテル】ご予約確認（予約番号 [BOOKID]）/ Booking Confirmed
```

### Body（HTML 推奨。プレーンテキスト版でも下記をそのまま流し込めます）

```
[FIRSTNAME] [LASTNAME] 様

このたびは富士山ガーデンホテルにご予約をいただき、誠にありがとうございます。
下記の通り、ご予約を承りましたのでご確認をお願いいたします。

────────────────────────────────
■ ご予約内容
────────────────────────────────
予約番号       [BOOKID]
お名前        [FIRSTNAME] [LASTNAME] 様
チェックイン     [CHECKIN]（15:00以降）
チェックアウト    [CHECKOUT]（10:00まで）
泊数         [NUMNIGHT] 泊
お部屋        [ROOM]
ご利用人数      大人 [NUMADULT] 名 / 子供 [NUMCHILD] 名
合計金額（税込）   ¥[TOTAL]
お支払い方法     現地払い（現金 / クレジットカード）

────────────────────────────────
■ ホテル所在地
────────────────────────────────
〒401-0502 山梨県南都留郡山中湖村平野字池畑2420-1
TEL  0555-65-8888（9:00〜21:00）
最寄り駅から：富士急行「富士山駅」よりバスで約25分
最寄バス停「ホテルマウント富士入口」より徒歩 約5分

────────────────────────────────
■ キャンセルポリシー
────────────────────────────────
・宿泊予定日の10日前まで   無料
・9日前〜2日前        宿泊料金の20%
・前日             宿泊料金の50%
・当日 / 不泊         宿泊料金の100%
※ご連絡なしの不泊は全額のキャンセル料を申し受けます。

────────────────────────────────
■ 当日のチェックイン
────────────────────────────────
チェックインの際は本確認メールをスマートフォンでご提示いただくか、
予約番号 [BOOKID] をフロントスタッフへお伝えください。
21:00以降のご到着の場合は、必ず事前にご連絡をお願いいたします。

────────────────────────────────
■ お問合せ
────────────────────────────────
TEL  0555-65-8888
Mail info@fuji-garden.com
Web  https://chijapanhotel.com/fuji-garden/

ご到着を心よりお待ちしております。

──────────────────────────────────────────────
Thank you for booking Fujisan Garden Hotel.
Your reservation is confirmed as follows.

▌ Reservation
Booking Ref   [BOOKID]
Guest       [FIRSTNAME] [LASTNAME]
Check-in     [CHECKIN] (from 15:00)
Check-out     [CHECKOUT] (by 10:00)
Nights      [NUMNIGHT]
Room       [ROOM]
Guests      [NUMADULT] adult(s) / [NUMCHILD] child(ren)
Total (tax incl.) JPY [TOTAL]
Payment      On-site (cash / credit card)

▌ Location
2420-1 Aza-Ikehata, Hirano, Yamanakako-mura, Minamitsuru-gun, Yamanashi 401-0502
TEL +81-555-65-8888 (9:00 – 21:00 JST)
Approx. 25 min by bus from "Mt. Fuji Station" (Fujikyu Line),
then 5 min walk from "Hotel Mount Fuji-iriguchi" stop.

▌ Cancellation Policy
Up to 10 days before stay   Free
9 – 2 days before        20% of room rate
1 day before          50% of room rate
Day of stay / no-show     100% of room rate

▌ Check-in
Please present this email or quote booking reference [BOOKID] at the front
desk. If arriving after 21:00, please contact us in advance.

▌ Contact
TEL +81-555-65-8888  |  info@fuji-garden.com  |  https://chijapanhotel.com/fuji-garden/

We look forward to welcoming you.

──────────────────────────────────────────────
感谢您预订富士山花园酒店，您的预订信息如下。

▌ 预约信息
预约编号     [BOOKID]
姓名       [FIRSTNAME] [LASTNAME]
入住       [CHECKIN]（15:00 起）
退房       [CHECKOUT]（10:00 前）
住宿夜数    [NUMNIGHT] 晚
房型      [ROOM]
人数      成人 [NUMADULT] 名 / 儿童 [NUMCHILD] 名
合计金额（含税） JPY [TOTAL]
付款方式    到店付款（现金 / 信用卡）

▌ 酒店地址
〒401-0502 山梨县南都留郡山中湖村平野字池畑2420-1
TEL +81-555-65-8888（日本时间 9:00–21:00）
富士急行「富士山站」搭乘巴士约 25 分钟，
「ホテルマウント富士入口」站下车步行 5 分钟。

▌ 退订政策
入住前10日以上   免费
入住前9–2日    收取房费 20%
入住前1日     收取房费 50%
当日 / 未到店   收取房费 100%

▌ 入住流程
请于前台出示本邮件或告知预约编号 [BOOKID]。
21:00 以后到店请提前联系酒店。

▌ 联系方式
TEL +81-555-65-8888  |  info@fuji-garden.com  |  https://chijapanhotel.com/fuji-garden/

期待您的光临。
```

---

## ▌ 3. Booking Notification（发给酒店内部的通知邮件）

**Where**: Email Templates → **Booking Notification** / Property Notification

收件人在 Account → Email Settings 里设置（例：`reservations@fuji-garden.com`）。

### Subject

```
[新規予約] [BOOKID] / [FIRSTNAME] [LASTNAME] / [CHECKIN] - [CHECKOUT]
```

### Body

```
新規予約が入りました。

予約番号   [BOOKID]
お客様氏名  [FIRSTNAME] [LASTNAME]
メール    [EMAIL]
電話     [PHONE]
国      [COUNTRY]

チェックイン [CHECKIN]
チェックアウト[CHECKOUT]
泊数     [NUMNIGHT] 泊
お部屋    [ROOM]
人数     大人 [NUMADULT] / 子供 [NUMCHILD]
合計     ¥[TOTAL]
ステータス  [STATUS]
お支払    現地払い

到着予定時刻 [ARRIVALTIME]
特別要望   [NOTES]

予約管理画面で詳細を確認してください。
```

---

## ▌ 4. Guest Details Form Fields（客户填信息页要哪些字段）

**Where**: Booking Engine → **Guest Details** / Booking Form Fields

### 必填（Required）

| Field | 用途 |
|---|---|
| First Name | 予約者名 |
| Last Name  | 予約者名 |
| Email | 確認メール送信先 |
| Phone | 緊急連絡 / 到着遅延連絡 |
| Country | 多言語ゲスト判定 / 統計 |
| Arrival Time | 当日到着予定時間（15:00 以降 / 21:00 までの選択肢） |

### 任意（Optional, 表示するが必須にしない）

| Field | 用途 |
|---|---|
| Address | 領収書発行希望時 |
| Postcode | 同上 |
| Company Name | 法人利用 |
| Special Requests (Notes) | アレルギー・記念日・部屋指定希望など |

### 不要（非表示にする）

- Passport Number（チェックイン時にフロントで確認すれば足りる）
- Date of Birth（プライバシー過剰収集）
- Address Line 2 / State（Address だけで十分）

### Custom Question（自定义问题 — 加 1 条即可）

**Where**: 同じ Standard Questions 画面の下方 "Custom Questions" 区块 → Add New

| Tab | Question label | Help text |
|---|---|---|
| 日本語  | アレルギー / 食材制限      | アレルギーや苦手な食材があればご記入ください |
| English | Allergies / Dietary       | Please let us know any food allergies or dietary restrictions |
| 中文   | 食物过敏 / 忌口          | 如有食物过敏或忌口请告知 |

- **Type**: Text Area
- **Required**: Optional
- **Show on**: Booking Page

---

## ▌ 5. Cancellation Policy（取消政策文案）

**Where**: Booking Engine → **Cancellation Policy** / Booking Terms

> このテキストは確認メール本文（上記 §2）と整合させる。
> Beds24 の Price Rule 側で実際の課金ルールを設定する場合は
> 別途 priceRule の cancellation stepladder を admin で設定する。

```
キャンセル料は下記の通り頂戴いたします（予約金額に対する割合）。

■ 宿泊予定日の10日前まで    無料
■ 宿泊予定日の9日前〜2日前   20%
■ 宿泊予定日の前日       50%
■ 当日 / 不泊          100%

※ ご連絡なしでチェックインされない場合は、全額のキャンセル料を頂戴いたします。
※ 天災・公共交通機関の長期運休等、不可抗力による場合はこの限りではありません。
事前にご相談ください。

──────────────────────────────────────────────
Cancellation fees are charged as a percentage of the total reservation:

▌ Up to 10 days before stay    Free
▌ 9 – 2 days before        20%
▌ 1 day before          50%
▌ Day of stay / no-show     100%

※ No-shows without prior notice are charged 100%.
※ In cases of force majeure (natural disasters, suspended public transport,
etc.), please contact us in advance.

──────────────────────────────────────────────
退订费用按预订总金额的百分比收取：

▌ 入住前10日以上    免费
▌ 入住前9–2日      收取 20%
▌ 入住前1日       收取 50%
▌ 当日 / 未到店     收取 100%

※ 未提前通知的未到店将收取 100% 退订费。
※ 因天灾、公共交通长期停运等不可抗力，请事前联系酒店协商。
```

---

## ▌ 6. Property Description（房型/物业描述 — Google Hotel 抓取用）

**Where**: Settings → Properties → Fujisan Garden Hotel → **Description / Long Description**

> Google Hotel Ads / Travel Partners が物件詳細をクロールするときに参照する。
> JA / EN / ZH 多言語に対応している場合は各言語タブに同様に入れる。

### Short Description（200 字以内）

```
山中湖畔の高原リゾート、富士山ガーデンホテル。
富士山と山中湖を望む全室美景、天然温泉大浴場、和洋中の朝食・夕食ビュッフェ完備。
都心から車で約90分、富士急ハイランド・忍野八海へのアクセスも良好。
```

### Long Description（500–800 字）

```
富士山ガーデンホテルは、富士五湖の一つ山中湖畔に位置する高原リゾートホテルです。
標高約 1,000m、清涼な空気の中で、雄大な富士山と山中湖の絶景をお楽しみいただけます。

▌ 客室
全室から富士山または山中湖を一望。ダブル / ツイン / トリプル / スイートをご用意し、
ご家族・グループ・ビジネスのいずれの滞在にもお応えします。Wi-Fi 無料、全室禁煙。

▌ 温泉・大浴場
富士の伏流水と天然温泉を使用した大浴場・露天風呂を併設。サウナ・水風呂もご利用いただけます。
営業時間 15:00 – 24:00 / 翌朝 6:00 – 10:00。

▌ お食事
朝食は和洋中ビュッフェスタイル（地元山梨の食材を中心に約 40 品）。
夕食は山梨郷土料理「ほうとう」や河口湖周辺の食材を使ったコース・ビュッフェをご用意。
冬季限定の「カニ食べ放題」もご好評いただいております。

▌ アクセス
東京駅より高速バスで約 2 時間、河口湖駅よりバスで約 30 分、富士急ハイランドより車で約 20 分。
富士山周辺観光（忍野八海・河口湖・新倉山浅間公園・富士スバルライン五合目）の拠点として最適。
無料駐車場あり（先着順 100 台）。

▌ サービス
24 時間フロント / 多言語対応（日 / 英 / 中 / 韓）/ ベビーベッド貸出無料 /
レンタサイクル / 観光案内デスク / 国際宅配便（DHL / FedEx）対応。
```

---

## ▌ 設定後に確認すること

1. 確認メールが正常に届くか — テスト予約をして自分の Gmail に届くか確認
2. キャンセル料テキストが Booking Page / 確認メール / Property Description の
   3 箇所で**完全に一致**しているか（不一致だと客とのトラブル原因になる）
3. Google Hotel 提出前に、Property Description が JA / EN / ZH の 3 言語すべて埋まっているか確認
