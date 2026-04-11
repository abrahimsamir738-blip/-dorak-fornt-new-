
export interface Branch {
 id: string;
 name: string;
 address: string;
 mapUrl: string;
 workingHours: string;
 lat: number;
 lng: number;
 isClosedToday?: boolean; // Clinic closed status
}

export interface Doctor {
 id: string;
 name: string;
 specialty: SpecialtyType;
 title: string;
 bio: string;
 image: string;
 rating: number;
 reviewsCount: number;
 location: string;
 isOnline: boolean;
 consultationFee: number;
 serviceFee: number;
 currentQueueCount: number; // عدد المنتظرين حالياً
 branches: Branch[];
 experience: string;
 education: string;
}

export enum SpecialtyType {
 ORTHOPEDICS = 'Orthopedics',
 CARDIOLOGY = 'Cardiology',
 DERMATOLOGY = 'Dermatology',
 PEDIATRICS = 'Pediatrics',
 DENTAL = 'Dental',
 OPHTHALMOLOGY = 'Ophthalmology',
 NEUROLOGY = 'Neurology',
 INTERNAL = 'Internal Medicine',
 SURGERY = 'General Surgery',
 GENERAL = 'General Practice'
}

export interface Specialty {
 type: SpecialtyType;
 icon: string;
 color: string;
}

export interface Booking {
 id: string;
 patientName: string;
 patientPhone: string;
 doctorId: string;
 doctorName: string;
 doctorSpecialty: SpecialtyType;
 doctorImage: string;
 branchId: string;
 branchName: string;
 turnNumber: number;
 bookedAt: string;
 status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
 consultationFee: number;
 serviceFee: number;
}

export interface Patient {
 id: string;
 name: string;
 phone: string;
 email?: string;
 avatar?: string;
 bookings: Booking[];
}
