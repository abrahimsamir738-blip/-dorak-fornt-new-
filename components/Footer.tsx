import React from 'react';
import { useI18n } from './Layout';
import { MessageSquare, Phone, ShieldCheck, Heart } from 'lucide-react';

const Footer: React.FC = () => {
 const { t, lang } = useI18n();

 return (
  <footer className="w-full bg-slate-900 text-white pt-16 md:pt-20 pb-24 md:pb-10 px-4 md:px-12 lg:px-24">
   <div className="max-w-7xl mx-auto">
    {/* Support Section */}
    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] md:rounded-[60px] p-8 md:p-16 mb-16 md:mb-20 relative overflow-hidden">
     <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-blue-600/10 rounded-full blur-[80px] md:blur-[100px] -mr-24 md:-mr-32 -mt-24 md:-mt-32" />

     <div className={`flex flex-col items-center justify-between gap-10 relative z-10 ${lang === 'ar' ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
      <div className="text-center lg:text-right">
       <div className={`flex items-center justify-center lg:justify-end gap-3 mb-4 md:mb-6 ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
         <ShieldCheck size={24} className="md:w-7 md:h-7" />
        </div>
        <h3 className="text-xl md:text-3xl font-black tracking-tighter uppercase text-blue-400">الدعم الفني</h3>
       </div>
       <h4 className="text-2xl md:text-4xl font-[1000] mb-4 md:mb-6 leading-tight max-w-xl mx-auto lg:ml-0 lg:mr-0">
        {t('support_title')}
       </h4>
       <p className="text-slate-400 text-base md:text-xl font-bold mb-8">
        نحن متاحون على مدار الساعة للرد على استفساراتكم وحل مشكلاتكم.
       </p>
      </div>

      <div className="flex flex-col items-center gap-4 md:gap-6 w-full sm:w-auto">
       <a
        href="https://wa.me/201507550401"
        target="_blank"
        rel="noopener noreferrer"
        className="group w-full sm:w-auto flex items-center justify-center gap-4 bg-[#25D366] hover:bg-[#128C7E] px-8 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-[30px] text-lg md:text-2xl font-black transition-all hover:scale-105 shadow-xl shadow-emerald-900/20"
       >
        <span className="shrink-0">{t('support_cta')}</span>
        <MessageSquare className="group-hover:rotate-12 transition-transform md:w-8 md:h-8" size={24} />
       </a>
       {/* تم إزالة رابط الهاتف (tel:) بالكامل من هنا */}
      </div>
     </div>
    </div>

    {/* Bottom Bar */}
    <div className={`flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-white/5 ${lang === 'ar' ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
     <div className={`flex items-center gap-3 ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl font-black">D</div> */}
      <span className="text-2xl font-black tracking-tighter">
       {lang === 'ar' ? 'عياداتي كير' : ''}
      </span>
     </div>

     <p className="text-slate-500 font-bold text-center text-sm md:text-base">
      {t('footer_rights')}
     </p>

     <div className="flex items-center gap-2 text-slate-500 font-bold text-xs md:text-sm">
      <span>Made with</span>
      <Heart size={14} className="text-red-500 fill-red-500" />
      <span>for Egypt</span>
     </div>
    </div>
   </div>
  </footer>
 );
};

export default Footer;