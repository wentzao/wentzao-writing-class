import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionValueEvent } from 'motion/react';
import { BookOpen, Users, Target, CheckCircle2, ChevronRight, Sparkles, Lightbulb, FileText, PenTool, ArrowRight } from 'lucide-react';
import React, { useRef, useState } from 'react';
import materialsImg from './img/materials.png';

const FLOATING_LETTERS = [
  { char: 'A', x: 10, delay: -5, duration: 20 },
  { char: 'B', x: 25, delay: -12, duration: 25 },
  { char: 'C', x: 40, delay: -2, duration: 18 },
  { char: 'W', x: 60, delay: -15, duration: 22 },
  { char: 'R', x: 75, delay: -8, duration: 19 },
  { char: 'I', x: 90, delay: -1, duration: 24 },
  { char: 'T', x: 15, delay: -18, duration: 21 },
  { char: 'E', x: 35, delay: -6, duration: 26 },
  { char: 'a', x: 50, delay: -10, duration: 17 },
  { char: 'e', x: 65, delay: -3, duration: 23 },
  { char: 'i', x: 80, delay: -14, duration: 20 },
  { char: 'o', x: 5, delay: -9, duration: 25 },
  { char: 'u', x: 85, delay: -11, duration: 19 },
  { char: 'E', x: 45, delay: -17, duration: 22 },
  { char: 'N', x: 55, delay: -4, duration: 21 },
  { char: 'G', x: 20, delay: -13, duration: 24 },
];

const PROCESS_STEPS = [
  { 
    step: '01', 
    title: '暖身與思考', 
    desc: 'Warm Up & Think Ahead', 
    icon: <Lightbulb className="w-6 h-6" />,
    exampleSegments: [
      { text: "Think Ahead:\n", color: "text-wenzao font-bold" },
      { text: "1. What makes a good friend?\n2. How would you describe your best friend?\n\n" },
      { text: "Brainstorming:\n", color: "text-amber-600 font-bold" },
      { text: "kind, helpful, funny, always there for me..." }
    ],
    exampleDesc: "透過圖片、暖身問題與簡短練習，引導學習者了解寫作目標，激發靈感並掌握任務重點。"
  },
  { 
    step: '02', 
    title: '範文解析', 
    desc: 'Model Text', 
    icon: <BookOpen className="w-6 h-6" />,
    exampleSegments: [
      { text: "My Close Friend\n\n", color: "text-purple-600 font-bold" },
      { text: "John is my close friend. We met at a swimming academy when I was ten years old.\n\n" },
      { text: "He is kind and friendly. ", color: "text-emerald-600 font-bold" },
      { text: "It is easy to talk to him because he makes people feel comfortable..." }
    ],
    exampleDesc: "閱讀優質範文，學習該單元的寫作技巧與語言目標，並透過提問與組織圖強化對文章結構的邏輯理解。"
  },
  { 
    step: '03', 
    title: '技巧與練習', 
    desc: 'Writing Skill & Practice', 
    icon: <PenTool className="w-6 h-6" />,
    exampleSegments: [
      { text: "Topic Sentence:\n", color: "text-blue-600 font-bold" },
      { text: "A topic sentence introduces the main idea of a paragraph.\n\n" },
      { text: "Guided Practice:\n", color: "text-blue-600 font-bold" },
      { text: "My good friend is ________. He/She is ________ and ________." }
    ],
    exampleDesc: "進行各項基礎寫作技巧練習（如段落組織、連貫性），並透過引導式練習熟悉文章結構與語言規範。"
  },
  { 
    step: '04', 
    title: '擬定草稿', 
    desc: 'Prewriting & First Draft', 
    icon: <FileText className="w-6 h-6" />,
    exampleSegments: [
      { text: "Graphic Organizer:\n", color: "text-indigo-600 font-bold" },
      { text: "▶ Introduction: ", color: "text-gray-500" },
      { text: "Who is my good friend?\n" },
      { text: "▶ Body: ", color: "text-gray-500" },
      { text: "Personality & Talent\n" },
      { text: "▶ Conclusion: ", color: "text-gray-500" },
      { text: "How I feel about him/her\n\n" },
      { text: "Checklist: ", color: "text-rose-600 font-bold" },
      { text: "☑ Topic sentence  ☑ Supporting details" }
    ],
    exampleDesc: "利用圖表組織個人想法，將所學技巧應用於初稿撰寫，並透過檢核表確保結構與語言的正確性。"
  },
  { 
    step: '05', 
    title: '最終定稿', 
    desc: 'Final Writing', 
    icon: <CheckCircle2 className="w-6 h-6" />,
    exampleSegments: [
      { text: "Final Draft\n\n", color: "text-wenzao font-bold" },
      { text: "Name: ________  Date: ________\n\n", color: "text-gray-400" },
      { text: "My best friend is Alex. We have known each other since kindergarten. " },
      { text: "He is not only humorous but also incredibly supportive. ", color: "text-emerald-600 font-bold" },
      { text: "Whenever I face difficulties, he is always there to help..." }
    ],
    exampleDesc: "在練習本上完成最終草稿，將整個單元所學的知識與技巧融會貫通，產出完整的寫作作品。"
  }
];

