import React from 'react';
import {
 Heart,
 Baby,
 Smile,
 Eye,
 Brain,
 Bone,
 UserRound,
 Activity,
 Ear,
 Apple,
 Stethoscope,
 Thermometer,
 Wind,
 Scissors,
 Syringe,
} from 'lucide-react';

// ==================== تعريف الأنواع ====================
export enum SpecialtyType {
 ORTHOPEDICS = 'orthopedics',
 CARDIOLOGY = 'cardiology',
 PEDIATRICS = 'pediatrics',
 DERMATOLOGY = 'dermatology',
 DENTAL = 'dental',
 NEUROLOGY = 'neurology',
 GYNECOLOGY = 'gynecology',
 UROLOGY = 'urology',
 OPHTHALMOLOGY = 'ophthalmology',
 PHYSIOTHERAPY = 'physiotherapy',
 ENT = 'ent',
 NUTRITION = 'nutrition',
 INTERNAL_MEDICINE = 'internal_medicine',
 CHEST = 'chest',
 GENERAL_SURGERY = 'general_surgery',
 ENDOCRINOLOGY = 'endocrinology',
}

// ==================== التخصصات مع الأيقونات ====================
export const SPECIALTIES = [
 { type: SpecialtyType.ORTHOPEDICS, icon: 'Bone', color: 'text-blue-600', name: 'عظام' },
 { type: SpecialtyType.CARDIOLOGY, icon: 'Heart', color: 'text-red-600', name: 'قلب وأوعية دموية' },
 { type: SpecialtyType.PEDIATRICS, icon: 'Baby', color: 'text-green-600', name: 'أطفال' },
 { type: SpecialtyType.DERMATOLOGY, icon: 'Smile', color: 'text-purple-600', name: 'جلدية' },
 { type: SpecialtyType.DENTAL, icon: 'Smile', color: 'text-cyan-600', name: 'أسنان' },
 { type: SpecialtyType.NEUROLOGY, icon: 'Brain', color: 'text-indigo-600', name: 'مخ وأعصاب' },
 { type: SpecialtyType.GYNECOLOGY, icon: 'UserRound', color: 'text-pink-600', name: 'نساء وتوليد' },
 { type: SpecialtyType.UROLOGY, icon: 'Activity', color: 'text-teal-600', name: 'مسالك بولية' },
 { type: SpecialtyType.OPHTHALMOLOGY, icon: 'Eye', color: 'text-blue-500', name: 'رمد' },
 { type: SpecialtyType.PHYSIOTHERAPY, icon: 'Activity', color: 'text-orange-500', name: 'علاج طبيعي وتأهيل' },
 { type: SpecialtyType.ENT, icon: 'Ear', color: 'text-amber-600', name: 'أنف وأذن وحنجرة' },
 { type: SpecialtyType.NUTRITION, icon: 'Apple', color: 'text-emerald-600', name: 'تغذية' },
 { type: SpecialtyType.INTERNAL_MEDICINE, icon: 'Thermometer', color: 'text-blue-800', name: 'باطنة' },
 { type: SpecialtyType.CHEST, icon: 'Wind', color: 'text-sky-400', name: 'صدر' },
 { type: SpecialtyType.GENERAL_SURGERY, icon: 'Scissors', color: 'text-slate-600', name: 'جراحة عامة' },
 { type: SpecialtyType.ENDOCRINOLOGY, icon: 'Syringe', color: 'text-rose-500', name: 'غدد وسكر' },
];

