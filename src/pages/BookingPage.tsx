import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { ProviderCard } from "@/components/booking/ProviderCard";
import { BookingForm } from "@/components/booking/BookingForm";
import { PaymentSummary } from "@/components/booking/PaymentSummary";
import { useState } from "react";

const BookingPage = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [duration, setDuration] = useState(2);

  const { data: provider, isLoading } = useQuery({
    queryKey: ['serviceProvider', providerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_providers')
        .select(`
          *,
          service_types(
            name,
            category_id,
            service_categories(name)
          )
        `)
        .eq('id', providerId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const handleBooking = async (formData: {
    date: Date;
    time: string;
    duration: number;
    address: string;
    notes: string;
  }) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please sign in to make a booking");
        return;
      }

      const { error } = await supabase.from("bookings").insert({
        provider_id: providerId,
        user_id: user.id,
        booking_date: formData.date.toISOString().split('T')[0],
        booking_time: formData.time,
        duration: formData.duration,
        address: formData.address,
        notes: formData.notes,
        total_amount: (provider?.hourly_rate || 0) * formData.duration,
      });

      if (error) throw error;

      toast.success("Booking confirmed successfully!");
      navigate("/bookings");
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!provider) {
    return <div className="p-8">Service provider not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <ProviderCard provider={provider} />
          <PaymentSummary
            hourlyRate={provider.hourly_rate || 0}
            duration={duration}
            onConfirm={() => {}}
          />
        </div>

        <BookingForm
          onSubmit={(formData) => {
            setDuration(formData.duration);
            handleBooking(formData);
          }}
        />
      </div>
    </div>
  );
};

export default BookingPage;