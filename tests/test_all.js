const puppeteer = require("puppeteer-core");
const path = require("path");
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const URL = "file:///" + path.join(__dirname, "..", "index.html").replace(/\\/g, "/");

async function run(vp) {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: "new",
    args: ["--no-first-run", "--disable-gpu"]
  });
  const page = await browser.newPage();
  await page.setViewport(vp);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(URL, { waitUntil: "load" });
  await sleep(2200);

  /* --- lock: unlock and check shackle clip + layout fit --- */
  await page.keyboard.type("1947");
  await sleep(2500);
  const lock = await page.evaluate(() => {
    const rect = (sel) => { const b = document.querySelector(sel).getBoundingClientRect(); return { l: Math.round(b.left), t: Math.round(b.top), r: Math.round(b.right), b: Math.round(b.bottom) }; };
    const shackle = rect("#shackle");
    const svg = rect("#lockSvg svg");
    const wrap = rect(".lock-wrap");
    const ov = getComputedStyle(document.querySelector("#lockSvg svg")).overflow;
    return { shackle, svg, wrap, svgOverflow: ov, lockActive: document.getElementById("lock").classList.contains("is-active"),
      shackleCut: shackle.t < svg.t, shackleBeyondSvg: shackle.t < svg.t || shackle.b > svg.b };
  });

  /* --- fragments: scattered broken pieces, varied sizes, no overlap, within field --- */
  await page.waitForFunction(() => document.getElementById("reconstructBtn").classList.contains("ready"), { timeout: 25000 });
  await sleep(1500);
  const frag = await page.evaluate(() => {
    const field = document.querySelector(".fragments-field").getBoundingClientRect();
    const kinds = Array.from(document.querySelectorAll(".fragment")).map((f) => {
      const r = f.getBoundingClientRect();
      return { kind: f.className.replace("fragment fragment--", ""), w: Math.round(r.width), h: Math.round(r.height), t: Math.round(r.top), l: Math.round(r.left), op: getComputedStyle(f).opacity };
    });
    const overlap = [];
    for (let i = 0; i < kinds.length; i++) for (let j = i + 1; j < kinds.length; j++) {
      const a = kinds[i], b = kinds[j];
      if (a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t) overlap.push(a.kind + " x " + b.kind);
    }
    const outOfField = kinds.filter((k) => k.l < field.left - 16 || k.r > field.right + 16 || k.t < field.top - 16 || k.b > field.bottom + 16).map((k) => k.kind);
    return {
      fieldDisplay: getComputedStyle(document.querySelector(".fragments-field")).display,
      field: { w: Math.round(field.width), h: Math.round(field.height) },
      kinds, overlap, outOfField,
      distinctWidths: new Set(kinds.map((k) => k.w)).size,
      distinctTops: new Set(kinds.map((k) => k.t)).size,
      hasWords: !!document.querySelector(".quote .word")
    };
  });
  await page.click("#reconstructBtn");

  /* --- flag assembly: poll the sequence — shards converge, crescent fills, then it hands off --- */
  const flag = { samples: [] };
  for (let i = 0; i < 14; i++) {
    await sleep(400);
    const s = await page.evaluate(() => {
      const f = document.getElementById("reconFlag");
      if (!f) return null;
      const sh = document.querySelector("#reconFlag .shard");
      return {
        flagOp: getComputedStyle(f).opacity,
        shardOp: sh ? getComputedStyle(sh).opacity : null,
        cresFill: getComputedStyle(document.getElementById("reconCrescent")).fillOpacity
      };
    });
    flag.samples.push(s);
  }
  const sawAssembled = flag.samples.some((s) => s && s.flagOp === "1" && s.shardOp === "1" && parseFloat(s.cresFill) > 0.9);
  const sawGone = flag.samples.some((s) => s && s.flagOp === "0");
  flag.ok = !!(sawAssembled && sawGone);

  /* --- ending: word integrity, caption, replay button, overflow --- */
  await page.waitForFunction(() => document.getElementById("restartBtn").classList.contains("ready"), { timeout: 30000 });
  await sleep(1000);
  const end = await page.evaluate(() => {
    const el = document.querySelector(".end-quote");
    const word = Array.from(el.querySelectorAll(".word")).find((w) => w.textContent.includes("village"));
    const villageChars = Array.from(word.querySelectorAll(".char")).map((c) => { const r = c.getBoundingClientRect(); return { ch: c.textContent, t: Math.round(r.top) }; });
    const sameLine = villageChars.every((c) => Math.abs(c.t - villageChars[0].t) < 2);
    const wordNowrap = getComputedStyle(word).whiteSpace;
    return {
      villageSameLine: sameLine,
      villageChars: villageChars.map((c) => c.ch).join(""),
      wordNowrap,
      caption: document.querySelector(".flag-caption").textContent,
      restartReady: document.getElementById("restartBtn").classList.contains("ready"),
      restartOpacity: getComputedStyle(document.getElementById("restartBtn")).opacity,
      overflowX: document.body.scrollWidth > innerWidth,
      bodyW: document.body.scrollWidth,
      endingActive: document.getElementById("ending").classList.contains("is-active")
    };
  });

  /* --- map tracking: probe sweeps the route, head + pulse live, position moves --- */
  const trackSample = async () => page.evaluate(() => {
    const q = (s) => document.querySelector("#networkSvg " + s);
    const p = q(".track-pulse");
    const h = q(".track-head");
    return p && h
      ? { cx: p.getAttribute("cx"), cy: p.getAttribute("cy"), headOp: getComputedStyle(h).opacity, route: !!q(".track-route"), trackOp: getComputedStyle(q(".track")).opacity }
      : null;
  });
  const tr1 = await trackSample();
  await sleep(450);
  const tr2 = await trackSample();
  const track = tr1 && tr2
    ? { ...tr1, moved: tr1.cx !== tr2.cx || tr1.cy !== tr2.cy }
    : { missing: true };

  /* --- replay: click, expect flash then back to lock --- */
  await page.click("#restartBtn");
  await sleep(250);
  const during = await page.evaluate(() => ({ flash: getComputedStyle(document.getElementById("flashOverlay")).opacity }));
  await page.waitForFunction(() => document.getElementById("lock").classList.contains("is-active"), { timeout: 20000 }).catch(() => {});
  const after = await page.evaluate(() => ({ lockActive: document.getElementById("lock").classList.contains("is-active") }));

  console.log(JSON.stringify(vp));
  console.log("lock:", JSON.stringify(lock));
  console.log("fragments:", JSON.stringify(frag));
  console.log("flag:", JSON.stringify({ ok: flag.ok, assembled: flag.samples.filter((s) => s && s.flagOp === "1").length, peakFill: Math.max(...flag.samples.map((s) => s ? parseFloat(s.cresFill) : 0)) }));
  console.log("ending:", JSON.stringify(end));
  console.log("track:", JSON.stringify(track));
  console.log("replay during:", JSON.stringify(during), "after:", JSON.stringify(after));
  console.log("errors:", errors.length ? errors.join(" | ") : "none");
  await browser.close();
}

(async () => {
  await run({ width: 1280, height: 800 });
  await run({ width: 390, height: 844 });
})().catch((e) => { console.error("FATAL", e); process.exit(1); });
