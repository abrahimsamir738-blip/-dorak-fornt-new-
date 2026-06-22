import React, { useState } from 'react';
import { Star, ShieldCheck, Zap, ChevronLeft, X, Banknote, Users, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Doctor, Branch } from '../types';
import MapModal from './MapModal';

interface DoctorCardProps {
 doctor: Doctor;
 onViewProfile: (doctor: Doctor) => void;
 onBookNow: (doctor: Doctor) => void;
 index?: number;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onViewProfile, onBookNow, index = 0 }) => {
 const [showInfo, setShowInfo] = useState(false);
 const [selectedBranchForMap, setSelectedBranchForMap] = useState<Branch | null>(null);

 const nextTurn = (doctor.currentQueueCount || 0) + 1;

 return (
  <>
   <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05, duration: 0.6 }}
    className="group relative bg-white dark:bg-slate-900 rounded-[35px] md:rounded-[45px] p-6 md:p-8 shadow-md hover:shadow-2xl border border-slate-100 dark:border-slate-800 transition-all flex flex-col items-center text-center md:flex-row-reverse md:text-right md:justify-between gap-6 overflow-hidden"
   >
    {/* Decorative Background Element */}
    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

    {/* Right: Portrait & Status */}
    <div className="relative shrink-0 z-10">
     <div className="w-28 h-28 md:w-44 md:h-44 rounded-[35px] md:rounded-[45px] overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl relative">
      <img
       src={doctor.image}
       alt={doctor.name}
       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
     </div>
     {doctor.isOnline && (
      <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black border-2 border-white dark:border-slate-900 shadow-lg">
       متصل الآن
      </div>
     )}
    </div>

    {/* Center: Main Info */}
    <div className="flex-1 w-full z-10">
     <div className="flex flex-col items-center md:items-start mb-4">
      <div className="flex flex-row-reverse items-center gap-2 mb-1">
       <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
        {doctor.name}
       </h3>
       <ShieldCheck className="text-[#1e40af]" size={20} />
      </div>
      <p className="text-[#1e40af] dark:text-blue-400 font-bold text-sm md:text-lg">
       {doctor.title}
      </p>
     </div>

     {/* Prominent Badges Grid */}
     <div className="flex flex-col sm:flex-row-reverse items-center justify-center md:justify-start gap-3 mb-6">
      {/* Next Role Badge */}
      {/* <div className="bg-[#1e40af] text-white px-5 py-2.5 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none flex items-center gap-3 w-full sm:w-auto justify-center">
              <Users size={18} />
              <span className="text-sm md:text-base font-black">دورك القادم: #{nextTurn}</span>
            </div> */}

      {/* Consultation Fee Box */}
      <div className="bg-white dark:bg-slate-800 border-2 border-[#1e40af] text-[#1e40af] dark:text-blue-300 px-5 py-2 rounded-2xl flex items-center gap-3 w-full sm:w-auto justify-center">
       <Banknote size={18} />
       <span className="text-sm md:text-base font-black">سعر الكشف: {doctor.consultationFee} ج.م</span>
      </div>
     </div>

     <div className="flex flex-row-reverse items-center justify-center md:justify-start gap-4 text-slate-400 font-bold text-xs md:text-sm">
      <div className="flex flex-row-reverse items-center gap-1.5">
       {/* <Star size={16} fill="#FACC15" className="text-yellow-400" />
       <span className="text-slate-800 dark:text-slate-200">{doctor.rating}</span> */}
       {/* <span className="opacity-60">({doctor.reviewsCount} تقييم)</span> */}
      </div>
      <div className="w-1.5 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
      <div className="flex flex-col gap-1 items-end md:items-start">
       {doctor.branches && doctor.branches.length > 0 ? (
        doctor.branches.map(branch => (
         <div key={branch.id} className="flex flex-row-reverse items-center gap-1.5">
          <MapPin size={14} />
          <span>{branch.name} - {branch.address}</span>
         </div>
        ))
       ) : (
        <div className="flex flex-row-reverse items-center gap-1.5">
         <MapPin size={14} />
         <span>{doctor.location}</span>
        </div>
       )}
      </div>
     </div>
    </div>

    {/* Left: Action Buttons */}
    <div className="flex flex-col gap-3 w-full md:w-[180px] z-10 pt-4 md:pt-0 border-t md:border-t-0 md:border-r border-slate-100 dark:border-slate-800 md:pr-6">
     <button
      onClick={() => onBookNow(doctor)}
      className="w-full bg-[#1e40af] text-white font-black text-lg py-4 rounded-2xl shadow-xl hover:bg-blue-800 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2"
     >
      <Zap size={18} fill="currentColor" />
      احجز الآن
     </button>

     <button
      onClick={() => setShowInfo(true)}
      className="w-full bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-300 font-black text-sm py-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
     >
      <span>نبذة عن الطبيب

      </span>
      <ChevronLeft size={16} />
     </button>
    </div>
   </motion.div>

   {/* Profile Detail Modal */}
   <AnimatePresence>
    {showInfo && (
     <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-6 bg-slate-900/70 backdrop-blur-md"
      onClick={() => setShowInfo(false)}
     >
      <motion.div
       initial={{ y: "100%" }}
       animate={{ y: 0 }}
       exit={{ y: "100%" }}
       transition={{ type: "spring", damping: 25, stiffness: 200 }}
       className="bg-white dark:bg-slate-900 w-full md:max-w-4xl h-[90vh] md:h-auto md:max-h-[85vh] rounded-t-[40px] md:rounded-[50px] p-6 md:p-10 shadow-2xl relative overflow-y-auto text-right"
       onClick={e => e.stopPropagation()}
      >
       <button onClick={() => setShowInfo(false)} className="absolute top-6 left-6 w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
        <X size={24} />
       </button>

       <div className="flex flex-col md:flex-row-reverse gap-10">
        <div className="w-full md:w-1/3">
         <div className="aspect-square rounded-[40px] overflow-hidden border-4 border-slate-50 dark:border-slate-800 shadow-xl mb-6">
          <img src={doctor.image} className="w-full h-full object-cover" />
         </div>
         <div className="space-y-4">
          {/* <div className="bg-[#1e40af] text-white p-4 rounded-2xl text-center shadow-lg">
           <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">دورك المتوقع</p>
           <p className="text-2xl font-[1000]">رقم {nextTurn}</p>
          </div> */}
          <div className="bg-white dark:bg-slate-800 border-2 border-[#1e40af] text-[#1e40af] dark:text-blue-300 p-4 rounded-2xl text-center">
           <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">سعر الكشف</p>
           <p className="text-2xl font-[1000]">{doctor.consultationFee} ج.م</p>
          </div>
         </div>
        </div>

        <div className="flex-1">
         <h2 className="text-3xl md:text-5xl font-[1000] text-slate-900 dark:text-white mb-2 tracking-tighter">{doctor.name}</h2>
         <p className="text-lg md:text-xl font-bold text-[#1e40af] mb-8">{doctor.title}</p>

         <div className="grid grid-cols-1 gap-6 mb-8">
          {/* ابحث عن قسم النبذة الطبية وخليه كدا بالضبط */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
           <h4 className="text-xs font-black text-slate-400 mb-4 uppercase tracking-widest">نبذة طبية</h4>
           {/* استخدم السطر ده عشان تضمن لو الداتا null يظهر نص بديل */}
           <p className="text-lg text-slate-700 dark:text-slate-300 font-bold leading-relaxed whitespace-pre-line">
            {doctor.bio ? doctor.bio : "لا توجد تفاصيل إضافية متاحة حالياً لهذا الطبيب."}
           </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
           <h4 className="text-xs font-black text-slate-400 mb-4 uppercase tracking-widest">فروع العيادة</h4>
           <div className="space-y-4">
            {doctor.branches.map(branch => (
             <div key={branch.id} className="flex flex-row-reverse items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
              <div className="text-right">
               <p className="font-black text-slate-800 dark:text-white">{branch.name}</p>
               <p className="text-xs text-slate-400 font-bold">{branch.address}</p>
              </div>
              <MapPin className="text-[#1e40af]" size={20} />
             </div>
            ))}
           </div>
          </div>
         </div>

         <button
          onClick={() => { setShowInfo(false); onBookNow(doctor); }}
          className="w-full bg-[#1e40af] text-white font-black text-xl py-6 rounded-3xl shadow-2xl hover:bg-blue-800 transition-all flex items-center justify-center gap-3 active:scale-95"
         >
          <Zap size={24} fill="currentColor" />
          تأكيد الحجز والدخول للطابور
         </button>
        </div>
       </div>
      </motion.div>
     </motion.div>
    )}
   </AnimatePresence>
  </>
 );
};

export default DoctorCard;