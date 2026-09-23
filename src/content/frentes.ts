export type Frente = {
  slug: string;
  nome: string;
  titulo: string;
  resumo: string;
  chamada: string;
  itens: { t: string; d: string }[];
  /** true quando os itens são etapas reais, uma depois da outra —
   *  só nesse caso faz sentido animar como timeline. Ofertas em
   *  paralelo (a maioria) ficam em grade. */
  sequencial?: boolean;
  /** Se definido, a página mostra depoimentos com essas origens
   *  (ex: ["treinamento","mentoria"] na Capacitação). Sem isso, a
   *  página não tem seção de depoimento. */
  depoimentosOrigem?: string[];
  /** Mostra depoimentos de cliente (origem "cliente") marcados com este
   *  serviço em tags_servico. Usado nas frentes comerciais — Capacitação
   *  usa depoimentosOrigem em vez disso. */
  depoimentosServico?: string;
  /** Mostra a galeria de fotos (treinamentos/eventos/bastidores) nesta
   *  página. Hoje só a Capacitação usa isso. */
  galeria?: boolean;
  paraQuem: string[];
};

export const FRENTES: Frente[] = [
  {
    slug: "desenvolvimento",
    nome: "Desenvolvimento",
    titulo: "Sistemas e automações sob medida",
    depoimentosServico: "desenvolvimento",
    resumo:
      "Nada de prateleira. Construímos a partir da dor real da operação — e na maior parte dos projetos você vê um protótipo funcionando antes de assumir qualquer compromisso.",
    chamada: "Sistemas construídos a partir da sua operação, não de um template.",
    itens: [
      { t: "Sistemas web sob medida", d: "Financeiro, CRM, gestão de pessoas, operação. Construído em cima do processo que já existe, não do processo ideal de outra empresa." },
      { t: "Agentes de IA no WhatsApp", d: "Atendimento, triagem e qualificação no mesmo número que você já usa, com handoff para a equipe quando alguém assume a conversa." },
      { t: "Automações entre sistemas", d: "O dado sai de um lugar e chega no outro sozinho. Sem alguém copiando e colando entre planilha, ERP e e-mail." },
      { t: "Integração com o que você já tem", d: "ERP, CRM, planilhas e sistemas legados. A ideia não é trocar tudo, é fazer o que existe conversar." },
    ],
    paraQuem: [
      "A operação roda em planilha e WhatsApp e o volume está crescendo",
      "Existe um dado importante que só uma pessoa sabe onde está",
      "Nenhuma ferramenta de mercado resolve exatamente o seu problema",
    ],
  },
  {
    slug: "diagnostico",
    nome: "Diagnóstico",
    titulo: "O mapa antes da ferramenta",
    depoimentosServico: "diagnostico",
    resumo:
      "Quando os processos ainda não estão claros, tecnologia só acelera a bagunça. Entramos setor a setor, mapeamos onde dói e entregamos um roadmap priorizado por impacto e viabilidade.",
    chamada: "Automação sem diagnóstico é desperdício.",
    sequencial: true,
    itens: [
      { t: "Entrevistas setor a setor", d: "Conversamos com quem faz o trabalho todo dia. É ali que o problema real aparece, não na reunião de diretoria." },
      { t: "Mapa de oportunidades", d: "Tudo que pode ser automatizado ou sistematizado, listado e avaliado — inclusive o que não vale a pena." },
      { t: "Roadmap priorizado", d: "Ordem de execução por impacto financeiro e viabilidade técnica, com o que pode ser absorvido internamente separado do que precisa de fornecedor." },
      { t: "Acompanhamento da execução", d: "O plano não termina no documento. Acompanhamos a implementação e ajustamos a prioridade conforme a realidade muda." },
    ],
    paraQuem: [
      "A empresa cresceu rápido e os processos não acompanharam",
      "Existem muitas ideias e nenhuma clareza sobre por onde começar",
      "Já tentaram implantar tecnologia antes e não vingou",
    ],
  },
  {
    slug: "capacitacao",
    nome: "Capacitação",
    titulo: "O time sabendo usar o que existe",
    depoimentosOrigem: ["treinamento", "mentoria"],
    galeria: true,
    resumo:
      "Tecnologia que ninguém sabe operar não muda nada. Formamos equipes dentro da empresa e também profissionais em treinamentos abertos e mentoria.",
    chamada: "Quando o treinamento é prático, o aluno sai usando.",
    itens: [
      { t: "Capacitação in company", d: "Treinamento presencial na empresa, com as ferramentas aplicadas à rotina real de cada setor — não a um caso genérico." },
      { t: "Treinamento presencial aberto", d: "Turmas abertas para profissionais de qualquer empresa, com foco no que dá para usar já no dia seguinte." },
      { t: "Mentoria em grupo", d: "Encontros ao vivo recorrentes, com plataforma de aulas gravadas para acompanhar no próprio ritmo." },
      { t: "Mentoria individual", d: "Acompanhamento personalizado, construindo as automações junto com a pessoa durante as sessões." },
    ],
    paraQuem: [
      "O time usa IA de forma solta, sem método e sem padrão",
      "A empresa comprou ferramentas que ninguém adotou",
      "Você quer aprender a aplicar IA na própria rotina profissional",
    ],
  },
  {
    slug: "marketing",
    nome: "Marketing",
    titulo: "Presença digital com estrutura atrás",
    depoimentosServico: "marketing",
    resumo:
      "Não adianta gerar demanda se o processo que recebe essa demanda não existe. Site e tráfego entram junto com a estrutura que sustenta o lead depois que ele chega.",
    chamada: "Presença digital só funciona quando tem estrutura atrás.",
    itens: [
      { t: "Site institucional", d: "Site construído a partir do funil, não da estética. Com autonomia de edição para o time, sem depender de fornecedor para trocar uma foto." },
      { t: "Tráfego pago", d: "Campanhas com rastreamento até a conversão real, não até o clique. Você sabe qual canal gerou venda." },
      { t: "Consultoria estratégica", d: "Mapeamento de produtos, públicos e jornada. Qual produto alimenta qual, e onde o lead está se perdendo hoje." },
      { t: "Estrutura de captação e CRM", d: "O lead chega e cai em algum lugar organizado, com qualificação e follow-up definidos. Não em uma caixa de entrada." },
    ],
    paraQuem: [
      "Você investe em anúncio e não sabe qual canal gera venda",
      "Os leads chegam e se perdem antes de virar conversa",
      "A empresa cresce por indicação e quer previsibilidade",
    ],
  },
];

export const getFrente = (slug: string) => FRENTES.find((f) => f.slug === slug)!;
