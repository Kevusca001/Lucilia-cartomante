
import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageCircle, 
  ShieldCheck, 
  Zap, 
  Flame,
  Quote,
  X,
  CheckCircle2,
  Copy,
  AlertCircle,
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
  BellRing,
  Plus,
  Edit2,
  Upload,
  Library,
  Save
} from 'lucide-react';
import { createClient, Session } from '@supabase/supabase-js';
import QRCode from 'qrcode';
import { DeckCategory, ServiceItem, TimeSlot, Bloqueio, Booking } from './types';
import { PixPayload } from './pixUtils';

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

const INITIAL_CATALOG: ServiceItem[] = [
  // BARALHO CIGANO (7 ITENS)
  { id: 'cigano-1', category: DeckCategory.CIGANO, title: 'Pergunta Avulsa', description: 'Uma resposta direta e objetiva para uma dúvida pontual.', price: 'R$ 20', discount: 0, imageUrl: 'https://kzrttlhfjhaortkrnqby.supabase.co/storage/v1/object/public/images-site/Pergunta%20avulsa.jpg' },
  { id: 'cigano-2', category: DeckCategory.CIGANO, title: 'Pacote - 2 Perguntas', description: 'Análise de dois temas interligados.', price: 'R$ 35', discount: 0, imageUrl: 'https://kzrttlhfjhaortkrnqby.supabase.co/storage/v1/object/public/images-site/Duas%20perguntas.jpg' },
  { id: 'cigano-3', category: DeckCategory.CIGANO, title: 'Pacote - 3 Perguntas', description: 'Visão completa sobre três questões específicas.', price: 'R$ 40', discount: 0, imageUrl: 'https://kzrttlhfjhaortkrnqby.supabase.co/storage/v1/object/public/images-site/3%20perguntas.jpg' },
  { id: 'cigano-4', category: DeckCategory.CIGANO, title: 'Orientação Espiritual', description: 'O que a espiritualidade tem para te dizer? (20 min)', price: 'R$ 50', discount: 0, imageUrl: 'https://kzrttlhfjhaortkrnqby.supabase.co/storage/v1/object/public/images-site/Conselho%20espiritual.jpg' },
  { id: 'cigano-5', category: DeckCategory.CIGANO, title: 'Caminho Afetivo', description: 'O que Ele(a) sente? + Como agir? (15 min)', price: 'R$ 50', discount: 0, imageUrl: 'https://kzrttlhfjhaortkrnqby.supabase.co/storage/v1/object/public/images-site/Caminho%20afetivo.jpg' },
  { id: 'cigano-6', category: DeckCategory.CIGANO, title: 'Sessão 30 Minutos', description: 'Leitura livre profunda para temas diversos.', price: 'R$ 65', discount: 0, imageUrl: 'https://kzrttlhfjhaortkrnqby.supabase.co/storage/v1/object/public/images-site/Meia%20hora.jpg' },
  { id: 'cigano-7', category: DeckCategory.CIGANO, title: 'Sessão 1 Hora Cigano', description: 'Imersão completa na sua jornada com o Baralho Cigano.', price: 'R$ 120', discount: 0, imageUrl: 'https://kzrttlhfjhaortkrnqby.supabase.co/storage/v1/object/public/images-site/Meia%20hora.jpg' },

  // POMBAGIRA (3 ITENS)
  { id: 'pombagira-1', category: DeckCategory.POMBAGIRA, title: 'Pergunta Avulsa Pombagira', description: 'Clareza sob a ótica da transformação e movimento.', price: 'R$ 29', discount: 0, imageUrl: 'https://kzrttlhfjhaortkrnqby.supabase.co/storage/v1/object/public/images-site/Movimento%20bombagira.jpg' },
  { id: 'pombagira-4', category: DeckCategory.POMBAGIRA, title: 'Voz da Pombagira', description: 'Mensagens diretas da espiritualidade feminina. (20 min)', price: 'R$ 57', discount: 0, imageUrl: 'https://kzrttlhfjhaortkrnqby.supabase.co/storage/v1/object/public/images-site/Movimento%20bombagira.jpg' },
  { id: 'pombagira-7', category: DeckCategory.POMBAGIRA, title: 'Sessão 1 Hora Pombagira', description: 'O poder da Pombagira guiando seus caminhos afetivos.', price: 'R$ 135', discount: 0, imageUrl: 'https://kzrttlhfjhaortkrnqby.supabase.co/storage/v1/object/public/images-site/Movimento%20bombagira.jpg' },

  // EXU (2 ITENS)
  { id: 'exu-1', category: DeckCategory.EXU, title: 'Estrutura e Proteção', description: 'Leitura focada em abertura de caminhos e proteção.', price: 'R$ 29', discount: 0, imageUrl: 'https://kzrttlhfjhaortkrnqby.supabase.co/storage/v1/object/public/images-site/Conselho%20espiritual.jpg' },
  { id: 'exu-5', category: DeckCategory.EXU, title: 'Sentimento & Ação', description: 'O que Ele(a) sente? + Como devo agir pela ótica de Exu.', price: 'R$ 60', discount: 0, imageUrl: 'https://kzrttlhfjhaortkrnqby.supabase.co/storage/v1/object/public/images-site/Conselho%20espiritual.jpg' },

  // TAROT (2 ITENS)
  { id: 'tarot-1', category: DeckCategory.TAROT, title: 'Pergunta Avulsa Tarot', description: 'Sabedoria dos arquétipos maiores para dúvidas pontuais.', price: 'R$ 25', discount: 0, imageUrl: 'https://kzrttlhfjhaortkrnqby.supabase.co/storage/v1/object/public/images-site/Arquetipos.jpg' },
  { id: 'tarot-4', category: DeckCategory.TAROT, title: 'Jornada Espiritual Tarot', description: 'Evolução e autoconhecimento através das lâminas. (20 min)', price: 'R$ 57', discount: 0, imageUrl: 'https://kzrttlhfjhaortkrnqby.supabase.co/storage/v1/object/public/images-site/Arquetipos.jpg' },

  // CONSELHO (1 ITEM)
  { id: 'conselho-1', category: DeckCategory.CONSELHO, title: 'Apenas um Conselho', description: 'Uma luz rápida para quando você precisa de uma direção.', price: 'R$ 20', discount: 0, imageUrl: 'https://kzrttlhfjhaortkrnqby.supabase.co/storage/v1/object/public/images-site/Pergunta%20avulsa.jpg' }
];

