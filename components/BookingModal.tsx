import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Loader2, Clock, CheckCircle2, AlertCircle, CreditCard, Phone, User } from 'lucide-react';
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
  selectedSlot: TimeSlot
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

const BookingModal: React.FC<BookingModalProps> = ({
 isOpen,
 onClose,
 doctor,
 onConfirm,
}) => {
 const [name, setName] = useState('');
 const [phone, setPhone] = useState('');
 const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
 const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
 const [selectedDay, setSelectedDay] = useState<number | null>(null);
 const [selectedDayName, setSelectedDayName] = useState<string | null>(null);
 const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
 const [isLoadingSlots, setIsLoadingSlots] = useState(false);
 const isInitialMount = useRef(true);

 // --- منطق استعادة البيانات تلقائياً ---
 useEffect(() => {
  if (isOpen) {
   const savedUser = localStorage.getItem('dorak_user');
   if (savedUser) {
    try {
     const userData = JSON.parse(savedUser);
     if (userData.name) setName(userData.name);
     if (userData.phone) setPhone(userData.phone);
    } catch (e) {
     console.error("Error parsing saved user", e);
    }
   }
  }
 }, [isOpen]);

 // Select first branch when modal opens
 useEffect(() => {
  if (isOpen && doctor.branches?.length && !selectedBranch) {
   const firstBranch = doctor.branches[0];
   setSelectedBranch(firstBranch);
  }
 }, [isOpen, doctor.branches, selectedBranch]);

 const fetchSchedulesForBranch = useCallback(async (branchId: string | number) => {
  setIsLoadingSlots(true);
  try {
   const doctorData = await publicAPI.getDoctor(doctor.id);
   const clinicData = doctorData.clinics?.find((c: any) =>
    c.id.toString() === branchId.toString()
   );
   const timeSlotsData = clinicData?.time_slots || [];

   const transformedSlots: TimeSlot[] = timeSlotsData.map((slot: any) => {
    const startTime = slot.start_time ? slot.start_time.substring(0, 5) : '';
    const endTime = slot.end_time ? slot.end_time.substring(0, 5) : '';
    return {
     id: slot.id,
     day_of_week: slot.day_of_week,
     day_name: slot.day_name,
     start_time: startTime,
     end_time: endTime,
     capacity: slot.capacity || 0,
     booked_count: slot.booked_count || 0,
    };
   });

   setAvailableSlots(transformedSlots);

   if (transformedSlots.length > 0 && isInitialMount.current) {
    const firstSlot = transformedSlots[0];
    setSelectedDay(firstSlot.day_of_week);
    setSelectedDayName(firstSlot.day_name);
    isInitialMount.current = false;
   } else if (transformedSlots.length === 0) {
    setSelectedDay(null);
    setSelectedDayName(null);
   }
  } catch (error) {
   console.error('❌ Failed to fetch schedules:', error);
   setAvailableSlots([]);
  } finally {
   setIsLoadingSlots(false);
  }
 }, [doctor.id]);

 // تأكد من إضافة هذه الدالة قبل سطر الـ return
 const handleDaySelect = (dayId: number) => {
  const dayName = daysOfWeek[dayId]?.name;
  setSelectedDay(dayId);
  setSelectedDayName(dayName || null);
  setSelectedSlot(null); // نصيحة: تصفير الموعد عند تغيير اليوم لتجنب الخطأ
 };

 useEffect(() => {
  if (selectedBranch && isOpen) {
   isInitialMount.current = true;
   setSelectedSlot(null);
   setSelectedDay(null);
   setSelectedDayName(null);
   fetchSchedulesForBranch(selectedBranch.id);
  }
 }, [selectedBranch?.id, isOpen, fetchSchedulesForBranch]);

 const availableDays = useMemo(() => {
  if (availableSlots.length === 0) return [];
  const daysWithSlots = new Set(availableSlots.map(slot => slot.day_of_week));
  return daysOfWeek.filter(day => daysWithSlots.has(day.id));
 }, [availableSlots]);

 const filteredSlots = useMemo(() => {
  if (!selectedDayName) return [];
  return availableSlots.filter(slot => slot.day_name === selectedDayName);
 }, [availableSlots, selectedDayName]);

 // Reset form when modal closes (except for auto-filled data if you prefer)
 useEffect(() => {
  if (!isOpen) {
   setSelectedSlot(null);
   setSelectedDay(null);
   setSelectedDayName(null);
   isInitialMount.current = true;
  }
 }, [isOpen]);

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (name && phone && selectedBranch && selectedSlot) {
   // حفظ رقم الهاتف في القائمة كما في طلبك السابق
   const existingPhones: string[] = JSON.parse(localStorage.getItem('dorak_user_phones') || '[]');
   if (!existingPhones.includes(phone)) {
    existingPhones.push(phone);
    localStorage.setItem('dorak_user_phones', JSON.stringify(existingPhones));
   }
   onConfirm(name, phone, selectedBranch, selectedSlot);
  } else {
   alert('من فضلك أكمل جميع البيانات');
  }
 };

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

      <form onSubmit={handleSubmit} className="space-y-8">
       {/* 1. اختيار العيادة */}
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
             className={`p-4 rounded-2xl border-2 text-right transition-all relative ${isClosed ? 'border-rose-300 bg-rose-50 dark:bg-rose-900/10 opacity-75 cursor-not-allowed' :
              isSelected ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' :
               'border-slate-200 dark:border-slate-800'
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
         ) : <p className="text-center text-slate-400">لا توجد عيادات</p>}
        </div>
       </div>

       {/* 2. اختيار اليوم */}
       {selectedBranch && !selectedBranch.isClosedToday && availableDays.length > 0 && (
        <div>
         <label className="text-xs font-blue text-slate-600 dark:text-slate-300 uppercase tracking-widest block mb-4">اختر اليوم</label>
         <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {availableDays.map((day) => (
           <button
            key={day.id}
            type="button"
            onClick={() => handleDaySelect(day.id)}


           >
            {day.short}
           </button>
          ))}
         </div>
        </div>
       )}

       {/* 3. المواعيد */}
       <div>
        <label className="text-xs font-blue text-slate-600 dark:text-slate-300 uppercase tracking-widest block mb-4">المواعيد المتاحة</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
         {isLoadingSlots ? (
          <div className="col-span-full flex justify-center py-8"><Loader2 className="animate-spin text-blue-600" /></div>
         ) : filteredSlots.map((slot) => {
          const isSelected = selectedSlot?.id === slot.id;
          const isFull = (slot.capacity - slot.booked_count) <= 0;
          return (
           <button
            key={slot.id}
            type="button"
            disabled={isFull}
            onClick={() => setSelectedSlot(slot)}
            className={`p-4 rounded-xl border-2 text-center transition-all ${isSelected ? 'border-blue-600 bg-blue-600 text-white shadow-lg' :
             isFull ? 'opacity-40 cursor-not-allowed bg-slate-100' : 'border-slate-200 dark:border-slate-800'
             }`}
           >
            <div className="font-blue text-sm">

             {`${slot.start_time} - ${slot.end_time}`}
            </div>            {/* <div className="text-[10px] mt-1 opacity-70">متبقي {slot.capacity - slot.booked_count}</div> */}
           </button>
          );
         })}
        </div>
       </div>

       {/* 4. البيانات الشخصية */}
       <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
         <label className="block text-xs font-blue text -slate-600 dark:text-blue-300 uppercase tracking-widest">اسم المريض الكامل</label>

         <div className="relative">
          <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
           type="text"
           required
           value={name}
           onChange={(e) => setName(e.target.value)}
           className="w-full pr-12 pl-4 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 dark:bg-slate-900 outline-none focus:border-blue-600 transition-all font-bold"
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
           className="w-full pr-12 pl-4 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 dark:bg-slate-900 outline-none focus:border-blue-600 transition-all font-bold"
           placeholder="01xxxxxxxxx"
          />
         </div>
        </div>
       </div>

       {/* زر التأكيد */}
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