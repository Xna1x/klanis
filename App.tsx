import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Upload, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  PieChart, 
  FileSpreadsheet,
  X,
  Mail
} from 'lucide-react';

// --- Components ---

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
      <a href="#" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
          <BarChart3 className="text-white" size={24} />
        </div>
        <span className="text-xl font-extrabold tracking-tight text-brand-dark">E-COM <span className="text-brand-primary">AI</span></span>
      </a>
      <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
        <a href="#features" className="hover:text-brand-primary transition-colors">Преимущества</a>
        <a href="#how-it-works" className="hover:text-brand-primary transition-colors">Как это работает</a>
        <a href="#upload" className="px-5 py-2.5 bg-brand-primary text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
          Начать анализ
        </a>
      </div>
    </div>
  </nav>
);

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
      <Icon size={28} className="text-brand-primary group-hover:text-white" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-brand-dark">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

const Step = ({ number, title, desc }: { number: string, title: string, desc: string }) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-12 h-12 rounded-full bg-indigo-100 text-brand-primary flex items-center justify-center font-bold text-lg mb-6 border-4 border-white shadow-sm">
      {number}
    </div>
    <h4 className="text-lg font-bold mb-2 text-brand-dark">{title}</h4>
    <p className="text-slate-500 text-sm max-w-[200px]">{desc}</p>
  </div>
);

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const sendToTelegram = async () => {
    if (!file || !email) return;

    // Формируем сообщение для Telegram
    const message = `
🔥 *НОВАЯ ЗАЯВКА НА АНАЛИЗ*

📧 Email: ${email}
📁 Файл: ${file.name}
📊 Размер файла: ${(file.size / 1024).toFixed(2)} KB
⏰ Время: ${new Date().toLocaleString('ru-RU')}
    `.trim();

    try {
      // Создаем FormData для отправки файла
      const formData = new FormData();
      formData.append('chat_id', '8561435009');
      formData.append('document', file); // Сам файл
      formData.append('caption', message); // Подпись к файлу
      formData.append('parse_mode', 'Markdown');

      const response = await fetch(`https://api.telegram.org/bot8066095363:AAEs-Ruk3NqLCmTkCE6LbhvQ3xLguDIyriw/sendDocument`, {
        method: 'POST',
        body: formData,
        // ВАЖНО: не указываем headers Content-Type при использовании FormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Ошибка Telegram: ${errorData.description}`);
      }
    } catch (err) {
      console.error('Ошибка отправки в Telegram:', err);
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!file) {
      setError('Пожалуйста, выберите файл для анализа');
      return;
    }
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Пожалуйста, введите корректный email');
      return;
    }

    setError(null);
    setUploading(true);
    
    try {
      // Отправляем данные в Telegram
      await sendToTelegram();
      
      // Показываем сообщение об успехе
      setSuccess(true);
      
      // Сбрасываем форму
      setTimeout(() => {
        setFile(null);
        setEmail('');
      }, 2000);
    } catch (err) {
      setError('Ошибка отправки заявки. Пожалуйста, попробуйте позже.');
      console.error('Ошибка:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-brand-primary selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-brand-primary text-xs font-bold tracking-wider uppercase rounded-full mb-6 border border-indigo-100">
                <Zap size={14} /> Нейросеть для вашего бизнеса
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] mb-6 text-brand-dark">
                Превратите данные продаж в <span className="text-brand-primary">чистую прибыль</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
                Загрузите выгрузку из вашего магазина (WB, Ozon, Shopify) и получите глубокий аудит ассортимента, прогноз спроса и поиск скрытых точек роста за 60 секунд.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#upload" className="px-8 py-4 bg-brand-primary text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-200">
                  Попробовать бесплатно <ArrowRight size={20} />
                </a>
                <div className="flex items-center gap-4 px-6 py-4 text-slate-500 text-sm italic">
                  <ShieldCheck className="text-emerald-500" size={24} /> 100% Конфиденциально
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 overflow-hidden relative">
                <div className="flex items-center justify-between mb-8">
                  <div className="h-6 w-32 bg-slate-100 rounded-lg"></div>
                  <div className="h-6 w-6 bg-slate-50 rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="h-24 bg-indigo-50 rounded-2xl flex flex-col justify-center px-6">
                    <span className="text-[10px] uppercase font-bold text-indigo-400">Маржа</span>
                    <span className="text-2xl font-black text-brand-primary">+24.5%</span>
                  </div>
                  <div className="h-24 bg-emerald-50 rounded-2xl flex flex-col justify-center px-6">
                    <span className="text-[10px] uppercase font-bold text-emerald-400">Прогноз</span>
                    <span className="text-2xl font-black text-emerald-600">Рост</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-3/4 bg-slate-100 rounded"></div>
                        <div className="h-2 w-1/2 bg-slate-50 rounded"></div>
                      </div>
                      <div className={`h-2 w-12 rounded ${i === 0 ? 'bg-indigo-200' : 'bg-slate-100'}`}></div>
                    </div>
                  ))}
                </div>
                <div className="absolute top-1/2 -right-4 w-40 h-40 bg-brand-primary rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Added scroll-mt-24 for navigation padding */}
      <section id="features" className="py-24 bg-slate-50 scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6 text-brand-dark">Почему магазины выбирают E-Com AI</h2>
            <p className="text-slate-500 text-lg">Мы не просто показываем цифры. Мы даем конкретные инструкции: что закупить больше, а от чего пора избавиться.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={TrendingUp} 
              title="Анализ прибыли" 
              desc="Считаем реальную маржу с учетом всех комиссий, логистики и налогов. Без ошибок в Excel."
            />
            <FeatureCard 
              icon={PieChart} 
              title="ABC-анализ" 
              desc="Автоматическое разделение товаров на категории. Выделяем 'золотой' ассортимент вашего магазина."
            />
            <FeatureCard 
              icon={CheckCircle2} 
              title="Прогноз спроса" 
              desc="Нейросеть предсказывает остатки на складе на 30 дней вперед. Забудьте о ситуации Out-of-Stock."
            />
          </div>
        </div>
      </section>

      {/* How it works - Added scroll-mt-24 */}
      <section id="how-it-works" className="py-24 bg-white scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-brand-dark mb-4">Три шага к росту</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-6 left-1/4 right-1/4 h-0.5 bg-indigo-50 -z-0"></div>
            
            <Step 
              number="1" 
              title="Загрузка" 
              desc="Прикрепите выгрузку продаж в формате CSV или XLSX." 
            />
            <Step 
              number="2" 
              title="ИИ-обработка" 
              desc="Система сопоставляет данные и строит математическую модель." 
            />
            <Step 
              number="3" 
              title="Готовый отчет" 
              desc="Получите файл с рекомендациями прямо на почту." 
            />
          </div>
        </div>
      </section>

      {/* Upload Form Section - Added scroll-mt-24 */}
      <section id="upload" className="py-24 bg-slate-900 text-white overflow-hidden relative scroll-mt-20">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-primary rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-[150px]"></div>
        </div>

        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black mb-4">Бесплатный экспресс-аудит</h2>
              <p className="text-indigo-200">Загрузите файл прямо сейчас и узнайте свою реальную прибыль</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`group cursor-pointer border-2 border-dashed transition-all p-12 rounded-2xl flex flex-col items-center justify-center gap-4 ${file ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/20 hover:border-brand-primary hover:bg-white/5'}`}
              >
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                  accept=".csv,.xlsx,.xls"
                />
                
                {file ? (
                  <>
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center">
                      <FileSpreadsheet size={32} />
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-emerald-400">{file.name}</p>
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        className="text-white/40 text-xs hover:text-white mt-2 uppercase tracking-widest font-bold"
                      >
                        Удалить и заменить
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload size={32} />
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold mb-1">Выберите файл для анализа</p>
                      <p className="text-white/40 text-sm italic">Поддерживаются CSV, Excel (XLSX, XLS)</p>
                    </div>
                  </>
                )}
              </div>

              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="Ваш рабочий Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-lg focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                disabled={!file || !email || uploading}
                className={`w-full py-6 rounded-2xl text-xl font-black transition-all flex items-center justify-center gap-3 ${
                  uploading ? 'bg-indigo-400 cursor-wait' : 'bg-brand-primary hover:bg-indigo-700 shadow-2xl shadow-indigo-500/20 active:scale-[0.98]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {uploading ? (
                  <>
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Анализируем данные...
                  </>
                ) : (
                  'Получить отчет на почту'
                )}
              </button>
            </form>

            <AnimatePresence>
              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center"
                >
                  <p className="text-emerald-400 font-bold text-lg mb-1">🎉 Успешно отправлено!</p>
                  <p className="text-emerald-400/70 text-sm">Ваш отчет будет готов и отправлен в течение 5-10 минут.</p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="mt-4 text-xs font-bold uppercase tracking-widest text-emerald-400/50 hover:text-emerald-400"
                  >
                    Закрыть
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="text-white" size={18} />
            </div>
            <span className="text-lg font-black text-brand-dark">E-COM <span className="text-brand-primary">AI</span></span>
          </div>
          <div className="text-slate-400 text-sm">
            © 2024 E-Com AI Analytics. Все права защищены.
          </div>
          <div className="flex gap-6 text-sm font-semibold text-slate-500">
            <a href="#" className="hover:text-brand-primary">Политика</a>
            <a href="#" className="hover:text-brand-primary">Условия</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;