const SITE_DATA = {
  profile: {
    name: 'Lucilia Cartomante',
    manifesto: "Sou cartomante, oraculista e dirigente espiritual. Trabalho com o Baralho Cigano e o Baralho da Pombagira como ferramentas de clareza, consciência e tomada de decisão. Não atuo para iludir, prometer milagres ou criar dependência. Minhas leituras servem para quem está disposto a enxergar a própria verdade, assumir responsabilidade sobre as próprias escolhas e encerrar ciclos que já passaram do prazo. A espiritualidade, para mim, é prática, ética e madura. Ela orienta, mas não decide por você. Se você busca lucidez, coragem e alinhamento, seja bem-vindo.",
    profileImage: 'https://kzrttlhfjhaortkrnqby.supabase.co/storage/v1/object/public/images-site/Imagem%20Lucilia.jpeg' || PLACEHOLDER_IMAGE
  }
};

const PIX_CONFIG = { KEY: '21124858000138', NAME: 'LUCILIA CARTOMANTE', CITY: 'RIO DE JANEIRO' };
const WHATSAPP_CONFIG = { NUMBER: '5521991629472', MESSAGE: 'Olá, Lucilia! Gostaria de tirar uma dúvida.' };

const supabaseUrl = 'https://kzrttlhfjhaortkrnqby.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6cnR0bGhmamhhb3J0a3JucWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNTY5OTMsImV4cCI6MjA4MzkzMjk5M30.1A6-V3tkk3hoD5iXOnLvfQpFtvUQyita3Ek1z-Mz6tU';

