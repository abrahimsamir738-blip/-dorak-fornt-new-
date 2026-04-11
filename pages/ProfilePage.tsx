import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
 Calendar,
 MapPin,
 User,
 LogOut,
 ClipboardList,
 CheckCircle2,
 ChevronLeft,
 RefreshCw,
 Search,
 Loader2,
 Trash2,
 ExternalLink,
 Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SPECIALTY_LABELS, DOCTORS } from '../constants';
import { Booking } from '../types';
import { publicAPI } from '../services/api';

const ProfilePage: React.FC = () => {
 const navigate = useNavigate();
 const [user, setUser] = useState<any>(null);
 const [bookings, setBookings] = useState<Booking[]>([]);
 const [isLoading, setIsLoading] = useState(true);

 const fetchAllUserBookings = async (savedUserStr: string) => {
  setIsLoading(true);
  try {
   const storedPhones: string[] = JSON.parse(localStorage.getItem('dorak_user_phones') || '[]');
   const currentUser = JSON.parse(savedUserStr);
   if (currentUser.phone && !storedPhones.includes(currentUser.phone)) {
    storedPhones.push(currentUser.phone);
   }

   if (storedPhones.length > 0) {
    const response = await publicAPI.getBookingsByPhones(storedPhones);
    setBookings(response.data || []);
   }
  } catch (error) {
   console.error("Error fetching bookings:", error);
  } finally {
   setIsLoading(false);
  }
 };

 useEffect(() => {
  const savedUser = localStorage.getItem('dorak_user');
  if (savedUser) {
   setUser(JSON.parse(savedUser));
   fetchAllUserBookings(savedUser);
  } else {
   navigate('/');
  }
 }, [navigate]);

 const handleLogout = () => {
  localStorage.removeItem('dorak_user');
  window.location.href = '/';
 };

 const handleCancelBooking = async (bookingId: string | number) => {
  if (window.confirm('هل أنت متأكد من رغبتك في إلغاء هذا الحجز؟')) {
   try {
    // افترضت وجود ميثود cancelBooking في الـ API عندك
    await publicAPI.cancelBooking(bookingId);
    alert('تم إلغاء الحجز بنجاح');
    // إعادة تحميل البيانات
    if (user) fetchAllUserBookings(JSON.stringify(user));
   } catch (error) {
    alert('عذراً، فشل إلغاء الحجز. حاول مرة أخرى.');
   }
  }
 };

 const handleBookAgain = (doctorId: string) => {
  const doctor = DOCTORS.find(d => d.id === doctorId);
  if (doctor) {
   navigate(`/doctors?search=${encodeURIComponent(doctor.name)}`);
  }
 };

 return (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24" dir="rtl">
   {/* Header Section */}
   <section className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 pt-16 pb-12 px-6">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row-reverse items-center justify-between gap-8">
     <div className="flex flex-col md:flex-row-reverse items-center gap-6">
      <div className="w-24 h-24 md:w-32 md:h-32 bg-[#1e40af] rounded-[35px] flex items-center justify-center text-white shadow-2xl relative">
       <User size={48} />
       <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-8 h-8 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center">
        <CheckCircle2 size={14} className="text-white" />
       </div>
      </div>
      <div className="text-center md:text-right">
       <h1 className="text-3xl md:text-5xl font-[1000] text-slate-900 dark:text-white tracking-tighter mb-1">
        {user?.name}
       </h1>
       <p className="text-slate-400 font-bold">{user?.phone}</p>
      </div>
     </div>

     <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-500 font-black border border-slate-100 dark:border-slate-700 hover:text-red-500 transition-all shadow-sm"
     >
      <span>خروج</span>
      <LogOut size={18} />
     </button>
    </div>
   </section>

   <div className="max-w-6xl mx-auto px-6 mt-16">
    <div className="flex items-center gap-3 mb-10 flex-row-reverse">
     <ClipboardList className="text-[#1e40af]" size={32} />
     <h2 className="text-3xl font-[1000] text-slate-900 dark:text-white tracking-tighter">سجل الحجوزات</h2>
    </div>

    {isLoading ? (
     <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={48} /></div>
    ) : bookings.length > 0 ? (
     <div className="grid grid-cols-1 gap-6">
      {bookings.map((booking, idx) => (
       <motion.div
        key={booking.id}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col lg:flex-row-reverse items-center justify-between gap-8 group"
       >
        {/* Doctor Info */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-6 flex-1 w-full text-center md:text-right">
         <div className="w-20 h-20 md:w-24 md:h-24 rounded-[30px] overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg shrink-0">
          <img src={booking.doctorImage || '/default-doctor.png'} alt={booking.doctorName} className="w-full h-full object-cover" />
         </div>
         <div className="flex-1">
          <div className="flex flex-col md:flex-row-reverse items-center gap-3 mb-2">
           <h3 className="text-2xl font-black text-slate-900 dark:text-white">{booking.doctorName}</h3>
           <span className={`px-3 py-1 rounded-full text-[10px] font-black ${booking.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
            }`}>
            {booking.status === 'pending' ? 'قيد الانتظار' : 'تم الكشف'}
           </span>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-slate-400 font-bold text-sm">
           <div className="flex items-center gap-2 flex-row-reverse">
            <Calendar size={16} />
            <span>{new Date(booking.bookedAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long' })}</span>
           </div>
           <div className="flex items-center gap-2 flex-row-reverse">
            <MapPin size={16} />
            <span>{booking.branchName}</span>
           </div>
          </div>
         </div>
        </div>

        {/* Actions Section */}

        {/* Actions Section */}
        <div className="flex flex-col items-center gap-4 w-full lg:w-auto lg:border-r border-slate-100 dark:border-slate-800 lg:pr-8">
         {/* التحقق من الحالات التي تسمح بالإجراءات النشطة */}
         {['منتظر', 'قيد الكشف'].includes(booking.status) ? (
          <div className="flex flex-col gap-3 w-full min-w-[200px]">

           {/* رابط تتبع الحجز - يفتح صفحة الـ QueueDashboard */}
           <a
            href={`http://localhost:3001/booking/${booking.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
           >
            <Clock size={16} />
            <span>تتبع دورك الآن</span>
            <ExternalLink size={14} />
           </a>

           {/* زر التأجيل - يمكنك ربطه بـ Modal لاختيار موعد آخر */}


           {/* زر الإلغاء */}
           <button
            onClick={() => handleCancelBooking(booking.id)}
            className="w-full bg-rose-50 text-rose-600 hover:bg-rose-100 font-black px-6 py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
           >
            <Trash2 size={16} />
            <span>إلغاء الحجز</span>
           </button>
          </div>
         ) : booking.status === 'تم الكشف' ? (
          /* حالة تم الكشف - إعادة الحجز */
          <button
           onClick={() => handleBookAgain(booking.doctorId)}
           className="w-full bg-[#1e40af] text-white font-black px-8 py-4 rounded-2xl text-sm hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
          >
           <RefreshCw size={16} />
           <span>احجز مرة أخرى</span>
          </button>
         ) : (
          /* حالة ملغي أو غير ذلك */
          <span className="text-slate-400 font-bold text-sm italic">الحجز ملغي</span>
         )}
        </div>
       </motion.div>
      ))}
     </div>
    ) : (
     <div className="py-32 bg-white dark:bg-slate-900 rounded-[60px] border-4 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center text-center px-10">
      <Search size={64} className="text-slate-200 mb-8" />
      <h3 className="text-3xl font-[1000] text-slate-900 dark:text-white mb-4">لا توجد حجوزات</h3>
      <button onClick={() => navigate('/doctors')} className="bg-[#1e40af] text-white font-black px-12 py-5 rounded-[25px] flex items-center gap-3">
       <span>استكشف الأطباء</span>
       <ChevronLeft size={20} />
      </button>
     </div>
    )}
   </div>
  </div>
 );
};

export default ProfilePage;