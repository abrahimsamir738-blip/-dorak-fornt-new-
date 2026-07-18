import React, { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SpecialtyType, Doctor, Booking, Branch, Specialty } from './types';
import { DOCTORS, SPECIALTIES, SPECIALTY_LABELS } from './constants';
import { publicAPI } from './services/api';
import { transformDoctor } from './utils/dataTransform';
import Layout from './components/Layout';
import { useLogin } from './components/Layout';
import Home from './Home';
import DoctorsPage from './pages/DoctorsPage';
import BookingPage from './pages/BookingPage';
import BookingModal from './components/BookingModal';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import QueueDashboardPage from './pages/QueueDashboardPage';

interface DataContextType {
 doctors: Doctor[];
 specialties: Specialty[];
 searchTerm: string;
 setSearchTerm: (s: string) => void;
 selectedSpecialty: SpecialtyType | null;
 setSelectedSpecialty: (s: SpecialtyType | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
 const context = useContext(DataContext);
 if (!context) throw new Error("useData must be used within DataProvider");
 return context;
};

const PageWrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
 <motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ duration: 0.3 }}
 >
  {children}
 </motion.div>
);

// مكون داخلي يستخدم useLogin بعد ما الـ LoginContext يكون متاح
const AppInner: React.FC = () => {
 const location = useLocation();
 const navigate = useNavigate();
 const [searchParams] = useSearchParams();
 const { openLogin } = useLogin();

 const [doctors, setDoctors] = useState<Doctor[]>([]);
 const [specialties, setSpecialties] = useState<Specialty[]>([]);

 const [searchTerm, setSearchTerm] = useState(() =>
  localStorage.getItem('dorak_search') || ''
 );
 const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyType | null>(() => {
  const saved = localStorage.getItem('dorak_specialty');
  return saved ? saved as SpecialtyType : null;
 });

 const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
 const [activeDoctor, setActiveDoctor] = useState<Doctor | null>(null);

 const [bookingFlow, setBookingFlow] = useState<{
  step: 1 | 2 | 3;
  doctor: Doctor | null;
  branch: Branch | null;
  booking: Booking | null;
 }>({ step: 1, doctor: null, branch: null, booking: null });

 useEffect(() => {
  const loadDoctors = async () => {
   try {
    const backendDoctors = await publicAPI.getDoctors();
    const transformedDoctors = backendDoctors.map(transformDoctor);
    if (transformedDoctors.length > 0) {
     setDoctors(transformedDoctors);
     localStorage.setItem('dorak_docs_cache', JSON.stringify(transformedDoctors));
    } else {
     setDoctors(DOCTORS);
     localStorage.setItem('dorak_docs_cache', JSON.stringify(DOCTORS));
    }
   } catch (error) {
    console.error('Failed to load doctors from API:', error);
    const cachedDocs = localStorage.getItem('dorak_docs_cache');
    if (cachedDocs) {
     setDoctors(JSON.parse(cachedDocs));
    } else {
     setDoctors(DOCTORS);
    }
   }
  };

  setSpecialties(SPECIALTIES);
  localStorage.setItem('dorak_specs_cache', JSON.stringify(SPECIALTIES));
  loadDoctors();
 }, []);

 useEffect(() => {
  localStorage.setItem('dorak_search', searchTerm);
 }, [searchTerm]);

 useEffect(() => {
  if (selectedSpecialty) {
   localStorage.setItem('dorak_specialty', selectedSpecialty);
  } else {
   localStorage.removeItem('dorak_specialty');
  }
 }, [selectedSpecialty]);

 useEffect(() => {
  const specParam = searchParams.get('specialty');
  if (specParam) {
   const found = Object.values(SpecialtyType).find(
    v => v.toLowerCase() === specParam.toLowerCase()
   );
   if (found) {
    setSelectedSpecialty(found as SpecialtyType);
   } else {
    const specialtyByLabel = Object.entries(SPECIALTY_LABELS).find(
     ([_, label]) => label.toLowerCase() === specParam.toLowerCase()
    );
    if (specialtyByLabel) {
     setSelectedSpecialty(specialtyByLabel[0] as SpecialtyType);
    }
   }
  } else {
   setSelectedSpecialty(null);
  }
 }, [searchParams]);

 const handleStartBooking = (doctor: Doctor) => {
  const token = localStorage.getItem('dorak_token');
  if (!token) {
   openLogin();
   return;
  }
  setActiveDoctor(doctor);
  setIsBookingModalOpen(true);
 };

 const saveToHistory = (booking: Booking, doctor: Doctor, branch: Branch) => {
  const savedBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
  const bookingToSave = {
   id: booking.id,
   doctorName: doctor.name,
   doctorTitle: doctor.title,
   doctorImage: doctor.image,
   specialty: doctor.specialty,
   branchName: branch.name,
   branchAddress: branch.address,
   turnNumber: booking.turnNumber,
   bookedAt: booking.bookedAt,
   lat: branch.lat,
   lng: branch.lng
  };
  localStorage.setItem('userBookings', JSON.stringify([bookingToSave, ...savedBookings]));
 };

 const handleConfirmBooking = async (
  name: string,
  phone: string,
  branch: Branch,
  selectedSlot: any,
  visitType: 'checkup' | 'consultation'
 ) => {
  try {
   const getNextDateForDay = (dayOfWeek: number): string => {
    const jsToApp = [6, 0, 1, 2, 3, 4, 5];
    const targetJsDay = jsToApp[dayOfWeek];
    const today = new Date();
    const currentJsDay = today.getDay();
    let daysUntilTarget = targetJsDay - currentJsDay;
    if (daysUntilTarget < 0) daysUntilTarget += 7;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntilTarget);
    return targetDate.toISOString().split('T')[0];
   };

   const bookingDate = getNextDateForDay(selectedSlot.day_of_week);

   const response = await publicAPI.createBooking({
    clinic_id: parseInt(branch.id),
    doctor_id: parseInt(activeDoctor!.id),
    patient_name: name,
    phone_number: phone,
    type: visitType === 'checkup' ? 'كشف' : 'استشارة',
    date: bookingDate,
    notes: '',
   });

   const newBooking: Booking = {
    id: response.order.id.toString(),
    patientName: name,
    patientPhone: phone,
    doctorId: activeDoctor!.id,
    doctorName: activeDoctor!.name,
    doctorSpecialty: activeDoctor!.specialty,
    doctorImage: activeDoctor!.image,
    branchId: branch.id,
    branchName: branch.name,
    turnNumber: response.queue_number,
    bookedAt: new Date().toISOString(),
    status: 'confirmed',
    consultationFee: activeDoctor!.consultationFee,
    serviceFee: activeDoctor!.serviceFee
   };

   saveToHistory(newBooking, activeDoctor!, branch);
   setBookingFlow({ step: 3, doctor: activeDoctor, branch, booking: newBooking });
   setIsBookingModalOpen(false);
   navigate('/booking');
  } catch (error: any) {
   console.error('Booking failed:', error);
   const message = error.response?.data?.message || 'فشل إنشاء الحجز. يرجى المحاولة مرة أخرى.';
   alert(message);
  }
 };

 const resetBookingFlow = () => {
  setBookingFlow({ step: 1, doctor: null, branch: null, booking: null });
  navigate('/', { replace: true });
 };

 return (
  <DataContext.Provider value={{
   doctors,
   specialties,
   searchTerm,
   setSearchTerm,
   selectedSpecialty,
   setSelectedSpecialty
  }}>
   <Layout>
    <AnimatePresence mode="wait">
     <Routes location={location} key={location.pathname}>
      <Route path="/" element={
       <PageWrapper>
        <Home
         searchTerm={searchTerm}
         setSearchTerm={setSearchTerm}
         onBookNow={handleStartBooking}
        />
       </PageWrapper>
      } />

      <Route path="/doctors" element={
       <PageWrapper>
        <DoctorsPage
         searchTerm={searchTerm}
         setSearchTerm={setSearchTerm}
         selectedSpecialty={selectedSpecialty}
         setSelectedSpecialty={setSelectedSpecialty}
         onBookNow={handleStartBooking}
        />
       </PageWrapper>
      } />

      <Route path="/booking" element={
       <PageWrapper>
        <BookingPage
         flow={bookingFlow}
         setFlow={setBookingFlow}
         onReset={resetBookingFlow}
         onSaveToHistory={saveToHistory}
        />
       </PageWrapper>
      } />

      <Route path="/booking/:id" element={<QueueDashboardPage />} />

      <Route path="/about" element={
       <PageWrapper>
        <AboutPage />
       </PageWrapper>
      } />

      <Route path="/profile" element={
       <PageWrapper>
        <ProfilePage />
       </PageWrapper>
      } />
     </Routes>
    </AnimatePresence>

    {activeDoctor && (
     <BookingModal
      isOpen={isBookingModalOpen}
      onClose={() => setIsBookingModalOpen(false)}
      doctor={activeDoctor}
      onConfirm={handleConfirmBooking}
     />
    )}
   </Layout>
  </DataContext.Provider>
 );
};

const App: React.FC = () => {
 return <AppInner />;
};

export default App;