import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Loader2, Clock, CheckCircle2, AlertCircle, CreditCard, Phone, User, Stethoscope, ClipboardList } from 'lucide-react';
import { Doctor, Branch } from '../types';
import { publicAPI } from '../services/api';

interface TimeSlot {
 id: string | number;
 day_of_week: number;
 day_name: string;
 start_time: string;
 end_time: string;
 capacity: number;
 booked_count: number;
}

interface BookingModalProps {
 isOpen: boolean;
 onClose: () => void;
 doctor: Doctor;
 onConfirm: (
  name: string,
  phone: string,
  branch: Branch,
  selectedSlot: TimeSlot,
  visitType: 'checkup' | 'consultation' // 🆕 نوع الزيارة
 ) => void;
}

const daysOfWeek = [
 { id: 0, name: 'السبت', short: 'سبت' },
 { id: 1, name: 'الأحد', short: 'أحد' },
 { id: 2, name: 'الاثنين', short: 'اثنين' },
 { id: 3, name: 'الثلاثاء', short: 'ثلاثاء' },
 { id: 4, name: 'الأربعاء', short: 'أربعاء' },
 { id: 5, name: 'الخميس', short: 'خميس' },
 { id: 6, name: 'الجمعة', short: 'جمعة' },
];

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, doctor, onConfirm }) => {
 const [name, setName] = useState('');
 const [phone, setPhone] = useState('');
 const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
 const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
 const [selectedDay, setSelectedDay] = useState<number | null>(null);
 const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
 const [isLoadingSlots, setIsLoadingSlots] = useState(false);
 const [visitType, setVisitType] = useState<'checkup' | 'consultation'>('checkup'); // 🆕

 // تحويل الوقت من 24 إلى 12 ساعة بصيغة عربية
 const formatTimeTo12Hour = (time24: string) => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'م' : 'ص';
  let hours12 = hours % 12;
  hours12 = hours12 === 0 ? 12 : hours12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
 };

 // استعادة بيانات المستخدم من localStorage
 useEffect(() => {
  if (isOpen) {
   const savedUser = localStorage.getItem('dorak_user');
   if (savedUser) {
    try {
     const userData = JSON.parse(savedUser);
     if (userData.name) setName(userData.name);
     if (userData.phone) setPhone(userData.phone);
    } catch (e) {
     console.error('Error parsing saved user', e);
    }
   }
  }
 }, [isOpen]);

 // اختيار أول عيادة تلقائياً عند فتح المودال
 useEffect(() => {
  if (isOpen && doctor.branches?.length && !selectedBranch) {
   setSelectedBranch(doctor.branches[0]);
  }
 }, [isOpen, doctor.branches, selectedBranch]);

 // جلب المواعيد من API للعيادة المختارة
 const fetchSchedulesForBranch = useCallback(async (branchId: string | number) => {
  setIsLoadingSlots(true);
  try {
   const doctorData = await publicAPI.getDoctor(doctor.id);
   const clinicData = doctorData.clinics?.find((c: any) => c.id.toString() === branchId.toString());
   const timeSlotsData = clinicData?.time_slots || [];

   const transformedSlots: TimeSlot[] = timeSlotsData.map((slot: any) => ({
    id: slot.id,
    day_of_week: slot.day_of_week,
    day_name: slot.day_name,
    start_time: slot.start_time ? slot.start_time.substring(0, 5) : '',
    end_time: slot.end_time ? slot.end_time.substring(0, 5) : '',
    capacity: slot.capacity || 0,
    booked_count: slot.booked_count || 0,
   }));

   setAvailableSlots(transformedSlots);
   setSelectedDay(null);
   setSelectedSlot(null);
  } catch (error) {
   console.error('Failed to fetch schedules:', error);
   setAvailableSlots([]);
  } finally {
   setIsLoadingSlots(false);
  }
 }, [doctor.id]);

 useEffect(() => {
  if (selectedBranch && isOpen) {
   fetchSchedulesForBranch(selectedBranch.id);
  }
 }, [selectedBranch?.id, isOpen, fetchSchedulesForBranch]);

 // الأيام المتاحة (اللي لها مواعيد في الـ API)
 const availableDays = useMemo(() => {
  if (availableSlots.length === 0) return [];
  const daysWithSlots = new Set(availableSlots.map(slot => slot.day_of_week));
  return daysOfWeek.filter(day => daysWithSlots.has(day.id));
 }, [availableSlots]);

 // فلترة المواعيد حسب اليوم المختار (باستخدام day_of_week)
 const filteredSlots = useMemo(() => {
  if (selectedDay === null) return [];
  return availableSlots.filter(slot => slot.day_of_week === selectedDay);
 }, [availableSlots, selectedDay]);

 const handleDaySelect = (dayId: number) => {
  setSelectedDay(dayId);
  setSelectedSlot(null);
 };

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (name && phone && selectedBranch && selectedSlot) {
   const existingPhones: string[] = JSON.parse(localStorage.getItem('dorak_user_phones') || '[]');
   if (!existingPhones.includes(phone)) {
    existingPhones.push(phone);
    localStorage.setItem('dorak_user_phones', JSON.stringify(existingPhones));
   }
   // حفظ بيانات المستخدم
   localStorage.setItem('dorak_user', JSON.stringify({ name, phone }));
   // 🆕 تمرير visitType مع باقي البيانات
   onConfirm(name, phone, selectedBranch, selectedSlot, visitType);
  } else {
   alert('من فضلك أكمل جميع البيانات');
  }
 };

 // إعادة تعيين الحالة عند إغلاق المودال
 useEffect(() => {
  if (!isOpen) {
   setSelectedSlot(null);
   setSelectedDay(null);
   setAvailableSlots([]);
   setVisitType('checkup'); // 🆕 إعادة تعيين نوع الزيارة
  }
 }, [isOpen]);

 return (
  <AnimatePresence>
   {isOpen && (
    <div className="fixed inset-0 z-[300] flex items-end md:items-center justify-center p-4">
     <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
     />

     <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="relative w-full md:max-w-3xl bg-white dark:bg-slate-900 rounded-t-[40px] md:rounded-[40px] shadow-2xl p-6 md:p-10 overflow-y-auto max-h-[92vh] text-right"
      dir="rtl"
      onClick={(e) => e.stopPropagation()}
     >
      <button
       onClick={onClose}
       className="absolute top-6 left-6 w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-100 transition-colors z-10"
      >
       <X size={20} />
      </button>

      <div className="mb-8">
       <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">{doctor.name}</h3>
       <p className="text-blue-600 dark:text-blue-400 text-sm font-bold">{doctor.title}</p>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-3">
       <div className="bg-gradient-to-l from-blue-600 to-blue-500 rounded-xl p-4 shadow-lg shadow-blue-500/20">
        <div className="flex items-center gap-3">
         <div className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg shrink-0 border border-white/30">
          <CreditCard size={20} />
         </div>
         <div>
          <h4 className="font-black text-white/90 text-xs uppercase tracking-wider">رسوم الخدمة</h4>
          <div className="flex items-baseline gap-1 mt-1">
           <span className="text-white font-black text-2xl">15</span>
           <span className="text-white/80 font-bold text-sm">ج</span>
          </div>
         </div>
        </div>
       </div>

       <div className="bg-gradient-to-l from-red-600 to-red-500 rounded-xl p-4 shadow-lg shadow-red-500/20">
        <div className="flex items-center gap-3">
         <div className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg shrink-0 border border-white/30 animate-pulse">
          <AlertCircle size={20} />
         </div>
         <div className="flex-1">
          <h4 className="font-black text-white/90 text-xs uppercase tracking-wider">🚨 حالات الطوارئ</h4>
          <p className="text-white/95 font-medium text-xs leading-relaxed mt-1">يرجى التوجه مباشرة إلى العيادة بعد الحجز</p>
         </div>
        </div>
       </div>
      </div>

      {/* 🆕 قسم اختيار نوع الزيارة */}
      <div className="mb-8">
       <label className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest block mb-4">نوع الزيارة</label>
       <div className="grid grid-cols-2 gap-3">
        <button
         type="button"
         onClick={() => setVisitType('checkup')}
         className={`p-4 rounded-2xl border-2 text-center transition-all flex items-center justify-center gap-3 ${visitType === 'checkup'
          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
         <Stethoscope size={22} />
         <span className="font-black">كشف</span>
        </button>
        <button
         type="button"
         onClick={() => setVisitType('consultation')}
         className={`p-4 rounded-2xl border-2 text-center transition-all flex items-center justify-center gap-3 ${visitType === 'consultation'
          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
         <ClipboardList size={22} />
         <span className="font-black">استشارة</span>
        </button>
       </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
       {/* اختيار العيادة */}
       <div>
        <label className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest block mb-4">اختر العيادة</label>
        <div className="grid gap-3">
         {doctor.branches?.length > 0 ? (
          doctor.branches.map((branch) => {
           const isClosed = branch.isClosedToday || false;
           const isSelected = selectedBranch?.id === branch.id;
           return (
            <button
             key={branch.id}
             type="button"
             disabled={isClosed}
             onClick={() => { if (!isClosed) setSelectedBranch(branch); }}
             className={`p-4 rounded-2xl border-2 text-right transition-all relative ${isClosed
              ? 'border-rose-300 bg-rose-50 dark:bg-rose-900/10 opacity-75 cursor-not-allowed'
              : isSelected
               ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
               : 'border-slate-200 dark:border-slate-800'
              }`}
            >
             <div className="flex justify-between items-center">
              <div>
               <p className={`font-black ${isClosed ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>{branch.name}</p>
               <p className="text-xs text-slate-500 mt-1">{branch.address}</p>
              </div>
              <MapPin size={18} className={isSelected ? 'text-blue-600' : 'text-slate-400'} />
             </div>
            </button>
           );
          })
         ) : (
          <p className="text-center text-slate-400">لا توجد عيادات</p>
         )}
        </div>
       </div>

       {/* اختيار اليوم */}
       {selectedBranch && !selectedBranch.isClosedToday && availableDays.length > 0 && (
        <div>
         <label className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest block mb-4">اختر اليوم</label>
         <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {availableDays.map((day) => (
           <button
            key={day.id}
            type="button"
            onClick={() => handleDaySelect(day.id)}
            className={`px-6 py-3 rounded-2xl font-black transition-all whitespace-nowrap ${selectedDay === day.id
             ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
             : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
             }`}
           >
            {day.name}
           </button>
          ))}
         </div>
        </div>
       )}

       {/* المواعيد المتاحة */}
       {selectedDay !== null && (
        <div>
         <label className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest block mb-4">
          اختر المواعيد المتاحة ليوم {daysOfWeek.find(d => d.id === selectedDay)?.name}
         </label>
         {isLoadingSlots ? (
          <div className="flex justify-center py-8"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
         ) : filteredSlots.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
           {filteredSlots.map((slot) => {
            const isSelected = selectedSlot?.id === slot.id;
            const isFull = (slot.capacity - slot.booked_count) <= 0;
            const start12 = formatTimeTo12Hour(slot.start_time);
            const end12 = formatTimeTo12Hour(slot.end_time);
            return (
             <button
              key={slot.id}
              type="button"
              disabled={isFull}
              onClick={() => setSelectedSlot(slot)}
              className={`p-4 rounded-xl border-2 text-center transition-all ${isSelected
               ? 'border-blue-600 bg-blue-600 text-white shadow-lg'
               : isFull
                ? 'opacity-30 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                : 'border-slate-200 bg-white dark:bg-white text-slate-900 dark:text-slate-900 hover:border-blue-500'
               }`}
             >
              <div className="font-black text-base italic">
               {`${start12} - ${end12}`}
              </div>
             </button>
            );
           })}
          </div>
         ) : (
          <div className="text-center py-8 text-slate-500 bg-slate-50 dark:bg-slate-800 rounded-xl">
           <Clock className="mx-auto mb-2 opacity-50" size={32} />
           <p className="font-bold">لا توجد مواعيد متاحة لهذا اليوم</p>
          </div>
         )}
        </div>
       )}

       {/* البيانات الشخصية */}
       <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
         <label className="block text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">اسم المريض الكامل</label>
         <div className="relative">
          <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
           type="text"
           required
           value={name}
           onChange={(e) => setName(e.target.value)}
           className="w-full pr-12 pl-4 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 dark:bg-slate-900 outline-none focus:border-blue-600 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white"
           placeholder="الاسم كما في البطاقة"
          />
         </div>
        </div>
        <div className="space-y-2">
         <label className="block text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">رقم الهاتف</label>
         <div className="relative">
          <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
           type="tel"
           required
           value={phone}
           onChange={(e) => setPhone(e.target.value)}
           className="w-full pr-12 pl-4 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 dark:bg-slate-900 outline-none focus:border-blue-600 transition-all font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white"
           placeholder="01xxxxxxxxx"
          />
         </div>
        </div>
       </div>

       <button
        type="submit"
        disabled={!selectedSlot || !name || !phone}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
       >
        <CheckCircle2 size={22} />
        <span>تأكيد الحجز والدخول</span>
       </button>
      </form>
     </motion.div>
    </div>
   )}
  </AnimatePresence>
 );
};

export default BookingModal;