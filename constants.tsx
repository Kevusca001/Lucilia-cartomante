
import { ServiceItem, DeckCategory } from './types';

export const SERVICES: ServiceItem[] = [
  // BARALHO CIGANO
  {
    id: 'cigano-1',
    category: DeckCategory.CIGANO,
    // Fix: Added missing discount property
    title: 'Pergunta Avulsa',
    description: 'Uma resposta direta e objetiva para uma dúvida pontual do seu cotidiano.',
    price: 'R$ 20',
    discount: 0,
    imageUrl: 'https://picsum.photos/seed/cigano1/400/300'
  },
  {
    id: 'cigano-2',
    category: DeckCategory.CIGANO,
    // Fix: Added missing discount property
    title: 'Pacote - 2 Perguntas',
    description: 'Análise de dois temas interligados que necessitam de clareza imediata.',
    price: 'R$ 35',
    discount: 0,
    imageUrl: 'https://picsum.photos/seed/cigano2/400/300'
  },
  {
    id: 'cigano-3',
    category: DeckCategory.CIGANO,
    // Fix: Added missing discount property
    title: 'Pacote - 3 Perguntas',
    description: 'Visão completa sobre três questões específicas para tomada de decisão.',
    price: 'R$ 40',
    discount: 0,
    imageUrl: 'https://picsum.photos/seed/cigano3/400/300'
  },
  {
    id: 'cigano-4',
    category: DeckCategory.CIGANO,
    // Fix: Added missing discount property
    title: 'Orientação Espiritual',
    description: 'O que a espiritualidade tem para te dizer? (Sessão de 20 minutos)',
    price: 'R$ 50',
    discount: 0,
    imageUrl: 'https://picsum.photos/seed/cigano4/400/300'
  },
  {
    id: 'cigano-5',
    category: DeckCategory.CIGANO,
    // Fix: Added missing discount property
    title: 'Caminho Afetivo',
    description: 'O que Ele(a) sente por mim? + Como devo agir? (Sessão de 15 minutos)',
    price: 'R$ 50',
    discount: 0,
    imageUrl: 'https://picsum.photos/seed/cigano5/400/300'
  },
  {
    id: 'cigano-6',
    category: DeckCategory.CIGANO,
    // Fix: Added missing discount property
    title: 'Sessão 30 Minutos',
    description: 'Leitura livre para explorarmos diversos aspectos da sua jornada com profundidade.',
    price: 'R$ 65',
    discount: 0,
    imageUrl: 'https://picsum.photos/seed/cigano6/400/300'
  },

  // BARALHO DA POMBAGIRA
  {
    id: 'pombagira-1',
    category: DeckCategory.POMBAGIRA,
    // Fix: Added missing discount property
    title: 'Pergunta Avulsa',
    description: 'Clareza sob a ótica da transformação e do movimento com Maria Padilha e outras.',
    price: 'R$ 29',
    discount: 0,
    imageUrl: 'https://picsum.photos/seed/pombagira1/400/300'
  },
  {
    id: 'pombagira-4',
    category: DeckCategory.POMBAGIRA,
    // Fix: Added missing discount property
    title: 'Voz da Pombagira',
    description: 'O que a espiritualidade feminina tem para revelar? (Sessão de 20 minutos)',
    price: 'R$ 57',
    discount: 0,
    imageUrl: 'https://picsum.photos/seed/pombagira4/400/300'
  },
  {
    id: 'pombagira-7',
    category: DeckCategory.POMBAGIRA,
    // Fix: Added missing discount property
    title: 'Sessão 1 Hora',
    description: 'Imersão completa nos seus caminhos com a regência das Pombagiras.',
    price: 'R$ 135',
    discount: 0,
    imageUrl: 'https://picsum.photos/seed/pombagira7/400/300'
  },

  // BARALHO DE EXU
  {
    id: 'exu-1',
    category: DeckCategory.EXU,
    // Fix: Added missing discount property
    title: 'Estrutura e Proteção',
    description: 'Leitura focada em abertura de caminhos e proteção espiritual.',
    price: 'R$ 29',
    discount: 0,
    imageUrl: 'https://picsum.photos/seed/exu1/400/300'
  },
  {
    id: 'exu-5',
    category: DeckCategory.EXU,
    // Fix: Added missing discount property
    title: 'Sentimento & Ação',
    description: 'O que Ele(a) sente? + Como devo agir? (Sessão de 15 minutos)',
    price: 'R$ 60',
    discount: 0,
    imageUrl: 'https://picsum.photos/seed/exu5/400/300'
  },

  // TAROT
  {
    id: 'tarot-1',
    category: DeckCategory.TAROT,
    // Fix: Added missing discount property
    title: 'Pergunta Avulsa Tarot',
    description: 'Sabedoria dos arquétipos maiores para sua dúvida imediata.',
    price: 'R$ 25',
    discount: 0,
    imageUrl: 'https://picsum.photos/seed/tarot1/400/300'
  },
  {
    id: 'tarot-4',
    category: DeckCategory.TAROT,
    // Fix: Added missing discount property
    title: 'Jornada Espiritual',
    description: 'Mensagens do Tarot para seu crescimento e evolução. (20 minutos)',
    price: 'R$ 57',
    discount: 0,
    imageUrl: 'https://picsum.photos/seed/tarot4/400/300'
  },

  // APENAS UM CONSELHO
  {
    id: 'conselho-1',
    category: DeckCategory.CONSELHO,
    // Fix: Added missing discount property
    title: 'Apenas um Conselho',
    description: 'Uma luz rápida para quando você precisa apenas de uma direção imediata.',
    price: 'R$ 20',
    discount: 0,
    imageUrl: 'https://picsum.photos/seed/conselho/400/300'
  }
];