const WORD = "StarConcurso";

export function BrandReveal() {
  return (
    <section className="brand-scene scene-layer" aria-label="StarConcurso">
      <div className="brand-mark" aria-hidden="true">
        <span className="brand-star">✦</span>
        <span className="brand-orbit" />
      </div>
      <div className="brand-word-mask">
        {/* Letras separadas só para animar; o leitor de tela lê a palavra inteira. */}
        <h1 className="brand-word" aria-label={WORD}>
          {[...WORD].map((letter, i) => (
            <span className="brand-letter" aria-hidden="true" key={i}>{letter}</span>
          ))}
        </h1>
      </div>
      <p className="brand-kicker">Uma jornada rumo à sua próxima conquista.</p>
    </section>
  );
}
