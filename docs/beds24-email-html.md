# Beds24 Email Templates — Guest Confirmation HTML (JA / EN / ZH)

富士山ガーデンホテル — 客人收到的"予约确认邮件"品牌化 HTML 模板。
三个语言各做一个独立模板，Beds24 按客人在 Booking Page 选的语言自动发对应那份。

## ▌ 在 Beds24 admin 怎么配

1. https://beds24.com/control3.php?pagetype=emailtemplates&propid=323430
2. 选 **Guest Confirmation Email** / Booking Confirmation
3. 模板编辑器切到 **HTML 模式**（不要 WYSIWYG，否则会把内联样式弄乱）
4. 创建 3 份 template，每份分别选 Language = Japanese / English / Chinese
5. 把下面对应语言段落 **整段 HTML** 复制粘贴到 Body 框
6. Subject 用对应语言的那行
7. 保存 → 测试一笔预约确认能正常收到

> **Merge tag 说明**：`[BOOKID]` `[FIRSTNAME]` `[LASTNAME]` `[CHECKIN]` `[CHECKOUT]`
> `[NUMNIGHT]` `[ROOM]` `[NUMADULT]` `[NUMCHILD]` `[TOTAL]` 这些是 Beds24 变量，
> Beds24 发件时会替换成真实数据，**不要改它们**。

---

## ▌ 1. 日本語版

### Subject
```
【富士山ガーデンホテル】ご予約確認（[BOOKID]）
```

