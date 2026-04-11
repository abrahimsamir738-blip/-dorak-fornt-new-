import React, { useState, useEffect } from 'react';
import { User, Phone, ShieldCheck } from 'lucide-react';

interface BookingFormProps {
 onConfirm: (name: string, phone: string) => void;
 isLoading: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({ onConfirm, isLoading }) => {
 const [name, setName] = useState('');
 const [phone, setPhone] = useState('');

 // منطق القراءة التلقائية من localStorage
 useEffect(() => {
  const savedUser = localStorage.getItem('dorak_user');
  if (savedUser) {
   try {
    const userData = JSON.parse(savedUser);
    if (userData.name) setName(userData.name);
    if (userData.phone) setPhone(userData.phone);
   } catch (error) {
    console.error("Error parsing dorak_user from localStorage", error);
   }
  }
 }, []);

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (name && phone) {
   onConfirm(name, phone);
  }
 };

 return (
  <div className="bg-white dark:bg-slate-900 rounded-[32px] md:rounded-[60px] p-6 md:p-16 shadow-xl border border-slate-50 dark:border-slate-800 flex flex-col items-center">
   <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#1e40af] mb-6 md:mb-8">
    <ShieldCheck size={32} className="md:w-10 md:h-10" />
   </div>

   <div className="text-center mb-8 md:mb-16">
    <h2 className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 md:mb-3 tracking-tighter">بيانات المريض</h2>
    <p className="text-slate-400 font-bold text-sm md:text-xl px-4 leading-relaxed">يرجى كتابة البيانات كما هي في البطاقة الشخصية لضمان دقة الملف الطبي</p>
   </div>

   <form id="booking-form" onSubmit={handleSubmit} className="w-full space-y-6 md:space-y-8 text-right">
    <div className="space-y-2 md:space-y-3">
     <label className="text-[10px] md:text-sm font-black text-slate-400 mr-2 md:mr-4 uppercase tracking-widest flex flex-row-reverse items-center gap-2">
      <User size={14} />
      اسم المريض الكامل
     </label>
     <input
      type="text"
      required
      className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-[#1e40af] rounded-xl md:rounded-2xl py-4 md:py-5 px-6 text-right font-bold text-base md:text-xl outline-none transition-all text-slate-900 dark:text-white"
      placeholder="الاسم الثلاثي أو الرباعي"
      value={name}
      onChange={(e) => setName(e.target.value)}
     />
    </div>

    <div className="space-y-2 md:space-y-3">
     <label className="text-[10px] md:text-sm font-black text-slate-400 mr-2 md:mr-4 uppercase tracking-widest flex flex-row-reverse items-center gap-2">
      <Phone size={14} />
      رقم الهاتف للتواصل
     </label>
     <input
      type="tel"
      required
      pattern="[0-9]{11}"
      className="w-full bg-slate-50 dark:bg-slate-800/80 border-2 border-transparent focus:border-[#1e40af] rounded-xl md:rounded-2xl py-4 md:py-5 px-6 text-right font-bold text-base md:text-xl outline-none transition-all text-slate-900 dark:text-white"
      placeholder="01XXXXXXXXX"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
     />
    </div>

    <div className="pt-4 md:pt-8">
     <button
      type="submit"
      disabled={isLoading || !name || !phone}
      className="w-full bg-[#1e40af] disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white font-black text-lg md:text-2xl py-5 md:py-6 rounded-2xl md:rounded-3xl shadow-xl hover:bg-blue-800 transition-all active:scale-95"
     >
      {isLoading ? (
       <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
      ) : (
       "تأكيد الحجز والدخول للملف"
      )}
     </button>
    </div>

    <div className="p-4 md:p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-dashed border-blue-200 dark:border-blue-800 text-center">
     <p className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
      تنبيه: يتم دفع إجمالي المبلغ (سعر الكشف + 15 ج.م رسوم الخدمة) نقداً داخل العيادة. لا يوجد دفع أونلاين.
     </p>
    </div>
   </form>
  </div>
 );
};

export default BookingForm;