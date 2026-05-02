import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import QueueDashboard from '../components/QueueDashboard'; // تأكد من المسار
import { publicAPI } from '../services/api';
import { Loader2 } from 'lucide-react';

const QueueDashboardPage = () => {
 const { id } = useParams<{ id: string }>(); // جلب الرقم 29 من الرابط
 const [bookingData, setBookingData] = useState<any>(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchBookingDetails = async () => {
   try {
    // تأكد من وجود ميثود في الـ API تجلب بيانات حجز واحد فقط
    const response = await publicAPI.getBookingDetails(id);
    setBookingData(response.data);
   } catch (error) {
    console.error("Error fetching booking:", error);
   } finally {
    setLoading(false);
   }
  };

  if (id) fetchBookingDetails();
 }, [id]);

 if (loading) {
  return (
   <div className="min-h-screen flex items-center justify-center bg-slate-950">
    <Loader2 className="animate-spin text-blue-500" size={48} />
   </div>
  );
 }

 if (!bookingData) {
  return <div className="text-white text-center mt-20">عذراً، لم يتم العثور على هذا الحجز.</div>;
 }

 return (
  <QueueDashboard
   bookingId={bookingData.id}
   status={bookingData.status}
   userTurn={bookingData.turn_number}
   clinicName={bookingData.branchName || bookingData.clinic?.name}
   clinicId={bookingData.clinic_id}
   doctorName={bookingData.doctorName}
   doctorLocation={bookingData.branchName}
   initialCurrentServing={bookingData.current_serving_number} // ✅ هنا

  // lat={bookingData.lat} 
  // lng={bookingData.lng}
  />
 );
};

export default QueueDashboardPage;