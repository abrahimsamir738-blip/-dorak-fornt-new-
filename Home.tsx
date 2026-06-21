import React, { useMemo } from 'react';
import { Search, Sparkles, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SpecialtyCard from './components/SpecialtyCard';
import DoctorCard from './components/DoctorCard';
import { Doctor, SpecialtyType } from './types';
import { useI18n } from './components/Layout';
import { useData } from './App';
import { filterDoctorsByTitle } from './utils/filterDoctors';
import { SPECIALTY_LABELS } from './constants';

const Home: React.FC<{ searchTerm: string; setSearchTerm: (v: string) => void; onBookNow: (d: Doctor) => void; }> = ({ searchTerm, setSearchTerm, onBookNow }) => {
 const navigate = useNavigate();
 const { t } = useI18n();
 const { doctors, specialties, setSelectedSpecialty, selectedSpecialty } = useData();

 const handleSpecialtyClick = (type: string) => {
  const spec = type as SpecialtyType;
  setSelectedSpecialty(spec);
  const specialtyLabel = SPECIALTY_LABELS[spec];
  if (specialtyLabel) {
   const filteredByTitle = filterDoctorsByTitle(doctors, specialtyLabel);
   console.log(`Dorak: Found ${filteredByTitle.length} doctors with title matching "${specialtyLabel}"`);
  }
  navigate(`/doctors?specialty=${spec}`);
 };

 const featuredDoctors = useMemo(() => doctors.slice(0, 3), [doctors]);

 return (
  <div className="flex flex-col items-center w-full max-w-full overflow-x-hidden bg-white dark:bg-slate-950" dir="rtl">

   {/* Hero Section */}
   <section className="w-full pt-16 md:pt-28 pb-20 md:pb-32 px-4 md:px-12 lg:px-24 hero-gradient text-center">
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-5 py-2 rounded-full mb-8 border border-blue-100 dark:border-blue-800">
     <Sparkles size={14} className="text-[#1e40af]" />
     <span className="text-[#1e40af] dark:text-blue-400 font-black text-xs md:text-sm tracking-wide">المنصة الطبية رقم 1 في مصر</span>
    </motion.div>

    <h1 className="text-4xl md:text-7xl font-[1000] text-slate-900 dark:text-white mb-8 tracking-tighter leading-tight">
     احجز عيادتك.. <br />
     <span className="text-[#1e40af]">وفر وقتك.</span>
    </h1>

    <div className="max-w-3xl mx-auto relative group">
     <div className="bg-white dark:bg-slate-900 p-2 md:p-3 rounded-[35px] md:rounded-[45px] shadow-2xl flex flex-col md:flex-row items-center gap-2 border border-slate-100 dark:border-slate-800">
      <div className="flex-1 w-full px-6 py-3 flex items-center gap-3 flex-row-reverse">
       <Search className="text-slate-300" size={24} />
       <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="اسم الدكتور أو التخصص..."
        className="w-full bg-transparent border-none outline-none text-lg md:text-xl font-bold text-right text-slate-800 dark:text-white"
       />
      </div>
      <button
       onClick={() => navigate('/doctors')}
       className="w-full md:w-auto bg-[#1e40af] text-white font-black py-4 md:py-5 px-10 md:px-14 rounded-[28px] md:rounded-[38px] text-lg md:text-xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-200 dark:shadow-none"
      >
       بحث
      </button>
     </div>
    </div>
   </section>

   {/* Specialties Section - 3 per row on mobile */}
   <section className="w-full max-w-7xl px-4 md:px-12 py-16 md:py-24">
    <div className="flex flex-row-reverse justify-between items-end mb-10 md:mb-14 px-2">
     <div className="text-right">
      <h2 className="text-2xl md:text-4xl font-[1000] text-slate-900 dark:text-white mb-2 tracking-tighter">التخصصات الطبية</h2>
      <p className="text-slate-400 font-bold text-sm md:text-lg">اختر التخصص لبدء الحجز فوراً</p>
     </div>
     <button onClick={() => { setSelectedSpecialty(null); navigate('/doctors'); }} className="text-[#1e40af] font-black text-sm md:text-base flex items-center gap-1 hover:gap-2 transition-all">
      <ChevronLeft size={18} />
      <span>عرض الكل</span>
     </button>
    </div>

    {/* 3 columns on mobile, 4 on desktop */}
    <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-8">
     {specialties.map((spec) => (
      <div key={spec.type} className="w-full">
       <SpecialtyCard
        specialty={spec}
        isSelected={selectedSpecialty === spec.type}
        onClick={handleSpecialtyClick}
       />
      </div>
     ))}
    </div>
   </section>

   {/* Featured Doctors Section - 1 per row on mobile */}
   <section className="w-full max-w-7xl px-4 md:px-12 pb-24 md:pb-32 bg-slate-50/50 dark:bg-transparent rounded-[60px] py-16 md:py-24">
    <div className="text-right mb-12 md:mb-16">
     <h2 className="text-3xl md:text-5xl font-[1000] text-slate-900 dark:text-white mb-3 tracking-tighter">أطباء متميزون</h2>
     <p className="text-slate-400 font-bold text-sm md:text-xl">الأكثر كفاءة وحجزاً عبر منصتنا هذا الأسبوع</p>
    </div>

    {/* 1 column on mobile, 3 on desktop */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
     {featuredDoctors.map((doctor) => (
      <div key={doctor.id} className="w-full">
       <DoctorCard
        doctor={doctor}
        onBookNow={onBookNow}
       />
      </div>
     ))}
    </div>

    <div className="mt-16 text-center">
     <button
      onClick={() => navigate('/doctors')}
      className="inline-flex items-center gap-3 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 px-10 py-5 rounded-[25px] font-black text-slate-900 dark:text-white hover:border-[#1e40af] hover:text-[#1e40af] transition-all shadow-sm"
     >
      عرض كافة الأطباء
      <ChevronLeft size={20} />
     </button>
    </div>
   </section>

  </div>
 );
};

export default Home;