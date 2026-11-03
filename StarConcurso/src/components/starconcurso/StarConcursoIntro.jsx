import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { BrandReveal } from "./BrandReveal";
import { MascotGuide } from "./MascotGuide";
import { StarField } from "./StarField";
import { StudyOrbit } from "./StudyOrbit";

// A partir deste progresso do scroll a cena final está visível e o botão fica clicável.
const READY_PROGRESS = 0.94;

// Cenas mostradas no indicador do topo e o instante (na timeline) em que cada uma começa.
const SCENES = ["Origem", "Direção", "Preparo", "Chegada"];
const SCENE_STARTS = [0, 0.95, 2.6, 4.5];

export function StarConcursoIntro() {
  const rootRef = useRef(null);
  const fillRef = useRef(null);
  const indexRef = useRef(null);
  const nameRef = useRef(null);
  const spotRef = useRef(null);
  const control = useRef({ velocity: 0, burst: 0 }); // lido pelo campo de estrelas
  const engine = useRef(null); // { gsap, context, lenis } depois que as libs carregam
  const leaving = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.remove("is-loading");
      root.classList.add("is-ready");
      return;
    }

    const small = window.matchMedia("(max-width: 700px)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    // `cancelled` evita o vazamento causado pelo StrictMode/desmontagem:
    // o cleanup pode rodar antes de os imports assíncronos terminarem.
    let cancelled = false;
    let teardown = null;
    const teardownExtras = [];

    // Espera a fonte para o texto não "pular" no meio da animação (com limite de tempo).
    const fontsReady = Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((resolve) => setTimeout(resolve, 1200)),
    ]);

    Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("lenis"), fontsReady])
      .then(([gsapModule, scrollModule, lenisModule]) => {
        if (cancelled) return;
        const gsap = gsapModule.default;
        const { ScrollTrigger } = scrollModule;
        const Lenis = lenisModule.default;
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.config({ ignoreMobileResize: true }); // barra de endereço do celular não reinicia a cena

        // Uma única suavização: o Lenis suaviza a rolagem e o scrub acompanha sem atraso extra.
        const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false });
        const onScroll = (e) => {
          ScrollTrigger.update();
          control.current.velocity = e.velocity;
        };
        lenis.on("scroll", onScroll);
        const tick = (time) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        let total = 5.8;
        let currentScene = 0;

        const context = gsap.context(() => {
          // Entrada (por tempo): marca, letras e legenda.
          gsap
            .timeline({ defaults: { ease: "power3.out" }, delay: 0.1 })
            .fromTo(".brand-mark", { scale: 0.4, opacity: 0, rotate: -40 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.9 })
            .fromTo(".brand-letter", { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.045, ease: "power4.out" }, 0.2)
            .fromTo(".brand-kicker", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 0.85);

          // Luz que acompanha o cursor (só com mouse).
          if (finePointer && spotRef.current) {
            gsap.set(spotRef.current, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
            const moveX = gsap.quickTo(spotRef.current, "x", { duration: 0.7, ease: "power3" });
            const moveY = gsap.quickTo(spotRef.current, "y", { duration: 0.7, ease: "power3" });
            const onMove = (e) => { moveX(e.clientX); moveY(e.clientY); };
            window.addEventListener("pointermove", onMove, { passive: true });
            teardownExtras.push(() => window.removeEventListener("pointermove", onMove));
          }

          // Cena guiada pelo scroll. Só transform/opacity: nada de blur em camadas grandes.
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
              onUpdate: (self) => {
                const p = self.progress;
                root.classList.toggle("is-ready", p >= READY_PROGRESS);
                if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;

                const t = p * total;
                const scene = SCENE_STARTS.reduce((acc, start, i) => (t >= start ? i : acc), 0);
                if (scene !== currentScene) {
                  currentScene = scene;
                  if (indexRef.current) indexRef.current.textContent = `0${scene + 1}`;
                  if (nameRef.current) nameRef.current.textContent = SCENES[scene];
                }
              },
            },
          });

          const exit = (target, to, at) =>
            tl.fromTo(target, { scale: 1, opacity: 1, xPercent: 0, yPercent: 0 }, { ...to, immediateRender: false }, at);

          tl.to(".scroll-cue", { opacity: 0, y: 10, duration: 0.3 }, 0);
          exit(".brand-scene", { scale: 1.45, opacity: 0, duration: 0.9, ease: "power2.in" }, 0.2);

          // Manifesto
          tl.set(".manifest-scene", { visibility: "visible" }, 0.95)
            .fromTo(".manifest-index", { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }, 0.98)
            .fromTo(".manifest-line span", { yPercent: 115, rotate: 2 }, { yPercent: 0, rotate: 0, stagger: 0.12, duration: 0.7, ease: "power3.out" }, 1.0)
            .fromTo(".manifest-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.out" }, 1.55)
            .fromTo(".manifest-meta", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, 1.8);
          exit(".manifest-scene", { scale: 1.3, opacity: 0, duration: 0.8, ease: "power2.in" }, 2.5);

          // Órbita de estudo
          tl.fromTo(".study-orbit", { scale: 0.5, opacity: 0, rotate: -6 }, { scale: 1, opacity: 1, rotate: 0, duration: 1.0, ease: "power3.out" }, 2.7)
            .fromTo(".orbit-core", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.8)" }, 2.9)
            .fromTo(".study-node", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, stagger: 0.1, duration: 0.5, ease: "back.out(1.6)" }, 3.0)
            .fromTo(".progress-trace i", { scaleY: 0 }, { scaleY: 1, stagger: 0.08, duration: 0.5, ease: "power2.out" }, 3.25)
            .fromTo(".intro-mascot-wrap", { xPercent: 35, yPercent: 15, opacity: 0, scale: 0.72 }, { xPercent: 0, yPercent: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" }, 3.3)
            .fromTo(".mascot-message", { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }, 3.75);
          exit(".study-orbit", { scale: 2.2, opacity: 0, duration: 1.0, ease: "power2.in" }, 4.45);
          exit(".intro-mascot-wrap", { xPercent: -18, yPercent: -10, scale: 1.18, opacity: 0, duration: 0.8, ease: "power2.in" }, 4.5);

          // Chegada
          tl.fromTo(".portal-line", { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.out" }, 4.6)
            .fromTo(".portal-glow", { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.0, ease: "power2.out" }, 4.6)
            .fromTo(".arrival-copy", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 4.85)
            .fromTo(
              ".arrival-icon, .arrival-eyebrow, .arrival-title, .arrival-rule, .arrival-cta",
              { y: 32, opacity: 0 },
              { y: 0, opacity: 1, stagger: 0.09, duration: 0.6, ease: "power3.out" },
              4.85,
            )
            .to(".star-field", { opacity: 0.55, duration: 5.8 }, 0);

          total = tl.duration();
        }, root);

        root.classList.remove("is-loading");
        engine.current = { gsap, context, lenis };

        teardown = () => {
          engine.current = null;
          teardownExtras.forEach((fn) => fn());
          context.revert();
          gsap.ticker.remove(tick);
          gsap.ticker.lagSmoothing(500, 33);
          lenis.off("scroll", onScroll);
          lenis.destroy();
          ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
      })
      .catch(() => {
        // Se as bibliotecas de animação falharem, mostra a versão estática: o acesso à Home nunca fica bloqueado.
        if (cancelled) return;
        root.classList.remove("is-loading");
        root.classList.add("is-ready", "is-static");
      });

    return () => {
      cancelled = true;
      teardown?.();
      root.classList.remove("is-ready");
    };
  }, []);

  // Saída: as estrelas viram "dobra espacial", a cena some e a tela clareia até a Home.
  // Cliques repetidos não empilham entradas no histórico.
  const start = () => {
    if (leaving.current) return;
    leaving.current = true;

    const api = engine.current;
    if (!api) {
      navigate("/home");
      return;
    }

    api.lenis.stop();
    api.context.add(() => {
      api.gsap
        .timeline({ onComplete: () => navigate("/home") })
        .to(control.current, { burst: 1.4, duration: 0.75, ease: "power2.in" }, 0)
        .to(".arrival-copy", { scale: 0.92, opacity: 0, duration: 0.4, ease: "power2.in" }, 0)
        .to(".intro-flash", { opacity: 1, duration: 0.4, ease: "power1.in" }, 0.4);
    });
  };

  return (
    <main className="intro-page">
      <Link to="/home" className="intro-skip">Pular introdução</Link>
      <section ref={rootRef} className="intro-scroll is-loading" aria-label="Introdução StarConcurso">
        <div className="intro-sticky">
          <StarField controlRef={control} />
          <div ref={spotRef} className="intro-spotlight" aria-hidden="true" />
          <div className="cinema-noise" aria-hidden="true" />
          <BrandReveal />

          <section className="manifest-scene scene-layer" aria-hidden="true">
            <p className="manifest-index">01 — A jornada</p>
            <div className="manifest-line"><span>Conhecimento</span></div>
            <div className="manifest-line accent-line"><span>vira direção.</span></div>
            <i className="manifest-rule" />
            <p className="manifest-meta">Cada questão. Cada avanço. Cada conquista.</p>
          </section>

          <section className="journey-scene scene-layer" aria-label="Jornada de preparação">
            <StudyOrbit />
            <MascotGuide />
          </section>

          <section className="arrival-scene scene-layer">
            <div className="portal-glow" aria-hidden="true" />
            <div className="portal-line" aria-hidden="true" />
            <div className="arrival-copy">
              <span className="arrival-icon" aria-hidden="true"><Sparkles size={18} /></span>
              <p className="arrival-eyebrow">Você entrou no universo</p>
              <h2 className="arrival-title">StarConcurso</h2>
              <div className="arrival-rule" aria-hidden="true"><i /><span>Prepare-se para evoluir</span><i /></div>
              <div className="arrival-cta">
                <button className="intro-start-button" type="button" onClick={start}>
                  Começar sua jornada <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </section>

          <div className="intro-flash" aria-hidden="true" />

          <div className="scroll-cue" aria-hidden="true">
            <span className="cue-mouse" /><span>Role para iniciar</span>
          </div>
          <div className="scene-counter" aria-hidden="true">
            <span className="scene-index" ref={indexRef}>01</span>
            <i className="scene-track"><b className="scene-fill" ref={fillRef} /></i>
            <span className="scene-name" ref={nameRef}>{SCENES[0]}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
