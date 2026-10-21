export function calcularResultadoDiagnostico(respostasDoUsuario, gabarito) {
  const acertosPorArea = {
    'Matemática': { total: 0, acertos: 0, color: '#9FA8FF' },
    'Linguagens': { total: 0, acertos: 0, color: '#57DDA9' },
    'Ciências da natureza': { total: 0, acertos: 0, color: '#FF8A65' },
    'Humanas': { total: 0, acertos: 0, color: '#B39DFF' },
  };

  let acertosTotais = 0;

  respostasDoUsuario.forEach((resposta, index) => {
    const questao = gabarito[index];
    if (!questao || !acertosPorArea[questao.area]) {
      return;
    }

    const area = questao.area;
    
    acertosPorArea[area].total += 1;
    
    if (resposta === questao.respostaCorreta) {
      acertosPorArea[area].acertos += 1;
      acertosTotais += 1;
    }
  });

  const areasProcessadas = Object.keys(acertosPorArea).map(area => {
    const dados = acertosPorArea[area];
    const score = dados.total > 0 ? Math.round((dados.acertos / dados.total) * 100) : 0;
    return { name: area, score, color: dados.color };
  });

  const overallScore = gabarito.length > 0
    ? Math.round((acertosTotais / gabarito.length) * 100)
    : 0;

  const piorArea = [...areasProcessadas].sort((a, b) => a.score - b.score)[0];

  return {
    overallScore,
    totalQuestions: gabarito.length,
    areas: areasProcessadas,
    priority: {
      subject: piorArea.name,
      reason: "este assunto trava módulos fundamentais do seu edital."
    }
  };
}