// FAQ data for VILLA VIEW
// Ported from /Users/kaori/GitHub/villa-view/app/faq/page.jsx
// Used to render /faq page and generate FAQPage schema.org JSON-LD

type LangText = { ja: string; en: string; zh: string };

export type FaqItem = { q: LangText; a: LangText };
export type FaqCategory = { id: string; label: LangText; items: FaqItem[] };

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "checkin",
    label: { ja: "チェックイン / チェックアウト", en: "Check-in / Check-out", zh: "入住 / 退房" },
    items: [
      {
        q: { ja: "チェックイン時間は？早めに入室できますか？", en: "What time is check-in? Can I check in early?", zh: "入住时间是几点？可以提前入住吗？" },
        a: {
          ja: "標準チェックインは 15:00〜21:00 です。早めの入室は 10:00 以降より有料で承ります（要事前申請）。",
          en: "Standard check-in is 15:00 to 21:00. Early check-in is available from 10:00 (paid, advance request required).",
          zh: "标准入住时间为 15:00-21:00。提前入住可于 10:00 之后办理（需提前申请，需付费）。",
        },
      },
      {
        q: { ja: "チェックアウト時間は？レイトチェックアウトは可能ですか？", en: "What time is check-out? Is late check-out available?", zh: "退房时间是几点？可以延迟退房吗？" },
        a: {
          ja: "チェックアウトは 11:00 までです。レイトチェックアウトは事前申請にて別途料金で承ります。",
          en: "Check-out is by 11:00. Late check-out is available on request for an additional fee.",
          zh: "退房时间为 11:00 之前。延迟退房需提前申请并支付费用。",
        },
      },
      {
        q: { ja: "鍵はどこで受け取りますか？", en: "Where do I pick up the key?", zh: "在哪里取钥匙？" },
        a: {
          ja: "フロントは常駐しておりません。玄関左側のカフェ入口にキーボックスがございます。暗証番号はチェックイン確認メールに記載されています。",
          en: "There is no on-site front desk. A key box is located at the cafe entrance to the left of the villa entrance. The passcode is in your check-in confirmation email.",
          zh: "我们没有常驻前台。玄关左侧的咖啡厅入口处有一个钥匙盒。密码已发送到您的入住确认邮件中。",
        },
      },
      {
        q: { ja: "フロントスタッフは常駐していますか？", en: "Is there on-site staff?", zh: "有常驻员工吗？" },
        a: {
          ja: "常駐しておりません。緊急時は 098-894-2474 まで 24 時間ご連絡可能です。",
          en: "No on-site staff. For emergencies, please call +81-98-894-2474 (available 24 hours).",
          zh: "没有常驻员工。如有紧急情况请拨打 +81-98-894-2474（24 小时可联系）。",
        },
      },
      {
        q: { ja: "到着前にやることはありますか？", en: "Is there anything I should do before arrival?", zh: "到达前需要做什么吗？" },
        a: {
          ja: "公式サイトの「チェックイン」セクションでオンラインチェックインをお願いします（人数分のゲスト登録・身分証アップロード）。スムーズなお迎えのため、到着予定時刻もご記入ください。",
          en: "Please complete online check-in (guest registration + ID upload) via the Check-In section on our website. Please also note your estimated arrival time.",
          zh: "请于到达前在官网「办理入住」板块完成在线办理入住（旅客登记 + 证件上传）。请同时填写预计到达时间。",
        },
      },
    ],
  },
  {
    id: "facility",
    label: { ja: "施設・設備", en: "Facilities & Amenities", zh: "设施与备品" },
    items: [
      {
        q: { ja: "Wi-Fi のパスワードは？", en: "What is the Wi-Fi password?", zh: "Wi-Fi 密码是多少？" },
        a: {
          ja: "ネットワーク名「VillaVIEW-guest」、パスワードは室内のカードに記載されています。",
          en: "Network: VillaVIEW-guest. The password is on the card inside the room.",
          zh: "网络名：VillaVIEW-guest，密码请见房间内的卡片。",
        },
      },
      {
        q: { ja: "エアコンの使い方は？", en: "How do I use the air conditioning?", zh: "空调如何使用？" },
        a: {
          ja: "リビングおよび各寝室に独立したリモコンがございます。使用しない部屋のエアコンはお切りいただけますと幸いです。",
          en: "Each living area and bedroom has its own remote. Please switch off the AC in unused rooms.",
          zh: "客厅及每间卧室都有独立遥控器。不使用的房间请关闭空调。",
        },
      },
      {
        q: { ja: "お風呂・シャワーは？", en: "What's in the bathroom?", zh: "浴室设施有哪些？" },
        a: {
          ja: "メインバスルームに大型バスタブ・レインシャワーがございます。バスソルト・シャンプー・コンディショナーは備え付けです。",
          en: "The main bathroom has a large bathtub and rain shower. Bath salts, shampoo, and conditioner are provided.",
          zh: "主浴室配有大型浴缸和雨淋花洒。备有浴盐、洗发水和护发素。",
        },
      },
      {
        q: { ja: "キッチンで料理はできますか？", en: "Can I cook in the kitchen?", zh: "厨房可以做饭吗？" },
        a: {
          ja: "IH コンロ・電子レンジ・冷蔵庫・食器一式完備です。塩・胡椒・油など基本調味料も少量ご用意しております。",
          en: "IH stove, microwave, fridge, and full dishware are provided. Basic seasonings (salt, pepper, oil) are also available.",
          zh: "配有 IH 电磁炉、微波炉、冰箱及全套餐具。备有基础调味料（盐、胡椒、油）。",
        },
      },
      {
        q: { ja: "BBQ テラスを使いたいです", en: "Can I use the BBQ terrace?", zh: "想使用 BBQ 平台" },
        a: {
          ja: "21:00 までご利用可能です。コンロは事前に清掃した状態でご用意します。炭・食材はお持ち込みください。",
          en: "Available until 21:00. We provide a clean empty grill; please bring your own charcoal and ingredients.",
          zh: "可使用至 21:00。我们提供清洁的烤架，请自带木炭和食材。",
        },
      },
      {
        q: { ja: "駐車場はありますか？", en: "Is there parking?", zh: "有停车场吗？" },
        a: {
          ja: "敷地内に 2 台分の無料駐車スペースがございます。",
          en: "Two free on-site parking spaces.",
          zh: "场内提供 2 个免费停车位。",
        },
      },
      {
        q: { ja: "タオル・アメニティは？", en: "What amenities are provided?", zh: "备有哪些用品？" },
        a: {
          ja: "バスタオル・フェイスタオル・歯ブラシ・ボディソープ・シャンプー・コンディショナーを備え付けております。",
          en: "Bath and face towels, toothbrush, body wash, shampoo, and conditioner are provided.",
          zh: "备有浴巾、面巾、牙刷、沐浴露、洗发水和护发素。",
        },
      },
    ],
  },
  {
    id: "access",
    label: { ja: "アクセス", en: "Access", zh: "交通" },
    items: [
      {
        q: { ja: "那覇空港からの行き方は？", en: "How do I get there from Naha Airport?", zh: "从那霸机场怎么过来？" },
        a: {
          ja: "車で約 40 分（高速利用）です。タクシーで約 6,500〜8,000 円。レンタカーが最もおすすめです。",
          en: "About 40 minutes by car via expressway. Taxi approximately ¥6,500-8,000. A rental car is recommended.",
          zh: "走高速约 40 分钟车程，出租车约 6,500-8,000 日元。建议租车。",
        },
      },
      {
        q: { ja: "レンタカーは必要ですか？", en: "Do I need a rental car?", zh: "需要租车吗？" },
        a: {
          ja: "沖縄観光・お買い物には強くお勧めします。公共交通は便数が少なくご不便です。",
          en: "Strongly recommended for sightseeing and shopping. Public transport is limited.",
          zh: "强烈推荐租车。公共交通班次较少，不便。",
        },
      },
      {
        q: { ja: "公共交通でも来られますか？", en: "Can I get there by public transport?", zh: "可以坐公共交通过来吗？" },
        a: {
          ja: "可能ですが、最寄りバス停から徒歩 15 分・本数も少ないため、レンタカーまたはタクシーをご検討ください。",
          en: "Possible but inconvenient — the nearest bus stop is a 15-minute walk with limited service. We recommend a rental car or taxi.",
          zh: "可以，但最近巴士站需步行 15 分钟且班次较少。建议租车或打车。",
        },
      },
    ],
  },
  {
    id: "area",
    label: { ja: "周辺・観光", en: "Surroundings & Sightseeing", zh: "周边与观光" },
    items: [
      {
        q: { ja: "近くにスーパー・コンビニはありますか？", en: "Is there a convenience store or supermarket nearby?", zh: "附近有便利店或超市吗？" },
        a: {
          ja: "徒歩 3 分の場所に LAWSON 南城つきしろ店（24 時間営業）がございます。車で 10 分にサンエー（地元スーパー）も。",
          en: "LAWSON Nanjo Tsukishiro (24-hour convenience store) is just 3 minutes' walk. San-A supermarket within a 10-minute drive.",
          zh: "步行 3 分钟即有 LAWSON 南城つきしろ店（24 小时营业）。10 分钟车程内有 San-A 超市。",
        },
      },
      {
        q: { ja: "おすすめのレストランは？", en: "Any restaurant recommendations?", zh: "有推荐的餐厅吗？" },
        a: {
          ja: "玄関左側のカフェがおすすめです。地元の食材を使った沖縄料理がいただけます（営業 11:00〜18:00）。",
          en: "We recommend the cafe to the left of the entrance, serving Okinawan cuisine with local ingredients (open 11:00-18:00).",
          zh: "推荐玄关左侧的咖啡厅，使用当地食材的冲绳料理（营业时间 11:00-18:00）。",
        },
      },
      {
        q: { ja: "海・ビーチまで近いですか？", en: "How close is the beach?", zh: "离海边近吗？" },
        a: {
          ja: "車で 10 分以内に新原ビーチがございます。",
          en: "Mibaru Beach is within a 10-minute drive.",
          zh: "10 分钟车程内有新原海滩。",
        },
      },
      {
        q: { ja: "近くの観光スポットは？", en: "What sightseeing spots are nearby?", zh: "附近有什么观光景点？" },
        a: {
          ja: "斎場御嶽（世界遺産）まで車で 15 分、おきなわワールドまで 20 分、ニライ橋・カナイ橋まで 25 分です。",
          en: "Sefa-Utaki (World Heritage Site) is 15 minutes by car, Okinawa World 20 minutes, and the Nirai-Kanai Bridge 25 minutes.",
          zh: "斎場御嶽（世界遗产）15 分钟车程，冲绳世界 20 分钟，ニライ・カナイ大桥 25 分钟。",
        },
      },
    ],
  },
  {
    id: "payment",
    label: { ja: "支払い・規定", en: "Payment & Rules", zh: "支付与规定" },
    items: [
      {
        q: { ja: "支払い方法は？", en: "What payment methods are accepted?", zh: "支持哪些支付方式？" },
        a: {
          ja: "公式サイトでのご予約時にクレジットカード決済（Stripe 経由で安全に処理）。VISA、Mastercard に対応しています。現金はお取り扱いしておりません。",
          en: "Credit card at the time of booking via Stripe (secure processing). VISA and Mastercard are accepted. We do not accept cash.",
          zh: "预订时通过 Stripe 使用信用卡支付（安全处理）。支持 VISA、Mastercard。不接受现金。",
        },
      },
      {
        q: { ja: "キャンセルポリシーは？", en: "What is the cancellation policy?", zh: "取消政策是怎样的？" },
        a: {
          ja: "宿泊日の 14 日前まで無料、13〜7 日前は宿泊料金の 30%、6 日前〜前日は 50%、当日・無連絡不泊は 100% のキャンセル料が発生します。",
          en: "Free up to 14 days before stay; 30% from 13-7 days before; 50% from 6 days to 1 day before; 100% on day of stay or no-show.",
          zh: "入住日 14 天前免费；13-7 天前收取住宿费用的 30%；6 天前–前一天 50%；当日或未到通知 100%。",
        },
      },
      {
        q: { ja: "喫煙は可能ですか？", en: "Is smoking allowed?", zh: "可以吸烟吗？" },
        a: {
          ja: "全室禁煙です（バルコニー含む）。違反時は清掃料として 50,000 円を申し受けます。喫煙は屋外の指定エリアのみとなります。",
          en: "The entire property is non-smoking (including the balcony). A JPY 50,000 cleaning fee applies for violations. Smoking only in the designated outdoor area.",
          zh: "全栋禁烟（含阳台）。违反时收取清洁费 50,000 日元。仅可在户外指定区域吸烟。",
        },
      },
      {
        q: { ja: "ペットは連れて行けますか？", en: "Are pets allowed?", zh: "可以带宠物吗？" },
        a: {
          ja: "申し訳ございませんがペット同伴はお断りしております。盲導犬・介助犬は受け入れ可能です。",
          en: "We do not accept pets, except for service or guide dogs.",
          zh: "抱歉，本馆不接受携带宠物。导盲犬/服务犬可入住。",
        },
      },
      {
        q: { ja: "夜間の騒音やパーティーは？", en: "Are loud parties allowed at night?", zh: "夜间可以开派对吗？" },
        a: {
          ja: "22:00 以降は近隣への配慮のためお静かにお願いいたします。大音量音楽・大人数の集まりは禁止です。",
          en: "Please keep noise down after 22:00 out of consideration for neighbors. Loud music and large gatherings are not permitted.",
          zh: "22:00 后请保持安静以避免打扰邻居。禁止大音量音乐和大型聚会。",
        },
      },
    ],
  },
  {
    id: "trouble",
    label: { ja: "トラブル", en: "Trouble Shooting", zh: "故障处理" },
    items: [
      {
        q: { ja: "鍵が開きません", en: "The door won't open", zh: "门打不开" },
        a: {
          ja: "玄関左側のカフェ入口にキーボックスがございます。暗証番号はチェックイン確認メールに記載されています。それでも開かない場合は 098-894-2474 までご連絡ください。",
          en: "There is a key box at the cafe entrance to the left of the villa entrance. The passcode is in your check-in confirmation email. If you still cannot enter, please call +81-98-894-2474.",
          zh: "玄关左侧的咖啡厅入口处有钥匙盒。密码已发送到您的入住确认邮件中。如仍无法打开，请拨打 +81-98-894-2474。",
        },
      },
      {
        q: { ja: "Wi-Fi が繋がりません", en: "Wi-Fi is not working", zh: "Wi-Fi 连不上" },
        a: {
          ja: "モデムは玄関収納内にございます。電源を抜いて 1 分待ってから再接続をお試しください。改善しない場合は 098-894-2474 へご連絡ください。",
          en: "The modem is in the entryway closet. Unplug for 1 minute and reconnect. If still no luck, please call +81-98-894-2474.",
          zh: "调制解调器在玄关收纳柜内。请拔下电源等待 1 分钟后重新连接。如仍未恢复请致电 +81-98-894-2474。",
        },
      },
      {
        q: { ja: "エアコンが動きません", en: "The air conditioner is not working", zh: "空调不工作" },
        a: {
          ja: "リモコンの電池をご確認ください。室外機のブレーカーが落ちている場合は分電盤（キッチン横）でご確認ください。",
          en: "Please check the remote batteries. If the outdoor unit's breaker has tripped, check the breaker panel next to the kitchen.",
          zh: "请检查遥控器电池。如果室外机断路器跳闸，请查看厨房旁的配电盘。",
        },
      },
      {
        q: { ja: "お湯が出ません", en: "There is no hot water", zh: "没有热水" },
        a: {
          ja: "給湯器のリモコン（バスルーム入口）の電源を一度切ってからオンにし直してください。改善しない場合は 098-894-2474 へ。",
          en: "Switch the water heater control panel (at the bathroom entrance) off and back on. If still no hot water, please call +81-98-894-2474.",
          zh: "请将热水器遥控器（位于浴室入口）关闭后再重新打开。如仍无热水请致电 +81-98-894-2474。",
        },
      },
    ],
  },
  {
    id: "other",
    label: { ja: "その他", en: "Other", zh: "其他" },
    items: [
      {
        q: { ja: "延泊したいです", en: "I'd like to extend my stay", zh: "想延长入住" },
        a: {
          ja: "空室状況によりますので、お早めに 098-894-2474 または info.serena.breeze@gmail.com までご連絡ください。",
          en: "Subject to availability. Please contact us as early as possible at +81-98-894-2474 or info.serena.breeze@gmail.com.",
          zh: "视空房情况而定。请尽早致电 +81-98-894-2474 或邮件至 info.serena.breeze@gmail.com。",
        },
      },
      {
        q: { ja: "忘れ物をしました", en: "I left something behind", zh: "我把东西落下了" },
        a: {
          ja: "お早めにご連絡ください。発見次第、着払いにて発送いたします（保管期間は 30 日です）。",
          en: "Please contact us promptly. We will ship found items by cash-on-delivery (30-day holding period).",
          zh: "请尽快联系我们。一经找到将以到付方式寄回（保管期为 30 天）。",
        },
      },
      {
        q: { ja: "緊急連絡先は？", en: "What is the emergency contact?", zh: "紧急联系方式？" },
        a: {
          ja: "電話: 098-894-2474（24 時間）／メール: info.serena.breeze@gmail.com",
          en: "Phone: +81-98-894-2474 (24 hours) / Email: info.serena.breeze@gmail.com",
          zh: "电话：+81-98-894-2474（24 小时）／邮件：info.serena.breeze@gmail.com",
        },
      },
    ],
  },
];

export const FAQ_T = {
  ja: { title: "よくあるご質問", sub: "ご滞在前後のご不明点はこちらをご確認ください", contact: "解決しない場合は ", back: "← トップへ戻る" },
  en: { title: "Frequently Asked Questions", sub: "Common questions before, during, and after your stay", contact: "If your question isn't answered, contact ", back: "← Back to Home" },
  zh: { title: "常见问题", sub: "您入住前后的疑问可在此查阅", contact: "如未解决请联系 ", back: "← 返回首页" },
};

// Pick lang text fallback chain: requested → en → ja
export function pickText(t: LangText, lang: string): string {
  return (t as any)[lang] || t.en || t.ja || "";
}

// Generate FAQPage schema.org JSON-LD for current language
export function faqSchema(lang: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_CATEGORIES.flatMap(cat =>
      cat.items.map(item => ({
        "@type": "Question",
        name: pickText(item.q, lang),
        acceptedAnswer: {
          "@type": "Answer",
          text: pickText(item.a, lang),
        },
      }))
    ),
  };
}
