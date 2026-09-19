import { PresetScenario } from '../types';

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'critica-fiis',
    name: 'Canibalização Crítica (Dois Guias Idênticos)',
    category: 'Finanças / Investimentos',
    description: 'Dois artigos cobrindo exatamente a mesma intenção informacional de introdução a Fundos Imobiliários.',
    expectedRisk: 'CRITICAL',
    contentA: {
      label: 'Artigo A: Como Investir em FIIs para Iniciantes (Publicado em 2023)',
      urlOrText: `Como Investir em Fundos Imobiliários (FIIs): Guia Passo a Passo para Iniciantes
Os Fundos Imobiliários (FIIs) são uma excelente alternativa para quem deseja receber renda passiva mensal sem a burocracia de comprar um imóvel físico. Neste artigo, você vai entender o que é dividend yield, como funciona a tributação dos proventos isentos de imposto de renda para pessoa física, a diferença entre fundos de papel (CRI, LCI) e fundos de tijolo (galpões logísticos, shopping centers e lajes corporativas), e como abrir conta numa corretora para comprar sua primeira cota pelo home broker. 
Vantagens dos FIIs: liquidez diária na B3, diversificação de inquilinos, gestão profissional do patrimônio e distribuição de dividendos mensais na conta. Aprenda a analisar o P/VP (preço sobre valor patrimonial), a vacância física e financeira e o histórico de gestão antes de aportar.`
    },
    contentB: {
      label: 'Artigo B: Guia Completo de FIIs: Aprenda a Investir em Fundos Imobiliários do Zero (Publicado em 2024)',
      urlOrText: `Guia de Fundos Imobiliários: Como Começar a Investir em FIIs do Zero
Quer viver de renda com aluguéis mensais? Os Fundos de Investimento Imobiliário (FIIs) permitem comprar frações dos maiores empreendimentos imobiliários do Brasil através da bolsa de valores B3. Veja o passo a passo para iniciantes: descubra o que é dividend yield (taxa de retorno de dividendos), como funciona a isenção de IR nos rendimentos mensais, as categorias de fundos de tijolo (shoppings e galpões) versus fundos de papel (títulos de dívida como CRI).
Para comprar seu primeiro fundo imobiliário, abra conta em uma corretora de valores, transfira dinheiro via PIX e acesse o home broker usando o ticker do fundo. Avalie sempre o indicador P/VP, a taxa de vacância e o histórico dos dividendos para evitar armadilhas no mercado imobiliário.`
    }
  },
  {
    id: 'sobreposicao-tenis',
    name: 'Sobreposição de Ângulo (Review vs Guia de Compra)',
    category: 'E-commerce / Calçados',
    description: 'Artigos que competem pelas mesmas palavras-chave transacionais/comerciais de calçados de corrida.',
    expectedRisk: 'HIGH',
    contentA: {
      label: 'Conteúdo A: Os 10 Melhores Tênis de Corrida de 2025 - Review e Comparativo',
      urlOrText: `Ranking Definitivo: Os Melhores Tênis de Corrida em 2025 para Treino e Prova
Analisamos os principais lançamentos do mercado esportivo para elencar os melhores tênis para corredores de rua: Nike Vaporfly 3, Asics Novablast 4, Adidas Adizero Boston 12 e Olympikus Corre 3. Testamos o amortecimento com espuma responsiva, placa de carbono versus placa de nylon, durabilidade da sola de borracha e respirabilidade do cabedal em mesh. 
Se você procura amortecimento máximo para maratona ou leveza para tiros de 5 km, confira nossa tabela comparativa de peso em gramas, drop (diferença entre calcanhar e ponta dos pés) e melhor custo-benefício para comprar com desconto.`
    },
    contentB: {
      label: 'Conteúdo B: Como Escolher seu Tênis de Corrida Ideal: Guia Prático para Não Errar',
      urlOrText: `Guia de Compra: Como Escolher o Melhor Tênis para Começar a Correr na Rua
Comprar um calçado esportivo correto evita lesões graves como canelite, fascite plantar e dores nos joelhos. Para escolher o tênis ideal, você precisa identificar seu tipo de pisada (pronada, supinada ou neutra), o nível de amortecimento desejado e o drop mais confortável para sua anatomia. 
Modelos populares como Asics Novablast, Olympikus Corre e Nike Pegasus são opções consagradas. Avalie se você precisa de placas de propulsão para ritmo rápido ou se um tênis de rodagem com solado macio e cabedal elástico é mais adequado para sua rotina de corrida diária.`
    }
  },
  {
    id: 'topic-cluster-seo',
    name: 'Topic Cluster / Autoridade Relacionada (SEO Geral vs Link Building)',
    category: 'Marketing Digital / SEO',
    description: 'Textos que compartilham o mesmo universo semântico (SEO), mas cobrem pilares complementares. Oportunidade perfeita de linkagem interna.',
    expectedRisk: 'MODERATE',
    contentA: {
      label: 'Conteúdo A: O que é SEO? Guia Essencial de Otimização para Mecanismos de Busca',
      urlOrText: `O que é SEO (Search Engine Optimization) e Como Funciona o Algoritmo do Google
Search Engine Optimization é o conjunto de estratégias voltadas para posicionar um site organicamente nas primeiras posições dos buscadores como Google e Bing. O ecossistema de SEO é dividido em três pilares essenciais: SEO On-page (pesquisa de palavras-chave, headings H1-H3, títulos atraentes e conteúdo relevante), SEO Técnico (velocidade de carregamento Core Web Vitals, rastreabilidade dos robôs do Google e HTTPS) e SEO Off-page (autoridade de domínio e referências externas). 
Entender a intenção de busca do usuário e otimizar para a experiência do visitante é o ponto central para atrair tráfego qualificado e constante sem depender exclusivamente de anúncios pagos.`
    },
    contentB: {
      label: 'Conteúdo B: Estratégias Avançadas de Link Building para Ganhar Autoridade em 2025',
      urlOrText: `Link Building Estratégico: Como Conquistar Backlinks de Alta Qualidade e Relevância
No pilar de SEO Off-page, os backlinks funcionam como votos de confiança para os algoritmos de busca. Conquistar links dofollow de sites com alta autoridade de domínio (DR/DA) transfere PageRank e sinaliza relevância temática para o seu domínio. 
Técnicas modernas incluem a criação de estudos originais de dados, outreach com assessoria de imprensa digital, técnica skyscraper em conteúdos de topo e recuperação de menções desvinculadas da sua marca. Evite esquemas de compra de links (PBN) que violem as diretrizes contra spam do Google e mantenha o perfil de texto-âncora natural e diversificado.`
    }
  },
  {
    id: 'distintos-gastronomia-tech',
    name: 'Conteúdos Distintos (Sem Risco Semântico)',
    category: 'Nicho Divergente',
    description: 'Dois artigos de nichos totalmente separados que não compartilham intenção ou entidades semânticas.',
    expectedRisk: 'LOW',
    contentA: {
      label: 'Conteúdo A: Como Fazer Pão Italiano de Fermentação Natural Artesanal',
      urlOrText: `Receita e Técnica para Fazer Pão de Fermentação Natural (Levain) em Casa
A panificação artesanal exige paciência, controle térmico e farinha de trigo de alta força (W alto). Para preparar o pão, você precisará de fermento natural ativo (levain ou massa madre), água mineral, sal marinho e farinha. 
O processo envolve as etapas de autólise para hidratar o glúten, dobras sucessivas a cada 30 minutos, fermentação em bloco até atingir o ponto de aeração e cozimento em panela de ferro bem quente para formar uma casca crocante e dourada com alvéolos abertos e miolo macio.`
    },
    contentB: {
      label: 'Conteúdo B: Manutenção e Limpeza Preventiva de Ar-Condicionado Split',
      urlOrText: `Passo a Passo para Limpar os Filtros e Serpentina do Ar-Condicionado Split
A manutenção periódica do sistema de climatização residencial prolonga a vida útil do compressor e melhora a qualidade do ar respirado no ambiente. Desligue o disjuntor elétrico antes de abrir a tampa da evaporadora interna. 
Retire as telas de filtro laváveis e enxágue com água morna e detergente neutro. Aplique spray bactericida na serpentina de alumínio para eliminar mofo e fungos acumulados na bandeja de dreno. Faça a higienização a cada 15 dias no verão para economizar até 20% na conta de energia elétrica.`
    }
  }
];
