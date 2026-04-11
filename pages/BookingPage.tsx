
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, MapPin, ArrowRight, ShieldCheck, MessageSquare } from 'lucide-react';
import { Doctor, Branch, Booking } from '../types';
import BookingForm from '../components/BookingForm';
import QueueDashboard from '../components/QueueDashboard';
import { publicAPI } from '../services/api';

interface BookingPageProps {
  flow: {
    step: 1 | 2 | 3;
    doctor: Doctor | null;
    branch: Branch | null;
    booking: Booking | null;
  };
  setFlow: React.Dispatch<React.SetStateAction<any>>;
  onReset?: () => void;
  onSaveToHistory?: (booking: Booking, doctor: Doctor, branch: Branch) => void;
}

const BookingPage: React.FC<BookingPageProps> = ({ flow, setFlow, onReset, onSaveToHistory }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (!flow.doctor) {
      navigate('/doctors');
    }
    window.scrollTo(0, 0);
  }, [flow.doctor, navigate]);

  if (!flow.doctor) return null;

  // Create booking via API
  const handleConfirmBooking = async (name: string, phone: string) => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Create booking via API
      const response = await publicAPI.createBooking({
        clinic_id: parseInt(flow.branch!.id),
        doctor_id: parseInt(flow.doctor!.id),
        patient_name: name,
        phone_number: phone,
        type: 'كشف',
        date: today,
        notes: '',
      });

      const newBooking: Booking = {
        id: response.order.id.toString(),
        patientName: name,
        patientPhone: phone,
        doctorId: flow.doctor!.id,
        doctorName: flow.doctor!.name,
        doctorSpecialty: flow.doctor!.specialty,
        doctorImage: flow.doctor!.image,
        branchId: flow.branch!.id,
        branchName: flow.branch!.name,
        turnNumber: response.queue_number,
        bookedAt: new Date().toISOString(),
        status: 'confirmed',
        consultationFee: flow.doctor!.consultationFee,
        serviceFee: flow.doctor!.serviceFee
      };
      
      if (onSaveToHistory) {
        onSaveToHistory(newBooking, flow.doctor!, flow.branch!);
      }
      
      setFlow((prev: any) => ({ ...prev, step: 3, booking: newBooking }));
    } catch (error: any) {
      console.error('Booking failed:', error);
      const message = error.response?.data?.message || 'فشل إنشاء الحجز. يرجى المحاولة مرة أخرى.';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppConfirm = () => {
    const text = `أهلاً منصة دورك، أود تأكيد حجزي مع الدكتور ${flow.doctor?.name} في فرع ${flow.branch?.name}. رقم الدور: ${flow.booking?.turnNumber}.`;
    window.open(`https://wa.me/201035177205?text=${encodeURIComponent(text)}`, '_blank');
  };

  const total = flow.doctor.consultationFee + flow.doctor.serviceFee;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-32">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-20">
        {/* Stepper UI */}
        <div className="mb-16 md:mb-24 flex flex-row-reverse items-center justify-between max-w-2xl mx-auto px-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center gap-4 relative z-10">
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-[20px] md:rounded-[24px] flex items-center justify-center font-black text-xl md:text-2xl transition-all duration-500 ${flow.step >= s ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-white dark:bg-slate-900 text-slate-300 border border-slate-100 dark:border-slate-800'}`}>
                {flow.step > s ? <CheckCircle2 size={32} /> : s}
              </div>
              <span className={`text-xs md:text-sm font-black tracking-widest uppercase ${flow.step === s ? 'text-blue-600' : 'text-slate-400'}`}>
                {s === 1 ? 'الفرع' : s === 2 ? 'البيانات' : 'التأكيد'}
              </span>
            </div>
          ))}
          <div className="absolute left-1/2 -translate-x-1/2 w-2/3 h-1 bg-slate-200 dark:bg-slate-800 -z-0 mt-[-30px] rounded-full">
            <motion.div 
              className="h-full bg-blue-600 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: flow.step === 1 ? '0%' : flow.step === 2 ? '50%' : '100%' }}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row-reverse gap-10 lg:gap-16 items-start">
          
          {/* Content Area */}
          <div className="flex-1 w-full">
            <AnimatePresence mode="wait">
              {flow.step === 1 && (
                <motion.div 
                  key="step1" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="text-right mb-10">
                    <h2 className="text-4xl font-[1000] text-slate-900 dark:text-white tracking-tighter mb-3">اختر الفرع الأقرب</h2>
                    <p className="text-slate-400 font-bold text-xl">جميع فروعنا مجهزة بأعلى المعايير</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {flow.doctor.branches.map(branch => (
                      <button 
                        key={branch.id} 
                        onClick={() => setFlow((prev: any) => ({ ...prev, branch }))}
                        className={`p-8 rounded-[40px] text-right border-4 transition-all flex flex-col gap-6 relative group ${flow.branch?.id === branch.id ? 'border-blue-600 bg-white dark:bg-slate-900 shadow-2xl scale-[1.02]' : 'border-transparent bg-white dark:bg-slate-900 shadow-sm opacity-60 hover:opacity-100'}`}
                      >
                        {flow.branch?.id === branch.id && (
                          <div className="absolute top-6 left-6 text-blue-600">
                             <CheckCircle2 size={32} />
                          </div>
                        )}
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
                           <MapPin size={32} />
                        </div>
                        <div>
                          <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{branch.name}</h4>
                          <p className="text-slate-400 font-bold text-sm mb-6 leading-relaxed">{branch.address}</p>
                          <div className="flex flex-row-reverse items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                             <Clock size={20} className="text-blue-500" />
                             <span className="text-xs font-black text-slate-600 dark:text-slate-400">{branch.workingHours}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="pt-8 flex justify-end">
                    <button 
                      onClick={() => setFlow((prev: any) => ({ ...prev, step: 2 }))}
                      disabled={!flow.branch}
                      className="bg-blue-600 disabled:bg-slate-200 text-white font-black text-xl py-6 px-16 rounded-[30px] shadow-xl hover:bg-blue-700 transition-all flex items-center gap-4 active:scale-95"
                    >
                      استمرار للبيانات
                      <ArrowRight size={24} className="rotate-180" />
                    </button>
                  </div>
                </motion.div>
              )}

              {flow.step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="max-w-3xl mx-auto">
                    <BookingForm onConfirm={handleConfirmBooking} isLoading={isLoading} />
                  </div>
                </motion.div>
              )}

              {flow.step === 3 && flow.booking && (
                <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                  <div className="flex flex-col items-center">
                    <QueueDashboard 
                      userTurn={flow.booking.turnNumber} 
                      clinicName={flow.branch!.name}
                      clinicId={flow.branch!.id}
                      doctorName={flow.doctor!.name}
                      doctorLocation={flow.branch!.address}
                      lat={flow.branch!.lat}
                      lng={flow.branch!.lng}
                      onBack={onReset}
                    />
                    
                    <button 
                      onClick={handleWhatsAppConfirm}
                      className="mt-12 bg-[#25D366] text-white font-black text-2xl py-8 px-16 rounded-[40px] shadow-2xl flex items-center gap-6 hover:scale-105 active:scale-95 transition-all"
                    >
                      <MessageSquare size={32} />
                      تأكيد الحجز عبر واتساب
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Summary (Desktop Only) */}
          {flow.step < 3 && (
            <div className="hidden lg:block w-[450px] sticky top-32">
              <div className="bg-slate-900 rounded-[60px] p-12 text-white shadow-2xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16" />
                
                <h4 className="text-3xl font-[1000] mb-10 text-right tracking-tighter">ملخص الحجز</h4>
                
                <div className="space-y-6 mb-12 text-right">
                  <div className="flex justify-between flex-row-reverse items-center pb-4 border-b border-white/5">
                    <span className="text-slate-500 font-bold">الطبيب</span>
                    <span className="text-lg font-black">{flow.doctor.name}</span>
                  </div>
                  <div className="flex justify-between flex-row-reverse items-center pb-4 border-b border-white/5">
                    <span className="text-slate-500 font-bold">قيمة الكشف</span>
                    <span className="text-lg font-black">{flow.doctor.consultationFee} ج.م</span>
                  </div>
                  <div className="flex justify-between flex-row-reverse items-center pb-4 border-b border-white/5">
                    <span className="text-slate-500 font-bold">رسوم الخدمة</span>
                    <span className="text-lg font-black text-emerald-400">{flow.doctor.serviceFee} ج.م</span>
                  </div>
                  {flow.branch && (
                    <div className="pt-4">
                      <span className="text-slate-500 text-sm font-black block mb-2 uppercase tracking-widest">الفرع المختار</span>
                      <div className="bg-white/5 p-5 rounded-2xl flex flex-row-reverse items-center gap-4">
                         <MapPin className="text-blue-500 shrink-0" size={24} />
                         <span className="text-lg font-bold leading-tight">{flow.branch.name}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white/5 p-8 rounded-[32px] border border-white/10 mb-10">
                  <p className="text-slate-500 font-bold mb-2 text-right">الإجمالي</p>
                  <div className="flex items-baseline gap-3 flex-row-reverse">
                    <span className="text-6xl font-[1000] text-blue-500">{total}</span>
                    <span className="text-xl font-black text-slate-500">ج.م</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20">
                  <ShieldCheck size={24} className="text-emerald-500 shrink-0" />
                  <p className="text-xs font-bold text-emerald-100 leading-relaxed text-right">
                    نظام حجز آمن وموثوق. يتم استرداد رسوم الخدمة في حال إلغاء الموعد قبل 24 ساعة.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
