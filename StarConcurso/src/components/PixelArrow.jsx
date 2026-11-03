// Seta em pixel art (triângulo escalonado com contorno). Aponta para a esquerda;
// a direção "right" é só um espelhamento por CSS.
const ROWS = 13; // linhas de pixel
const TIP = 6; // linha da ponta

const rows = Array.from({ length: ROWS }, (_, y) => {
  const w = Math.min(y, ROWS - 1 - y) + 1;
  return { y, w, x: 7 - w, top: y <= TIP };
});

export default function PixelArrow({ dir = 'left' }) {
  return (
    <svg className={`pixel-arrow ${dir === 'right' ? 'is-right' : ''}`} viewBox="-1 -1 9 15" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      {rows.map(({ y, w, x }) => <rect key={`o${y}`} x={x - 1} y={y - 1} width={w + 2} height={3} fill="#0b0b0c" />)}
      {rows.map(({ y, w, x, top }) => <rect key={`f${y}`} x={x} y={y} width={w} height={1} fill={top ? '#ffd84d' : '#f4c430'} />)}
    </svg>
  );
}
