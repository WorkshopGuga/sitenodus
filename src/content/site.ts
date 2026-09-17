/** Conteúdo fixo do site. Só o que não muda toda semana fica aqui —
 *  logos, depoimentos, cases e blog vêm do painel. */

export const PASSOS = [
  { t: "Entendemos a operação", d: "Conversamos com quem faz o trabalho todo dia. É ali que o problema real aparece, não na reunião de diretoria." },
  { t: "Mostramos antes de cobrar", d: "Em boa parte dos projetos desenvolvemos um protótipo funcional sem custo. Você vê como ficaria antes de decidir." },
  { t: "Implementamos de verdade", d: "Não entregamos relatório e vamos embora. Construímos, colocamos no ar e acompanhamos até virar rotina." },
  { t: "Capacitamos o time", d: "Tecnologia que ninguém sabe usar não muda nada. Ensinamos a equipe a operar e a evoluir o que foi construído." },
];

export const SINTOMAS = [
  { t: "Planilha", d: "que se repete toda semana do mesmo jeito" },
  { t: "Cadastro", d: "que alguém copia de um sistema para outro" },
  { t: "Mensagem", d: "que é respondida igual dezenas de vezes por dia" },
  { t: "Relatório", d: "que se monta à mão todo fim de mês" },
];

/** Fallbacks: aparecem enquanto o painel ainda não tem registros. */
export const CASES_FALLBACK = [
  {
    id: "f1", setor: "Distribuição industrial — abrasivos B2B", categoria: "Atendimento com IA",
    desafio: "Atendimento no WhatsApp feito à mão por uma pessoa só, com até um dia de espera pela primeira resposta.",
    solucao: "Agente de IA no mesmo número da empresa, triagem automática por CPF/CNPJ e integração com o CRM existente.",
    resultado: "Primeira resposta caiu de horas para segundos.",
    destaque: true, ordem: 1, ativo: true,
  },
  {
    id: "f2", setor: "Distribuição — insumos para marcenaria", categoria: "Gestão Financeira",
    desafio: "Toda a operação financeira em planilhas, com conciliação bancária manual todo mês.",
    solucao: "Sistema financeiro sob medida com leitura de extratos por IA, DRE gerencial e dashboard executivo.",
    resultado: "Cerca de 16 mil lançamentos migrados e conciliação que roda sozinha.",
    destaque: true, ordem: 2, ativo: true,
  },
  {
    id: "f3", setor: "Indústria metalúrgica", categoria: "Gestão de Pessoas",
    desafio: "Avaliação de competências 100% manual em planilhas, com risco de não conformidade na ISO 9001.",
    solucao: "Sistema web de avaliação por área, PDI com apoio de IA e dashboard em tempo real.",
    resultado: "Rastreabilidade completa do desenvolvimento de cada colaborador.",
    destaque: true, ordem: 3, ativo: true,
  },
  {
    id: "f4", setor: "Transporte rodoviário — fretamento corporativo", categoria: "Operação e Logística",
    desafio: "Montar o transporte exigia caçar cada funcionário em 25 abas de planilha.",
    solucao: "Base modelada com 519 funcionários e 286 pontos de embarque, com aplicação web de consulta e edição.",
    resultado: "48 inconsistências invisíveis identificadas e rastreáveis.",
    destaque: true, ordem: 4, ativo: true,
  },
];

export const DEPOIMENTOS_FALLBACK = [
  { id: "d1", texto: "Automatizamos processos, aceleramos análises de dados e passamos a executar atividades com muito mais agilidade.", autor: "Gilmar", cargo: "Gerente Comercial — Indústria", foto_url: null, origem: null, ordem: 1, ativo: true },
  { id: "d2", texto: "Um passo concreto para quem quer tomar decisões com mais qualidade.", autor: "Éder", cargo: "Diretor de Operações — Indústria", foto_url: null, origem: null, ordem: 2, ativo: true },
  { id: "d3", texto: "As demandas que antes consumiam horas passaram a ser resolvidas com muito mais agilidade e precisão.", autor: "Leonardo", cargo: "TI — Indústria", foto_url: null, origem: null, ordem: 3, ativo: true },
];
