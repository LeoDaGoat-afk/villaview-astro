#!/usr/bin/env node
/**
 * Pull Rakuten Travel prices for Fujisan Garden Hotel (hotelNo 130736)
 * across a date range, group by room type × meal plan.
 *
 * Output: a price matrix we use to (a) update our booking-page card
 * base prices, (b) batch-update Beds24 priceRules so the two sources
 * stay aligned.
 *
 * Usage: node scripts/rakuten-price-pull.mjs > rakuten-prices.json
 */

const PROXY = 'https://smartinn-api-proxy.leoroy225.workers.dev/rakuten';
const HOTEL_NO = 130736;

// Probe over a window of dates to capture weekday/weekend variance
function dateRange(daysAhead) {
  const out = [];
  const today = new Date();
  for (let offset = 1; offset <= daysAhead; offset++) {
    const d = new Date(today.getTime() + offset * 86400000);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

async function fetchVacancy(checkin, adults) {
  const checkout = new Date(new Date(checkin).getTime() + 86400000).toISOString().slice(0, 10);
  const url = `${PROXY}/vacant?hotelNo=${HOTEL_NO}&checkinDate=${checkin}&checkoutDate=${checkout}&adultNum=${adults}&responseType=large`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const json = await res.json();
  return json;
}

// Classify Rakuten room/plan name into our 3 room types + 3 meal types
function classifyRoom(roomName) {
  const n = (roomName || '').toLowerCase();
  if (n.includes('triple') || n.includes('トリプル') || n.includes('3名')) return 'triple';
  if (n.includes('twin') || n.includes('ツイン')) return 'twin';
  if (n.includes('double') || n.includes('ダブル')) return 'double';
  return null;
}

function classifyMeal(plan) {
  const dinner = plan.withDinnerFlag === 1;
  const breakfast = plan.withBreakfastFlag === 1;
  if (dinner && breakfast) return 'choseki'; // 朝夕食付
  if (breakfast) return 'choshoku';            // 朝食付
  if (dinner) return 'dinnerOnly';             // 夕食付 (rare; map to choseki)
  return 'sutomari';                           // 素泊
}

const matrix = {
  double: { sutomari: [], choshoku: [], choseki: [] },
  twin:   { sutomari: [], choshoku: [], choseki: [] },
  triple: { sutomari: [], choshoku: [], choseki: [] },
};

const dates = dateRange(28); // probe next 4 weeks
console.error(`▌ probing ${dates.length} dates × 2 adults`);

for (const date of dates) {
  const v = await fetchVacancy(date, 2);
  if (!v || !v.hotels) {
    console.error(`  ${date}  no data`);
    continue;
  }
  const hotelArr = v.hotels[0];
  if (!hotelArr) continue;

  // hotelArr is [{hotelBasicInfo},{hotelDetailInfo},{hotelReserveInfo},{roomInfo:[{roomBasicInfo},{dailyCharge}]},…]
  // Iterate from index 3 onward — each entry is a {roomInfo} grouping
  let plans = 0;
  for (let i = 3; i < hotelArr.length; i++) {
    const ri = hotelArr[i] && hotelArr[i].roomInfo;
    if (!ri) continue;
    const base = (ri[0] || {}).roomBasicInfo;
    const charge = (ri[1] || {}).dailyCharge;
    if (!base || !charge) continue;

    const roomKey = classifyRoom(base.roomName);
    const mealKey = classifyMeal(base);
    if (!roomKey || !mealKey || mealKey === 'dinnerOnly') continue;

    matrix[roomKey][mealKey].push({
      date,
      total: charge.total,        // total for 2 adults / 1 night
      perPerson: charge.rakutenCharge,
      planId: base.planId,
      planName: base.planName,
      roomName: base.roomName,
    });
    plans++;
  }
  console.error(`  ${date}  ${plans} plan(s)`);
  await new Promise(r => setTimeout(r, 250)); // throttle
}

// Summary: min/median/max per cell
function stats(arr) {
  if (!arr.length) return null;
  const totals = arr.map(x => x.total).sort((a, b) => a - b);
  return {
    samples: totals.length,
    min: totals[0],
    median: totals[Math.floor(totals.length / 2)],
    max: totals[totals.length - 1],
    sample_plan: arr[0].planName,
  };
}

const summary = {};
for (const room of Object.keys(matrix)) {
  summary[room] = {};
  for (const meal of Object.keys(matrix[room])) {
    summary[room][meal] = stats(matrix[room][meal]);
  }
}

console.log(JSON.stringify({ matrix, summary }, null, 2));
console.error('\n▌ summary:');
console.error(JSON.stringify(summary, null, 2));
