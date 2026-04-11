
import React from 'react';
import { Specialty } from '../types';
import { getIcon, SPECIALTY_LABELS } from '../constants';

interface SpecialtyCardProps {
  specialty: Specialty;
  isSelected: boolean;
  onClick: (type: string) => void;
}

const SpecialtyCard: React.FC<SpecialtyCardProps> = ({ specialty, isSelected, onClick }) => {
  return (
    <button
      onClick={() => onClick(specialty.type)}
      className={`group flex flex-col items-center justify-center gap-6 p-8 md:p-10 rounded-[40px] transition-all duration-300 w-full relative overflow-hidden border-[3px]
        ${isSelected 
          ? 'bg-blue-50/80 dark:bg-blue-900/20 border-[#1e40af] shadow-[0_0_25px_rgba(30,64,175,0.2)] scale-105' 
          : 'bg-white dark:bg-slate-900/40 border-transparent hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 hover:scale-[1.02] shadow-[0_4px_20px_rgba(0,0,0,0.02)]'
        }
      `}
    >
      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-500
        ${isSelected 
          ? 'bg-[#1e40af] text-white shadow-lg' 
          : 'bg-slate-50 dark:bg-slate-800 text-[#1e40af] group-hover:bg-blue-100'
        }
      `}>
        {getIcon(specialty.icon, 28)}
      </div>
      <span className={`text-lg font-black transition-colors duration-300
        ${isSelected ? 'text-[#1e40af] dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}
      `}>
        {SPECIALTY_LABELS[specialty.type]}
      </span>
      
      {isSelected && (
        <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-[#1e40af] rounded-full animate-pulse" />
      )}
    </button>
  );
};

export default SpecialtyCard;
