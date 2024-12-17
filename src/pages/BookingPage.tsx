import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookingForm } from "@/components/booking/BookingForm";
import { ProviderCard } from "@/components/booking/ProviderCard";
import { PaymentSummary } from "@/components/booking/PaymentSummary";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BurgerMenu } from "@/components/BurgerMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNav } from "@/components/BottomNav";

const BookingPage = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Check if we have the user's location
  useEffect(() => {
    const userAddress = localStorage.getItem("userAddress");
    if (!userAddress) {
      navigate("/location");
    }
  }, [navigate]);

  const { data: provider, isLoading } = useQuery({
    queryKey: ["provider", providerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_providers")
        .select("*")
        .eq("id", providerId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return (
    <div>
      {!isMobile && <BurgerMenu />}
      Loading...
      {isMobile && <BottomNav />}
    </div>
  );
  
  if (!provider) return (
    <div>
      {!isMobile && <BurgerMenu />}
      Provider not found
      {isMobile && <BottomNav />}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {!isMobile && <BurgerMenu />}
      <div className="max-w-4xl mx-auto space-y-8">
        <ProviderCard provider={provider} />
        <BookingForm onSubmit={console.log} />
        <PaymentSummary provider={provider} />
      </div>
      {isMobile && <BottomNav />}
    </div>
  );
};

export default BookingPage;