const puppeteer = require("puppeteer-core");
const path = require("path");
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const URL = "file:///" + path.join(__dirname, "..", "index.html").replace(/\\/g, "/");
const OUT = (label, name) => path.join(__dirname, `shot_${label}_${name}.png`);

async function run(vp, label) {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: "new",
    args: ["--no-first-run", "--disable-gpu"]
  });
  const page = await browser.newPage();
  await page.setViewport(vp);
  await page.goto(URL, { waitUntil: "load" });
  await sleep(2200);
  await page.keyboard.type("1947");
  await page.waitForFunction(() => document.getElementById("reconstructBtn").classList.contains("ready"), { timeout: 25000 });
  await sleep(1600);
  await page.screenshot({ path: OUT(label, "fragments") });
  await page.click("#reconstructBtn");
  await sleep(4500);
  await page.screenshot({ path: OUT(label, "track") });
  await browser.close();
  console.log(label, "done");
}

(async () => {
  await run({ width: 1280, height: 800 }, "1280");
  await run({ width: 390, height: 844 }, "390");
})().catch((e) => { console.error("FATAL", e); process.exit(1); });
