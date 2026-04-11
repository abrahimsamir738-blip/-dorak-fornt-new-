import { Doctor, Branch, SpecialtyType } from '../types';

// Specialty mapping between backend and frontend
// Maps Arabic specialty names from backend to frontend SpecialtyType enum
const specialtyMapping: Record<string, SpecialtyType> = {
 'مخ وأعصاب': SpecialtyType.NEUROLOGY,
 'رمد وجراحة عيون': SpecialtyType.OPHTHALMOLOGY,
 'قلب وأوعية دموية': SpecialtyType.CARDIOLOGY,
 'باطنة العامة': SpecialtyType.INTERNAL,
 'أطفال وحديثي الولادة': SpecialtyType.PEDIATRICS,
 'جراحة عامة': SpecialtyType.SURGERY,
 'عظام': SpecialtyType.ORTHOPEDICS,
 'جلدية وتجميل': SpecialtyType.DERMATOLOGY,
 'نساء وتوليد': SpecialtyType.GENERAL, // Map to closest match
 'أسنان': SpecialtyType.DENTAL,
 'أنف وأذن وحنجرة': SpecialtyType.GENERAL, // Map to closest match
 'مسالك بولية': SpecialtyType.GENERAL, // Map to closest match
 'أمراض نفسية وعصبية': SpecialtyType.NEUROLOGY,
 'علاج طبيعي وتأهيل': SpecialtyType.GENERAL, // Map to closest match
 'أورام': SpecialtyType.GENERAL, // Map to closest match
 'أشعة': SpecialtyType.GENERAL, // Map to closest match
 'تحاليل طبية': SpecialtyType.GENERAL, // Map to closest match
 'تخسيس وتغذية': SpecialtyType.GENERAL, // Map to closest match
 // Legacy mappings for backward compatibility
 'جراحة العظام': SpecialtyType.ORTHOPEDICS,
 'أمراض القلب': SpecialtyType.CARDIOLOGY,
 'طب الأطفال': SpecialtyType.PEDIATRICS,
 'الجلدية': SpecialtyType.DERMATOLOGY,
 'المخ والأعصاب': SpecialtyType.NEUROLOGY,
 'الرمد': SpecialtyType.OPHTHALMOLOGY,
 'الباطنة': SpecialtyType.INTERNAL,
 'الجراحة العامة': SpecialtyType.SURGERY,
 'الممارس العام': SpecialtyType.GENERAL,
 'الأسنان': SpecialtyType.DENTAL,
};

// Transform backend doctor to website Doctor type
export const transformDoctor = (backendDoctor: any): Doctor => {
 // Get specialty from backend (default to GENERAL if not found)
 // Store the original backend specialty string for filtering
 const backendSpecialty = backendDoctor.specialty || 'الممارس العام';
 const specialty = specialtyMapping[backendSpecialty] || SpecialtyType.GENERAL;

 // Store original specialty string in education field for search compatibility
 // This ensures search filters can match the exact backend specialty string

 // Transform clinics to branches
 const branches: Branch[] = (backendDoctor.clinics || []).map((clinic: any) => ({
  id: clinic.id.toString(),
  name: clinic.name,
  address: clinic.address,
  mapUrl: clinic.map_link || `https://www.google.com/maps?q=${clinic.address}`,
  workingHours: clinic.working_hours,
  lat: 30.0444, // Default Cairo coordinates - should be stored in DB
  lng: 31.2357,
  isClosedToday: clinic.is_closed_today || false, // Include closed status
 }));

 // Get current queue count from backend (if provided)
 const currentQueueCount = backendDoctor.current_queue_count || 0;

 // Get consultation fee from first open clinic
 const consultationFee = backendDoctor.clinics?.find((c: any) => !c.is_closed_today)?.consultation_fee ||
  backendDoctor.clinics?.[0]?.consultation_fee || 300;

 return {
  id: backendDoctor.id.toString(),
  name: backendDoctor.name,
  specialty: specialty,
  title: backendDoctor.title || 'طبيب',
  image: backendDoctor.photo || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
  rating: 4.5, // Default rating - can be added to backend later
  reviewsCount: 0, // Default - can be added to backend later
  location: branches[0]?.address || 'القاهرة، مصر',
  isOnline: !backendDoctor.clinics?.some((c: any) => c.is_closed_today) && branches.length > 0,
  consultationFee: consultationFee,
  serviceFee: 15,
  currentQueueCount: currentQueueCount,
  branches: branches,
  bio: backendDoctor.bio || 'لا توجد نبذة طبية متاحة حالياً.',
  experience: backendDoctor.bio || 'خبرة واسعة',
  education: backendDoctor.specialty || '', // Store original backend specialty for search matching
 };
};

// Transform backend clinic to website Branch type
export const transformClinicToBranch = (clinic: any): Branch => ({
 id: clinic.id.toString(),
 name: clinic.name,
 address: clinic.address,
 mapUrl: clinic.map_link || `https://www.google.com/maps?q=${clinic.address}`,
 workingHours: clinic.working_hours,
 lat: 30.0444, // Default - should be stored in DB
 lng: 31.2357,
 isClosedToday: clinic.is_closed_today || false, // Include closed status
});
