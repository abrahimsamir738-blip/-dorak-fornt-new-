
import React from 'react';
import { motion } from 'framer-motion';
import { BellRing, Activity, Navigation, Clock, ShieldCheck, Heart, Sparkles, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) => (
 <motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay, duration: 0.6 }}
  className="bg-white dark:bg-slate-900/60 backdrop-blur-xl p-10 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none group hover:border-blue-500 transition-all duration-500"
 >
  <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center text-blue-600 mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
   <Icon size={40} />
  </div>
  <h3 className="text-2xl font-[1000] text-slate-900 dark:text-white mb-4 tracking-tighter">{title}</h3>
  <p className="text-slate-500 dark:text-slate-400 font-bold text-lg leading-relaxed">
   {description}
  </p>
 </motion.div>
);

const AboutPage: React.FC = () => {
 const navigate = useNavigate();

 return (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden" dir="rtl">

   {/* Hero Section */}
   <section className="relative pt-20 pb-32 md:pt-40 md:pb-56 px-6 overflow-hidden">
    {/* Background Decorations */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
     <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px]" />
     <div className="absolute bottom-0 right-[-5%] w-[30%] h-[30%] bg-emerald-400/10 rounded-full blur-[100px]" />
    </div>

    <div className="max-w-7xl mx-auto text-center">
     <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-6 py-2 rounded-full mb-8"
     >
      <Sparkles size={16} className="text-blue-600" />
      <span className="text-blue-600 dark:text-blue-400 font-black text-sm uppercase tracking-widest">ثورة في عالم الحجز الطبي</span>
     </motion.div>

     <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-5xl md:text-[100px] font-[1000] text-slate-900 dark:text-white leading-[1.1] mb-8 tracking-tighter"
     >
      صحتك <span className="text-blue-600">أولاً</span>.. <br />
      ووقتك أغلى
     </motion.h1>

     <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-xl md:text-3xl text-slate-400 font-bold max-w-4xl mx-auto leading-relaxed mb-16"
     >
      منصة عياداتي كير هي الحل الذكي لإنهاء عهد الانتظار الطويل في العيادات. نحن نؤمن أن الرعاية الصحية يجب أن تكون مريحة، سريعة، وبأعلى معايير الرفاهية.
     </motion.p>

     {/* Stats Bar */}
     <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[40px] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800"
     >
      {[
       { label: 'طبيب متخصص', val: '500+', icon: Activity },
       { label: 'حجز ناجح', val: '10K+', icon: ShieldCheck },
       { label: 'وقت انتظار أقل', val: '70%', icon: Clock },
       { label: 'فرع متاح', val: '120+', icon: Navigation },
      ].map((stat, i) => (
       <div key={i} className="text-center group">
        <div className="flex justify-center mb-3">
         <stat.icon className="text-blue-600 opacity-40 group-hover:opacity-100 transition-opacity" size={24} />
        </div>
        <div className="text-3xl md:text-4xl font-[1000] text-slate-900 dark:text-white mb-1">{stat.val}</div>
        <div className="text-sm font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
       </div>
      ))}
     </motion.div>
    </div>
   </section>

   {/* Main Benefits Grid */}
   <section className="max-w-7xl mx-auto px-6 py-24">
    <div className="text-center mb-24">
     <h2 className="text-4xl md:text-6xl font-[1000] text-slate-900 dark:text-white mb-6 tracking-tighter">لماذا تختار عياداتي كير؟</h2>
     <p className="text-slate-400 text-xl md:text-2xl font-bold">كل ما تحتاجه لتجربة طبية خالية من الإجهاد</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
     <FeatureCard
      icon={BellRing}
      title="تنبيهات ذكية"
      description="نرسل لك إشعاراً فورياً على هاتفك عندما يقترب دورك بـ 2 مرضى فقط، لتتحرك من منزلك في الوقت المناسب تماماً."
      delay={0.1}
     />
     <FeatureCard
      icon={Activity}
      title="تتبع حي للدور"
      description="شاهد رقم الحالة التي يتم خدمتها الآن في العيادة من أي مكان عبر التطبيق، وتابع تقدم الطابور لحظة بلحظة."
      delay={0.2}
     />
     <FeatureCard
      icon={Navigation}
      title="سهولة الوصول"
      description="خرائط دقيقة مدمجة توصلك لباب العيادة، مع معلومات كاملة عن المواعيد، الفروع، وأقرب أماكن الانتظار."
      delay={0.3}
     />
    </div>
   </section>

   {/* Philosophy Section */}
   <section className="bg-slate-900 py-32 md:py-48 px-6 text-white overflow-hidden relative">
    <div className="absolute inset-0 opacity-10">
     <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,#3b82f6,transparent)]" />
    </div>

    <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
     <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center mb-12 shadow-2xl shadow-blue-500/40">
      <Heart size={48} fill="white" />
     </div>
     <h2 className="text-4xl md:text-7xl font-[1000] mb-8 tracking-tighter leading-tight">رسالتنا هي راحة بالك</h2>
     <p className="text-blue-100 text-xl md:text-3xl font-bold leading-relaxed opacity-80 mb-16">
      بدأت فكرة عياداتي كير من معاناة حقيقية مع غرف الانتظار المزدحمة. نحن هنا لنعيد للمريض كرامته ووقته، ولنجعل التكنولوجيا في خدمة الإنسانية بأرقى صورها.
     </p>
     <div className="flex flex-col md:flex-row gap-6">
      <div className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl flex items-center gap-4">
       <ShieldCheck className="text-emerald-400" />
       <span className="font-black">نظام مشفر وآمن بالكامل</span>
      </div>
      <div className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl flex items-center gap-4">
       <Activity className="text-blue-400" />
       <span className="font-black">تحديثات لحظية 24/7</span>
      </div>
     </div>
    </div>
   </section>

   {/* Final CTA */}
   <section className="py-32 px-6 flex flex-col items-center text-center">
    <motion.div
     initial={{ opacity: 0, scale: 0.95 }}
     whileInView={{ opacity: 1, scale: 1 }}
     viewport={{ once: true }}
     className="max-w-4xl bg-blue-600 rounded-[60px] p-16 md:p-24 text-white shadow-3xl shadow-blue-200 dark:shadow-none relative overflow-hidden group"
    >
     <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-700" />

     <h2 className="text-4xl md:text-6xl font-[1000] mb-8 tracking-tighter relative z-10">جاهز لتجربة <br />الحجز الذكي؟</h2>
     <p className="text-blue-100 text-xl md:text-2xl font-bold mb-12 opacity-90 relative z-10">
      انضم لآلاف المرضى الذين غيروا حياتهم مع منصة عياداتي كير.
     </p>
     <button
      onClick={() => navigate('/doctors')}
      className="bg-white text-blue-600 text-2xl font-[1000] py-6 px-16 rounded-[30px] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 mx-auto group relative z-10"
     >
      <span>ابدأ الحجز الآن</span>
      <ArrowLeft className="group-hover:-translate-x-2 transition-transform" />
     </button>
    </motion.div>
   </section>

  </div>
 );
};

export default AboutPage;
