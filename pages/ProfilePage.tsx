import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
 Clock,
 History,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DOCTORS } from '../constants';
import { Booking } from '../types';
import { publicAPI } from '../services/api';

type TabType = 'pending' | 'history';

const ProfilePage: React.FC = () => {
 const navigate = useNavigate();
 const [user, setUser] = useState<any>(null);
 const [bookings, setBookings] = useState<Booking[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [activeTab, setActiveTab] = useState<TabType>('pending');

 const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  'منتظر': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', label: 'منتظر' },
  'قيد الكشف': { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-400', label: 'قيد الكشف' },
  'تم الكشف': { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', label: 'تم الكشف' },
  'ملغي': { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-400', label: 'ملغي' },
 };

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
   console.error('Error fetching bookings:', error);
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
    await publicAPI.cancelBooking(bookingId);
    alert('تم إلغاء الحجز بنجاح');
    if (user) fetchAllUserBookings(JSON.stringify(user));
   } catch {
    alert('عذراً، فشل إلغاء الحجز. حاول مرة أخرى.');
   }
  }
 };

 const handleBookAgain = (doctorId: string) => {
  const doctor = DOCTORS.find((d) => d.id === doctorId);
  if (doctor) {
   navigate(`/doctors?search=${encodeURIComponent(doctor.name)}`);
  }
 };

 // ── فصل الحجوزات ──────────────────────────────────────────
 const pendingBookings = bookings.filter((b) => b.status === 'منتظر');
 const historyBookings = bookings.filter((b) =>
  ['قيد الكشف', 'تم الكشف', 'ملغي'].includes(b.status)
 );
 const displayedBookings = activeTab === 'pending' ? pendingBookings : historyBookings;

 // ── Booking Card ───────────────────────────────────────────
 const BookingCard = ({ booking }: { booking: Booking }) => {
  const config =
   statusConfig[booking.status] || {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    label: booking.status,
   };

  return (
   <motion.div
    key={booking.id}
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.25 }}
    className="bg-white dark:bg-slate-900 rounded-[32px] p-6 md:p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col lg:flex-row-reverse items-center justify-between gap-6 group"
   >
    {/* Doctor Info */}
    <div className="flex flex-col md:flex-row-reverse items-center gap-5 flex-1 w-full text-center md:text-right">
     <div className="w-20 h-20 md:w-24 md:h-24 rounded-[28px] overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg shrink-0">
      <img
       src={booking.doctorImage || '/default-doctor.png'}
       alt={booking.doctorName}
       className="w-full h-full object-cover"
      />
     </div>
     <div className="flex-1">
      <div className="flex flex-col md:flex-row-reverse items-center gap-3 mb-2">
       <h3 className="text-xl font-black text-slate-900 dark:text-white">
        {booking.doctorName}
       </h3>
       <span
        className={`px-3 py-1.5 rounded-xl text-xs font-black ${config.bg} ${config.text}`}
       >
        {config.label}
       </span>
      </div>
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 text-slate-400 font-bold text-sm">
       <div className="flex items-center gap-2 flex-row-reverse">
        <Calendar size={14} />
        <span>
         {new Date(booking.bookedAt).toLocaleDateString('ar-EG', {
          day: 'numeric',
          month: 'long',
         })}
        </span>
       </div>
       <div className="flex items-center gap-2 flex-row-reverse">
        <MapPin size={14} />
        <span>{booking.branchName}</span>
       </div>
      </div>
     </div>
    </div>

    {/* Actions */}
    <div className="flex flex-col items-center gap-3 w-full lg:w-auto lg:border-r border-slate-100 dark:border-slate-800 lg:pr-8 shrink-0">
     {booking.status === 'منتظر' ? (
      <>
       <button
        onClick={() => navigate(`/booking/${booking.id}`)}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 min-w-[190px]"
       >
        <Clock size={15} />
        <span>تتبع دورك الآن</span>
        <ExternalLink size={13} />
       </button>
       <button
        onClick={() => handleCancelBooking(booking.id)}
        className="w-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/40 font-black px-6 py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
       >
        <Trash2 size={15} />
        <span>إلغاء الحجز</span>
       </button>
      </>
     ) : booking.status === 'تم الكشف' || booking.status === 'قيد الكشف' ? (
      <button
       onClick={() => handleBookAgain(booking.doctorId)}
       className="w-full bg-[#1e40af] text-white font-black px-8 py-4 rounded-2xl text-sm hover:bg-blue-800 transition-all flex items-center justify-center gap-2 min-w-[190px]"
      >
       <RefreshCw size={15} />
       <span>احجز مرة أخرى</span>
      </button>
     ) : (
      <span className="text-slate-400 font-bold text-sm italic">الحجز ملغي</span>
     )}
    </div>
   </motion.div>
  );
 };

 // ── Empty State ────────────────────────────────────────────
 const EmptyState = () => (
  <div className="py-28 bg-white dark:bg-slate-900 rounded-[48px] border-4 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center text-center px-10">
   <Search size={56} className="text-slate-200 dark:text-slate-700 mb-6" />
   <h3 className="text-2xl font-[1000] text-slate-900 dark:text-white mb-2">
    {activeTab === 'pending' ? 'لا توجد حجوزات منتظرة' : 'لا يوجد سجل حجوزات'}
   </h3>
   <p className="text-slate-400 font-bold mb-8 text-sm">
    {activeTab === 'pending'
     ? 'احجز موعدك الآن مع أفضل الأطباء'
     : 'حجوزاتك السابقة ستظهر هنا'}
   </p>
   <button
    onClick={() => navigate('/doctors')}
    className="bg-[#1e40af] text-white font-black px-10 py-4 rounded-[20px] flex items-center gap-3 hover:bg-blue-800 transition-all"
   >
    <span>استكشف الأطباء</span>
    <ChevronLeft size={18} />
   </button>
  </div>
 );

 // ── Render ─────────────────────────────────────────────────
 return (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24" dir="rtl">

   {/* Header */}
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

   <div className="max-w-6xl mx-auto px-6 mt-14">

    {/* Section title */}
    <div className="flex items-center gap-3 mb-8 flex-row-reverse">
     <ClipboardList className="text-[#1e40af]" size={28} />
     <h2 className="text-3xl font-[1000] text-slate-900 dark:text-white tracking-tighter">
      سجل الحجوزات
     </h2>
    </div>

    {/* Tabs */}
    <div className="flex gap-3 mb-10 flex-row-reverse">
     {/* Tab: منتظر */}
     <button
      onClick={() => setActiveTab('pending')}
      className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm transition-all duration-200 ${activeTab === 'pending'
        ? 'bg-[#1e40af] text-white shadow-lg shadow-blue-500/20'
        : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-800 hover:border-slate-200'
       }`}
     >
      <Clock size={16} />
      <span>منتظر</span>
      {pendingBookings.length > 0 && (
       <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-black ${activeTab === 'pending'
          ? 'bg-white/20 text-white'
          : 'bg-amber-100 text-amber-700'
         }`}
       >
        {pendingBookings.length}
       </span>
      )}
     </button>

     {/* Tab: تاريخ الحجوزات */}
     <button
      onClick={() => setActiveTab('history')}
      className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm transition-all duration-200 ${activeTab === 'history'
        ? 'bg-[#1e40af] text-white shadow-lg shadow-blue-500/20'
        : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-800 hover:border-slate-200'
       }`}
     >
      <History size={16} />
      <span>تاريخ الحجوزات</span>
      {historyBookings.length > 0 && (
       <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-black ${activeTab === 'history'
          ? 'bg-white/20 text-white'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
         }`}
       >
        {historyBookings.length}
       </span>
      )}
     </button>
    </div>

    {/* Content */}
    {isLoading ? (
     <div className="flex justify-center py-20">
      <Loader2 className="animate-spin text-blue-600" size={48} />
     </div>
    ) : displayedBookings.length > 0 ? (
     <AnimatePresence mode="wait">
      <motion.div
       key={activeTab}
       initial={{ opacity: 0, y: 10 }}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, y: -10 }}
       transition={{ duration: 0.2 }}
       className="grid grid-cols-1 gap-5"
      >
       {displayedBookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
       ))}
      </motion.div>
     </AnimatePresence>
    ) : (
     <AnimatePresence mode="wait">
      <motion.div
       key={activeTab + '-empty'}
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}
      >
       <EmptyState />
      </motion.div>
     </AnimatePresence>
    )}
   </div>
  </div>
 );
};

export default ProfilePage;