const TypewriterRichText = ({ segments, isActive }: { segments: any[], isActive: boolean }) => {
  if (!isActive) return null;

  const chars: { char: string; color: string }[] = [];
  segments.forEach(seg => {
    const segChars = seg.text.split('');
    segChars.forEach((char: string) => {
      chars.push({ char, color: seg.color || "text-[#1d1d1f]" });
    });
  });

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.01 } },
        hidden: {}
      }}
      className="font-mono text-[13px] md:text-[15px] whitespace-pre-wrap leading-[1.8] tracking-tight"
    >
      {chars.map((item, i) => (
        <motion.span
          key={i}
          className={item.color}
          variants={{
            visible: { opacity: 1 },
            hidden: { opacity: 0 }
          }}
        >
          {item.char}
        </motion.span>
      ))}
    </motion.div>
  );
};

const StickyProcessFlow = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.min(Math.floor(latest * 5), 4);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  });

  return (
    <section ref={containerRef} className="h-[500vh] relative">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Subtle background blobs for glassmorphism */}
        <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-wenzao/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-yellow-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        
        <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
            {/* Left side: The list of steps */}
            <div className="relative flex flex-col gap-0 h-[80px] sm:h-[100px] lg:h-auto mt-4 lg:mt-0">
              {PROCESS_STEPS.map((step, idx) => (
                <React.Fragment key={idx}>
                  <div 
                    className={`transition-all duration-500 absolute lg:relative w-full left-0 top-0 lg:top-auto lg:left-auto ${
                      activeIndex === idx 
                        ? 'opacity-100 translate-y-0 lg:scale-105 z-10' 
                        : activeIndex > idx
                          ? 'opacity-0 -translate-y-8 lg:translate-y-0 lg:opacity-40 lg:scale-100 z-0 pointer-events-none lg:pointer-events-auto'
                          : 'opacity-0 translate-y-8 lg:translate-y-0 lg:opacity-40 lg:scale-100 z-0 pointer-events-none lg:pointer-events-auto'
                    }`}
                  >
                    <div className="glass-card p-4 md:p-6 rounded-2xl flex items-center gap-4 md:gap-6">
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-colors duration-500 shrink-0 ${activeIndex === idx ? 'bg-wenzao text-white shadow-lg shadow-wenzao/30' : 'bg-white text-gray-400'}`}>
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="text-lg md:text-2xl font-bold text-[#1d1d1f]">{step.title}</h3>
                        <p className="text-xs md:text-base text-[#86868b] font-medium hidden sm:block">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Arrow Connection */}
                  {idx < PROCESS_STEPS.length - 1 && (
                    <div className="hidden lg:flex justify-start ml-[39px] md:ml-[51px] h-6 md:h-10">
                      <div className={`w-0.5 h-full relative transition-colors duration-500 ${activeIndex > idx ? 'bg-wenzao' : 'bg-gray-200'}`}>
                        <div className={`absolute -bottom-1 -left-1 w-2.5 h-2.5 border-r-2 border-b-2 transform rotate-45 transition-colors duration-500 ${activeIndex > idx ? 'border-wenzao' : 'border-gray-200'}`}></div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Right side: The animated example and description */}
            <div className="flex flex-col gap-4 md:gap-6 w-full mt-4 lg:mt-0 h-[400px] md:h-[460px] lg:h-[500px]">
              {/* Example Card */}
              <div className="relative glass-card rounded-3xl overflow-hidden bg-white/80 shadow-sm flex-1">
                {PROCESS_STEPS.map((step, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 p-6 md:p-8 flex flex-col justify-start transition-opacity duration-500 ${
                      activeIndex === idx 
                        ? 'opacity-100 pointer-events-auto z-10' 
                        : 'opacity-0 pointer-events-none z-0'
                    }`}
                  >
                    <div className="mb-4 md:mb-6 inline-flex px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-wenzao/10 text-wenzao font-semibold text-[11px] md:text-xs tracking-wider w-fit shrink-0">
                      {step.title} 範例
                    </div>
                    
                    <div className="w-full overflow-hidden">
                      <TypewriterRichText segments={step.exampleSegments} isActive={activeIndex === idx} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Description Card */}
              <div className="relative glass-card rounded-2xl overflow-hidden bg-white/80 shadow-sm h-[100px] md:h-[120px] shrink-0">
                {PROCESS_STEPS.map((step, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 p-5 md:p-6 flex items-center transition-opacity duration-500 ${
                      activeIndex === idx 
                        ? 'opacity-100 pointer-events-auto z-10' 
                        : 'opacity-0 pointer-events-none z-0'
                    }`}
                  >
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: activeIndex === idx ? 1 : 0, x: activeIndex === idx ? 0 : -10 }}
                      transition={{ delay: activeIndex === idx ? 1.5 : 0, duration: 0.5 }}
                      className="text-[13px] md:text-[15px] text-[#86868b] font-medium border-l-2 border-wenzao pl-3 md:pl-4 leading-relaxed"
                    >
                      {step.exampleDesc}
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FloatingLetters = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {FLOATING_LETTERS.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-5xl md:text-9xl font-bold text-gray-200/40 select-none"
          initial={{
            y: '120vh',
            x: `${item.x}vw`,
            rotate: 0,
          }}
          animate={{
            y: -150,
            rotate: 360,
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "linear",
            delay: item.delay,
          }}
        >
          {item.char}
        </motion.div>
      ))}
    </div>
  );
};

function App() {
  const aboutRef = useRef<HTMLElement>(null);

  const scrollToAbout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] font-sans selection:bg-wenzao selection:text-white relative">
      <FloatingLetters />

      <style>{`
        body {
          overflow-x: hidden;
        }
        /* Lightbulb Flicker Animation */
        @keyframes lightbulb-flicker {
          0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
            opacity: 1;
            filter: drop-shadow(0px 0px 30px rgba(234, 179, 8, 0.8));
          }
          20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
            opacity: 0.4;
            filter: drop-shadow(0px 0px 5px rgba(234, 179, 8, 0.2));
          }
        }
        .lightbulb-flicker {
          animation: lightbulb-flicker 3s infinite;
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-text {
          background-size: 200% auto;
          animation: gradient-shift 4s ease-in-out infinite;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.05);
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1d1d1f]/5 text-[#1d1d1f] font-semibold text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              文藻育英寫作班
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#1d1d1f] mb-6 tracking-tighter leading-tight">
              中高級<br />
              <span className="bg-gradient-to-r from-wenzao via-emerald-400 to-wenzao text-transparent bg-clip-text animate-gradient-text">閱讀與寫作</span>
            </h1>
            <p className="text-[15px] sm:text-lg md:text-2xl lg:text-3xl text-[#86868b] font-medium max-w-3xl mx-auto mb-12 leading-relaxed tracking-tight">
              系統化建構清晰、有深度的英文表達能力。<br />打造真正有效的進階學習環境。
            </p>
            <motion.a 
              href="#about"
              onClick={scrollToAbout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-[#1d1d1f] text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-[#000000] transition-colors cursor-pointer"
            >
              探索課程內容
              <ChevronRight className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Importance of Writing & Process Flow */}
      <section 
        id="about" 
        ref={aboutRef}
        className="py-20 md:py-32 relative group"
      >
        {/* Subtle background blobs for glassmorphism */}
        <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-wenzao/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-0 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-yellow-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto text-center mb-16 md:mb-20"
          >
            {/* Lightbulb Animation */}
            <motion.div
              initial={{ color: '#d1d5db', filter: 'drop-shadow(0px 0px 0px rgba(234, 179, 8, 0))' }}
              whileInView={{ color: '#eab308', filter: 'drop-shadow(0px 0px 30px rgba(234, 179, 8, 0.8))' }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="inline-block mb-6 md:mb-8 lightbulb-flicker"
            >
              <Lightbulb className="w-12 h-12 md:w-16 md:h-16 mx-auto" />
            </motion.div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#1d1d1f] mb-6 md:mb-8 tracking-tighter leading-tight">
              英文是表達思想的媒介。<br className="hidden md:block" />
              <span className="bg-gradient-to-r from-wenzao via-emerald-500 to-wenzao text-transparent bg-clip-text animate-gradient-text">寫作是內在觀點的展現。</span>
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-[#86868b] font-medium max-w-3xl mx-auto leading-relaxed tracking-tight">
              我們專為中高級數學生規劃，從句型架構、段落組織到完整篇章寫作，逐步培養孩子的學術寫作能力與批判思考。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sticky Process Flow Section */}
      <StickyProcessFlow />

      {/* Features */}
      <section className="py-20 md:py-32 relative">
        <div className="absolute top-40 left-10 w-64 h-64 md:w-72 md:h-72 bg-emerald-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute bottom-10 right-10 w-64 h-64 md:w-72 md:h-72 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: <Target className="w-8 h-8 text-[#1d1d1f]" />,
                title: "專為中高級數規劃",
                desc: "從句型架構、段落組織到完整篇章寫作，逐步培養學術寫作能力與批判思考。"
              },
              {
                icon: <BookOpen className="w-8 h-8 text-[#1d1d1f]" />,
                title: "閱讀輸入・寫作輸出",
                desc: "每週全英文引導式寫作課程，系統化建構清晰、有深度的英文表達能力。"
              },
              {
                icon: <Users className="w-8 h-8 text-[#1d1d1f]" />,
                title: "小班精緻教學",
                desc: "提供個別化回饋，讓每位孩子都能在穩定支持中深化語言能力。"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card p-8 md:p-10 rounded-[2rem]"
              >
                <div className="mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-[#1d1d1f] mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-[#86868b] text-base md:text-lg font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials */}
      <section id="materials" className="py-20 md:py-32 relative">
        <div className="absolute top-1/2 right-0 w-64 h-64 md:w-96 md:h-96 bg-wenzao/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-20">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1d1d1f] mb-6 tracking-tighter">專業寫作教材</h2>
              <p className="text-lg md:text-xl text-[#86868b] font-medium mb-8 md:mb-10 leading-relaxed tracking-tight">
                採用 <strong className="text-[#1d1d1f]">Bricks 中高級數寫作教材</strong>，符合 CEFR A1~A2+ 能力，系統化建構寫作能力。
              </p>
              <div className="space-y-6 md:space-y-8">
                {[
                  { title: "Process Writing", desc: "拆解寫作步驟，引導學生循序漸進完成寫作。" },
                  { title: "多元文體訓練", desc: "涵蓋多種實用文體，全面提升實用寫作能力。" },
                  { title: "圖像化工具輔助", desc: "利用視覺化圖表與工具，幫助學生有效整理思路。" }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-start gap-4 md:gap-5"
                  >
                    <div className="mt-1 bg-[#fbfbfd] p-2 rounded-full shrink-0">
                      <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-[#1d1d1f]" />
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-semibold text-[#1d1d1f] tracking-tight">{item.title}</h4>
                      <p className="text-sm md:text-base text-[#86868b] font-medium mt-1">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:w-1/2 relative w-full mt-10 lg:mt-0"
            >
              <div className="absolute inset-0 bg-[#fbfbfd] rounded-[2rem] md:rounded-[3rem] -z-10" />
              <img 
                src={materialsImg} 
                alt="Bricks Writing Materials" 
                className="w-full h-auto object-contain p-6 md:p-12"
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute -bottom-6 left-4 right-4 md:left-auto md:-right-8 md:w-auto glass-card p-4 md:p-5 rounded-2xl flex items-center justify-center md:justify-start gap-3 md:gap-4 z-10">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1d1d1f] rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm md:text-base">A1+</span>
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-[#86868b] font-semibold uppercase tracking-wider">符合國際標準</p>
                  <p className="font-bold text-sm md:text-base text-[#1d1d1f] whitespace-nowrap">CEFR A1~A2+</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Levels */}
      <section id="levels" className="py-20 md:py-32 relative">
        <div className="absolute top-0 left-1/3 w-full h-full bg-gradient-to-b from-wenzao/5 to-transparent -z-10" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1d1d1f] mb-4 md:mb-6 tracking-tighter">級數說明</h2>
            <p className="text-lg md:text-xl text-[#86868b] font-medium tracking-tight">為不同階段的孩子，打造專屬的寫作訓練計畫</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 max-w-6xl mx-auto">
            {/* Level 5 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden group"
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/80 text-[#1d1d1f] font-semibold text-xs md:text-sm mb-6 md:mb-8 border border-white">
                Level 5
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 text-transparent bg-clip-text animate-gradient-text">
                Writing Plus 150
              </h3>
              
              <div className="mt-8 md:mt-10 space-y-6 md:space-y-8">
                <div>
                  <h4 className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-[#86868b] uppercase tracking-widest mb-2 md:mb-3">
                    <Users className="w-4 h-4" /> 課程對象
                  </h4>
                  <p className="text-[#1d1d1f] font-medium text-base md:text-lg">本校美語級數 Flyers 以上，且國小五~六年級學生。</p>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-[#86868b] uppercase tracking-widest mb-2 md:mb-3">
                    <Target className="w-4 h-4" /> 課程目標
                  </h4>
                  <p className="text-[#1d1d1f] font-medium text-base md:text-lg">培養學生寫出結構完整、表達清晰的英文段落。</p>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-[#86868b] uppercase tracking-widest mb-2 md:mb-3">
                    <FileText className="w-4 h-4" /> 課程內容
                  </h4>
                  <p className="text-[#86868b] font-medium leading-relaxed text-sm md:text-lg">
                    透過圖像引導、範文學習與寫作技巧訓練，從句型練習到段落規劃，逐步完成草稿到定稿，培養完整段落寫作能力。
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Level 6 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden group"
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-white/80 text-[#1d1d1f] font-semibold text-xs md:text-sm mb-6 md:mb-8 border border-white">
                Level 6
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 text-transparent bg-clip-text animate-gradient-text">
                Writing Pro 200
              </h3>
              
              <div className="mt-8 md:mt-10 space-y-6 md:space-y-8">
                <div>
                  <h4 className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-[#86868b] uppercase tracking-widest mb-2 md:mb-3">
                    <Users className="w-4 h-4" /> 課程對象
                  </h4>
                  <p className="text-[#1d1d1f] font-medium text-base md:text-lg">本校美語級數 MegaA 以上，且國小六年級學生。</p>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-[#86868b] uppercase tracking-widest mb-2 md:mb-3">
                    <Target className="w-4 h-4" /> 課程目標
                  </h4>
                  <p className="text-[#1d1d1f] font-medium text-base md:text-lg">培養學生撰寫多段落文章的能力，提升內容深度、邏輯組織與整體連貫性，發展更成熟的寫作表達。</p>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-[#86868b] uppercase tracking-widest mb-2 md:mb-3">
                    <FileText className="w-4 h-4" /> 課程內容
                  </h4>
                  <p className="text-[#86868b] font-medium leading-relaxed text-sm md:text-lg">
                    透過完整寫作歷程 (發想 — 分析 — 規劃 — 撰寫 — 編修）結合多元文本與寫作任務，訓練學生組織篇章、強化句型變化，完成具結構性與表達力的文章。
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
