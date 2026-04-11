import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, ShieldCheck, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';

interface LoginModalProps {
 isOpen: boolean;
 onClose: () => void;
 onLoginSuccess: (name: string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
 // الحالات الأساسية
 const [isLoginView, setIsLoginView] = useState(true); // التبديل بين دخول وإنشاء حساب
 const [name, setName] = useState('');
 const [phone, setPhone] = useState('');
 const [error, setError] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const [isSuccess, setIsSuccess] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  // التحقق من المدخلات (Client-side validation)
  if (!isLoginView && name.trim().length < 3) {
   setError('يرجى إدخال الاسم بالكامل (3 أحرف على الأقل)');
   setIsLoading(false);
   return;
  }

  if (!/^01[0125][0-9]{8}$/.test(phone)) {
   setError('يرجى إدخال رقم موبايل مصري صحيح');
   setIsLoading(false);
   return;
  }

  try {
   // تحديد الرابط بناءً على الحالة (Login أو Register)
   const endpoint = isLoginView ? '/api/login' : '/api/createUser';
   const payload = isLoginView ? { phone } : { name, phone };

   // إرسال الطلب للـ Backend (Laravel)
   const response = await axios.post(`https://paleturquoise-cassowary-158484.hostingersite.com/api/${endpoint}`, payload);

   if (response.data.status === 'success') {
    const userData = response.data.user;

    // حفظ البيانات في المتصفح
    localStorage.setItem('dorak_user', JSON.stringify(userData));
    if (response.data.token) {
     localStorage.setItem('dorak_token', response.data.token);
    }

    setIsSuccess(true);

    setTimeout(() => {
     onLoginSuccess(userData.name);
     onClose();
     // إعادة تعيين الحالات بعد النجاح
     setIsSuccess(false);
     setIsLoading(false);
     setName('');
     setPhone('');
    }, 1500);
   }
  } catch (err: any) {
   setIsLoading(false);
   if (err.response && err.response.data.message) {
    setError(err.response.data.message);
   } else {
    setError('حدث خطأ في الاتصال بالسيرفر. حاول مرة أخرى.');
   }
  }
 };

 return (
  <AnimatePresence>
   {isOpen && (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
     {/* Overlay */}
     <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
     />

     <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-2xl border border-white/20 dark:border-slate-800/50 overflow-hidden"
      dir="rtl"
     >
      {/* Success Overlay */}
      <AnimatePresence>
       {isSuccess && (
        <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         className="absolute inset-0 z-50 bg-blue-700 flex flex-col items-center justify-center text-white p-6 text-center"
        >
         <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <CheckCircle2 size={72} className="mb-6 text-emerald-400" />
         </motion.div>
         <h3 className="text-3xl font-[950] mb-2">تم بنجاح</h3>
         <p className="text-blue-100 font-bold text-lg">مرحباً بك في منصة دورك</p>
        </motion.div>
       )}
      </AnimatePresence>

      {/* Close Button */}
      <button
       onClick={onClose}
       className="absolute top-6 left-6 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors z-10"
      >
       <X size={20} />
      </button>

      {/* Header */}
      <div className="text-center mb-10">
       <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl mx-auto mb-6 transform -rotate-6">
        <ShieldCheck size={32} />
       </div>
       <h2 className="text-3xl font-[950] text-slate-900 dark:text-white mb-2 tracking-tighter">
        {isLoginView ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
       </h2>
       <p className="text-slate-400 text-sm font-bold">
        {isLoginView ? 'أهلاً بك مجدداً في منصة دورك' : 'انضم إلينا لتنظيم حجوزاتك الطبية بسهولة'}
       </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 flex flex-col items-center w-full">

       {/* حقل الاسم (يظهر فقط في إنشاء الحساب) */}
       <AnimatePresence>
        {!isLoginView && (
         <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="space-y-2 w-full overflow-hidden"
         >
          <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest block text-right">الاسم الكامل</label>
          <div className="relative">
           <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
           <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="أدخل اسمك الثلاثي"
            className="w-full bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent focus:border-blue-600 rounded-2xl py-4 pr-12 pl-4 text-right font-bold outline-none transition-all"
           />
          </div>
         </motion.div>
        )}
       </AnimatePresence>

       {/* حقل الموبايل */}
       <div className="space-y-2 w-full">
        <label className="text-xs font-black text-slate-400 mr-2 uppercase tracking-widest block text-right">رقم الموبايل</label>
        <div className="relative">
         <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
         <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="01XXXXXXXXX"
          className="w-full bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent focus:border-blue-600 rounded-2xl py-4 pr-12 pl-4 text-right font-bold outline-none transition-all"
         />
        </div>
       </div>

       {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs font-bold text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-xl w-full">
         {error}
        </motion.p>
       )}

       <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white font-[950] text-xl py-5 rounded-2xl shadow-xl shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all active:scale-95 mt-4 flex items-center justify-center gap-3 disabled:opacity-70"
       >
        {isLoading ? <Loader2 className="animate-spin" /> : (isLoginView ? 'دخول' : 'تأكيد التسجيل')}
       </button>

       {/* التبديل بين الحالتين */}
       <div className="mt-6 flex flex-col items-center gap-4">
        <button
         type="button"
         onClick={() => {
          setIsLoginView(!isLoginView);
          setError('');
         }}
         className="text-blue-600 dark:text-blue-400 font-black text-sm hover:underline flex items-center gap-2"
        >
         {isLoginView ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب بالفعل؟ سجل دخولك'}
         <ArrowRight size={16} className="rotate-180" />
        </button>
       </div>

       <p className="text-center text-[10px] text-slate-400 font-bold leading-relaxed px-4 mt-4">
        بمجرد {isLoginView ? 'الدخول' : 'التسجيل'}، أنت توافق على شروط الاستخدام وسياسة الخصوصية لمنصة دورك الطبية.
       </p>
      </form>
     </motion.div>
    </div>
   )}
  </AnimatePresence>
 );
};

export default LoginModal;