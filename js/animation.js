/* animation.js — GSAP timelines, SplitType text, scene orchestration */

(function () {
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const splitMap = {};

  function splitText(el) {
    if (!window.SplitType) return null;
    try {
      const st = new SplitType(el, { types: "words,chars" });
      return st.chars || null;
    } catch (e) {
      return null;
    }
  }

  /* ---------------- LOCK ---------------- */
  function lockIntro() {
    const tl = gsap.timeline({ delay: 0.25 });
    tl.from(".lock-svg", { y: 30, opacity: 0, duration: 1.3, ease: "power3.out" })
      .from(".lock-label", { opacity: 0, y: 14, duration: 0.8, ease: "power2.out" }, "-=0.8")
      .from(".slot", { opacity: 0, y: 20, duration: 0.55, stagger: 0.09, ease: "back.out(2)" }, "-=0.6")
      .from(".lock-hint", { opacity: 0, duration: 0.9 }, "-=0.4")
      .from(".lock-brand", { opacity: 0, duration: 0.9 }, "-=0.5");

    gsap.to(".lock-svg", {
      rotation: 1.1,
      yoyo: true,
      repeat: -1,
      duration: 3.4,
      ease: "sine.inOut",
      transformOrigin: "50% 100%"
    });
  }

  function unlock(onComplete) {
    gsap.killTweensOf(".lock-svg");
    const tl = gsap.timeline();
    tl.to(".lock-wrap", { x: -7, duration: 0.05, yoyo: true, repeat: 5 })
      .to(".lock-wrap", { x: 0, duration: 0.1 })
      .add(() => {
        gsap.to(".key-glow", { opacity: 1, duration: 0.5, ease: "power2.out" });
        gsap.to("#shackle", {
          rotation: 34,
          transformOrigin: "100px 20px",
          duration: 0.55,
          ease: "power2.out",
          delay: 0.15
        });
        gsap.to("#lockBody", { y: 8, duration: 0.55, ease: "power2.in", delay: 0.15 });
        gsap.to(".lock-label", { color: "#d4af37", duration: 0.5, delay: 0.2 });
      })
      .to({}, { duration: 0.7 })
      .add(flash)
      .add(() => { if (onComplete) onComplete(); });
  }

  function flash() {
    const el = document.getElementById("flashOverlay");
    if (!el) return;
    gsap.fromTo(el,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: "power2.out" });
    gsap.to(el, { opacity: 0, duration: 1.1, ease: "power2.inOut", delay: 0.35 });
  }

  /* ---------------- FRAGMENTS ---------------- */
  function fragmentsIn() {
    const rand = gsap.utils.random;
    gsap.fromTo(".fragment",
      {
        opacity: 0,
        x: () => rand(-70, 70),
        y: () => rand(70, 130),
        scale: 0.82,
        rotation: () => rand(-9, 9)
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 1.15,
        stagger: 0.11,
        ease: "power3.out",
        delay: 0.15
      });
  }

  function revealQuote(key) {
    const chars = splitMap[key];
    const el = document.querySelector(`[data-split="${key}"]`);
    if (!el) return;
    gsap.to(el, { opacity: 1, duration: 0.5 });
    if (chars && chars.length) {
      gsap.fromTo(chars,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.022, ease: "power2.out" });
    } else {
      gsap.to(el, { opacity: 1, duration: 0.7 });
    }
  }

  function showFragmentsMessage() {
    revealQuote("msg1");
    gsap.to("#fragmentsMessage .frag-rule", { opacity: 1, duration: 0.6, delay: 0.12 });
    gsap.to("#reconstructBtn", {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power3.out",
      delay: 0.6,
      onComplete: () => document.getElementById("reconstructBtn").classList.add("ready")
    });
  }

  function reconstruct(onComplete) {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const els = Array.from(document.querySelectorAll(".fragment"));

    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      const dx = cx - (r.left + r.width / 2);
      const dy = cy - (r.top + r.height / 2);
      gsap.to(el, {
        x: `+=${dx}`,
        y: `+=${dy}`,
        rotation: () => gsap.utils.random(180, 320),
        scale: 0.3,
        opacity: 0,
        duration: 0.75,
        ease: "power2.in",
        delay: 0.1
      });
    });

    gsap.to("#fragments .quote", { opacity: 0, duration: 0.5, delay: 0.1 });
    gsap.to("#reconstructBtn", { opacity: 0, duration: 0.4, delay: 0.1 });

    gsap.delayedCall(0.75, () => {
      flash();
      gsap.delayedCall(0.3, () => {
        if (onComplete) onComplete();
      });
    });
  }

  /* ---------------- FLAG ASSEMBLY ---------------- */
  function flagAssembly(onComplete) {
    const shards = Array.from(document.querySelectorAll("#reconFlag .shard"));
    const cres = document.getElementById("reconCrescent");
    const star = document.getElementById("reconStar");
    const done = () => { if (onComplete) onComplete(); };
    if (!shards.length || !cres || !star) { done(); return; }

    if (REDUCED) {
      gsap.set(shards, { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1 });
      gsap.set([cres, star], { attr: { fill: "#ffffff", "fill-opacity": 1, stroke: "none" } });
      gsap.set("#reconFlag", { opacity: 1 });
      gsap.delayedCall(0.01, done);
      return;
    }

    const rand = gsap.utils.random;
    gsap.set(shards, {
      opacity: 0,
      x: () => rand(-230, 230),
      y: () => rand(-130, 130),
      rotation: () => rand(-32, 32),
      scale: () => rand(0.5, 1.25),
      transformOrigin: "50% 50%"
    });
    gsap.set("#reconFlag", { opacity: 1, scale: 0.6, transformOrigin: "50% 50%" });
    gsap.set([cres, star], {
      attr: { fill: "#ffffff", "fill-opacity": 0, stroke: "#ffffff", "stroke-width": 2.5, "stroke-dasharray": 1, "stroke-dashoffset": 1 }
    });

    const tl = gsap.timeline();
    tl.to("#reconFlag", { scale: 1, duration: 0.65, ease: "power3.out" }, 0)
      .to(shards, { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 0.7, stagger: 0.04, ease: "power3.out" }, 0)
      .to(cres, { attr: { "stroke-dashoffset": 0 }, duration: 0.5, ease: "power1.inOut" }, "+=0.1")
      .to(cres, { attr: { "fill-opacity": 1 }, duration: 0.3, ease: "power2.out" }, "-=0.12")
      .to(cres, { attr: { "stroke-width": 0 }, duration: 0.2 }, "<")
      .to(star, { attr: { "stroke-dashoffset": 0 }, duration: 0.4, ease: "power1.inOut" }, "+=0.08")
      .to(star, { attr: { "fill-opacity": 1 }, duration: 0.28, ease: "power2.out" }, "-=0.12")
      .to(star, { attr: { "stroke-width": 0 }, duration: 0.2 }, "<")
      .to("#reconFlag", { opacity: 0, duration: 0.4, ease: "power1.inOut", onComplete: done });
  }

  /* ---------------- RECONSTRUCTION ---------------- */
  function reconstruction(onComplete) {
    const tl = gsap.timeline();

    tl.set("#recFlash", { opacity: 1, scale: 0.4 }, 0)
      .to("#recFlash", { opacity: 0, scale: 3.2, duration: 0.85, ease: "power2.out" }, 0)
      .to("#mapSvg", { opacity: 1, duration: 0.8, ease: "power2.out" }, 0.15)
      .fromTo(".prov-line",
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 1.5, stagger: 0.09, ease: "power1.inOut" }, 0.3)
      .to(".prov-fill",
        { opacity: 1, duration: 1.2, ease: "power1.inOut", stagger: 0.06 }, 1.6)
      .call(() => window.Network.show(), null, 2.0)
      .to("#networkSvg", { opacity: 1, duration: 0.7, ease: "power2.out" }, 2.0)
      .to("#dnaSvg", { opacity: 1, duration: 0.7, ease: "power2.out" }, 2.6)
      .call(() => animateDNA(), null, 2.8)
      .to(".map-label", { opacity: 1, duration: 0.5, stagger: 0.06, ease: "power2.out" }, 3.4)
      .to("#mapLabel", { opacity: 1, duration: 0.5, ease: "power2.out" }, 3.7)
      .to("#dnaLabel", { opacity: 1, duration: 0.5, ease: "power2.out" }, 3.85)
      .call(() => revealQuote("msg2"), null, 4.1);

    gsap.delayedCall(8.5, () => {
      if (onComplete) onComplete();
    });
  }

  function animateDNA() {
    const strands = document.querySelectorAll("#dnaSvg .dna-strand");
    strands.forEach((s) => {
      const len = s.getTotalLength();
      gsap.fromTo(s,
        { strokeDasharray: len, strokeDashoffset: len },
        { strokeDashoffset: 0, duration: 1.8, delay: 0.25, ease: "power2.inOut" });
    });

    const rungs = Array.from(document.querySelectorAll("#dnaSvg .dna-rung")).map((el) => ({
      el,
      x1: parseFloat(el.getAttribute("x1")),
      x2: parseFloat(el.getAttribute("x2"))
    }));

    rungs.forEach((r, i) => {
      gsap.fromTo(r.el,
        { attr: { x1: 100, x2: 100 }, opacity: 0 },
        {
          attr: { x1: r.x1, x2: r.x2 },
          opacity: 1,
          duration: 0.55,
          ease: "power1.inOut",
          delay: 0.35 + i * 0.045
        });
    });
  }

  /* ---------------- ENDING ---------------- */
  function waveFlag() {
    if (REDUCED) return;
    gsap.to(".flag-cloth", {
      skewX: 3.2, rotation: 0.8, y: 1.5,
      duration: 1.7, yoyo: true, repeat: -1, ease: "sine.inOut"
    });
    gsap.to("#flagRig", {
      rotation: 0.4, duration: 2.1, yoyo: true, repeat: -1, ease: "sine.inOut",
      transformOrigin: "50% 100%"
    });
  }

  function ending() {
    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo(".ghost-path",
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 1.9, stagger: 0.1, ease: "power1.inOut" }, 0)
      .to(".end-map-ghost", { opacity: 1, duration: 1.1, ease: "power1.inOut" }, 0)
      .to(".end-map-ghost", { opacity: 0, duration: 1.3, ease: "power1.inOut" }, 2.2)
      .to(".end-cs", { opacity: 0.08, duration: 1.4, ease: "power1.inOut" }, 0)
      .fromTo(".end-divider", { width: 0, opacity: 0 }, { width: 72, opacity: 1, duration: 1.0, stagger: 0.2, ease: "power3.out" }, 0.5)
      .call(() => revealQuote("msg3"), null, 1.0)
      .to(".end-foot", { opacity: 1, duration: 0.7, ease: "power2.out" }, 2.0)
      /* flag hoist */
      .to("#flagRig", { opacity: 1, duration: 0.8, ease: "power2.out" }, 0.2)
      .fromTo(".flag-cloth",
        { y: 165, scaleY: 0.06, skewX: -12, transformOrigin: "50% 0%" },
        { y: 0, scaleY: 1, skewX: 0, duration: 1.9, ease: "power3.out", onComplete: waveFlag }, 0.4)
      .to(".flag-mark", { opacity: 1, duration: 0.8, ease: "power2.out" }, 1.6)
      .to(".flag-caption", { opacity: 1, duration: 0.6, ease: "power2.out" }, 2.1)
      .to("#restartBtn", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 2.6)
      .add(() => document.getElementById("restartBtn").classList.add("ready"), 2.6);
  }

  /* ---------------- PUBLIC ---------------- */
  function init() {
    if (REDUCED) gsap.globalTimeline.timeScale(8);

    // pre-split quotes and hold them hidden
    document.querySelectorAll(".split-me").forEach((el) => {
      const key = el.dataset.split;
      const chars = splitText(el);
      splitMap[key] = chars;
      if (chars && chars.length) {
        gsap.set(chars, { opacity: 0, y: 14 });
      } else {
        gsap.set(el, { opacity: 0 });
      }
    });

    window.Network.init();
    window.Network.buildDNA();

    lockIntro();
  }

  window.Anim = {
    init,
    unlock,
    fragmentsIn,
    showFragmentsMessage,
    reconstruct,
    flagAssembly,
    reconstruction,
    ending
  };
})();