### Body (HTML)
```html
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ご予約確認</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif;color:#333;line-height:1.6">
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f5f5f5"><tr><td align="center" style="padding:24px 12px">

<table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="max-width:600px;border-radius:6px;overflow:hidden;border:1px solid #e5e5e5">

  <tr><td bgcolor="#2a6b6e" style="padding:28px 32px;text-align:center">
    <img src="https://chijapanhotel.com/fuji-garden/images/main_logo.png" alt="富士山ガーデンホテル" width="160" style="display:block;margin:0 auto 10px;border:0;max-width:160px">
    <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:11px;letter-spacing:3px">RESERVATION CONFIRMED</p>
  </td></tr>

  <tr><td style="padding:32px 32px 8px;text-align:center">
    <h1 style="margin:0 0 14px;font-size:22px;color:#2a6b6e;font-weight:600;letter-spacing:2px">ご予約ありがとうございました</h1>
    <p style="margin:0;font-size:14px;color:#555">[FIRSTNAME] [LASTNAME] 様<br>下記の通りご予約を承りました。当日のご来館を心よりお待ちしております。</p>
  </td></tr>

  <tr><td align="center" style="padding:20px 32px 28px">
    <table cellpadding="0" cellspacing="0" border="0" bgcolor="#f0f5f5" style="border:1px solid #cfdcdd;border-radius:4px"><tr><td style="padding:14px 28px;text-align:center">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;color:#558">予約番号 / BOOKING REF</p>
      <strong style="font-size:22px;color:#2a6b6e;letter-spacing:1px">[BOOKID]</strong>
    </td></tr></table>
  </td></tr>

  <tr><td style="padding:0 32px 24px">
    <h3 style="margin:0 0 12px;font-size:13px;color:#2a6b6e;font-weight:600;letter-spacing:2px;border-bottom:1px solid #e5e5e5;padding-bottom:8px">▌ ご予約内容</h3>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="padding:8px 0;font-size:12px;color:#888;width:40%">チェックイン</td><td style="padding:8px 0;font-size:14px;color:#333;font-weight:600">[CHECKIN] <span style="font-size:11px;color:#888;font-weight:400">15:00以降</span></td></tr>
      <tr><td colspan="2" style="border-bottom:1px dashed #eee;line-height:0">&nbsp;</td></tr>
      <tr><td style="padding:8px 0;font-size:12px;color:#888">チェックアウト</td><td style="padding:8px 0;font-size:14px;color:#333;font-weight:600">[CHECKOUT] <span style="font-size:11px;color:#888;font-weight:400">10:00まで</span></td></tr>
      <tr><td colspan="2" style="border-bottom:1px dashed #eee;line-height:0">&nbsp;</td></tr>
      <tr><td style="padding:8px 0;font-size:12px;color:#888">泊数</td><td style="padding:8px 0;font-size:14px;color:#333;font-weight:600">[NUMNIGHT] 泊</td></tr>
      <tr><td colspan="2" style="border-bottom:1px dashed #eee;line-height:0">&nbsp;</td></tr>
      <tr><td style="padding:8px 0;font-size:12px;color:#888">お部屋</td><td style="padding:8px 0;font-size:14px;color:#333;font-weight:600">[ROOM]</td></tr>
      <tr><td colspan="2" style="border-bottom:1px dashed #eee;line-height:0">&nbsp;</td></tr>
      <tr><td style="padding:8px 0;font-size:12px;color:#888">ご利用人数</td><td style="padding:8px 0;font-size:14px;color:#333;font-weight:600">大人 [NUMADULT] 名 / 子供 [NUMCHILD] 名</td></tr>
      <tr><td colspan="2" style="border-bottom:1px dashed #eee;line-height:0">&nbsp;</td></tr>
      <tr><td style="padding:10px 0 4px;font-size:12px;color:#888">合計金額（税込）</td><td style="padding:10px 0 4px;font-size:18px;color:#e8633a;font-weight:700">¥[TOTAL]</td></tr>
      <tr><td colspan="2" style="padding:0 0 8px;font-size:11px;color:#888">お支払い：現地払い（現金 / クレジットカード）</td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:0 32px 28px;text-align:center">
    <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto"><tr>
      <td style="padding:0 4px"><a href="https://chijapanhotel.com/fuji-garden/access/" style="display:inline-block;padding:11px 20px;background:#e8633a;color:#fff;text-decoration:none;border-radius:3px;font-size:13px;font-weight:600;letter-spacing:1px">アクセス情報</a></td>
      <td style="padding:0 4px"><a href="https://chijapanhotel.com/fuji-garden/contact/" style="display:inline-block;padding:11px 20px;background:#fff;color:#2a6b6e;border:1px solid #2a6b6e;text-decoration:none;border-radius:3px;font-size:13px;font-weight:600;letter-spacing:1px">お問合せ</a></td>
    </tr></table>
  </td></tr>

  <tr><td style="padding:0 32px 20px">
    <h3 style="margin:0 0 10px;font-size:13px;color:#2a6b6e;font-weight:600;letter-spacing:2px;border-bottom:1px solid #e5e5e5;padding-bottom:8px">▌ キャンセルポリシー</h3>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:12px;color:#555">
      <tr><td style="padding:4px 0">宿泊予定日の10日前まで</td><td style="padding:4px 0;text-align:right;color:#2a6b6e;font-weight:600">無料</td></tr>
      <tr><td style="padding:4px 0">9日前〜2日前</td><td style="padding:4px 0;text-align:right">宿泊料金の20%</td></tr>
      <tr><td style="padding:4px 0">前日</td><td style="padding:4px 0;text-align:right">宿泊料金の50%</td></tr>
      <tr><td style="padding:4px 0">当日 / 不泊</td><td style="padding:4px 0;text-align:right;color:#c44">宿泊料金の100%</td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:0 32px 24px">
    <h3 style="margin:0 0 10px;font-size:13px;color:#2a6b6e;font-weight:600;letter-spacing:2px;border-bottom:1px solid #e5e5e5;padding-bottom:8px">▌ 当日のチェックイン</h3>
    <p style="margin:0;font-size:13px;color:#555;line-height:1.7">本メールをスマートフォンでご提示いただくか、予約番号 <strong style="color:#2a6b6e">[BOOKID]</strong> をフロントスタッフへお伝えください。<br>21:00以降のご到着の場合は、必ず事前にお電話にてご連絡をお願いいたします。</p>
  </td></tr>

  <tr><td bgcolor="#fafafa" style="padding:24px 32px;border-top:1px solid #eee">
    <p style="margin:0 0 8px;font-size:15px;color:#2a6b6e;font-weight:600;letter-spacing:1px">富士山ガーデンホテル</p>
    <p style="margin:0 0 4px;font-size:12px;color:#666">〒401-0502 山梨県南都留郡山中湖村平野字池畑2420-1</p>
    <p style="margin:0 0 4px;font-size:12px;color:#666">TEL <a href="tel:0555658888" style="color:#666;text-decoration:none">0555-65-8888</a>（9:00〜21:00）</p>
    <p style="margin:0 0 4px;font-size:12px;color:#666">Mail <a href="mailto:info@fuji-garden.com" style="color:#666;text-decoration:none">info@fuji-garden.com</a></p>
    <p style="margin:8px 0 0;font-size:12px"><a href="https://chijapanhotel.com/fuji-garden/" style="color:#e8633a;text-decoration:none">chijapanhotel.com/fuji-garden</a></p>
  </td></tr>

</table>

<p style="margin:16px 0 0;font-size:11px;color:#999;text-align:center">本メールは自動送信されています。返信される場合は info@fuji-garden.com まで。</p>

</td></tr></table>
</body></html>
```

