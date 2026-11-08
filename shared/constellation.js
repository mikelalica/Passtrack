(function () {
  const c = document.getElementById('stars'); if (!c) return;
  const x = c.getContext('2d'), still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COL = ['#5b7de6', '#5b7de6', '#f5a623']; let W, H, P = [], run = false;
  function size() {
    const r = devicePixelRatio || 1; W = innerWidth; H = innerHeight;
    c.width = W * r; c.height = H * r; x.setTransform(r, 0, 0, r, 0, 0);
    P = Array.from({ length: Math.min(70, Math.round(W * H / 16000)) }, () => ({
      x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
      r: 1.5 + Math.random() * 2.5, c: COL[Math.floor(Math.random() * 3)] }));
  }
  function draw() {
    x.clearRect(0, 0, W, H);
    P.forEach((a, i) => {
      if (!still) { a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1; }
      for (let j = i + 1; j < P.length; j++) {
        const b = P[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 140) { x.strokeStyle = 'rgba(91,125,230,' + 0.3 * (1 - d / 140) + ')'; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke(); }
      }
      x.fillStyle = a.c; x.beginPath(); x.arc(a.x, a.y, a.r, 0, 7); x.fill();
    });
  }
  function loop() { draw(); if (!still && !document.hidden) requestAnimationFrame(loop); else run = false; }
  function start() { if (!run) { run = true; loop(); } }
  size(); start();
  addEventListener('resize', () => { size(); draw(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && !still) start(); });
})();
