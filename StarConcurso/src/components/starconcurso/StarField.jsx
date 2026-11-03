import { useEffect, useRef } from "react";

const TAU = Math.PI * 2;
const WHITE = "255,253,248";
const GOLD = "255,216,77";

function spawn(initial) {
  const d = 0.25 + Math.random() * 0.75; // profundidade: define tamanho, brilho e velocidade
  return {
    a: Math.random() * TAU,
    r: initial ? Math.sqrt(Math.random()) * 1.15 : Math.random() * 0.1,
    d,
    size: d > 0.85 ? 2 : d > 0.55 ? 1.4 : 1,
    phase: Math.random() * TAU,
    twinkle: 0.6 + Math.random() * 1.6,
    color: Math.random() < 0.16 ? GOLD : WHITE,
  };
}

/**
 * Campo de estrelas em <canvas>: uma única superfície em vez de dezenas de elementos DOM.
 * - `controlRef.current.velocity` (scroll) e `.burst` (salto final) controlam o "warp".
 * - Parallax suave com o ponteiro, estrelas cadentes ocasionais.
 * - Pausa com a aba oculta e respeita prefers-reduced-motion.
 */
export function StarField({ controlRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 700px)").matches;
    const stars = Array.from({ length: mobile ? 70 : 150 }, () => spawn(true));
    const maxDpr = mobile ? 1.5 : 2;

    let w = 0, h = 0, radius = 0;
    let warp = 0, mx = 0, my = 0, tx = 0, ty = 0;
    let raf = 0, last = 0;
    let shoot = null;
    let nextShoot = 3500 + Math.random() * 4000;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      radius = Math.hypot(w, h) / 2;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) draw(0, 0);
    };

    const draw = (now, dt) => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;

      for (const s of stars) {
        s.r += (0.003 + warp * 0.85) * s.d * dt;
        if (s.r > 1.2) Object.assign(s, spawn(false));

        const dist = s.r * radius;
        const cos = Math.cos(s.a), sin = Math.sin(s.a);
        const x = cx + cos * dist + mx * 28 * s.d;
        const y = cy + sin * dist + my * 28 * s.d;
        const tw = 0.7 + 0.3 * Math.sin(now * 0.001 * s.twinkle + s.phase);
        const alpha = Math.min(1, s.d * 0.9 * tw + warp * 0.3) * Math.min(1, s.r * 6);
        const trail = warp * s.d * dist * 0.22;

        ctx.globalAlpha = alpha;
        if (trail > 1.5) {
          ctx.strokeStyle = `rgb(${s.color})`;
          ctx.lineWidth = s.size;
          ctx.beginPath();
          ctx.moveTo(x - cos * trail, y - sin * trail);
          ctx.lineTo(x, y);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgb(${s.color})`;
          ctx.fillRect(x - s.size / 2, y - s.size / 2, s.size, s.size);
        }
      }
      ctx.globalAlpha = 1;

      if (shoot) {
        const k = shoot.life / shoot.max;
        const g = ctx.createLinearGradient(shoot.x, shoot.y, shoot.x - shoot.dx * 150, shoot.y - shoot.dy * 150);
        g.addColorStop(0, `rgba(${WHITE},${0.9 * (1 - k)})`);
        g.addColorStop(1, `rgba(${GOLD},0)`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(shoot.x, shoot.y);
        ctx.lineTo(shoot.x - shoot.dx * 150, shoot.y - shoot.dy * 150);
        ctx.stroke();
      }
    };

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;

      const ctl = controlRef?.current;
      let target = 0;
      if (ctl) {
        ctl.velocity *= 0.9; // decai sozinho quando o scroll para
        target = Math.min(1, Math.abs(ctl.velocity) / 45) + ctl.burst;
      }
      warp += (target - warp) * Math.min(1, dt * 7);
      mx += (tx - mx) * Math.min(1, dt * 3);
      my += (ty - my) * Math.min(1, dt * 3);

      nextShoot -= dt * 1000;
      if (!shoot && nextShoot <= 0 && warp < 0.25) {
        shoot = { x: w * (0.45 + Math.random() * 0.55), y: h * Math.random() * 0.4, dx: -0.86, dy: 0.5, life: 0, max: 0.75 };
        nextShoot = 6000 + Math.random() * 6000;
      }
      if (shoot) {
        shoot.x += shoot.dx * 950 * dt;
        shoot.y += shoot.dy * 950 * dt;
        shoot.life += dt;
        if (shoot.life >= shoot.max) shoot = null;
      }

      draw(now, dt);
    };

    const start = () => { last = performance.now(); raf = requestAnimationFrame(frame); };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) start();
    };
    const onPointer = (e) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    if (!reduce) {
      start();
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("pointermove", onPointer, { passive: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [controlRef]);

  return (
    <div className="star-field" aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="star-horizon" />
    </div>
  );
}
