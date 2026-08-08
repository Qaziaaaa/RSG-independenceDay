/* particles.js — floating paper-dust canvas (zero dependency) */
(function () {
  const canvas = document.getElementById("dust");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w, h, particles = [], rafId = null;
  const DPR = Math.min(window.devicePixelRatio || 1, 1.5);

  function countFor() {
    return Math.min(Math.round((w * h) / 26000), REDUCED ? 24 : 72);
  }

  function resize() {
    w = canvas.width = window.innerWidth * DPR;
    h = canvas.height = window.innerHeight * DPR;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    if (particles.length !== countFor()) particles = Array.from({ length: countFor() }, make);
  }

  function make() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: (Math.random() * 1.5 + 0.3) * DPR,
      vx: REDUCED ? 0 : (Math.random() - 0.5) * 0.16 * DPR,
      vy: REDUCED ? 0 : -((Math.random() * 0.24 + 0.06) * DPR),
      tw: Math.random() * Math.PI * 2,
      gold: Math.random() < 0.35
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: countFor() }, make);
  }

  let intensity = 1;
  let visible = !document.hidden;

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.x += p.vx * intensity;
      p.y += p.vy * intensity;
      p.tw += 0.02;
      if (p.y < -6) { p.y = h + 6; p.x = Math.random() * w; }
      if (p.x < -6) p.x = w + 6;
      if (p.x > w + 6) p.x = -6;

      const alpha = (0.1 + 0.22 * (0.5 + 0.5 * Math.sin(p.tw))) * intensity;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? `rgba(240, 245, 234, ${alpha})`
        : `rgba(127, 214, 160, ${alpha * 0.7})`;
      ctx.fill();
    }
  }

  function loop() {
    if (visible && w > 0 && h > 0) draw();
    rafId = requestAnimationFrame(loop);
  }

  function pause() { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }
  function play() { if (!rafId) rafId = requestAnimationFrame(loop); }

  document.addEventListener("visibilitychange", () => {
    visible = !document.hidden;
    if (visible) play(); else pause();
  });

  window.Dust = {
    init,
    setIntensity: (v) => { intensity = v; }
  };

  window.addEventListener("resize", () => { resize(); });

  init();
  play();
})();
