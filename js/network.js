/* network.js — D3 force-directed graph + DNA helix generator */

(function () {
  const NODE_COLOR = "#f0f5ea";
  const NODE_FILL = "#0a2417";

  const PROVINCES = [
    { id: "KPK", tx: 638, ty: 185 },
    { id: "Punjab", tx: 642, ty: 379 },
    { id: "Balochistan", tx: 319, ty: 512 },
    { id: "Sindh", tx: 471, ty: 633 },
    { id: "Bengal", tx: 878, ty: 588 }
  ];

  const LINKS = [
    { s: "KPK", t: "Punjab", type: "rail" },
    { s: "KPK", t: "Balochistan", type: "road" },
    { s: "Punjab", t: "Balochistan", type: "road" },
    { s: "Punjab", t: "Sindh", type: "rail" },
    { s: "Balochistan", t: "Sindh", type: "road" },
    { s: "Sindh", t: "Bengal", type: "sea" },
    { s: "Punjab", t: "Bengal", type: "air" }
  ];

  let svg, linksSel, nodesSel;
  let trackPts = [], trackFracs = [], trackTween = null;
  let active = false, driftTimer = null;
  const REDUCED = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function driftTick(elapsed) {
    const nodes = nodesSel.data();
    nodes.forEach((d, i) => {
      d.dx = Math.sin(elapsed * 0.0011 + d.phase) * d.ampX;
      d.dy = Math.cos(elapsed * 0.0009 + d.phase * 1.3) * d.ampY;
    });
    linksSel
      .attr("x1", (d) => d.source.dx + d.source.tx)
      .attr("y1", (d) => d.source.dy + d.source.ty)
      .attr("x2", (d) => d.target.dx + d.target.tx)
      .attr("y2", (d) => d.target.dy + d.target.ty);
    nodesSel.attr("transform", (d) => `translate(${d.dx + d.tx},${d.dy + d.ty})`);
  }

  function setActive(on) {
    active = on;
    if (on && !driftTimer) driftTimer = d3.timer(driftTick);
    if (!on && driftTimer) { driftTimer.stop(); driftTimer = null; }
    if (!on) nodesSel.selectAll(".halo").interrupt().attr("opacity", 0);
  }

  function build() {
    svg = d3.select("#networkSvg");
    const W = 1000, H = 800;
    svg.attr("viewBox", `0 0 ${W} ${H}`).attr("class", "stage-network");

    const nodes = PROVINCES.map((p, i) => ({
      ...p,
      x: p.tx, y: p.ty,
      ampX: p.id === "Bengal" ? 5 : 3.2,
      ampY: p.id === "Bengal" ? 4 : 2.4,
      phase: i * 1.7
    }));

    const links = LINKS.map((l) => {
      const byId = {};
      nodes.forEach((n) => { byId[n.id] = n; });
      return {
        source: byId[l.s],
        target: byId[l.t],
        type: l.type
      };
    });

    // links layer
    linksSel = svg.append("g").selectAll("line")
      .data(links)
      .join("line")
      .attr("class", "net-link")
      .attr("stroke", (d) => d.type === "sea"
        ? "rgba(210,240,220,0.30)"
        : d.type === "air"
          ? "rgba(210,240,220,0.42)"
          : "rgba(210,240,220,0.62)")
      .attr("stroke-width", (d) => d.type === "air" ? 1 : 1.5)
      .attr("stroke-dasharray", (d) => (d.type === "air" ? "5 6" : null))
      .attr("opacity", 0);

    // nodes layer
    const g = svg.append("g").selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "net-node")
      .attr("opacity", 0);

    g.append("circle")
      .attr("r", 8)
      .attr("fill", NODE_FILL)
      .attr("stroke", NODE_COLOR)
      .attr("stroke-width", 1.8);

    g.append("circle")
      .attr("r", 14)
      .attr("fill", "none")
      .attr("stroke", "rgba(240,245,234,0.35)")
      .attr("stroke-width", 1)
      .attr("class", "halo");

    g.filter((d) => d.id === "Bengal")
      .append("text")
      .attr("x", -40)
      .attr("y", -16)
      .attr("class", "net-label bengal-label")
      .text("EAST WING · BENGAL");

    nodesSel = g;

    // Static home positions — the drift timer (started on show) refines these.
    linksSel
      .attr("x1", (d) => d.source.tx)
      .attr("y1", (d) => d.source.ty)
      .attr("x2", (d) => d.target.tx)
      .attr("y2", (d) => d.target.ty);
    nodesSel.attr("transform", (d) => `translate(${d.tx},${d.ty})`);

    buildTrack();
  }

  /* --- tracking animation: a probe sweeps the map, connecting the points --- */
  function buildTrack() {
    trackPts = [
      { id: "KPK", x: 638, y: 185 },
      { id: "Punjab", x: 642, y: 379 },
      { id: "Balochistan", x: 319, y: 512 },
      { id: "Sindh", x: 471, y: 633 }
    ];
    const d = trackPts.map((p, i) => (i ? "L" : "M") + p.x + " " + p.y).join(" ") + " Z";
    const g = svg.append("g").attr("class", "track").attr("opacity", 0);
    g.append("path").attr("class", "track-route").attr("d", d);
    g.append("path").attr("class", "track-head").attr("d", d);
    g.append("circle").attr("class", "track-pulse").attr("r", 4);
    g.append("g").attr("class", "track-pings");

    let cum = 0;
    const segs = trackPts.map((p, i) => {
      const q = trackPts[(i + 1) % trackPts.length];
      cum += Math.hypot(q.x - p.x, q.y - p.y);
      return cum;
    });
    trackFracs = trackPts.map((_, i) => (i ? segs[i - 1] : 0) / cum);
  }

  function firePing(g, x, y) {
    const c = g.append("circle")
      .attr("cx", x).attr("cy", y)
      .attr("r", 5)
      .attr("fill", "none")
      .attr("stroke", "#d4af37")
      .attr("stroke-width", 1.6)
      .attr("opacity", 0.9);
    c.transition()
      .duration(900)
      .attr("r", 26)
      .attr("opacity", 0)
      .on("end", function () { d3.select(this).remove(); });
  }

  function startTrack() {
    const g = svg.select(".track");
    if (g.empty() || trackTween) return;
    const route = g.select(".track-route").node();
    const head = g.select(".track-head").node();
    const pulse = g.select(".track-pulse").node();
    const pings = g.select(".track-pings");
    const L = route.getTotalLength();
    const HEAD = 90;

    g.attr("opacity", 1);
    d3.select(head).attr("stroke-dasharray", HEAD + " " + L).attr("opacity", 0);
    d3.select(pulse).attr("opacity", 0);

    gsap.to(head, { opacity: 1, duration: 0.35, delay: 0.7 });
    gsap.to(pulse, { opacity: 1, duration: 0.35, delay: 0.7 });

    if (REDUCED) return;

    const state = { idx: 0, prev: 0 };
    const proxy = { t: 0 };
    trackTween = gsap.to(proxy, {
      t: 1,
      duration: 6,
      ease: "none",
      repeat: -1,
      onUpdate: function () {
        const t = proxy.t;
        const pt = route.getPointAtLength(t * L);
        d3.select(pulse).attr("cx", pt.x).attr("cy", pt.y);
        d3.select(head).attr("stroke-dashoffset", t * L);
        for (let i = 1; i < trackPts.length; i++) {
          if (t >= trackFracs[i] && state.idx < i) {
            firePing(pings, trackPts[i].x, trackPts[i].y);
            state.idx = i;
          }
        }
        if (t < state.prev) state.idx = 0;
        state.prev = t;
      }
    });
  }

  function show() {
    window.Reconstruct = window.Reconstruct || {};
    window.Reconstruct.active = true;
    setActive(true);

    // staggered reveal: nodes pop in, links draw themselves
    nodesSel
      .transition()
      .delay((d, i) => i * 180)
      .duration(500)
      .attr("opacity", 1);

    linksSel.each(function (d) {
      const el = d3.select(this);
      if (d.type === "air") {
        el.transition().delay(600).duration(500).attr("opacity", 1);
        return;
      }
      const len = el.node().getTotalLength();
      el.attr("stroke-dasharray", len)
        .transition()
        .delay(600)
        .duration(900)
        .attr("stroke-dashoffset", 0)
        .attr("opacity", 1);
    });

    if (!REDUCED) {
      nodesSel.selectAll(".halo")
        .each(function () {
          const h = d3.select(this);
          h.attr("r", 10).attr("opacity", 0.8)
            .transition()
            .duration(2200)
            .attr("r", 34)
            .attr("opacity", 0)
            .on("end", function repeat() {
              if (!active) return;
              d3.select(this)
                .attr("r", 10).attr("opacity", 0.8)
                .transition()
                .duration(2200)
                .attr("r", 34)
                .attr("opacity", 0)
                .on("end", repeat);
            });
        });
    }

    nodesSel.selectAll(".net-label")
      .transition()
      .delay((d, i) => 900 + i * 200)
      .duration(600)
      .attr("opacity", 1);

    startTrack();
  }

  function buildDNA() {
    const svg = d3.select("#dnaSvg");
    const W = 200, H = 420, cx = 100, amp = 44;
    const yStart = 26, yEnd = 388;
    const step = 7;

    function strandPath(phase) {
      let d = "";
      for (let y = yStart; y <= yEnd; y += step) {
        const x = cx + amp * Math.sin(((y - yStart) / (yEnd - yStart)) * Math.PI * 5 + phase);
        d += (y === yStart ? "M" : " L") + x.toFixed(1) + " " + y.toFixed(1);
      }
      return d;
    }

    svg.append("path")
      .attr("class", "dna-strand")
      .attr("stroke-width", 3)
      .attr("fill", "none")
      .attr("stroke-linecap", "round")
      .attr("d", strandPath(0));

    svg.append("path")
      .attr("class", "dna-strand")
      .attr("stroke-width", 3)
      .attr("fill", "none")
      .attr("stroke-linecap", "round")
      .attr("stroke", "rgba(190,235,205,0.8)")
      .attr("d", strandPath(Math.PI));

    const rungStep = 26;
    svg.append("g")
      .selectAll("line")
      .data(d3.range(yStart + 8, yEnd, rungStep))
      .join("line")
      .attr("class", "dna-rung")
      .attr("stroke-width", 1)
      .each(function (y) {
        const x1 = cx + amp * Math.sin(((y - yStart) / (yEnd - yStart)) * Math.PI * 5);
        const x2 = cx + amp * Math.sin(((y - yStart) / (yEnd - yStart)) * Math.PI * 5 + Math.PI);
        d3.select(this)
          .attr("x1", x1).attr("y1", y)
          .attr("x2", x2).attr("y2", y)
          .attr("opacity", 0);
      });
  }

  window.Network = {
    init: build,
    show,
    setActive,
    buildDNA,
    W: 720,
    H: 560
  };
})();