---

## ▌ 2. English version

### Subject
```
[Fujisan Garden Hotel] Reservation Confirmed ([BOOKID])
```

### Body (HTML)
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Reservation Confirmed</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Lato','Helvetica Neue',Arial,sans-serif;color:#333;line-height:1.6">
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f5f5f5"><tr><td align="center" style="padding:24px 12px">

<table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="max-width:600px;border-radius:6px;overflow:hidden;border:1px solid #e5e5e5">

  <tr><td bgcolor="#2a6b6e" style="padding:28px 32px;text-align:center">
    <img src="https://chijapanhotel.com/fuji-garden/images/main_logo.png" alt="Fujisan Garden Hotel" width="160" style="display:block;margin:0 auto 10px;border:0;max-width:160px">
    <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:11px;letter-spacing:3px">RESERVATION CONFIRMED</p>
  </td></tr>

  <tr><td style="padding:32px 32px 8px;text-align:center">
    <h1 style="margin:0 0 14px;font-size:22px;color:#2a6b6e;font-weight:600;letter-spacing:1px">Thank you for your reservation</h1>
    <p style="margin:0;font-size:14px;color:#555">Dear [FIRSTNAME] [LASTNAME],<br>Your reservation is confirmed as below. We look forward to welcoming you.</p>
  </td></tr>

  <tr><td align="center" style="padding:20px 32px 28px">
    <table cellpadding="0" cellspacing="0" border="0" bgcolor="#f0f5f5" style="border:1px solid #cfdcdd;border-radius:4px"><tr><td style="padding:14px 28px;text-align:center">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;color:#558">BOOKING REFERENCE</p>
      <strong style="font-size:22px;color:#2a6b6e;letter-spacing:1px">[BOOKID]</strong>
    </td></tr></table>
  </td></tr>

  <tr><td style="padding:0 32px 24px">
    <h3 style="margin:0 0 12px;font-size:13px;color:#2a6b6e;font-weight:600;letter-spacing:2px;border-bottom:1px solid #e5e5e5;padding-bottom:8px">▌ RESERVATION</h3>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="padding:8px 0;font-size:12px;color:#888;width:40%">Check-in</td><td style="padding:8px 0;font-size:14px;color:#333;font-weight:600">[CHECKIN] <span style="font-size:11px;color:#888;font-weight:400">from 15:00</span></td></tr>
      <tr><td colspan="2" style="border-bottom:1px dashed #eee;line-height:0">&nbsp;</td></tr>
      <tr><td style="padding:8px 0;font-size:12px;color:#888">Check-out</td><td style="padding:8px 0;font-size:14px;color:#333;font-weight:600">[CHECKOUT] <span style="font-size:11px;color:#888;font-weight:400">by 10:00</span></td></tr>
      <tr><td colspan="2" style="border-bottom:1px dashed #eee;line-height:0">&nbsp;</td></tr>
      <tr><td style="padding:8px 0;font-size:12px;color:#888">Nights</td><td style="padding:8px 0;font-size:14px;color:#333;font-weight:600">[NUMNIGHT]</td></tr>
      <tr><td colspan="2" style="border-bottom:1px dashed #eee;line-height:0">&nbsp;</td></tr>
      <tr><td style="padding:8px 0;font-size:12px;color:#888">Room</td><td style="padding:8px 0;font-size:14px;color:#333;font-weight:600">[ROOM]</td></tr>
      <tr><td colspan="2" style="border-bottom:1px dashed #eee;line-height:0">&nbsp;</td></tr>
      <tr><td style="padding:8px 0;font-size:12px;color:#888">Guests</td><td style="padding:8px 0;font-size:14px;color:#333;font-weight:600">[NUMADULT] adult(s) / [NUMCHILD] child(ren)</td></tr>
      <tr><td colspan="2" style="border-bottom:1px dashed #eee;line-height:0">&nbsp;</td></tr>
      <tr><td style="padding:10px 0 4px;font-size:12px;color:#888">Total (tax incl.)</td><td style="padding:10px 0 4px;font-size:18px;color:#e8633a;font-weight:700">JPY [TOTAL]</td></tr>
      <tr><td colspan="2" style="padding:0 0 8px;font-size:11px;color:#888">Payment: On-site (cash / credit card)</td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:0 32px 28px;text-align:center">
    <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto"><tr>
      <td style="padding:0 4px"><a href="https://chijapanhotel.com/fuji-garden/en/access/" style="display:inline-block;padding:11px 20px;background:#e8633a;color:#fff;text-decoration:none;border-radius:3px;font-size:13px;font-weight:600;letter-spacing:1px">Access</a></td>
      <td style="padding:0 4px"><a href="https://chijapanhotel.com/fuji-garden/en/contact/" style="display:inline-block;padding:11px 20px;background:#fff;color:#2a6b6e;border:1px solid #2a6b6e;text-decoration:none;border-radius:3px;font-size:13px;font-weight:600;letter-spacing:1px">Contact</a></td>
    </tr></table>
  </td></tr>

  <tr><td style="padding:0 32px 20px">
    <h3 style="margin:0 0 10px;font-size:13px;color:#2a6b6e;font-weight:600;letter-spacing:2px;border-bottom:1px solid #e5e5e5;padding-bottom:8px">▌ CANCELLATION POLICY</h3>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:12px;color:#555">
      <tr><td style="padding:4px 0">Up to 10 days before stay</td><td style="padding:4px 0;text-align:right;color:#2a6b6e;font-weight:600">Free</td></tr>
      <tr><td style="padding:4px 0">9 – 2 days before</td><td style="padding:4px 0;text-align:right">20% of room rate</td></tr>
      <tr><td style="padding:4px 0">1 day before</td><td style="padding:4px 0;text-align:right">50% of room rate</td></tr>
      <tr><td style="padding:4px 0">Day of stay / no-show</td><td style="padding:4px 0;text-align:right;color:#c44">100% of room rate</td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:0 32px 24px">
    <h3 style="margin:0 0 10px;font-size:13px;color:#2a6b6e;font-weight:600;letter-spacing:2px;border-bottom:1px solid #e5e5e5;padding-bottom:8px">▌ CHECK-IN</h3>
    <p style="margin:0;font-size:13px;color:#555;line-height:1.7">Please show this email at the front desk or quote booking reference <strong style="color:#2a6b6e">[BOOKID]</strong>.<br>If arriving after 21:00, please contact us in advance by phone.</p>
  </td></tr>

  <tr><td bgcolor="#fafafa" style="padding:24px 32px;border-top:1px solid #eee">
    <p style="margin:0 0 8px;font-size:15px;color:#2a6b6e;font-weight:600;letter-spacing:1px">Fujisan Garden Hotel</p>
    <p style="margin:0 0 4px;font-size:12px;color:#666">2420-1 Aza-Ikehata, Hirano, Yamanakako-mura, Minamitsuru-gun, Yamanashi 401-0502</p>
    <p style="margin:0 0 4px;font-size:12px;color:#666">TEL <a href="tel:+81555658888" style="color:#666;text-decoration:none">+81-555-65-8888</a> (9:00 – 21:00 JST)</p>
    <p style="margin:0 0 4px;font-size:12px;color:#666">Mail <a href="mailto:info@fuji-garden.com" style="color:#666;text-decoration:none">info@fuji-garden.com</a></p>
    <p style="margin:8px 0 0;font-size:12px"><a href="https://chijapanhotel.com/fuji-garden/en/" style="color:#e8633a;text-decoration:none">chijapanhotel.com/fuji-garden</a></p>
  </td></tr>

