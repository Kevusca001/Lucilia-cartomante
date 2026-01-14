
import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageCircle, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Flame,
  Star, 
  Quote,
  X,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Copy,
  AlertCircle,
  QrCode,
  Info,
  Ban,
  Wallet,
  Timer,
  Moon,
  Eye,
  Lock,
  LayoutDashboard,
  Settings,
  LogOut,
  TrendingUp,
  TrendingDown,
  Trash2,
  Tag,
  ChevronRight,
  UserX,
  Check,
  Undo2,
  BellRing
} from 'lucide-react';
import { createClient, Session } from '@supabase/supabase-js';
import QRCode from 'qrcode';
import { DeckCategory, ServiceItem, TimeSlot, ServiceConfig, Bloqueio, Booking } from './types';
import { PixPayload } from './pixUtils';

/** 
 * Ícone personalizado de Carta de Tarot
 */
const TarotCardIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="7" y="3" width="10" height="18" rx="2" />
    <path d="M12 8v8M10 12h4" />
    <circle cx="12" cy="12" r="1.5" />
  </svg>
);

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=800';

const SITE_DATA = {
  profile: {
    name: 'Lucilia Cartomante',
    manifesto: "Sou cartomante, oraculista e dirigente espiritual. Trabalho com o Baralho Cigano e o Baralho da Pombagira como ferramentas de clareza, consciência e tomada de decisão. Não atuo para iludir, prometer milagres ou criar dependência. Minhas leituras servem para quem está disposto a enxergar a própria verdade, assumir responsabilidade sobre as próprias escolhas e encerrar ciclos que já passaram do prazo. A espiritualidade, para mim, é prática, ética e madura. Ela orienta, mas não decide por você. Se você busca lucidez, coragem e alinhamento, seja bem-vindo.",
    profileImage: 'https://kzrttlhfjhaortkrnqby.supabase.co/storage/v1/object/public/images-site/Imagem%20Lucilia.jpeg' || PLACEHOLDER_IMAGE
  },
  catalog: [
    { id: 'cigano-1', category: DeckCategory.CIGANO, title: 'Pergunta Avulsa', description: 'Uma resposta direta e objetiva para uma dúvida pontual.', price: 'R$ 20', imageUrl: 'https://kzrttlhfjhaortkrnqby.supabase.co/storage/v1/object/public/images-site/Pergunta%20avulsa.jpg' },
    { id: 'cigano-2', category: DeckCategory.CIGANO, title: 'Pacote - 2 Perguntas', description: 'Análise de dois temas interligados.', price: 'R$ 35', imageUrl: 'https://kzrttlhfjhaortkrnqby.supabase.co/storage/v1/object/public/images-site/Duas%20perguntas.jpg' },
    { id: 'cigano-3', category: DeckCategory.CIGANO, title: 'Pacote - 3 Perguntas', description: 'Visão completa sobre três questões específicas.', price: 'R$ 40', imageUrl: 'https://kzrttlhfjhaortkrnqby.supabase.co/storage/v1/object/public/images-site/3%20perguntas.jpg' },
    { id: 'cigano-4', category: DeckCategory.CIGANO, title: 'Orientação Espiritual', description: 'O que a espiritualidade tem para te dizer? (20 min)', price: 'R$ 50', imageUrl: 'https://kzrttlhfjhaortkrnqby.supabase.co/storage/v1/object/public/images-site/Conselho%20espiritual.jpg' },
    { id: 'cigano-5', category: DeckCategory.CIGANO, title: 'Caminho Afetivo', description: 'O que elx sente? + Como agir? (15 min)', price: 'R$ 50', imageUrl: 'https://kzrttlhfjhaortkrnqby.supabase.co/storage/v1/object/public/images-site/Caminho%20afetivo.jpg' },
    { id: 'cigano-6', category: DeckCategory.CIGANO, title: 'Sessão 30 Minutos', description: 'Leitura livre profunda.', price: 'R$ 65', imageUrl: 'https://kzrttlhfjhaortkrnqby.supabase.co/storage/v1/object/public/images-site/Meia%20hora.jpg' },
    { id: 'pombagira-1', category: DeckCategory.POMBAGIRA, title: 'Pergunta Avulsa Pombagira', description: 'Clareza sob a ótica da transformação.', price: 'R$ 29', imageUrl: 'https://kzrttlhfjhaortkrnqby.supabase.co/storage/v1/object/public/images-site/Movimento%20bombagira.jpg' },
    { id: 'tarot-1', category: DeckCategory.TAROT, title: 'Pergunta Avulsa Tarot', description: 'Sabedoria dos arquétipos maiores.', price: 'R$ 25', imageUrl: 'https://kzrttlhfjhaortkrnqby.supabase.co/storage/v1/object/public/images-site/Arquetipos.jpg' }
  ]
};

const PIX_CONFIG = { KEY: '21124858000138', NAME: 'LUCILIA CARTOMANTE', CITY: 'RIO DE JANEIRO' };
const WHATSAPP_CONFIG = { NUMBER: '5521991629472', MESSAGE: 'Olá, Lucilia! Gostaria de tirar uma dúvida.' };

