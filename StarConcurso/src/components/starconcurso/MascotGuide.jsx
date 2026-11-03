import mascot from "../../assets/star-mascot.png";

export function MascotGuide() {
  return (
    <div className="intro-mascot-wrap" aria-label="Mascote Estelar, guia do StarConcurso">
      <div className="mascot-message">
        <span>Seu próximo passo</span>
        <strong>começa agora.</strong>
      </div>
      <div className="mascot-glow" aria-hidden="true" />
      {/* O GSAP move o wrapper; a flutuação contínua fica neste filho para não competir com ele. */}
      <div className="mascot-float">
        <img className="mascot" src={mascot} alt="Mascote Estelar do StarConcurso" decoding="async" />
      </div>
    </div>
  );
}