</table>

<p style="margin:16px 0 0;font-size:11px;color:#999;text-align:center">This is an automated email. For inquiries please reply to info@fuji-garden.com</p>

</td></tr></table>
</body></html>
```

---

## ▌ 3. 中文版

### Subject
```
【富士山花园酒店】预约确认（[BOOKID]）
```

### Body (HTML)
```html
<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>预约确认</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif;color:#333;line-height:1.6">
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f5f5f5"><tr><td align="center" style="padding:24px 12px">

<table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="max-width:600px;border-radius:6px;overflow:hidden;border:1px solid #e5e5e5">

  <tr><td bgcolor="#2a6b6e" style="padding:28px 32px;text-align:center">
    <img src="https://chijapanhotel.com/fuji-garden/images/main_logo.png" alt="富士山花园酒店" width="160" style="display:block;margin:0 auto 10px;border:0;max-width:160px">
    <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:11px;letter-spacing:3px">RESERVATION CONFIRMED</p>
  </td></tr>

  <tr><td style="padding:32px 32px 8px;text-align:center">
    <h1 style="margin:0 0 14px;font-size:22px;color:#2a6b6e;font-weight:600;letter-spacing:2px">感谢您的预订</h1>
    <p style="margin:0;font-size:14px;color:#555">[FIRSTNAME] [LASTNAME] 您好，<br>您的预订已确认，详情如下。期待您的光临。</p>
  </td></tr>

  <tr><td align="center" style="padding:20px 32px 28px">
    <table cellpadding="0" cellspacing="0" border="0" bgcolor="#f0f5f5" style="border:1px solid #cfdcdd;border-radius:4px"><tr><td style="padding:14px 28px;text-align:center">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:2px;color:#558">预约编号 / BOOKING REF</p>
      <strong style="font-size:22px;color:#2a6b6e;letter-spacing:1px">[BOOKID]</strong>
    </td></tr></table>
  </td></tr>

  <tr><td style="padding:0 32px 24px">
    <h3 style="margin:0 0 12px;font-size:13px;color:#2a6b6e;font-weight:600;letter-spacing:2px;border-bottom:1px solid #e5e5e5;padding-bottom:8px">▌ 预约信息</h3>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="padding:8px 0;font-size:12px;color:#888;width:40%">入住</td><td style="padding:8px 0;font-size:14px;color:#333;font-weight:600">[CHECKIN] <span style="font-size:11px;color:#888;font-weight:400">15:00 起</span></td></tr>
      <tr><td colspan="2" style="border-bottom:1px dashed #eee;line-height:0">&nbsp;</td></tr>
      <tr><td style="padding:8px 0;font-size:12px;color:#888">退房</td><td style="padding:8px 0;font-size:14px;color:#333;font-weight:600">[CHECKOUT] <span style="font-size:11px;color:#888;font-weight:400">10:00 前</span></td></tr>
      <tr><td colspan="2" style="border-bottom:1px dashed #eee;line-height:0">&nbsp;</td></tr>
      <tr><td style="padding:8px 0;font-size:12px;color:#888">夜数</td><td style="padding:8px 0;font-size:14px;color:#333;font-weight:600">[NUMNIGHT] 晚</td></tr>
      <tr><td colspan="2" style="border-bottom:1px dashed #eee;line-height:0">&nbsp;</td></tr>
      <tr><td style="padding:8px 0;font-size:12px;color:#888">房型</td><td style="padding:8px 0;font-size:14px;color:#333;font-weight:600">[ROOM]</td></tr>
      <tr><td colspan="2" style="border-bottom:1px dashed #eee;line-height:0">&nbsp;</td></tr>
      <tr><td style="padding:8px 0;font-size:12px;color:#888">人数</td><td style="padding:8px 0;font-size:14px;color:#333;font-weight:600">成人 [NUMADULT] 名 / 儿童 [NUMCHILD] 名</td></tr>
      <tr><td colspan="2" style="border-bottom:1px dashed #eee;line-height:0">&nbsp;</td></tr>
      <tr><td style="padding:10px 0 4px;font-size:12px;color:#888">合计金额（含税）</td><td style="padding:10px 0 4px;font-size:18px;color:#e8633a;font-weight:700">JPY [TOTAL]</td></tr>
      <tr><td colspan="2" style="padding:0 0 8px;font-size:11px;color:#888">付款：到店付款（现金 / 信用卡）</td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:0 32px 28px;text-align:center">
    <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto"><tr>
      <td style="padding:0 4px"><a href="https://chijapanhotel.com/fuji-garden/zh/access/" style="display:inline-block;padding:11px 20px;background:#e8633a;color:#fff;text-decoration:none;border-radius:3px;font-size:13px;font-weight:600;letter-spacing:1px">交通指南</a></td>
      <td style="padding:0 4px"><a href="https://chijapanhotel.com/fuji-garden/zh/contact/" style="display:inline-block;padding:11px 20px;background:#fff;color:#2a6b6e;border:1px solid #2a6b6e;text-decoration:none;border-radius:3px;font-size:13px;font-weight:600;letter-spacing:1px">联系我们</a></td>
    </tr></table>
  </td></tr>

  <tr><td style="padding:0 32px 20px">
    <h3 style="margin:0 0 10px;font-size:13px;color:#2a6b6e;font-weight:600;letter-spacing:2px;border-bottom:1px solid #e5e5e5;padding-bottom:8px">▌ 退订政策</h3>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:12px;color:#555">
      <tr><td style="padding:4px 0">入住前 10 日以上</td><td style="padding:4px 0;text-align:right;color:#2a6b6e;font-weight:600">免费</td></tr>
      <tr><td style="padding:4px 0">入住前 9 – 2 日</td><td style="padding:4px 0;text-align:right">收取 20%</td></tr>
      <tr><td style="padding:4px 0">入住前 1 日</td><td style="padding:4px 0;text-align:right">收取 50%</td></tr>
      <tr><td style="padding:4px 0">当日 / 未到店</td><td style="padding:4px 0;text-align:right;color:#c44">收取 100%</td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:0 32px 24px">
    <h3 style="margin:0 0 10px;font-size:13px;color:#2a6b6e;font-weight:600;letter-spacing:2px;border-bottom:1px solid #e5e5e5;padding-bottom:8px">▌ 入住流程</h3>
    <p style="margin:0;font-size:13px;color:#555;line-height:1.7">请于前台出示本邮件，或告知预约编号 <strong style="color:#2a6b6e">[BOOKID]</strong>。<br>21:00 以后到店请提前电话联系。</p>
  </td></tr>

  <tr><td bgcolor="#fafafa" style="padding:24px 32px;border-top:1px solid #eee">
    <p style="margin:0 0 8px;font-size:15px;color:#2a6b6e;font-weight:600;letter-spacing:1px">富士山花园酒店</p>
    <p style="margin:0 0 4px;font-size:12px;color:#666">〒401-0502 山梨县南都留郡山中湖村平野字池畑 2420-1</p>
    <p style="margin:0 0 4px;font-size:12px;color:#666">TEL <a href="tel:+81555658888" style="color:#666;text-decoration:none">+81-555-65-8888</a>（日本时间 9:00 – 21:00）</p>
    <p style="margin:0 0 4px;font-size:12px;color:#666">Mail <a href="mailto:info@fuji-garden.com" style="color:#666;text-decoration:none">info@fuji-garden.com</a></p>
    <p style="margin:8px 0 0;font-size:12px"><a href="https://chijapanhotel.com/fuji-garden/zh/" style="color:#e8633a;text-decoration:none">chijapanhotel.com/fuji-garden</a></p>
  </td></tr>