const supabase = createClient(supabaseUrl, supabaseKey);

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(window.location.pathname === '/admin');
  const [session, setSession] = useState<Session | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | 'Todos'>('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [catalog, setCatalog] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Promo inputs state for local handling before save
  const [promoInputs, setPromoInputs] = useState<Record<string, number>>({});

  // Form State for My Games
  const [isEditingGame, setIsEditingGame] = useState(false);
  const [gameFormData, setGameFormData] = useState<Partial<ServiceItem>>({
    title: '', category: '', price: '', description: '', imageUrl: '', discount: 0
  });
  const [newCategory, setNewCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Booking State
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasConfirmedPix, setHasConfirmedPix] = useState(false);

  // Admin Data
  const [dashboardData, setDashboardData] = useState({ revenueThisMonth: 0, diffPercent: 0 });
  const [bloqueios, setBloqueios] = useState<Bloqueio[]>([]);
  const [futureAppointments, setFutureAppointments] = useState<Booking[]>([]);
  const [adminTab, setAdminTab] = useState<'dashboard' | 'agenda' | 'promo' | 'servicos'>('dashboard');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const safetyTimeout = setTimeout(() => { if (isLoading) setIsLoading(false); }, 5000);

    const init = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        await fetchCatalog();
      } catch (err) {
        console.error("App: Erro na inicialização:", err);
      } finally {
        setIsLoading(false);
        clearTimeout(safetyTimeout);
      }
    };

    init();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const fetchCatalog = async () => {
    try {
      const { data, error } = await supabase.from('servicos').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      
      if (data && data.length > 0) {
        const mapped: ServiceItem[] = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
          category: item.category,
          imageUrl: item.image_url,
          discount: item.discount || 0
        }));
        setCatalog(mapped);
        // Initialize promo inputs
        const inputs = mapped.reduce((acc, s) => ({ ...acc, [s.id]: s.discount }), {});
        setPromoInputs(inputs);
      } else {
        console.log("Banco vazio. Semeando INITIAL_CATALOG...");
        const seedPayload = INITIAL_CATALOG.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
          category: item.category,
          image_url: item.imageUrl,
          discount: item.discount
        }));
        await supabase.from('servicos').upsert(seedPayload);
        setCatalog(INITIAL_CATALOG);
        const inputs = INITIAL_CATALOG.reduce((acc, s) => ({ ...acc, [s.id]: s.discount }), {});
        setPromoInputs(inputs);
      }
    } catch (err) {
      console.error("Erro ao buscar catálogo:", err);
      setCatalog(INITIAL_CATALOG);
    }
  };

  const calculatePrice = (basePrice: string, discount: number = 0) => {
    const numeric = parseFloat((basePrice || '0').replace(/[^0-9,.]/g, '').replace(',', '.')) || 0;
    if (discount <= 0) return { original: basePrice, current: basePrice, numeric, hasDiscount: false };
    const current = numeric * (1 - discount / 100);
    return {
      original: basePrice || 'R$ 0,00',
      current: `R$ ${current.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      numeric: current,
      hasDiscount: true,
      percent: discount
    };
  };

  const categories = useMemo(() => {
    const cats = new Set(catalog.map(s => s.category));
    return Array.from(cats).sort();
  }, [catalog]);

  const fetchOccupiedSlots = async (date: string) => {
    const baseSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    try {
      const { data: booked } = await supabase.from('agendamentos').select('hora').eq('data', date).neq('status', 'cancelado');
      const { data: blocked } = await supabase.from('bloqueios').select('hora').eq('data', date);
      const busyTimes = new Set([...(booked?.map(b => b.hora) || []), ...(blocked?.map(b => b.hora) || [])]);
      const isDayBlocked = blocked?.some(b => b.hora === null);
      setAvailableSlots(baseSlots.map(s => ({ time: s, available: !isDayBlocked && !busyTimes.has(s) })));
    } catch (e) {
      setAvailableSlots(baseSlots.map(s => ({ time: s, available: true })));
    }
  };

  useEffect(() => { if (selectedDate && isModalOpen) fetchOccupiedSlots(selectedDate); }, [selectedDate, isModalOpen]);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage.from('images-site').upload(fileName, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('images-site').getPublicUrl(fileName);
      setGameFormData(prev => ({ ...prev, imageUrl: publicUrl }));
    } catch (err) {
      console.error("Erro no upload:", err);
      alert("Falha ao subir imagem.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const finalCategory = gameFormData.category === 'CUSTOM' ? newCategory : gameFormData.category;
      const finalId = gameFormData.id || `game-${Date.now()}`;
      const payload = {
        id: finalId,
        title: gameFormData.title,
        description: gameFormData.description,
        price: gameFormData.price,
        category: finalCategory,
        image_url: gameFormData.imageUrl || PLACEHOLDER_IMAGE,
        discount: gameFormData.discount || 0
      };
      const { error } = await supabase.from('servicos').upsert([payload]);
      if (error) throw error;
      setToastMessage("Jogo salvo com sucesso!");
      setIsEditingGame(false);
      fetchCatalog();
    } catch (err) {
      alert("Erro ao salvar: " + (err as any).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGame = async (id: string) => {
    try {
      const { error } = await supabase.from('servicos').delete().eq('id', id);
      if (error) throw error;
      fetchCatalog();
      setToastMessage("Jogo excluído.");
      setDeletingId(null);
    } catch (err) {
      alert("Falha ao excluir.");
    }
  };

  const handleSavePromo = async (id: string, newDiscount: number) => {
    try {
      const { error } = await supabase.from('servicos').update({ discount: newDiscount }).eq('id', id);
      if (error) throw error;
      setToastMessage("Desconto atualizado com sucesso!");
      fetchCatalog();
    } catch (err) {
      console.error("Erro ao salvar promoção:", err);
      alert("Falha ao atualizar desconto.");
    }
  };

  const handleAddBloqueio = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = (form.elements.namedItem('date') as HTMLInputElement).value;
    const hora = (form.elements.namedItem('time') as HTMLInputElement).value || null;
    try {
      const { error } = await supabase.from('bloqueios').insert([{ data, hora }]);
      if (error) throw error;
      setToastMessage("Horário bloqueado!");
      fetchBloqueios();
      form.reset();
    } catch (err) {
      console.error("Erro ao adicionar bloqueio:", err);
    }
  };

  const deleteBloqueio = async (id: string) => {
    try {
      const { error } = await supabase.from('bloqueios').delete().eq('id', id);
      if (error) throw error;
      setToastMessage("Bloqueio removido.");
      fetchBloqueios();
    } catch (err) {
      console.error("Erro ao deletar bloqueio:", err);
    }
  };

  const handleImportDefault = async () => {
    setIsSubmitting(true);
    try {
      const seedPayload = INITIAL_CATALOG.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        image_url: item.imageUrl,
        discount: 0
      }));
      await supabase.from('servicos').upsert(seedPayload);
      fetchCatalog();
      setToastMessage("Padrões importados.");
    } catch (err) { 
      alert("Falha na importação."); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenModal = (service: ServiceItem) => {
    setSelectedService(service);
    setIsModalOpen(true);
    setBookingStep(1);
    setSelectedDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    setHasConfirmedPix(false);
  };

  const handleConfirmPix = async () => {
    if (!selectedService || !selectedDate || !selectedTime) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('agendamentos').insert([{
        data: selectedDate, hora: selectedTime, nome_cliente: formData.name,
        telefone: formData.phone, servico: selectedService.title, status: 'confirmed' 
      }]);
      if (error) throw error;
      setHasConfirmedPix(true);
    } catch (err) { alert("Erro ao agendar."); } finally { setIsSubmitting(false); }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    if (error) alert('Login falhou: ' + error.message);
  };

  const fetchDashboardData = async () => {
    try {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const { data: bookings } = await supabase.from('agendamentos').select('*').eq('status', 'confirmed').gte('data', firstDay.split('T')[0]);
      const revenue = (bookings || []).reduce((acc, curr) => {
        const s = catalog.find(item => item.title === curr.servico);
        return acc + parseFloat((s?.price || '0').replace(/[^0-9.]/g, ''));
      }, 0);
      setDashboardData({ revenueThisMonth: revenue, diffPercent: 10 });
      const { data: future } = await supabase.from('agendamentos').select('*').eq('status', 'confirmed').gte('data', now.toISOString().split('T')[0]).order('data');
      setFutureAppointments(future || []);
    } catch (err) {}
  };

  const fetchBloqueios = async () => {
    const { data } = await supabase.from('bloqueios').select('*').gte('data', new Date().toISOString().split('T')[0]).order('data');
    setBloqueios(data || []);
  };

  useEffect(() => {
    if (session && isAdmin) {
      if (adminTab === 'dashboard') fetchDashboardData();
      if (adminTab === 'agenda') fetchBloqueios();
      if (adminTab === 'servicos') fetchCatalog();
    }
  }, [session, isAdmin, adminTab, catalog.length]);

  const toggleAdmin = () => {
    const newAdmin = !isAdmin;
    setIsAdmin(newAdmin);
    window.history.pushState({}, '', newAdmin ? '/admin' : '/');
  };

  if (isLoading) return (
    <div className="min-h-screen bg-mystic-deep flex flex-col items-center justify-center p-10 text-center">
      <TarotCardIcon className="text-mystic-gold w-16 h-16 animate-pulse" />
      <h1 className="text-xl font-serif text-mystic-gold mt-6 uppercase tracking-[0.3em]">Carregando Portal...</h1>
    </div>
  );

  if (isAdmin && !session) return (
    <div className="min-h-screen bg-mystic-deep flex items-center justify-center p-6 stars-overlay">
      <div className="w-full max-w-md bg-mystic-purple/20 border border-mystic-gold/30 backdrop-blur-xl p-10 rounded-3xl shadow-2xl">
        <h1 className="font-serif text-3xl text-mystic-gold uppercase tracking-widest text-center mb-10">Portal Admin</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <input type="email" required className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none" placeholder="Email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
          <input type="password" required className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none" placeholder="Senha" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
          <button type="submit" className="w-full bg-mystic-gold text-mystic-deep font-bold p-4 rounded-2xl shadow-lg uppercase text-xs">Entrar</button>
        </form>
        <button onClick={toggleAdmin} className="w-full mt-6 text-xs text-white/40 hover:text-white uppercase tracking-widest">Voltar</button>
      </div>
    </div>
  );

  if (isAdmin && session) return (
    <div className="min-h-screen bg-mystic-deep text-white flex flex-col md:flex-row relative">
      <div className="w-full md:w-80 bg-mystic-purple/10 border-r border-white/5 p-8 flex flex-col gap-10">
        <h2 className="font-serif text-xl text-mystic-gold uppercase">Admin Console</h2>
        <nav className="flex flex-col gap-2">
          <button onClick={() => setAdminTab('dashboard')} className={`flex items-center gap-4 p-4 rounded-2xl ${adminTab === 'dashboard' ? 'bg-mystic-gold text-mystic-deep font-bold' : 'hover:bg-white/5'}`}><LayoutDashboard size={20} /> Dashboard</button>
          <button onClick={() => setAdminTab('servicos')} className={`flex items-center gap-4 p-4 rounded-2xl ${adminTab === 'servicos' ? 'bg-mystic-gold text-mystic-deep font-bold' : 'hover:bg-white/5'}`}><Library size={20} /> Meus Jogos</button>
          <button onClick={() => setAdminTab('agenda')} className={`flex items-center gap-4 p-4 rounded-2xl ${adminTab === 'agenda' ? 'bg-mystic-gold text-mystic-deep font-bold' : 'hover:bg-white/5'}`}><Settings size={20} /> Agenda</button>
          <button onClick={() => setAdminTab('promo')} className={`flex items-center gap-4 p-4 rounded-2xl ${adminTab === 'promo' ? 'bg-mystic-gold text-mystic-deep font-bold' : 'hover:bg-white/5'}`}><Tag size={20} /> Promoções</button>
        </nav>
        <button onClick={() => supabase.auth.signOut()} className="mt-auto flex items-center gap-4 p-4 text-red-400 hover:bg-red-500/10 rounded-2xl"><LogOut size={20} /> Sair</button>
        <button onClick={toggleAdmin} className="text-xs text-center text-white/30 hover:text-white uppercase tracking-widest">Ver site</button>
      </div>

      <div className="flex-grow p-6 md:p-12 overflow-y-auto">
        {toastMessage && (
          <div className="fixed bottom-10 right-10 z-[2000] animate-fade-in bg-mystic-gold text-mystic-deep p-4 rounded-2xl shadow-2xl font-bold uppercase text-xs flex items-center gap-3">
            <BellRing size={16} /> {toastMessage}
          </div>
        )}

        {adminTab === 'servicos' && (
          <div className="max-w-5xl space-y-12 animate-fade-in">
            <header className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-serif">Meus Jogos</h1>
                <p className="text-white/40">Gerencie o seu catálogo de consultas.</p>
              </div>
              <div className="flex gap-4">
                <button onClick={handleImportDefault} className="px-6 py-3 rounded-xl border border-white/10 text-xs uppercase font-bold hover:bg-white/5">Importar Padrão</button>
                <button onClick={() => { setGameFormData({}); setIsEditingGame(true); }} className="px-6 py-3 bg-mystic-gold text-mystic-deep rounded-xl font-bold uppercase text-xs flex items-center gap-2"><Plus size={16} /> Novo Jogo</button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalog.map(game => (
                <div key={game.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden group hover:border-mystic-gold/40 transition-all flex flex-col">
                  <div className="relative h-40">
                    <img src={game.imageUrl || PLACEHOLDER_IMAGE} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button onClick={() => { setGameFormData(game); setIsEditingGame(true); }} className="p-2 bg-black/60 rounded-lg text-white hover:text-mystic-gold"><Edit2 size={16} /></button>
                      
                      {deletingId === game.id ? (
                        <button 
                          onClick={() => handleDeleteGame(game.id)}
                          className="px-3 py-2 bg-red-600 rounded-lg text-white font-bold text-[10px] uppercase animate-pulse"
                        >
                          Confirmar Exclusão?
                        </button>
                      ) : (
                        <button onClick={() => setDeletingId(game.id)} className="p-2 bg-black/60 rounded-lg text-white hover:text-red-400"><Trash2 size={16} /></button>
                      )}
                      
                      {deletingId === game.id && (
                        <button onClick={() => setDeletingId(null)} className="p-2 bg-black/60 rounded-lg text-white hover:text-white"><X size={16} /></button>
                      )}
                    </div>
                  </div>
                  <div className="p-6 space-y-2 flex-grow">
                    <span className="text-[10px] uppercase tracking-widest text-mystic-gold font-bold">{game.category}</span>
                    <h3 className="font-serif text-lg">{game.title}</h3>
                    <p className="text-xs text-white/40 line-clamp-2">{game.description}</p>
                    <div className="pt-4 font-bold text-mystic-gold">{game.price}</div>
                  </div>
                </div>
              ))}
            </div>

            {isEditingGame && (
              <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-mystic-deep/95 backdrop-blur-sm">
                <div className="bg-mystic-purple/30 border border-white/10 w-full max-w-2xl rounded-[40px] p-10 overflow-y-auto max-h-[90vh]">
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="font-serif text-3xl">{gameFormData.id ? 'Editar Jogo' : 'Novo Jogo'}</h2>
                    <button onClick={() => setIsEditingGame(false)}><X /></button>
                  </div>
                  <form onSubmit={handleSaveGame} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-white/40">Título</label>
                        <input required className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none" value={gameFormData.title} onChange={e => setGameFormData({...gameFormData, title: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-white/40">Preço (ex: R$ 50)</label>
                        <input required className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none" value={gameFormData.price} onChange={e => setGameFormData({...gameFormData, price: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-white/40">Categoria</label>
                      <select className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none" value={gameFormData.category} onChange={e => setGameFormData({...gameFormData, category: e.target.value})}>
                        <option value="">Selecione...</option>
                        {Object.values(DeckCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        {categories.filter(c => !Object.values(DeckCategory).includes(c as any)).map(c => <option key={c} value={c}>{c}</option>)}
                        <option value="CUSTOM">+ Criar Nova Categoria</option>
                      </select>
                      {gameFormData.category === 'CUSTOM' && (
                        <input className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none" placeholder="Nome da nova categoria" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-white/40">Descrição</label>
                      <textarea required rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none" value={gameFormData.description} onChange={e => setGameFormData({...gameFormData, description: e.target.value})} />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase font-bold text-white/40">Imagem do Jogo</label>
                      <div className="flex items-center gap-6">
                        <div className="w-32 h-32 rounded-2xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center">
                          {gameFormData.imageUrl ? <img src={gameFormData.imageUrl} className="w-full h-full object-cover" /> : <TarotCardIcon className="opacity-20" />}
                        </div>
                        <label className="flex-grow cursor-pointer bg-white/5 border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center gap-2 hover:border-mystic-gold transition-all">
                          <Upload className="text-mystic-gold" />
                          <span className="text-xs font-bold uppercase tracking-widest">{isUploading ? 'Subindo...' : 'Trocar Foto'}</span>
                          <input type="file" hidden accept="image/*" onChange={handleUploadImage} disabled={isUploading} />
                        </label>
                      </div>
                    </div>
                    <button type="submit" disabled={isSubmitting || isUploading} className="w-full bg-mystic-gold text-mystic-deep font-bold p-6 rounded-2xl shadow-xl uppercase text-xs">Salvar Jogo</button>
                  </form>
                </div>
              </div>
            )}
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
                  <input name="date" type="date" required className="w-full bg-black/40 p-4 rounded-xl border border-white/10 outline-none focus:border-mystic-gold text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-white/40 uppercase font-bold">Hora (Vazio = Dia Todo)</label>
                  <select name="time" className="w-full bg-black/40 p-4 rounded-xl border border-white/10 outline-none focus:border-mystic-gold text-white">
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
              {catalog.map(service => (
                <div key={service.id} className="bg-white/5 p-6 rounded-3xl border border-white/10 flex items-center justify-between group hover:border-white/20 transition-all">
                  <div className="flex items-center gap-4">
                    <img src={service.imageUrl || PLACEHOLDER_IMAGE} className="w-12 h-12 rounded-xl object-cover grayscale opacity-50" />
                    <div>
                      <h4 className="font-bold text-sm">{service.title}</h4>
                      <p className="text-[10px] uppercase text-white/40">{service.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end gap-1">
                      <label className="text-[8px] uppercase font-bold text-white/30">% Desconto</label>
                      <input 
                        type="number" 
                        min="0" max="100" 
                        value={promoInputs[service.id] ?? service.discount}
                        onChange={(e) => setPromoInputs({ ...promoInputs, [service.id]: parseInt(e.target.value || '0') })}
                        className="w-20 bg-black/40 border border-white/10 p-2 rounded-lg text-center outline-none focus:border-mystic-gold text-white" 
                      />
                    </div>
                    <button 
                      onClick={() => handleSavePromo(service.id, promoInputs[service.id] || 0)}
                      className="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase transition-colors shadow-lg"
                    >
                      <Save size={14} /> Salvar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {adminTab === 'dashboard' && (
          <div className="max-w-4xl space-y-12 animate-fade-in">
            <h1 className="text-4xl font-serif">Visão Geral</h1>
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <span className="text-xs uppercase text-white/40">Faturamento Mês</span>
              <div className="text-4xl font-serif mt-2">R$ {dashboardData.revenueThisMonth.toLocaleString('pt-BR')}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-mystic-deep text-white font-sans overflow-x-hidden selection:bg-mystic-gold selection:text-mystic-deep">
      <div className="fixed inset-0 stars-overlay opacity-30 z-0"></div>
      
      <a href={`https://wa.me/${WHATSAPP_CONFIG.NUMBER}`} className="fixed bottom-6 right-6 z-[1000] w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl animate-pulse-gold"><MessageCircle /></a>

      <header className="fixed top-0 left-0 w-full z-[999] px-6 py-8 flex justify-between items-center bg-mystic-deep/90 backdrop-blur-lg border-b border-purple-900/40">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          <TarotCardIcon className="text-mystic-gold w-6 h-6" />
          <h1 className="font-serif text-xl tracking-widest uppercase text-mystic-gold">{SITE_DATA.profile.name}</h1>
        </div>
        <nav className="hidden md:flex gap-8 text-[10px] uppercase tracking-widest font-bold">
          <button onClick={() => window.scrollTo(0,0)}>Sobre</button>
          <button onClick={() => document.getElementById('leituras')?.scrollIntoView()}>Leituras</button>
          <button onClick={() => document.getElementById('avisos')?.scrollIntoView()}>Avisos</button>
        </nav>
        <button onClick={() => document.getElementById('leituras')?.scrollIntoView()} className="bg-mystic-gold/10 border border-mystic-gold text-mystic-gold px-6 py-2 text-[10px] uppercase font-bold">Agendar</button>
      </header>

      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative group animate-float">
            <div className="absolute -inset-4 bg-mystic-gold/20 rounded-full blur-3xl opacity-50"></div>
            <img src={SITE_DATA.profile.profileImage} className="relative rounded-3xl grayscale hover:grayscale-0 transition-all duration-1000 border border-mystic-gold/30 w-full" />
          </div>
          <div className="space-y-8">
            <h2 className="font-serif text-5xl text-white uppercase tracking-widest">O caminho é claro</h2>
            <div className="p-8 bg-mystic-purple/20 border-l-4 border-mystic-gold backdrop-blur-md rounded-r-3xl">
              <p className="text-lg leading-relaxed text-mystic-lavender font-light italic">{SITE_DATA.profile.manifesto}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="leituras" className="relative z-10 py-32 px-6 bg-mystic-deep/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <span className="text-mystic-gold uppercase tracking-[0.3em] text-[10px] font-bold">Catálogo de Oráculos</span>
            <h3 className="font-serif text-5xl text-white uppercase">Escolha seu Portal</h3>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            <button onClick={() => setActiveCategory('Todos')} className={`px-8 py-3 rounded-full text-[10px] uppercase tracking-widest border transition-all ${activeCategory === 'Todos' ? 'bg-mystic-gold border-mystic-gold text-mystic-deep font-bold' : 'border-white/10'}`}>Todos</button>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-8 py-3 rounded-full text-[10px] uppercase tracking-widest border transition-all ${activeCategory === cat ? 'bg-mystic-gold border-mystic-gold text-mystic-deep font-bold' : 'border-white/10'}`}>{cat}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {catalog.filter(s => activeCategory === 'Todos' || s.category === activeCategory).map(service => {
              const pricing = calculatePrice(service.price, service.discount);
              return (
                <div key={service.id} className="group card-gradient border border-white/5 rounded-[40px] overflow-hidden hover:border-mystic-gold/40 transition-all flex flex-col shadow-2xl h-full">
                  <div className="relative h-72 overflow-hidden">
                    <img src={service.imageUrl || PLACEHOLDER_IMAGE} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-90 grayscale group-hover:grayscale-0" />
                    {pricing.hasDiscount && <div className="absolute top-6 right-6 bg-red-500 text-white font-bold text-[10px] uppercase px-4 py-2 rounded-full">-{pricing.percent}%</div>}
                    <div className="absolute bottom-6 left-6"><span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-bold uppercase px-4 py-2 rounded-full border border-white/10">{service.category}</span></div>
                  </div>
                  <div className="p-10 flex-grow flex flex-col gap-6">
                    <h4 className="font-serif text-2xl group-hover:text-mystic-gold transition-colors">{service.title}</h4>
                    <p className="text-sm text-mystic-lavender/60 leading-relaxed">{service.description}</p>
                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex flex-col">
                        {pricing.hasDiscount && <span className="text-xs text-white/30 line-through">{pricing.original}</span>}
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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-mystic-deep/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-mystic-purple/20 border border-white/10 rounded-[50px] overflow-hidden shadow-2xl backdrop-blur-3xl p-10">
            <div className="flex justify-between items-start mb-10">
              <h4 className="font-serif text-3xl">{selectedService.title}</h4>
              <button onClick={() => setIsModalOpen(false)}><X /></button>
            </div>
            {bookingStep === 1 && (
              <div className="space-y-10 animate-fade-in">
                <div className="grid grid-cols-2 gap-3">
                  {[1,2,3,4,5,6].map(i => {
                    const d = new Date(Date.now() + i * 86400000);
                    const iso = d.toISOString().split('T')[0];
                    return <button key={iso} onClick={() => setSelectedDate(iso)} className={`p-4 rounded-2xl border text-xs ${selectedDate === iso ? 'bg-mystic-gold text-mystic-deep font-bold' : 'border-white/5'}`}>{d.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}</button>;
                  })}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map(slot => <button key={slot.time} disabled={!slot.available} onClick={() => setSelectedTime(slot.time)} className={`p-4 rounded-xl border text-[10px] ${!slot.available ? 'opacity-10' : selectedTime === slot.time ? 'bg-mystic-gold text-mystic-deep' : 'border-white/5'}`}>{slot.time}</button>)}
                </div>
              </div>
            )}
            <div className="flex gap-4 pt-10">
               <button onClick={() => bookingStep < 3 ? setBookingStep(bookingStep+1) : handleConfirmPix()} className="w-full bg-white text-black font-bold p-6 rounded-2xl uppercase text-[10px]">{bookingStep === 3 ? 'Finalizar' : 'Próximo'}</button>
            </div>
          </div>
        </div>
      )}

      <footer className="relative z-10 py-24 px-6 bg-black/80 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <TarotCardIcon className="text-mystic-gold w-8 h-8" />
            <h1 className="font-serif text-2xl tracking-widest text-mystic-gold uppercase">{SITE_DATA.profile.name}</h1>
          </div>
          <button onClick={toggleAdmin} className="text-[9px] text-white/5 hover:text-white transition-all uppercase tracking-widest">Portal Administrativo</button>
        </div>
      </footer>
    </div>
  );
};

export default App;
