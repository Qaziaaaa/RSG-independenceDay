/* particles.js — floating paper-dust canvas (zero dependency) */
(function () {
  const canvas = document.getElementById("dust");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h, particles = [];
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    w = canvas.width = window.innerWidth * DPR;
    h = canvas.height = window.innerHeight * DPR;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
  }

  function make() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      r: (Math.random() * 1.6 + 0.3) * DPR,
      vx: (Math.random() - 0.5) * 0.16 * DPR,
      vy: -((Math.random() * 0.24 + 0.06) * DPR),
      a: Math.random() * Math.PI * 2,
      tw: Math.random() * Math.PI * 2,
      gold: Math.random() < 0.35
    };
  }

  const COUNT = Math.min(Math.round((w * h) / 16000), 110);

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, make);
  }

  let intensity = 1;

  function loop() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.x += p.vx * intensity;
      p.y += p.vy * intensity;
      p.tw += 0.02;
      if (p.y < -6) { p.y = h + 6; p.x = Math.random() * w; }
      if (p.x < -6) p.x = w + 6;
      if (p.x > w + 6) p.x = -6;

      const alpha = (0.14 + 0.3 * (0.5 + 0.5 * Math.sin(p.tw))) * intensity;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? `rgba(240, 245, 234, ${alpha})`
        : `rgba(127, 214, 160, ${alpha * 0.7})`;
      ctx.fill();
    }
    requestAnimationFrame(loop);
  }

  window.Dust = {
    init,
    setIntensity: (v) => { intensity = v; }
  };

  window.addEventListener("resize", () => { resize(); });

  init();
  loop();
})();
