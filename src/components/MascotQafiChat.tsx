import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  X, 
  Sparkles, 
  Bot, 
  User, 
  RotateCcw, 
  Phone, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { askMascotQafi } from '../services/qafiAI';
import { COMPANY_INFO } from '../data/mockData';
import { MASCOT_QAFI_IMAGE } from '../assets/mascot';

interface Props {
  onOpenWhatsApp: (options?: any) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'qafi';
  text: string;
  timestamp: string;
}

export const MascotQafiChat: React.FC<Props> = ({ onOpenWhatsApp }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'qafi',
      text: `Assalamu’alaikum Warahmatullahi Wabarakatuh! 👋😊\n\nSaya **QAFI**, maskot & sahabat pemandu resmi Anda di **QAFIYA × Darul Hikmah Wisata**.\n\nAda yang bisa QAFI bantu untuk rencana perjalanan ibadah Anda ke Baitullah? Silakan pilih topik cepat di bawah atau ketik pertanyaan langsung!`,
      timestamp: 'Baru saja',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickQuestions = [
    '🕋 Paket Umrah Istimewa 12 Hari',
    '💰 Simulasi Cicilan Syariah Tanpa Riba',
    '🏨 Jarak Hotel Makkah & Madinah ke Masjid',
    '✈️ Jadwal Keberangkatan 2026–2027',
    '📄 Syarat Paspor & Visa Umrah',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const message = textToSend || inputMessage;
    if (!message.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: message.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        text: m.text,
      }));

      const replyText = await askMascotQafi(message, history);

      const qafiMsg: ChatMessage = {
        id: `qafi-${Date.now()}`,
        sender: 'qafi',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, qafiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'qafi',
          text: `Afwan sahabat, terjadi sedikit kendala sambungan. Namun Anda dapat langsung berkonsultasi via WhatsApp resmi kami di ${COMPANY_INFO.primaryWhatsApp} ya!`,
          timestamp: 'Sekarang',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'qafi',
        text: `Assalamu’alaikum! Percakapan baru telah dimulai. Saya QAFI, ada yang bisa dibantu seputar Umrah & Haji Syariah? 😊`,
        timestamp: 'Baru saja',
      },
    ]);
  };

  return (
    <>
      {/* Floating Mascot QAFI Action Button (Bottom Left) */}
      <div className="fixed bottom-6 left-5 z-40 flex flex-col items-start gap-2">
        {/* Cute Speech Bubble Badge */}
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="cursor-pointer bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-emerald-200 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-emerald-950/10"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[11px] sm:text-xs text-emerald-900">
              Tanya Maskot <strong>QAFI</strong> 🤖✨
            </span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Tanya Jawab Online Bersama Maskot QAFI"
          className="relative flex items-center gap-3 bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-white p-3 sm:px-4 sm:py-3 rounded-full shadow-xl shadow-emerald-900/30 transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-amber-300/60"
        >
          {/* Mascot QAFI Avatar */}
          <div className="relative w-11 h-11 rounded-full bg-white flex items-center justify-center p-0.5 shadow-md overflow-hidden border-2 border-amber-300">
            <img src={MASCOT_QAFI_IMAGE} alt="Maskot QAFI" className="w-full h-full object-cover object-top" />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 leading-none">
              Pemandu Digital
            </span>
            <span className="text-xs font-extrabold tracking-tight leading-snug">
              Tanya Maskot QAFI
            </span>
          </div>
        </button>
      </div>

      {/* Mascot QAFI Chat Window Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-y-0 left-0 sm:left-5 sm:bottom-20 sm:inset-y-auto sm:h-[590px] w-full sm:max-w-md z-50 flex flex-col bg-white sm:rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-950 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center p-0.5 border-2 border-amber-300 shadow-md shrink-0 overflow-hidden">
                <img src={MASCOT_QAFI_IMAGE} alt="Maskot QAFI" className="w-full h-full object-cover object-top" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white">Maskot QAFI</h3>
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.2 rounded-full">
                    AI Online
                  </span>
                </div>
                <div className="text-[11px] text-emerald-200/90 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Sahabat Pemandu Umrah QAFIYA × DHW</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title="Mulai Percakapan Baru"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title="Tutup Chat QAFI"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-white border border-amber-300 shadow-xs flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                      <img src={MASCOT_QAFI_IMAGE} alt="QAFI" className="w-full h-full object-cover object-top" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 shadow-xs ${
                      isUser
                        ? 'bg-emerald-700 text-white rounded-tr-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed font-sans">
                      {msg.text}
                    </div>
                    <div
                      className={`text-[9px] mt-1.5 text-right ${
                        isUser ? 'text-emerald-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs py-2">
                <div className="w-8 h-8 rounded-full bg-white border border-amber-300 shadow-xs flex items-center justify-center shrink-0 overflow-hidden">
                  <img src={MASCOT_QAFI_IMAGE} alt="QAFI" className="w-full h-full object-cover object-top" />
                </div>
                <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[11px] text-slate-500 ml-1">QAFI sedang mengetik...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="p-2.5 bg-white border-t border-slate-100 overflow-x-auto flex gap-1.5 no-scrollbar">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-[11px] font-medium text-slate-600 transition-colors shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Fast WhatsApp Gateway Handoff */}
          <div className="px-3 py-1.5 bg-emerald-50 border-t border-emerald-100 flex items-center justify-between text-[11px] text-emerald-900">
            <span>Ingin kepastian akad & amankan seat?</span>
            <button
              type="button"
              onClick={() => onOpenWhatsApp({ type: 'general' })}
              className="text-[#25D366] hover:underline font-bold flex items-center gap-1"
            >
              <span>Hubungi WA {COMPANY_INFO.primaryWhatsApp}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Tanya QAFI apa saja seputar Umrah & DHW..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white rounded-xl transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
