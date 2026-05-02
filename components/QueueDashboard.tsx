import React, { useState, useEffect } from 'react';
import {
 Clock,
 MapPin,
 ShieldCheck,
 Activity,
 Navigation,
 BellRing,
 ArrowRight,
 Trash2,
 Loader2,
 X,
 AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { publicAPI } from '../services/api';

// ─── Modal ────────────────────────────────────────────────
const UpgradeAlert = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
 <AnimatePresence>
  {isOpen && (
   <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
    onClick={onClose}
   >
    <motion.div
     initial={{ scale: 0.9, y: 20, opacity: 0 }}
     animate={{ scale: 1, y: 0, opacity: 1 }}
     exit={{ scale: 0.9, y: 20, opacity: 0 }}
     onClick={(e) => e.stopPropagation()}
     className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-800 text-center relative"
    >
     <button
      onClick={onClose}
      className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 transition-colors"
     >
      <X size={24} />
     </button>
     <div className="w-24 h-24 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner">
      <BellRing size={48} className="animate-bounce" />
     </div>
     <h3 className="text-3xl md:text-4xl font-[1000] text-slate-900 dark:text-white mb-4 tracking-tighter">
      قريباً في "دورك"
     </h3>
     <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-bold leading-relaxed mb-10">
      نعمل حالياً على تطوير نظام تنبيهات ذكي يرسل لك إشعاراً عبر{' '}
      <span className="text-emerald-500">WhatsApp</span> عندما يقترب دورك بـ مريضين.
     </p>
     <button
      onClick={onClose}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-[950] text-xl py-5 rounded-[24px] transition-all shadow-xl shadow-blue-500/25 active:scale-95"
     >
      فهمت ذلك
     </button>
    </motion.div>
   </motion.div>
  )}
 </AnimatePresence>
);

// ─── StatBox ──────────────────────────────────────────────
const StatBox = ({
 icon,
 label,
 value,
 color,
}: {
 icon: React.ReactNode;
 label: string;
 value: string;
 color: string;
}) => (
 <div className="flex flex-row-reverse items-center justify-center md:justify-start gap-6">
  <div
   className={`w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 ${color}`}
  >
   {icon}
  </div>
  <div className="text-right">
   <p className="text-slate-500 text-xs md:text-sm font-black uppercase mb-1 tracking-widest">
    {label}
   </p>
   <p className="text-2xl md:text-4xl font-[950]">{value}</p>
  </div>
 </div>
);

// ─── Props ────────────────────────────────────────────────
interface QueueDashboardProps {
 bookingId: string | number;
 status: string;
 /** رقم دور المريض — ممكن يكون null لو السيرفر ما بعتوش */
 userTurn: number | null;
 clinicName: string;
 clinicId?: string | number;
 doctorName?: string;
 doctorLocation?: string;
 lat?: number;
 lng?: number;
 onBack?: () => void;
 initialCurrentServing?: number | null; // ✅ أضف هذا

}