</table>

<p style="margin:16px 0 0;font-size:11px;color:#999;text-align:center">本邮件为系统自动发送，如有疑问请发送邮件至 info@fuji-garden.com</p>

</td></tr></table>
</body></html>
```

---

## ▌ 模板写完了之后还要做的 2 件事

### a. 发件人邮箱配置（重要）

Beds24 默认发件人是 `noreply@beds24.com`，会被很多客户邮箱判为垃圾邮件。

**入口**：`control3.php?pagetype=accountemail`（Account → Email Settings）

**推荐**：用酒店自己域名发件 → `reservation@fuji-garden.com` 或 `info@fuji-garden.com`

两种实现方式：

1. **Beds24 internal SMTP**（最简单）—— 在 Email Settings 里填 SMTP host/user/pass：
   - Resend SMTP（推荐）：`smtp.resend.com:465`，user `resend`，pass 从 Resend 后台拿 API key
   - 或 Postmark / SendGrid / 酒店现有的邮件 server
2. **不配 SMTP，只改 From address**：邮件还从 Beds24 发出但 From 显示酒店域名 —— 这种情况要在域名 DNS 加 SPF 记录 include Beds24 的发送 IP（在 Beds24 docs 有），否则更可能进垃圾邮件

无论哪种，**强烈建议域名 DNS 加 SPF + DKIM** 提高送达率：
- SPF: `v=spf1 include:_spf.resend.com ~all`（用 Resend 的话）
- DKIM: Resend 后台会给一个 CNAME，加到 DNS

### b. 测试发送

设置完之后用你自己的 Gmail / Outlook 真订一笔（可以马上取消），验证：

1. 主收件箱（不是垃圾邮件）能不能收到？
2. logo 图片能不能加载？
3. CTA 按钮点击能不能跳到正确页面？
4. merge tag（[BOOKID] / [CHECKIN] 等）是不是都被替换成真实值？
5. 不同邮件客户端（Gmail web / Gmail iOS / Outlook / Apple Mail）显示有没有问题？

测试预约可以用 priceRule 设个 ¥0 的测试方案，订完直接 admin 里删除即可。
