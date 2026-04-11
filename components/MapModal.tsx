
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Navigation, MapPin, Phone, Clock } from 'lucide-react';
import { Branch } from '../types';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: Branch;
}

const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, branch }) => {
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-[32px] md:rounded-[50px] overflow-hidden shadow-2xl flex flex-col md:flex-row-reverse"
            dir="rtl"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 left-6 z-50 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md flex items-center justify-center text-slate-500 hover:text-red-500 shadow-lg"
            >
              <X size={20} />
            </button>

            {/* Map Area */}
            <div className="w-full md:w-2/3 h-[300px] md:h-[600px] bg-slate-100 dark:bg-slate-800 relative">
              <iframe
                title="map"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15000!2d${branch.lng}!3d${branch.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2seg!4v1620000000000!5m2!1sen!2seg`}
                allowFullScreen
              />
            </div>

            {/* Info Area */}
            <div className="w-full md:w-1/3 p-8 md:p-12 flex flex-col justify-between bg-white dark:bg-slate-900">
              <div>
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                  <MapPin size={32} />
                </div>
                <h3 className="text-3xl font-[1000] text-slate-900 dark:text-white mb-4 tracking-tighter">
                  {branch.name}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 font-bold text-lg mb-8 leading-relaxed">
                  {branch.address}
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-slate-600 dark:text-slate-300 font-bold">
                    <Clock size={20} className="text-blue-500" />
                    <span>{branch.workingHours}</span>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:bg-blue-700 transition-all active:scale-95"
                >
                  <Navigation size={24} className="text-emerald-300" />
                  <span>فتح المسار في الخرائط</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MapModal;
