import { BookOpen, Check, Sigma, TrendingUp } from "lucide-react";

// Sem números inventados: cada nó descreve uma etapa real da preparação.
const nodes = [
  { className: "node-question", label: "Questões", value: "Resolvidas", icon: Check },
  { className: "node-library", label: "Repertório", value: "Em expansão", icon: BookOpen },
  { className: "node-progress", label: "Evolução", value: "Constante", icon: TrendingUp },
  { className: "node-focus", label: "Foco", value: "Direcionado", icon: Sigma },
];

export function StudyOrbit() {
  return (
    <div className="study-orbit" aria-hidden="true">
      <div className="orbit-ring orbit-ring-one"><i className="orbit-dot" /></div>
      <div className="orbit-ring orbit-ring-two"><i className="orbit-dot" /></div>
      <div className="orbit-axis" />
      <div className="orbit-core">✦</div>
      {nodes.map(({ className, label, value, icon: Icon }) => (
        <div className={`study-node ${className}`} key={label}>
          <div className="node-icon"><Icon size={18} strokeWidth={1.7} /></div>
          <div><span>{label}</span><strong>{value}</strong></div>
        </div>
      ))}
      <div className="progress-trace"><i /><i /><i /><i /><i /></div>
    </div>
  );
}