// ==================== الترجمة للعربية ====================
export const SPECIALTY_LABELS: Record<SpecialtyType, string> = {
 [SpecialtyType.ORTHOPEDICS]: 'عظام',
 [SpecialtyType.CARDIOLOGY]: 'قلب وأوعية دموية',
 [SpecialtyType.PEDIATRICS]: 'أطفال',
 [SpecialtyType.DERMATOLOGY]: 'جلدية',
 [SpecialtyType.DENTAL]: 'أسنان',
 [SpecialtyType.NEUROLOGY]: 'مخ وأعصاب',
 [SpecialtyType.GYNECOLOGY]: 'نساء وتوليد',
 [SpecialtyType.UROLOGY]: 'مسالك بولية',
 [SpecialtyType.OPHTHALMOLOGY]: 'رمد',
 [SpecialtyType.PHYSIOTHERAPY]: 'علاج طبيعي وتأهيل',
 [SpecialtyType.ENT]: 'أنف وأذن وحنجرة',
 [SpecialtyType.NUTRITION]: 'تغذية',
 [SpecialtyType.INTERNAL_MEDICINE]: 'باطنة',
 [SpecialtyType.CHEST]: 'صدر',
 [SpecialtyType.GENERAL_SURGERY]: 'جراحة عامة',
 [SpecialtyType.ENDOCRINOLOGY]: 'غدد وسكر',
};

// ==================== دالة جلب الأيقونة ====================
export const getIcon = (iconName: string, size = 24, color = 'currentColor') => {
 const icons: Record<string, React.ReactNode> = {
  Heart: <Heart size={size} color={color} />,
  Baby: <Baby size={size} color={color} />,
  Smile: <Smile size={size} color={color} />,
  Eye: <Eye size={size} color={color} />,
  Brain: <Brain size={size} color={color} />,
  Bone: <Bone size={size} color={color} />,
  UserRound: <UserRound size={size} color={color} />,
  Activity: <Activity size={size} color={color} />,
  Ear: <Ear size={size} color={color} />,
  Apple: <Apple size={size} color={color} />,
  Thermometer: <Thermometer size={size} color={color} />,
  Wind: <Wind size={size} color={color} />,
  Scissors: <Scissors size={size} color={color} />,
  Syringe: <Syringe size={size} color={color} />,
 };
 return icons[iconName] || <Stethoscope size={size} color={color} />;
};

// ==================== أطباء نموذجيين ====================
export const DOCTORS: Doctor[] = [
 {
  id: 'd1',
  name: 'د. أحمد إبراهيم',
  specialty: SpecialtyType.ORTHOPEDICS,
  title: 'استشاري جراحة العظام',
  image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
  rating: 4.8,
  reviewsCount: 124,
  location: 'القاهرة، مصر',
  isOnline: true,
  consultationFee: 450,
  serviceFee: 15,
  currentQueueCount: 8,
  experience: '15 سنة',
  education: 'دكتوراه جراحة العظام',
  branches: [],
 },
 {
  id: 'd2',
  name: 'د. سارة أحمد',
  specialty: SpecialtyType.CARDIOLOGY,
  title: 'استشاري أمراض القلب',
  image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
  rating: 4.9,
  reviewsCount: 89,
  location: 'القاهرة، مصر',
  isOnline: true,
  consultationFee: 450,
  serviceFee: 15,
  currentQueueCount: 3,
  experience: '12 سنة',
  education: 'دكتوراه القلب',
  branches: [],
 },
 {
  id: 'd3',
  name: 'د. منى محمود',
  specialty: SpecialtyType.GYNECOLOGY,
  title: 'استشارية النساء والتوليد',
  image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
  rating: 4.9,
  reviewsCount: 156,
  location: 'الإسكندرية، مصر',
  isOnline: true,
  consultationFee: 500,
  serviceFee: 15,
  currentQueueCount: 5,
  experience: '18 سنة',
  education: 'دكتوراه النساء والتوليد',
  branches: [],
 },
];

// تعريف نوع Doctor
export interface Doctor {
 id: string;
 name: string;
 specialty: SpecialtyType;
 title: string;
 image: string;
 rating: number;
 reviewsCount: number;
 location: string;
 isOnline: boolean;
 consultationFee: number;
 serviceFee: number;
 currentQueueCount: number;
 experience: string;
 education: string;
 branches: any[];
}