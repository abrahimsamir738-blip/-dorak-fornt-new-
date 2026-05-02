import React, { useMemo, useEffect } from 'react';
import { Search, UserSearch, RefreshCw } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SpecialtyType, Doctor } from '../types';
import { SPECIALTIES, SPECIALTY_LABELS, getIcon } from '../constants';
import DoctorCard from '../components/DoctorCard';
import { useData } from '../App';

// دالة تنظيف النصوص للبحث الدقيق باللغة العربية
const normalizeText = (text: string): string => {
 if (!text) return '';
 return text
  .trim()
  .toLowerCase()
  .replace(/[أإآ]/g, 'ا')
  .replace(/ة/g, 'ه')
  .replace(/[ىي]/g, 'ي')
  .replace(/[\u064B-\u065F]/g, '');
};

interface DoctorsPageProps {
 searchTerm: string;
 setSearchTerm: (val: string) => void;
 selectedSpecialty: SpecialtyType | null;
 setSelectedSpecialty: (val: SpecialtyType | null) => void;
 onBookNow: (doctor: Doctor) => void;
}

const DoctorsPage: React.FC<DoctorsPageProps> = ({
 searchTerm,
 setSearchTerm,
 selectedSpecialty,
 setSelectedSpecialty,
 onBookNow
}) => {
 const { doctors } = useData();
 const [searchParams] = useSearchParams();

 // --- منطق قراءة التخصص من الرابط (URL Query Params) ---
 useEffect(() => {
  const specFromUrl = searchParams.get('specialty') as SpecialtyType;
  if (specFromUrl && specFromUrl !== selectedSpecialty) {
   // إذا وجد تخصص في الرابط، نقوم بتحديث الحالة ليتم الفلترة
   setSelectedSpecialty(specFromUrl);
  }
 }, [searchParams, setSelectedSpecialty]);

 // منطق الفلترة (Memoized للحفاظ على الأداء)
 const filteredDoctors = useMemo(() => {
  let result = doctors;

  // 1. الفلترة بناءً على التخصص المختار (Sidebar أو URL)
  if (selectedSpecialty) {
   const specialtyLabel = normalizeText(SPECIALTY_LABELS[selectedSpecialty] || '');

   result = result.filter(doc => {
    const matchByCode = doc.specialty === selectedSpecialty;
    const matchByTitle = normalizeText(doc.title).includes(specialtyLabel);
    const matchBySpecialtyField = normalizeText(doc.education || '').includes(specialtyLabel);

    return matchByCode || matchByTitle || matchBySpecialtyField;
   });
  }

  // 2. الفلترة بناءً على نص البحث (Search Bar)
  if (searchTerm && searchTerm.trim() !== '') {
   const normalizedTerm = normalizeText(searchTerm);

   result = result.filter(doc => {
    const name = normalizeText(doc.name);
    const title = normalizeText(doc.title);
    const bio = normalizeText(doc.bio || '');
    const specialtyField = normalizeText(doc.education || '');
    const specialtyLabel = normalizeText(SPECIALTY_LABELS[doc.specialty as SpecialtyType] || '');
    const clinicsInfo = doc.clinics?.map(c => normalizeText(c.name + c.address)).join(' ') || '';

    return (
     name.includes(normalizedTerm) ||
     title.includes(normalizedTerm) ||
     specialtyField.includes(normalizedTerm) ||
     specialtyLabel.includes(normalizedTerm) ||
     bio.includes(normalizedTerm) ||
     clinicsInfo.includes(normalizedTerm)
    );
   });
  }

  return result;
 }, [doctors, selectedSpecialty, searchTerm]);
 return (
  <div className="max-w-7xl mx-auto px-6 py-10 md:py-16">
   {/* Header & Search */}
   <div className="flex flex-col md:flex-row-reverse items-center justify-between mb-10 md:mb-16 gap-8 text-right">
    <div className="w-full md:w-auto">
     <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">
      دليل أطباء دورك
     </h1>
     <p className="text-lg text-slate-500 font-bold">
      {selectedSpecialty ? `تخصص ${SPECIALTY_LABELS[selectedSpecialty]}: ` : ''}
      {filteredDoctors.length === 0 ? "لا توجد نتائج" : `${filteredDoctors.length} طبيب متاح`}
     </p>
    </div>

    <div className="w-full max-w-xl bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-2xl flex flex-row-reverse items-center gap-4 border border-slate-100 dark:border-slate-800 focus-within:ring-4 focus-within:ring-[#1e40af]/10 transition-all">
     <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="ابحث بالاسم، التخصص، أو العيادة..."
      className="flex-1 text-right bg-transparent outline-none font-bold text-slate-700 dark:text-white placeholder:text-slate-300"
     />
     <Search className="text-[#1e40af]" />
    </div>
   </div>

   <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
    {/* Sidebar Filters */}
    <div className="hidden lg:block lg:col-span-1 space-y-8 sticky top-32 h-fit">
     <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-slate-50 dark:border-slate-800">
      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 text-right">التخصصات</h3>
      <div className="space-y-2">
       {SPECIALTIES.map(spec => (
        <button
         key={spec.type}
         onClick={() => setSelectedSpecialty(spec.type === selectedSpecialty ? null : spec.type)}
         className={`w-full flex flex-row-reverse items-center justify-between p-4 rounded-2xl transition-all duration-300 border-2 ${selectedSpecialty === spec.type ? 'bg-[#1e40af] border-[#1e40af] text-white shadow-lg' : 'border-transparent hover:bg-slate-50 text-slate-500'}`}
        >
         <span className="font-bold">{SPECIALTY_LABELS[spec.type as SpecialtyType]}</span>
         {getIcon(spec.icon, 18)}
        </button>
       ))}
      </div>
     </div>
    </div>

    {/* Results Area */}
    <div className="lg:col-span-3 space-y-8">
     <AnimatePresence mode="popLayout">
      {filteredDoctors.length > 0 ? (
       filteredDoctors.map((doc, idx) => (
        <motion.div
         key={doc.id}
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, scale: 0.95 }}
         transition={{ duration: 0.3, delay: idx * 0.05 }}
        >
         <DoctorCard
          doctor={doc}
          onViewProfile={() => { }}
          onBookNow={onBookNow}
         />
        </motion.div>
       ))
      ) : (
       <motion.div className="py-24 text-center bg-slate-50/50 dark:bg-slate-900/40 rounded-[56px] border-4 border-dashed border-slate-100 flex flex-col items-center">
        <UserSearch size={64} className="text-slate-200 mb-6" />
        <h3 className="text-2xl font-black text-slate-400 mb-2">لم نجد أطباء في هذا التخصص</h3>
        <button
         onClick={() => { setSearchTerm(''); setSelectedSpecialty(null); }}
         className="bg-[#1e40af] text-white font-black px-12 py-4 rounded-2xl shadow-xl hover:bg-blue-800 transition-all flex items-center gap-3"
        >
         <RefreshCw size={20} />
         <span>عرض كل التخصصات</span>
        </button>
       </motion.div>
      )}
     </AnimatePresence>
    </div>
   </div>
  </div>
 );
};

export default DoctorsPage;