// Dados demonstrativos: concursos da região.
// `titulo` é sempre "Concurso de {município}"; o que diferencia cada prova é cargo, ano e disciplina.
const P = (id, municipio, cargo, ano, disciplina, questoes, status, descricao) => ({
  id, municipio, titulo: `Concurso de ${municipio}`, cargo, ano, disciplina, questoes, status, descricao,
});

const DEMO = 'Dados demonstrativos para apresentação do StarConcurso.';

export const provas = [
  P(1, 'Quixeramobim', 'Agente Administrativo', 2026, 'Português', 40, 'disponivel', DEMO),
  P(2, 'Quixadá', 'Professor de Educação Básica', 2026, 'Matemática', 50, 'producao', 'Resolução em produção. Dados demonstrativos para apresentação do StarConcurso.'),
  P(3, 'Iguatu', 'Agente Administrativo', 2025, 'Português', 45, 'disponivel', DEMO),
  P(4, 'Senador Pompeu', 'Técnico em Informática', 2025, 'Informática', 30, 'disponivel', DEMO),
  P(5, 'Quixeramobim', 'Guarda Municipal', 2025, 'Matemática', 35, 'indisponivel', 'Ainda não temos esta resolução. Peça pelo WhatsApp.'),
  P(6, 'Quixadá', 'Agente Administrativo', 2024, 'Raciocínio Lógico', 40, 'disponivel', DEMO),
  P(7, 'Iguatu', 'Técnico de Enfermagem', 2026, 'Conhecimentos Específicos', 25, 'producao', 'Resolução em produção. Dados demonstrativos para apresentação do StarConcurso.'),
  P(8, 'Senador Pompeu', 'Professor de Educação Básica', 2024, 'Conhecimentos Pedagógicos', 45, 'indisponivel', 'Ainda não temos esta resolução. Peça pelo WhatsApp.'),
];
