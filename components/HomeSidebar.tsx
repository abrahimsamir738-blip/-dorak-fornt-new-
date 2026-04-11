
import React, { useState } from 'react';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SPECIALTIES, SPECIALTY_LABELS, getIcon } from '../constants';
import { SpecialtyType } from '../types';

interface HomeSidebarProps {
  onSpecialtyClick: (type: SpecialtyType) => void;
  selectedSpecialty: SpecialtyType | null;
}

const HomeSidebar: React.FC<HomeSidebarProps> = ({ onSpecialtyClick, selectedSpecialty }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSpecialties = SPECIALTIES.filter(spec => 
    SPECIALTY_LABELS[spec.type].includes(searchTerm)
  );

  return (
    <aside className="w-full flex flex-col gap-10">
      {/* Quick Filter Search */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/40 backdrop-blur-2xl saturate-150 border border-white/60 p-6 rounded-[40px] shadow-sm"
      >
        <div className="flex flex-row-reverse items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Filter size={18} />
          </div>
          <h3 className="text-xl font-black text-slate-800">تصفية البحث</h3>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="ابحث عن تخصص..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/80 border border-slate-100 rounded-3xl py-4 pr-12 pl-4 text-right font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all text-slate-700"
          />
          <Search className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-300" size={20} />
        </div>
      </motion.div>

      {/* Specialties Vertical List */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/40 backdrop-blur-2xl saturate-150 border border-white/60 p-8 rounded-[48px] shadow-sm"
      >
        <div className="flex flex-row-reverse justify-between items-center mb-8">
          <h3 className="text-2xl font-black text-slate-900">التخصصات</h3>
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-black">
            {filteredSpecialties.length}
          </span>
        </div>
        
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {filteredSpecialties.map((spec, idx) => (
              <motion.button
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                key={spec.type}
                onClick={() => onSpecialtyClick(spec.type)}
                className={`w-full group flex flex-row-reverse items-center justify-between p-4 rounded-[30px] transition-all duration-300 ${
                  selectedSpecialty === spec.type 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 scale-[1.02]' 
                  : 'hover:bg-white hover:shadow-lg hover:shadow-slate-100 text-slate-500 hover:text-blue-600'
                }`}
              >
                <div className="flex flex-row-reverse items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-inner ${
                    selectedSpecialty === spec.type ? 'bg-white/20' : 'bg-slate-50 group-hover:bg-blue-50'
                  }`}>
                    <div className={`transform scale-100 transition-transform group-hover:scale-110 ${selectedSpecialty === spec.type ? 'text-white' : 'text-blue-600'}`}>
                      {getIcon(spec.icon, 22)}
                    </div>
                  </div>
                  <span className="text-lg font-black tracking-tight">
                    {SPECIALTY_LABELS[spec.type]}
                  </span>
                </div>
                <ArrowLeft size={16} className={`transition-all duration-300 ${
                  selectedSpecialty === spec.type ? 'opacity-100 -translate-x-1' : 'opacity-0 translate-x-4'
                }`} />
              </motion.button>
            ))}
          </AnimatePresence>
          {filteredSpecialties.length === 0 && (
            <div className="text-center py-10 text-slate-300 font-bold">لا توجد نتائج مطابقة</div>
          )}
        </div>

        <button className="w-full mt-8 py-5 text-blue-600 font-black hover:bg-blue-50 rounded-3xl transition-colors border-2 border-dashed border-blue-100">
          عرض كافة التخصصات (24+)
        </button>
      </motion.div>

      {/* Mini Promotion Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-200 group"
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        <h4 className="text-xl font-black mb-2 relative z-10">تطبيق دورك المطور</h4>
        <p className="text-blue-100 text-sm font-medium mb-6 relative z-10 leading-relaxed">
          حمل التطبيق الآن وتابع دورك لحظة بلحظة مع تنبيهات ذكية.
        </p>
        <button className="bg-white text-blue-600 font-black px-8 py-3 rounded-2xl text-sm hover:shadow-xl transition-all relative z-10">
          تحميل الآن
        </button>
      </motion.div>
    </aside>
  );
};

export default HomeSidebar;
