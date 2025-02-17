
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { Header } from "@/components/Header";
import { PromotionalCarousel } from "@/components/PromotionalCarousel";
import { ServiceCategoriesGrid } from "@/components/ServiceCategoriesGrid";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Header />
      
      {/* Add padding to account for fixed header */}
      <div className="pt-20">
        <PromotionalCarousel />
        <ServiceCategoriesGrid />
      </div>
      
      {isMobile && <BottomNav />}
    </div>
  );
};

export default Index;
