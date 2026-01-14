
export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  discount: number;
  created_at?: string;
}

export interface ServiceConfig {
  id_servico: string;
  desconto_porcentagem: number;
}

export interface Bloqueio {
  id: string;
  data: string;
  hora: string | null;
  created_at?: string;
}

export enum DeckCategory {
  CIGANO = 'Baralho Cigano',
  POMBAGIRA = 'Baralho da Pombagira',
  EXU = 'Baralho de Exu',
  TAROT = 'Tarot',
  CONSELHO = 'Conselho'
}

export interface Booking {
  id?: string;
  data: string;
  hora: string;
  nome_cliente: string;
  telefone: string;
  servico: string;
  status: 'pending' | 'confirmed' | 'cancelado';
  created_at?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}
