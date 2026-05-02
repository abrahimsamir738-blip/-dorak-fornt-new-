import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ' http://localhost:8000/api';

// Create axios instance for website (no auth required)
const api: AxiosInstance = axios.create({
 baseURL: API_BASE_URL,
 headers: {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
 },
});

// Public API for website
export const publicAPI = {
 // Get all doctors
 getDoctors: async () => {
  const response = await api.get('/public/doctors');
  return response.data;
 },
 // services/api.ts
 getBookingDetails: (id: string | number) =>
  axios.get(`${API_BASE_URL}/bookings/${id}`).then(res => res.data),
 getBookingsByPhones: async (phones: string[]) => {
  const response = await api.post('/public/bookings/by-phones', { phones });
  return response.data;
 },
 cancelBookings: async (id: string | number) => {
  const response = await api.delete(`/public/bookings/${id}`);
  return response.data;
 },
 getClinicQueue: (clinicId: string | number) =>
  axios.get(`${API_BASE_URL}/clinic/${clinicId}/queue`).then(res => res.data),

 // إلغاء الحجز
 cancelBooking: (id: string | number) =>
  axios.post(`${API_BASE_URL}/bookings/${id}/cancel`).then(res => res.data),

 // تأجيل الحجز
 rescheduleBooking: (id: string | number, newDate: string) =>
  axios.post(`${API_BASE_URL}/bookings/${id}/reschedule`, { new_date: newDate }).then(res => res.data),

 // Get single doctor
 getDoctor: async (id: string | number) => {
  const response = await api.get(`/public/doctors/${id}`);
  return response.data;
 },

 // Get clinics for a doctor
 getDoctorClinics: async (doctorId: string | number) => {
  const response = await api.get(`/public/doctors/${doctorId}/clinics`);
  return response.data;
 },

 // Get schedules for a clinic
 getClinicSchedules: async (clinicId: string | number) => {
  const response = await api.get(`/public/clinics/${clinicId}/schedules`);
  return response.data;
 },

 // Get queue status for a clinic
 getClinicQueueس: async (clinicId: string | number) => {
  const response = await api.get(`/public/clinics/${clinicId}/queue`);
  return response.data;
 },

 // Create booking
 createBooking: async (data: {
  clinic_id: string | number;
  doctor_id: string | number;
  slot_id?: string | number | null;
  patient_name: string;
  phone_number: string;
  type: 'كشف' | 'استشارة';
  date: string;
  notes?: string;
 }) => {
  const response = await api.post('/public/bookings', data);
  return response.data;
 },
};

export default api;