// ─── Main Component ───────────────────────────────────────
const QueueDashboard: React.FC<QueueDashboardProps> = ({
 bookingId,
 status: initialStatus,
 userTurn,
 clinicName,
 clinicId,
 doctorName,
 doctorLocation,
 lat,
 lng,
 onBack,
 initialCurrentServing = null,
}) => {
 const navigate = useNavigate();

 // الدور الحالي اللي بيتخدم دلوقتي في العيادة
 const [currentTurn, setCurrentTurn] = useState<number | null>(initialCurrentServing);
 const [isLoadingQueue, setIsLoadingQueue] = useState(initialCurrentServing === null);
 const [queueError, setQueueError] = useState(false);

 const [showUpgradeModal, setShowUpgradeModal] = useState(false);
 const [isCancelling, setIsCancelling] = useState(false);
 const [currentStatus, setCurrentStatus] = useState(initialStatus);

 // ── جلب بيانات الطابور ──────────────────────────────────
 const fetchQueueData = async () => {
  if (!clinicId) {
   setIsLoadingQueue(false);
   return;
  }
  try {
   setQueueError(false);
   const queueData = await publicAPI.getClinicQueue(clinicId);
   const serving = queueData?.current_serving_number;

   // ✅ فقط حدّث لو القيمة موجودة فعلاً
   if (typeof serving === 'number') {
    setCurrentTurn(serving);
   }
   // ❌ متعملش setCurrentTurn(null) لو مجاش رقم
  } catch (err) {
   console.error('Queue API error:', err);
   // ✅ متعملش setQueueError(true) عشان متبقيش الـ initialCurrentServing شغال
   // setQueueError(true); ← احذف أو علّق عليه
  } finally {
   setIsLoadingQueue(false);
  }
 };
 useEffect(() => {
  fetchQueueData();
  const interval = setInterval(fetchQueueData, 20_000);
  return () => clearInterval(interval);
 }, [clinicId]);

 // ── حسابات ──────────────────────────────────────────────
 // كام شخص قدامك = رقمك - الدور الحالي (بس لو الاتنين موجودين)
 const patientsAhead: number | null =
  userTurn !== null && currentTurn !== null
   ? Math.max(0, userTurn - currentTurn)
   : null;

 const waitTime: number | null =
  patientsAhead !== null ? patientsAhead * 10 : null;

 // ── Handlers ─────────────────────────────────────────────
 const handleCancelBooking = async () => {
  if (window.confirm('هل أنت متأكد من إلغاء الحجز؟ سيتم حذف دورك نهائياً.')) {
   setIsCancelling(true);
   try {
    await publicAPI.cancelBooking(bookingId);
    setCurrentStatus('ملغي');
    alert('تم إلغاء الحجز بنجاح');
    handleBackNavigation();
   } catch {
    alert('عذراً، حدث خطأ أثناء الإلغاء. حاول مرة أخرى.');
   } finally {
    setIsCancelling(false);
   }
  }
 };

 const handleOpenMaps = () => {
  const url =
   lat && lng
    ? `https://www.google.com/maps?q=${lat},${lng}`
    : `https://www.google.com/maps/search/${encodeURIComponent(
     clinicName + ' ' + (doctorLocation || '')
    )}`;
  window.open(url, '_blank');
 };

 const handleBackNavigation = () => {
  if (onBack) onBack();
  else navigate('/profile');
 };

 // ── Render ────────────────────────────────────────────────
 return (
  <div
   className="flex flex-col items-center gap-8 md:gap-16 w-full max-w-6xl mx-auto py-10 md:py-20 px-4"
   dir="rtl"
  >
   {/* ── كارت التتبع الرئيسي ── */}
   <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="w-full bg-slate-900 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[40px] md:rounded-[100px] p-8 md:p-20 text-white shadow-2xl relative overflow-hidden"
   >
    <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20 bg-[radial-gradient(circle_at_20%_20%,#3b82f6,transparent)]" />

    {/* Live badge */}
    <div className="flex justify-center mb-8 md:mb-16">
     <div className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-2 md:px-8 md:py-3 rounded-full flex items-center gap-3">
      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
      <span className="text-emerald-500 text-sm md:text-lg font-black tracking-widest uppercase">
       تتبع حي مباشر
      </span>
     </div>
    </div>

    <h2 className="text-3xl md:text-7xl font-[950] text-center mb-12 md:mb-24 tracking-tighter leading-tight">
     {clinicName}
    </h2>

    {/* الأرقام */}
    <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-24 mb-12 md:mb-24">

     {/* الدور الحالي */}
     <div className="text-center">
      <p className="text-slate-400 text-lg md:text-2xl font-black mb-4">
       يتم خدمته الآن
      </p>
      {isLoadingQueue ? (
       <div className="flex justify-center items-center h-40">
        <Loader2 size={56} className="animate-spin text-emerald-500" />
       </div>
      ) : currentTurn === null ? (<div className="flex flex-col items-center gap-3 text-slate-500">
       <AlertCircle size={48} />
       <p className="text-xl font-black">غير متاح</p>
      </div>
      ) : (
       <div className="text-[100px] md:text-[260px] font-[1000] leading-none bg-gradient-to-b from-emerald-300 via-emerald-500 to-emerald-700 bg-clip-text text-transparent tracking-tighter">
        {currentTurn}
       </div>
      )}
     </div>

     <div className="hidden md:block w-[1px] h-64 bg-white/10" />

     {/* رقم دورك أنت */}
     <div className="text-center w-full md:w-auto">
      <div className="bg-white/5 rounded-[40px] md:rounded-[80px] p-8 md:p-16 border border-white/5 backdrop-blur-2xl shadow-inner relative">
       <p className="text-slate-400 text-lg md:text-2xl font-black mb-4">
        رقم دورك أنت
       </p>

       {userTurn !== null ? (
        <>
         <div className="text-[80px] md:text-[200px] font-[1000] leading-none tracking-tighter">
          {userTurn}
         </div>

         {/* ── متبقي كام شخص قبلك ── */}
         <div className="mt-6">
          {patientsAhead === null || isLoadingQueue ? (
           <p className="text-slate-500 text-lg font-black">
            جارٍ الحساب...
           </p>
          ) : patientsAhead === 0 ? (
           <p className="text-emerald-400 text-xl md:text-2xl font-black animate-pulse">
            🎉 دورك الآن!
           </p>
          ) : (
           <p className="text-blue-400 text-xl md:text-2xl font-black">
            متبقي{' '}
            <span className="text-white text-3xl md:text-4xl mx-1">
             {patientsAhead}
            </span>{' '}
            {patientsAhead === 1 ? 'شخص' : 'أشخاص'} قبلك
           </p>
          )}
         </div>
        </>
       ) : (
        /* turn_number = null من السيرفر */
        <div className="flex flex-col items-center gap-4 py-4">
         <AlertCircle size={48} className="text-amber-400" />
         <p className="text-amber-400 text-xl font-black text-center leading-relaxed">
          لم يتم تحديد رقم الدور بعد
          <br />
          <span className="text-slate-400 text-base font-bold">
           سيظهر بعد تأكيد الحجز من العيادة
          </span>
         </p>
        </div>
       )}

       <p className="text-blue-500 text-lg md:text-xl font-black mt-6 tracking-widest uppercase">
        {currentStatus}
       </p>
      </div>
     </div>
    </div>

    {/* Stats Row */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 px-4 md:px-10">
     <StatBox
      icon={<Clock size={32} />}
      label="الانتظار المتوقع"
      value={waitTime !== null ? `~ ${waitTime} دقيقة` : 'غير متاح'}
      color="text-blue-400"
     />
     <StatBox
      icon={<Activity size={32} />}
      label="الحالات المتبقية"
      value={
       patientsAhead !== null
        ? patientsAhead === 0
         ? 'دورك الآن'
         : `${patientsAhead} ${patientsAhead === 1 ? 'حالة' : 'حالات'}`
        : 'غير متاح'
      }
      color="text-emerald-400"
     />
     <StatBox
      icon={<ShieldCheck size={32} />}
      label="حالة الحجز"
      value={currentStatus}
      color="text-blue-400"
     />
    </div>
   </motion.div>

   {/* ── كروت السفلية ── */}
   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 w-full">

    {/* كارت التنبيه */}
    <div className="bg-blue-600 rounded-[40px] md:rounded-[80px] p-10 md:p-16 text-white flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
     <div className="absolute top-10 -left-10 -rotate-45 bg-amber-400 text-blue-900 py-1 px-12 font-black text-xs md:text-sm shadow-xl z-10 uppercase tracking-widest">
      قريباً جداً
     </div>
     <h3 className="text-3xl md:text-5xl font-[950] mb-4 md:mb-6 tracking-tighter">
      تنبيه ذكي
     </h3>
     <p className="text-blue-50 text-lg md:text-2xl font-bold mb-8 md:mb-12 max-w-sm leading-relaxed">
      سنقوم بتنبيهك تلقائياً عبر واتساب عندما يقترب دورك بـ مريضين.
     </p>
     <button
      onClick={() => setShowUpgradeModal(true)}
      className="font-[950] text-xl md:text-2xl py-5 md:py-6 px-10 md:px-16 rounded-[24px] md:rounded-[32px] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4 bg-white text-blue-600"
     >
      تفعيل التنبيه
      <BellRing size={28} />
     </button>
    </div>

    {/* كارت الموقع */}
    <div className="bg-white dark:bg-slate-900 rounded-[40px] md:rounded-[80px] p-10 md:p-16 flex flex-col items-center justify-between shadow-xl border border-slate-100 dark:border-slate-800">
     <div className="flex flex-col items-center gap-6 mb-10">
      <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-[24px] flex items-center justify-center">
       <MapPin size={40} />
      </div>
      <div className="text-center">
       <h4 className="text-2xl md:text-4xl font-[950] text-slate-900 dark:text-white tracking-tighter mb-1">
        {doctorName}
       </h4>
       <p className="text-lg md:text-2xl text-slate-400 font-bold">{doctorLocation}</p>
      </div>
     </div>

     <div className="flex flex-col w-full gap-4">
      <button
       onClick={handleOpenMaps}
       className="w-full bg-[#0b1221] dark:bg-blue-600 text-white font-[950] text-xl py-6 rounded-[30px] flex items-center justify-center gap-4 hover:opacity-90 transition-all shadow-xl shadow-blue-500/10"
      >
       <Navigation size={28} className="text-emerald-400" />
       فتح المسار في الخرائط
      </button>

      {['منتظر', 'قيد الكشف'].includes(currentStatus) && (
       <button
        disabled={isCancelling}
        onClick={handleCancelBooking}
        className="w-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 font-black py-5 rounded-[25px] flex items-center justify-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors disabled:opacity-60"
       >
        {isCancelling ? (
         <Loader2 size={20} className="animate-spin" />
        ) : (
         <Trash2 size={20} />
        )}
        إلغاء الحجز
       </button>
      )}
     </div>
    </div>
   </div>

   {/* زر الرجوع */}
   <button
    className="mt-8 text-slate-400 dark:text-slate-600 font-black text-xl md:text-2xl hover:text-blue-600 transition-colors flex items-center gap-4 group"
    onClick={handleBackNavigation}
   >
    <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
    <span>العودة للملف الشخصي</span>
   </button>

   <UpgradeAlert isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
  </div>
 );
};

export default QueueDashboard;