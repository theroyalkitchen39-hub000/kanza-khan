import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, MessageCircle } from 'lucide-react';
import { MenuItem, WebsiteSettings } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AIChatModalProps {
  menuItems: MenuItem[];
  settings: WebsiteSettings;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({ menuItems, settings }) => {
  const { isUrdu } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: isUrdu
        ? 'السلام علیکم! میں دی رائل کچن کا اسسٹنٹ ہوں۔ میں آج کے مینو، قیمتوں، مریض کے کھانے اور ڈیلیوری چارجز کے بارے میں آپ کی رہنمائی کر سکتا ہوں۔ آپ کیا جاننا چاہتے ہیں؟'
        : 'Assalam-o-Alaikum! Welcome to The Royal Kitchen. I can help you with today\'s menu, item prices, patient special diet food, and Karachi delivery charges. How can I help you today?',
      timestamp: 'Just now',
    },
  ]);

  const quickQuestions = isUrdu
    ? [
        "آج کا مینو کیا ہے؟",
        "چکن بریانی کی قیمت کیا ہے؟",
        "ڈیلیوری چارجز کتنے ہیں؟",
        "مریضوں کیلئے کیا کھانا دستیاب ہے؟",
        "آرڈر کیسے کریں؟"
      ]
    : [
        "What is today's menu?",
        "Chicken biryani price?",
        "What are your delivery charges?",
        "What patient food is available?",
        "How can I order?"
      ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Knowledge generation based on current live menu items
  const generateAssistantAnswer = (query: string): string => {
    const q = query.toLowerCase();

    // 1. Today's menu
    if (q.includes("today") || q.includes("menu") || q.includes("مینو") || q.includes("آج")) {
      const dailyItems = menuItems.filter(i => i.isDailyMenu && i.isAvailable);
      if (dailyItems.length === 0) {
        return isUrdu 
          ? "آج کے مینو میں ہمارے پاس تازہ دم چکن بریانی، روایتی چکن کڑاہی، تڑکا دال چاول اور شاہی کھیر تیار ہے۔"
          : "Today's fresh daily menu features: " + menuItems.slice(0, 5).map(i => `${i.name} (Rs. ${i.price})`).join(', ') + ". All cooked fresh today!";
      }
      const list = dailyItems.map(i => `• ${i.name} — Rs. ${i.price}`).join('\n');
      return isUrdu
        ? `آج کے مینو میں درج ذیل تازہ گھریلو پکوان دستیاب ہیں:\n${list}\n\nآپ اوپر مینو سے کارٹ میں شامل کر کے آن لائن آرڈر کر سکتے ہیں۔`
        : `Here is Today's Fresh Daily Menu:\n${list}\n\nAll items are prepared fresh with authentic home kitchen hygiene!`;
    }

    // 2. Biryani price
    if (q.includes("biryani") || q.includes("بریانی")) {
      const biryani = menuItems.find(i => i.name.toLowerCase().includes("biryani"));
      return isUrdu
        ? "چکن بریانی سنگل پلیٹ Rs. 380، جبکہ آن آرڈر ہانڈی ½ KG کیلئے Rs. 1,300 اور 1 KG کیلئے Rs. 2,200 ہے۔ آلو دم بریانی ½ KG کیلئے Rs. 1,000 ہے۔"
        : "Our Special Chicken Biryani is Rs. 380 for a single plate. For advance bulk orders, ½ KG is Rs. 1,300 and 1 KG is Rs. 2,200. Aloo Dum Biryani is Rs. 1,000 for ½ KG and Rs. 1,800 for 1 KG.";
    }

    // 3. Karahi / Qorma / Handi
    if (q.includes("karahi") || q.includes("کڑاہی") || q.includes("qorma") || q.includes("قورمہ") || q.includes("handi")) {
      return isUrdu
        ? "تازہ چکن کڑاہی روزانہ سنگل پلیٹ Rs. 450 اور آن آرڈر ½ KG کیلئے Rs. 1,200 ہے۔ کریمی وائٹ کڑاہی Rs. 1,500 ہے۔ شاہی چکن قورمہ ½ KG Rs. 1,500 اور 1 KG Rs. 2,800 ہے۔"
        : "Chicken Karahi is Rs. 450 for single serving and Rs. 1,200 for ½ KG. Creamy White Karahi is Rs. 1,500 (½ KG). Shahi Chicken Qorma is Rs. 1,500 (½ KG) and Rs. 2,800 (1 KG).";
    }

    // 4. Delivery charges & area
    if (q.includes("delivery") || q.includes("charges") || q.includes("کراچی") || q.includes("ڈیلیوری") || q.includes("area") || q.includes("location")) {
      return isUrdu
        ? "دی رائل کچن گلشن اقبال، بلاک 6 سے آپریٹ کرتا ہے اور پورے کراچی میں ڈیلیوری فراہم کرتا ہے۔ ڈیلیوری چارجز علاقے کے مطابق ہیں (مثلاً گلشن اقبال Rs. 150، گلستان جوہر Rs. 200، پی ای سی ایچ ایس Rs. 250، کلفٹن/ڈی ایچ اے Rs. 350)۔"
        : "We operate from Gulshan-e-Iqbal, Block 6, Karachi and deliver all across Karachi. Delivery charges depend on your area (e.g., Gulshan-e-Iqbal Rs. 150, Gulistan-e-Jauhar Rs. 200, PECHS Rs. 250, Clifton/DHA Rs. 350).";
    }

    // 5. Patient food
    if (q.includes("patient") || q.includes("مریض") || q.includes("diet") || q.includes("sick") || q.includes("hospital") || q.includes("oil")) {
      const patientItems = menuItems.filter(i => i.isPatientSpecial || i.category === 'patient');
      const list = patientItems.map(i => `• ${i.name} (Rs. ${i.price})`).join('\n');
      return isUrdu
        ? `ہم مریضوں کیلئے خصوصی پرہیزی کھانا تیار کرتے ہیں (کم نمک، برائے نام تیل، بغیر لال مرچ):\n${list || '• چکن ہلکی کھچڑی (Rs. 320)\n• لوکی و چکن ہلکا شوربہ (Rs. 380)\n• مونگ دال مع 2 نرم روٹیاں (Rs. 240)'}\n\nیہ خاص طور پر معدے کے مریضوں اور بزرگوں کیلئے موزوں ہے۔`
        : `We have a dedicated Patient Special section prepared with zero red chili, heart-friendly minimal oil, and gentle digestive spices:\n${list || '• Mild Chicken Khichdi (Rs. 320)\n• Clear Chicken Broth & Lauki (Rs. 380)\n• Moong Daal with 2 Soft Rotis (Rs. 240)'}\n\nCooked with utmost hygiene and care for patients and elderly.`;
    }

    // 6. How to order & Payment
    if (q.includes("order") || q.includes("pay") || q.includes("jazzcash") || q.includes("cod") || q.includes("آرڈر") || q.includes("ادائیگی")) {
      return isUrdu
        ? "آرڈر کرنے کا طریقہ بہت آسان ہے:\n1. مینو سے اپنی پسندیدہ اشیاء کارٹ میں شامل کریں\n2. اپنا نام، پتہ اور علاقہ درج کریں\n3. ہمارا کاروبار کیش آن ڈیلیوری (COD) قبول نہیں کرتا — صرف آن لائن ادائیگی قبول ہے جاز کیش (0300 2934707) پر\n4. آرڈر مکمل کرتے ہی رسید واٹس ایپ 0336 2046434 پر خودکار بھیجی جا سکتی ہے۔"
        : "To order:\n1. Click 'Add to Cart' on any dish.\n2. Open your Cart, pick your Karachi area, and fill in your delivery address.\n3. IMPORTANT: ONLINE PAYMENT ONLY (No Cash on Delivery). Send payment to JazzCash: 0300 2934707.\n4. Click 'Place Order & Send via WhatsApp' to verify with our kitchen at 0336 2046434!";
    }

    // 7. Paratha / Roti
    if (q.includes("paratha") || q.includes("roti") || q.includes("پراٹھا") || q.includes("روٹی")) {
      return isUrdu
        ? "گھریلو روٹی Rs. 30 ہے۔ آلو پراٹھا Rs. 140 (6 عدد Rs. 840)، دال پراٹھا Rs. 140، بیسن پراٹھا Rs. 140، بیسن روٹی Rs. 100، اور سیخ کباب 6 عدد Rs. 600 ہے۔"
        : "Homemade Roti is Rs. 30. Stuffed Parathas (Aloo, Daal, Besan) are Rs. 140 each (or Rs. 840 for 6). Besan Roti is Rs. 100 (6 for Rs. 600). Seekh Kabab is Rs. 600 (6 pcs) or Rs. 1,200 (12 pcs).";
    }

    // 8. Frozen items
    if (q.includes("frozen") || q.includes("فروزن") || q.includes("shami") || q.includes("kofta")) {
      return isUrdu
        ? "فروزن آئٹمز:\n• چکن کوفتے (12 عدد) — Rs. 1,200\n• چکن شامی کباب (12 عدد) — Rs. 900\n• بیف شامی کباب (12 عدد) — Rs. 1,100"
        : "Our Homemade Frozen items (ready to fry/simmer):\n• Chicken Kofta (12 pcs) — Rs. 1,200\n• Chicken Shami (12 pcs) — Rs. 900\n• Beef Shami (12 pcs) — Rs. 1,100";
    }

    // Default polite response
    return isUrdu
      ? "دی رائل کچن سے رابطہ کرنے کا شکریہ! ہم کراچی میں معیاری گھریلو کھانا ڈیلیور کرتے ہیں۔ آپ روزانہ کا مینو، مریضوں کا کھانا، یا آن آرڈر پکوان اوپر دیکھ سکتے ہیں، یا براہ راست واٹس ایپ (0336 2046434) پر بات کر سکتے ہیں۔"
      : "Thank you for asking! The Royal Kitchen delivers freshly prepared homemade food across Karachi. You can order from Today's Menu, Patient Special, or On Order items. For any custom requests, you can also reach us on WhatsApp at 0336 2046434.";
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Now',
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const answer = generateAssistantAnswer(text);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: answer,
        timestamp: 'Now',
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-zinc-950 text-white border-2 border-amber-400 shadow-xl hover:scale-105 transition-transform duration-200 cursor-pointer group"
          aria-label="Ask AI Assistant"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black">
            <Sparkles className="w-4 h-4 fill-black" />
          </div>
          <span className="font-extrabold text-sm text-amber-300">
            {isUrdu ? 'اے آئی اسسٹنٹ' : 'Ask AI'}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-92 sm:w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-white rounded-2xl shadow-2xl border border-amber-400/40 z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-zinc-950 text-white flex items-center justify-between border-b border-amber-500/20">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-black">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">
                  The Royal Kitchen AI
                </h3>
                <p className="text-[11px] text-amber-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Online • Instant Answers
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-zinc-50/70">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-black flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                    m.sender === 'user'
                      ? 'bg-zinc-950 text-white font-medium rounded-tr-none'
                      : 'bg-white border border-zinc-200 text-zinc-900 rounded-tl-none'
                  }`}
                >
                  {m.text}
                </div>

                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-zinc-500 p-2">
                <Bot className="w-4 h-4 text-amber-500 animate-spin" />
                <span>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Question Chips */}
          <div className="p-2 bg-white border-t border-zinc-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap bg-zinc-100 hover:bg-amber-100 hover:text-amber-900 text-zinc-700 transition border border-zinc-200 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Row */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-zinc-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isUrdu ? "کوئی بھی سوال پوچھیں..." : "Ask about menu, prices, delivery..."}
              className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl border border-zinc-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-xl gold-button text-black disabled:opacity-40 transition cursor-pointer"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