const supabaseUrl = 'https://kzrttlhfjhaortkrnqby.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6cnR0bGhmamhhb3J0a3JucWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNTY5OTMsImV4cCI6MjA4MzkzMjk5M30.1A6-V3tkk3hoD5iXOnLvfQpFtvUQyita3Ek1z-Mz6tU';

// Inicialização segura do Supabase
const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

if (!supabase) {
  console.error("Configuração do Supabase ausente ou inválida. Algumas funcionalidades podem não estar disponíveis.");
}

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(window.location.pathname === '/admin');
  const [session, setSession] = useState<Session | null>(null);
  const [activeCategory, setActiveCategory] = useState<DeckCategory | 'Todos'>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [serviceConfigs, setServiceConfigs] = useState<Record<string, number>>({});
  
  // Booking State
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasConfirmedPix, setHasConfirmedPix] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [pixPayloadCode, setPixPayloadCode] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Admin Data
  const [dashboardData, setDashboardData] = useState({ revenueThisMonth: 0, diffPercent: 0 });
  const [bloqueios, setBloqueios] = useState<Bloqueio[]>([]);
  const [futureAppointments, setFutureAppointments] = useState<Booking[]>([]);
  const [adminTab, setAdminTab] = useState<'dashboard' | 'agenda' | 'promo'>('dashboard');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [confirmingCancelId, setConfirmingCancelId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    fetchServiceConfigs();
    return () => subscription.unsubscribe();
  }, []);

  const fetchServiceConfigs = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('servicos_config').select('*');
      if (error) throw error;
      if (data) {
        const configMap = (data || []).reduce((acc, curr) => ({ ...acc, [curr.id_servico]: curr.desconto_porcentagem }), {});
        setServiceConfigs(configMap);
      }
    } catch (err) {
      console.error("Falha ao buscar configurações de serviço:", err);
    }
  };

  const calculatePrice = (basePrice: string, id: string) => {
    const numeric = parseFloat((basePrice || '0').replace(/[^0-9,.]/g, '').replace(',', '.')) || 0;
    const discount = serviceConfigs[id] || 0;
    if (discount <= 0) return { original: basePrice, current: basePrice, numeric: numeric, hasDiscount: false };
    const current = numeric * (1 - discount / 100);
    return {
      original: basePrice || 'R$ 0,00',
      current: `R$ ${(current || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      numeric: current,
      hasDiscount: true,
      percent: discount
    };
  };

  const fetchOccupiedSlots = async (date: string) => {
    const baseSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    if (!supabase) {
      setAvailableSlots(baseSlots.map(s => ({ time: s, available: true })));
      return;
    }

    try {
      const { data: booked, error: bookedError } = await supabase
        .from('agendamentos')
        .select('hora')
        .eq('data', date)
        .neq('status', 'cancelado');
      
      const { data: blocked, error: blockedError } = await supabase
        .from('bloqueios')
        .select('hora')
        .eq('data', date);
      
      if (bookedError || blockedError) throw new Error("Erro na consulta de horários");
      
      const busyTimes = new Set([...(booked?.map(b => b.hora) || []), ...(blocked?.map(b => b.hora) || [])]);
      const isDayBlocked = blocked?.some(b => b.hora === null);

      setAvailableSlots(baseSlots.map(s => ({
        time: s,
        available: !isDayBlocked && !busyTimes.has(s)
      })));
    } catch (e) {
      console.error("Erro ao carregar slots ocupados:", e);
      setAvailableSlots(baseSlots.map(s => ({ time: s, available: true })));
    }
  };

  useEffect(() => {
    if (selectedDate && isModalOpen) fetchOccupiedSlots(selectedDate);
  }, [selectedDate, isModalOpen]);

  useEffect(() => {
    if (bookingStep === 3 && selectedService) {
      try {
        const pricing = calculatePrice(selectedService.price, selectedService.id);
        const pix = new PixPayload(
          PIX_CONFIG.KEY,
          PIX_CONFIG.NAME,
          PIX_CONFIG.CITY,
          `AG${Date.now().toString().slice(-8)}`,
          pricing.numeric
        );
        
        const payload = pix.generate();
        setPixPayloadCode(payload);

        QRCode.toDataURL(payload, {
          width: 400,
          margin: 2,
          color: { dark: '#0f051d', light: '#ffffff' },
        }).then(url => {
          setQrCodeDataUrl(url);
        }).catch(err => {
          console.error("Erro ao gerar QR Code:", err);
        });
      } catch (err) {
        console.error("Falha no fluxo de geração de PIX:", err);
      }
    }
  }, [bookingStep, selectedService]);

  const handleOpenModal = (service: ServiceItem) => {
    setSelectedService(service);
    setIsModalOpen(true);
    setBookingStep(1);
    setSelectedDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    setHasConfirmedPix(false);
  };

  const handleConfirmPix = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !supabase) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('agendamentos').insert([{
        data: selectedDate,
        hora: selectedTime,
        nome_cliente: formData.name || 'Cliente',
        telefone: formData.phone || '',
        servico: selectedService.title || 'Consulta',
        status: 'confirmed' 
      }]);
      if (error) throw error;
      setHasConfirmedPix(true);
    } catch (err) {
      console.error("Falha ao registrar agendamento:", err);
      alert("Houve um erro ao processar seu agendamento. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyPix = () => {
    if (!pixPayloadCode) return;
    navigator.clipboard.writeText(pixPayloadCode);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    if (error) alert('Falha no login: ' + error.message);
  };

  const fetchDashboardData = async () => {
    if (!supabase) return;
    try {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
      
      const firstDayPrev = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      const lastDayPrev = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

      const fetchRev = async (start: string, end: string) => {
        const { data, error } = await supabase.from('agendamentos')
          .select('servico')
          .eq('status', 'confirmed')
          .gte('data', start.split('T')[0])
          .lte('data', end.split('T')[0]);
        
        if (error) throw error;
        
        return (data || []).reduce((acc, curr) => {
          const service = SITE_DATA.catalog.find(s => s.title === curr.servico);
          const priceStr = (service?.price || '0').replace(/[^0-9,.]/g, '').replace(',', '.') || '0';
          const price = parseFloat(priceStr);
          return acc + price;
        }, 0);
      };

      const thisMonth = await fetchRev(firstDay, lastDay);
      const prevMonth = await fetchRev(firstDayPrev, lastDayPrev);
      const diff = prevMonth === 0 ? 100 : ((thisMonth - prevMonth) / prevMonth) * 100;
      
      setDashboardData({ revenueThisMonth: thisMonth, diffPercent: diff });

      const { data: future, error: futureError } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('status', 'confirmed')
        .gte('data', now.toISOString().split('T')[0])
        .order('data', { ascending: true })
        .order('hora', { ascending: true });
      
      if (futureError) throw futureError;
      setFutureAppointments(future || []);
    } catch (err) {
      console.error("Erro ao buscar dados do dashboard:", err);
    }
  };

  const handleConfirmCancel = async (booking: Booking) => {
    if (!booking.id || !supabase) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('agendamentos')
        .update({ status: 'cancelado' })
        .eq('id', booking.id);

      if (error) {
        alert('Erro ao cancelar: ' + error.message);
        setIsSubmitting(false);
        return;
      }

      setFutureAppointments((prev) => (prev || []).filter(app => app.id !== booking.id));
      setToastMessage("Agendamento cancelado e horário liberado!");
      setTimeout(() => setToastMessage(null), 4000);

      fetchDashboardData();

      const formattedDate = (booking.data || '').split('-').reverse().join('/');
      const message = `Olá ${booking.nome_cliente || 'Cliente'}, infelizmente precisei cancelar seu agendamento de ${booking.servico || 'Consulta'} marcado para o dia ${formattedDate} às ${booking.hora || ''} por motivos de força maior. Por favor, entre em contato para reagendarmos ou para o reembolso.`;
      
      const phone = (booking.telefone || '').replace(/\D/g, '');
      if (phone) {
        const cleanPhone = phone.startsWith('55') ? phone : '55' + phone;
        const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
      }
      setConfirmingCancelId(null);
    } catch (err: any) {
      console.error("Erro crítico no fluxo de cancelamento:", err);
      alert('Erro inesperado ao processar cancelamento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchBloqueios = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase.from('bloqueios')
        .select('*')
        .gte('data', new Date().toISOString().split('T')[0])
        .order('data', { ascending: true });
      if (error) throw error;
      setBloqueios(data || []);
    } catch (err) {
      console.error("Erro ao buscar bloqueios:", err);
    }
  };

  useEffect(() => {
    if (session && isAdmin) {
      if (adminTab === 'dashboard') fetchDashboardData();
      if (adminTab === 'agenda') fetchBloqueios();
    }
  }, [session, isAdmin, adminTab]);

  const toggleAdmin = () => {
    const newAdmin = !isAdmin;
    setIsAdmin(newAdmin);
    window.history.pushState({}, '', newAdmin ? '/admin' : '/');
  };

  const handleSavePromo = async (id: string, value: number) => {
    if (!supabase) return;
    try {
      await supabase.from('servicos_config').upsert({ id_servico: id, desconto_porcentagem: value });
      fetchServiceConfigs();
    } catch (err) {
      console.error("Erro ao salvar promoção:", err);
    }
  };

  const handleAddBloqueio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    const form = e.target as HTMLFormElement;
    const data = (form.elements.namedItem('date') as HTMLInputElement).value;
    const hora = (form.elements.namedItem('time') as HTMLInputElement).value || null;
    try {
      await supabase.from('bloqueios').insert([{ data, hora }]);
      fetchBloqueios();
      form.reset();
    } catch (err) {
      console.error("Erro ao adicionar bloqueio:", err);
    }
  };

  const deleteBloqueio = async (id: string) => {
    if (!supabase) return;
    try {
      await supabase.from('bloqueios').delete().eq('id', id);
      fetchBloqueios();
    } catch (err) {
      console.error("Erro ao deletar bloqueio:", err);
    }
  };

  if (isAdmin && !session) {
    return (
      <div className="min-h-screen bg-mystic-deep flex items-center justify-center p-6 stars-overlay">
        <div className="w-full max-w-md bg-mystic-purple/20 border border-mystic-gold/30 backdrop-blur-xl p-10 rounded-3xl shadow-2xl">
          <div className="flex flex-col items-center gap-6 mb-10">
            <div className="w-20 h-20 bg-mystic-gold/10 rounded-full flex items-center justify-center border border-mystic-gold/20">
              <Lock className="text-mystic-gold w-8 h-8" />
            </div>
            <h1 className="font-serif text-3xl text-mystic-gold uppercase tracking-widest text-center">Portal Admin</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold ml-2">Email</label>
              <input type="email" required className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-mystic-gold outline-none" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold ml-2">Senha</label>
              <input type="password" required className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-mystic-gold outline-none" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
            </div>
            <button type="submit" className="w-full bg-mystic-gold text-mystic-deep font-bold p-4 rounded-2xl hover:scale-[1.02] transition-transform active:scale-95 shadow-lg shadow-mystic-gold/20 uppercase tracking-widest text-xs">Entrar no Painel</button>
          </form>
          <button onClick={toggleAdmin} className="w-full mt-6 text-xs text-white/40 hover:text-white uppercase tracking-widest">Voltar para o site</button>
        </div>
      </div>
    );
  }

  if (isAdmin && session) {
    return (
      <div className="min-h-screen bg-mystic-deep text-white flex flex-col md:flex-row relative">
        {toastMessage && (
          <div className="fixed bottom-10 right-10 z-[2000] animate-fade-in">
            <div className="bg-mystic-gold text-mystic-deep p-6 rounded-3xl shadow-2xl flex items-center gap-4 border-2 border-white/20">
              <BellRing className="w-6 h-6 animate-bounce" />
              <span className="font-bold uppercase tracking-widest text-xs">{toastMessage}</span>
              <button onClick={() => setToastMessage(null)}><X size={16} /></button>
            </div>
          </div>
        )}

        <div className="w-full md:w-80 bg-mystic-purple/10 border-r border-white/5 p-8 flex flex-col gap-10">
          <div className="flex items-center gap-4">
            <TarotCardIcon className="text-mystic-gold w-8 h-8" />
            <h2 className="font-serif text-xl text-mystic-gold uppercase tracking-tighter">Admin Console</h2>
          </div>
          <nav className="flex flex-col gap-2">
            <button onClick={() => setAdminTab('dashboard')} className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${adminTab === 'dashboard' ? 'bg-mystic-gold text-mystic-deep font-bold' : 'hover:bg-white/5'}`}>
              <LayoutDashboard size={20} /> Dashboard
            </button>
            <button onClick={() => setAdminTab('agenda')} className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${adminTab === 'agenda' ? 'bg-mystic-gold text-mystic-deep font-bold' : 'hover:bg-white/5'}`}>
              <Settings size={20} /> Agenda
            </button>
            <button onClick={() => setAdminTab('promo')} className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${adminTab === 'promo' ? 'bg-mystic-gold text-mystic-deep font-bold' : 'hover:bg-white/5'}`}>
              <Tag size={20} /> Promoções
            </button>
          </nav>
          <div className="mt-auto flex flex-col gap-4">
            <button onClick={() => supabase?.auth.signOut()} className="flex items-center gap-4 p-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all">
              <LogOut size={20} /> Sair
            </button>
            <button onClick={toggleAdmin} className="text-xs text-center text-white/30 hover:text-white uppercase tracking-widest">Ver site principal</button>
          </div>
        </div>

        <div className="flex-grow p-6 md:p-12 overflow-y-auto">
          {adminTab === 'dashboard' && (
            <div className="max-w-4xl space-y-12 animate-fade-in">
              <header>
                <h1 className="text-4xl font-serif mb-2">Visão Geral</h1>
                <p className="text-white/40">Controle financeiro e performance do mês.</p>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-4">
                  <span className="text-xs uppercase tracking-widest text-white/40 font-bold">Faturamento (Mês)</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-serif">R$ {(dashboardData.revenueThisMonth || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-bold ${dashboardData.diffPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {dashboardData.diffPercent >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {Math.abs(dashboardData.diffPercent || 0).toFixed(1)}% vs mês passado
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-10">
                <h3 className="font-serif text-2xl uppercase tracking-widest text-mystic-gold">Próximos Agendamentos</h3>
                <div className="grid gap-4">
                  {(futureAppointments || []).length === 0 && <p className="text-white/20 italic">Sem consultas agendadas para os próximos dias.</p>}
                  {(futureAppointments || []).map(app => (
                    <div key={app.id} className="bg-white/5 border border-white/5 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 hover:border-white/20 transition-all">
                      <div className="flex items-center gap-6 w-full">
                        <div className="w-14 h-14 rounded-2xl bg-mystic-gold/10 flex flex-col items-center justify-center border border-mystic-gold/20 shrink-0">
                          <span className="text-[10px] font-bold text-mystic-gold">{(app.data || '').split('-')[2]}</span>
                          <span className="text-[10px] uppercase font-bold text-white/50">{app.hora}</span>
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-white text-lg">{app.nome_cliente || 'Cliente'}</h4>
                          <p className="text-xs text-mystic-lavender/40 uppercase tracking-widest font-semibold">{app.servico || 'Consulta'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                         <a 
                          href={`https://wa.me/${(app.telefone || '').replace(/\D/g, '')}`} 
                          target="_blank" 
                          className="p-4 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all border border-green-500/20 flex items-center justify-center"
                        >
                          <MessageCircle size={18} />
                        </a>
                        
                        {confirmingCancelId === app.id ? (
                          <div className="flex gap-2 animate-fade-in">
                            <button 
                              onClick={() => handleConfirmCancel(app)}
                              disabled={isSubmitting}
                              className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-red-500/20"
                            >
                              <Check size={14} /> {isSubmitting ? '...' : 'Confirmar'}
                            </button>
                            <button 
                              onClick={() => setConfirmingCancelId(null)}
                              className="px-4 py-2 rounded-xl bg-white/10 text-white/50 hover:bg-white/20 transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                            >
                              <Undo2 size={14} /> Voltar
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setConfirmingCancelId(app.id!)}
                            className="p-4 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all border border-red-500/20 flex items-center justify-center gap-2 text-xs uppercase font-bold tracking-widest"
                          >
                            <UserX size={18} /> <span className="hidden lg:inline">Cancelar</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {adminTab === 'agenda' && (
            <div className="max-w-4xl space-y-12 animate-fade-in">
              <header>
                <h1 className="text-4xl font-serif mb-2">Gerenciar Agenda</h1>
                <p className="text-white/40">Bloqueie datas festivas ou horários de descanso.</p>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <form onSubmit={handleAddBloqueio} className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-6">
                  <h3 className="font-bold uppercase text-xs tracking-widest text-mystic-gold">Novo Bloqueio</h3>
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 uppercase font-bold">Data</label>
                    <input name="date" type="date" required className="w-full bg-black/40 p-4 rounded-xl border border-white/10 outline-none focus:border-mystic-gold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-white/40 uppercase font-bold">Hora (Vazio = Dia Todo)</label>
                    <select name="time" className="w-full bg-black/40 p-4 rounded-xl border border-white/10 outline-none focus:border-mystic-gold">
                      <option value="">Dia Todo</option>
                      {['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00', '17:00'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-white text-black font-bold p-4 rounded-xl text-xs uppercase tracking-widest hover:bg-mystic-gold transition-colors">Bloquear Horário</button>
                </form>
                <div className="space-y-6">
                  <h3 className="font-bold uppercase text-xs tracking-widest text-white/40">Bloqueios Ativos</h3>
                  <div className="space-y-2">
                    {(bloqueios || []).length === 0 && <p className="text-white/20 italic">Nenhum bloqueio futuro.</p>}
                    {(bloqueios || []).map(b => (
                      <div key={b.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-4">
                          <Ban size={16} className="text-red-400" />
                          <div>
                            <p className="text-sm font-bold">{new Date((b.data || '') + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                            <p className="text-[10px] uppercase text-white/40">{b.hora || 'Dia Todo'}</p>
                          </div>
                        </div>
                        <button onClick={() => deleteBloqueio(b.id)} className="p-2 text-white/30 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {adminTab === 'promo' && (
            <div className="max-w-4xl space-y-12 animate-fade-in">
              <header>
                <h1 className="text-4xl font-serif mb-2">Promoções & Descontos</h1>
                <p className="text-white/40">Aplique descontos em massa no catálogo.</p>
              </header>
              <div className="grid gap-4">
                {(SITE_DATA.catalog || []).map(service => (
                  <div key={service.id} className="bg-white/5 p-6 rounded-3xl border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={service.imageUrl || PLACEHOLDER_IMAGE} className="w-12 h-12 rounded-xl object-cover grayscale opacity-50" />
                      <div>
                        <h4 className="font-bold text-sm">{service.title || 'Consulta'}</h4>
                        <p className="text-[10px] uppercase text-white/40">{service.price || 'R$ 0'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end gap-1">
                        <label className="text-[8px] uppercase font-bold text-white/30">% Desconto</label>
                        <input 
                          type="number" 
                          min="0" max="100" 
                          defaultValue={serviceConfigs[service.id] || 0}
                          onBlur={(e) => handleSavePromo(service.id, parseInt(e.target.value || '0'))}
                          className="w-20 bg-black/40 border border-white/10 p-2 rounded-lg text-center outline-none focus:border-mystic-gold" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans overflow-x-hidden selection:bg-mystic-gold selection:text-mystic-deep bg-mystic-deep text-white">
      <div className="fixed inset-0 pointer-events-none z-0 stars-overlay opacity-30"></div>
      
      <a 
        href={`https://wa.me/${WHATSAPP_CONFIG.NUMBER}?text=${encodeURIComponent(WHATSAPP_CONFIG.MESSAGE)}`}
        target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[1000] w-14 h-14 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-2 border-mystic-gold/10 animate-pulse-gold"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 md:w-8 md:h-8 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821(0 00-3.48-8.413z"/></svg>
      </a>

      <header className="fixed top-0 left-0 w-full z-[999] px-6 py-6 md:py-8 flex justify-between items-center bg-mystic-deep/90 backdrop-blur-lg border-b border-purple-900/40">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <TarotCardIcon className="text-mystic-gold w-6 h-6" />
          <h1 className="font-serif text-xl md:text-2xl tracking-widest uppercase text-mystic-gold">{SITE_DATA.profile.name || 'Portal Místico'}</h1>
        </div>
        <nav className="hidden md:flex gap-8 text-sm uppercase tracking-widest font-semibold">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-mystic-gold transition-colors text-white">Sobre</button>
          <button onClick={() => document.getElementById('leituras')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-mystic-gold transition-colors text-white">Leituras</button>
          <button onClick={() => document.getElementById('avisos')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-mystic-gold transition-colors text-white">Avisos</button>
        </nav>
        <button onClick={() => document.getElementById('leituras')?.scrollIntoView({ behavior: 'smooth' })} className="bg-mystic-gold/10 border border-mystic-gold text-mystic-gold px-4 py-2 text-xs uppercase tracking-widest hover:bg-mystic-gold hover:text-mystic-deep transition-all">Agendar</button>
      </header>

      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative group animate-float">
            <div className="absolute -inset-4 bg-mystic-gold/20 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            <img src={SITE_DATA.profile.profileImage || PLACEHOLDER_IMAGE} alt={SITE_DATA.profile.name || 'Perfil'} className="relative rounded-3xl grayscale hover:grayscale-0 transition-all duration-700 border border-mystic-gold/30 shadow-2xl w-full" />
          </div>
          <div className="space-y-8">
            <h2 className="font-serif text-4xl md:text-6xl text-white tracking-widest uppercase">O caminho é claro</h2>
            <div className="p-8 bg-mystic-purple/20 border-l-4 border-mystic-gold backdrop-blur-md rounded-r-3xl">
              <p className="text-lg leading-relaxed text-mystic-lavender font-light italic">{SITE_DATA.profile.manifesto || ''}</p>
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-[10px] uppercase tracking-widest"><ShieldCheck className="w-4 h-4 text-mystic-gold" /> Ética Profissional</div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-[10px] uppercase tracking-widest"><Zap className="w-4 h-4 text-mystic-gold" /> Clareza Real</div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-[10px] uppercase tracking-widest"><Flame className="w-4 h-4 text-mystic-gold" /> Força Ancestral</div>
            </div>
          </div>
        </div>
        <button onClick={() => document.getElementById('leituras')?.scrollIntoView({ behavior: 'smooth' })} className="mt-16 animate-pulse-gold bg-mystic-gold text-mystic-deep px-12 py-6 rounded-full font-bold uppercase tracking-widest text-sm flex items-center gap-4 shadow-2xl">
          <MessageCircle className="w-6 h-6" /> Agende sua consulta
        </button>
      </section>

      <section id="avisos" className="relative z-10 py-24 px-6 bg-mystic-deep">
        <div className="max-w-4xl mx-auto space-y-20">
          <div className="text-center space-y-8 animate-fade-in">
            <h3 className="font-serif text-3xl md:text-4xl text-mystic-gold uppercase tracking-widest">A Verdade Oracular</h3>
            <div className="relative">
              <Quote className="absolute -top-6 -left-4 w-12 h-12 text-white/5" />
              <p className="text-lg md:text-xl leading-relaxed text-mystic-lavender font-light italic px-4">
                "Oráculos são bússolas, não sentenças. Minha missão é traduzir os sinais para que você possa caminhar com autonomia."
              </p>
            </div>
          </div>

          <div className="bg-mystic-purple/10 border-2 border-mystic-gold/20 rounded-[40px] p-8 md:p-12 shadow-2xl backdrop-blur-sm">
            <h3 className="font-serif text-2xl md:text-3xl text-white uppercase tracking-widest mb-10 text-center">Informações & Regras</h3>
            <ul className="grid gap-6 max-w-2xl mx-auto">
              <li className="flex gap-4 items-start">
                <div className="bg-mystic-gold/10 p-2 rounded-lg"><Ban className="w-5 h-5 text-mystic-gold" /></div>
                <p className="text-mystic-lavender text-sm">Jogos via WhatsApp (Fotos e Áudios). <strong className="text-white uppercase">SEM VIDEOCHAMADA.</strong></p>
              </li>
              <li className="flex gap-4 items-start">
                <div className="bg-mystic-gold/10 p-2 rounded-lg"><Wallet className="w-5 h-5 text-mystic-gold" /></div>
                <p className="text-mystic-lavender text-sm">Pagamento <strong className="text-white uppercase">ANTECIPADO</strong> (Pix, Boleto ou Cartão).</p>
              </li>
              <li className="flex gap-4 items-start">
                <div className="bg-mystic-gold/10 p-2 rounded-lg"><Timer className="w-5 h-5 text-mystic-gold" /></div>
                <p className="text-mystic-lavender text-sm">Tolerância para atrasos: 15 minutos.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="leituras" className="relative z-10 py-32 px-6 bg-mystic-deep/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="text-mystic-gold uppercase tracking-[0.3em] text-[10px] font-bold">Catálogo de Oráculos</span>
            <h3 className="font-serif text-4xl md:text-5xl text-white uppercase">Escolha seu Portal</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {['Todos', ...Object.values(DeckCategory)].map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat as any)} className={`px-8 py-3 rounded-full text-[10px] uppercase tracking-widest border transition-all ${activeCategory === cat ? 'bg-mystic-gold border-mystic-gold text-mystic-deep font-bold' : 'border-white/10 hover:border-mystic-gold text-white/50 hover:text-white'}`}>{cat}</button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(SITE_DATA.catalog || []).filter(s => activeCategory === 'Todos' || s.category === activeCategory).map(service => {
              const pricing = calculatePrice(service.price, service.id);
              return (
                <div key={service.id} className="group card-gradient border border-white/5 rounded-[40px] overflow-hidden hover:border-mystic-gold/40 transition-all flex flex-col shadow-2xl h-full">
                  <div className="relative h-72 overflow-hidden">
                    <img src={service.imageUrl || PLACEHOLDER_IMAGE} alt={service.title || 'Consulta'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-90 grayscale group-hover:grayscale-0" />
                    {pricing.hasDiscount && (
                      <div className="absolute top-6 right-6 bg-red-500 text-white font-bold text-[10px] uppercase tracking-tighter px-4 py-2 rounded-full shadow-lg">-{pricing.percent}% OFF</div>
                    )}
                    <div className="absolute bottom-6 left-6"><span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-white/10">{service.category}</span></div>
                  </div>
                  <div className="p-10 flex-grow flex flex-col gap-6">
                    <h4 className="font-serif text-2xl text-white group-hover:text-mystic-gold transition-colors">{service.title || 'Leitura Oracular'}</h4>
                    <p className="text-sm text-mystic-lavender/60 leading-relaxed">{service.description || ''}</p>
                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex flex-col">
                        {pricing.hasDiscount && <span className="text-xs text-white/30 line-through mb-1">{pricing.original}</span>}
                        <span className="font-serif text-2xl text-mystic-gold font-bold">{pricing.current}</span>
                      </div>
                      <button onClick={() => handleOpenModal(service)} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-mystic-gold hover:text-mystic-deep transition-all border border-white/10"><ChevronRight /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {isModalOpen && selectedService && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-mystic-deep/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-mystic-purple/20 border border-white/10 rounded-[50px] overflow-hidden shadow-2xl backdrop-blur-3xl">
            <div className="p-10 md:p-16 space-y-10">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="font-serif text-3xl text-white">{selectedService.title || 'Consulta'}</h4>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-mystic-gold font-bold">Reserva Online • Passo {bookingStep} de 3</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500/20 transition-colors"><X size={18} /></button>
              </div>

              {bookingStep === 1 && (
                <div className="space-y-10 animate-fade-in">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold ml-4">1. Escolha uma data</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[1,2,3,4,5,6].map(i => {
                        const d = new Date(Date.now() + i * 86400000);
                        const iso = d.toISOString().split('T')[0];
                        return (
                          <button key={iso} onClick={() => setSelectedDate(iso)} className={`p-4 rounded-2xl border text-xs transition-all ${selectedDate === iso ? 'bg-mystic-gold border-mystic-gold text-mystic-deep font-bold' : 'border-white/5 hover:border-white/20'}`}>
                            {d.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold ml-4">2. Horário Disponível</label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {(availableSlots || []).map(slot => (
                        <button key={slot.time} disabled={!slot.available} onClick={() => setSelectedTime(slot.time)} className={`p-4 rounded-xl border text-[10px] transition-all ${!slot.available ? 'opacity-10 cursor-not-allowed border-transparent' : selectedTime === slot.time ? 'bg-mystic-gold border-mystic-gold text-mystic-deep font-bold' : 'border-white/5 hover:border-white/20'}`}>
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {bookingStep === 2 && (
                <div className="space-y-8 animate-fade-in">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold ml-4">Seu Nome</label>
                    <input type="text" className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-white outline-none focus:border-mystic-gold" placeholder="Como devemos te chamar?" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold ml-4">WhatsApp</label>
                    <input type="tel" className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-white outline-none focus:border-mystic-gold" placeholder="(00) 00000-0000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>
              )}

              {bookingStep === 3 && (
                <div className="text-center space-y-8 animate-fade-in">
                  {!hasConfirmedPix ? (
                    <div className="flex flex-col items-center gap-8">
                      <div className="p-8 bg-black/40 rounded-[30px] border border-white/5 space-y-4 w-full">
                        <h5 className="font-serif text-2xl text-white">Finalizar Agendamento</h5>
                        <div className="flex justify-center gap-6 text-[10px] uppercase tracking-widest text-mystic-gold font-bold">
                          <span>{(selectedDate || '').split('-').reverse().join('/')}</span>
                          <span>{selectedTime}</span>
                        </div>
                        <p className="text-white font-serif text-xl">{calculatePrice(selectedService.price, selectedService.id).current}</p>
                      </div>

                      <div className="flex flex-col items-center gap-4">
                        <p className="text-mystic-gold text-xs uppercase tracking-widest font-bold">Escaneie o QR Code:</p>
                        <div className="bg-white p-6 rounded-3xl shadow-2xl flex items-center justify-center">
                          {qrCodeDataUrl ? (
                            <img src={qrCodeDataUrl} alt="QR Code PIX" className="w-48 h-48" />
                          ) : (
                            <div className="w-48 h-48 flex items-center justify-center text-mystic-deep animate-pulse">Gerando...</div>
                          )}
                        </div>
                        <div className="w-full max-w-xs space-y-2">
                          <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Ou copie a chave (CNPJ)</p>
                          <div className="flex gap-2">
                            <div className="flex-grow bg-black/40 border border-white/5 p-4 rounded-xl text-[10px] text-white/70 truncate">{PIX_CONFIG.KEY}</div>
                            <button onClick={handleCopyPix} className="bg-mystic-gold p-4 rounded-xl text-mystic-deep hover:scale-110 transition-transform">
                              {copyFeedback ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex items-center gap-4 text-left w-full">
                        <AlertCircle size={20} className="text-red-500 shrink-0" />
                        <p className="text-[10px] leading-relaxed text-red-200 uppercase font-bold tracking-widest">Importante: Após o Pix, clique em 'JÁ REALIZEI O PIX' e envie o comprovante no WhatsApp.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8 py-10">
                      <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/50 mx-auto"><CheckCircle2 size={40} className="text-green-500" /></div>
                      <h3 className="font-serif text-3xl">Sucesso!</h3>
                      <p className="text-mystic-lavender/60 text-sm">Agendamento registrado. Clique abaixo para nos enviar o comprovante.</p>
                      <button onClick={() => window.open(`https://wa.me/${WHATSAPP_CONFIG.NUMBER}?text=${encodeURIComponent(`Olá! Me chamo ${formData.name || 'Cliente'}. Fiz o Pix para ${selectedService.title || 'Consulta'} dia ${(selectedDate || '').split('-').reverse().join('/')} às ${selectedTime || ''}. Segue comprovante.`)}`, '_blank')} className="w-full bg-[#25D366] text-white p-6 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3"><MessageCircle /> Enviar Comprovante</button>
                    </div>
                  )}
                </div>
              )}

              {!hasConfirmedPix && (
                <div className="flex gap-4 pt-10">
                  {bookingStep > 1 && <button onClick={() => setBookingStep(bookingStep-1)} className="flex-1 p-6 rounded-2xl border border-white/10 font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 transition-colors">Voltar</button>}
                  <button 
                    disabled={isSubmitting || (bookingStep === 1 && !selectedTime) || (bookingStep === 2 && !formData.name)} 
                    onClick={() => bookingStep < 3 ? setBookingStep(bookingStep+1) : handleConfirmPix()} 
                    className="flex-[2] p-6 rounded-2xl bg-white text-black font-bold uppercase tracking-widest text-[10px] hover:bg-mystic-gold transition-colors disabled:opacity-20 shadow-xl"
                  >
                    {isSubmitting ? 'Processando...' : bookingStep === 3 ? 'JÁ REALIZEI O PIX' : 'Confirmar & Pagar'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="relative z-10 py-24 px-6 bg-black/80 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <TarotCardIcon className="text-mystic-gold w-8 h-8" />
              <h1 className="font-serif text-2xl tracking-widest uppercase text-mystic-gold">{SITE_DATA.profile.name || 'Portal Místico'}</h1>
            </div>
            <p className="text-sm text-mystic-lavender/30 leading-relaxed max-w-sm">Clareza, ética e ancestralidade para sua jornada de autoconhecimento.</p>
          </div>
          <div className="space-y-6">
            <h5 className="font-serif text-xl uppercase tracking-widest text-white">Navegação</h5>
            <div className="flex flex-col gap-4 text-sm text-white/40">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-left hover:text-mystic-gold transition-colors">Início</button>
              <button onClick={() => document.getElementById('leituras')?.scrollIntoView()} className="text-left hover:text-mystic-gold transition-colors">Serviços</button>
              <button onClick={toggleAdmin} className="text-left text-[9px] text-white/5 hover:text-white/20 transition-colors uppercase tracking-widest mt-10">Área Restrita</button>
            </div>
          </div>
          <div className="space-y-6">
            <h5 className="font-serif text-xl uppercase tracking-widest text-white">Redes</h5>
            <div className="flex gap-4">
              {[Star, Moon, Eye].map((Icon, i) => (
                <div key={i} className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white border border-white/5 hover:border-mystic-gold/40 transition-all"><Icon size={24} /></div>
              ))}
            </div>
            <p className="text-[10px] text-white/20 pt-10">© 2024 Portal de Clarividência Ética. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
