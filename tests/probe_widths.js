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
  await page.goto(URL, { waitUntil: "load" });
  await sleep(2000);
  await page.keyboard.type("1947");
  await page.waitForFunction(() => document.getElementById("reconstructBtn").classList.contains("ready"), { timeout: 25000 });
  await sleep(1500);
  const frag = await page.evaluate(() => {
    const field = document.querySelector(".fragments-field").getBoundingClientRect();
    const kinds = Array.from(document.querySelectorAll(".fragment")).map((f) => {
      const r = f.getBoundingClientRect();
      return { kind: f.className.replace("fragment fragment--", ""), w: Math.round(r.width), h: Math.round(r.height), t: Math.round(r.top), l: Math.round(r.left), b: Math.round(r.bottom) };
    });
    const overlap = [];
    for (let i = 0; i < kinds.length; i++) for (let j = i + 1; j < kinds.length; j++) {
      const a = kinds[i], b = kinds[j];
      if (a.l < b.l + b.w && a.l + a.w > b.l && a.t < b.b && a.b > b.t) overlap.push(a.kind + " x " + b.kind);
    }
    return {
      field: { w: Math.round(field.width), h: Math.round(field.height), top: Math.round(field.top) },
      kinds, overlap,
      outOfField: kinds.filter((k) => k.l < field.left - 16 || k.l + k.w > field.right + 16 || k.t < field.top - 16 || k.b > field.bottom + 16).map((k) => k.kind),
      overflowX: document.body.scrollWidth > innerWidth
    };
  });
  console.log(JSON.stringify(vp), "fragments:", JSON.stringify(frag), "errors:", errors.length ? errors.join("|") : "none");
  await browser.close();
}

(async () => {
  await run({ width: 768, height: 1024 });
  await run({ width: 900, height: 800 });
  await run({ width: 861, height: 800 });
})().catch((e) => { console.error("FATAL", e); process.exit(1); });
