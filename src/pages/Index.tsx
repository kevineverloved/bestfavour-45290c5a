import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BurgerMenu } from "@/components/BurgerMenu";
import { BottomNav } from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Brush,
  Flower2,
  Wrench,
  Home,
  Truck,
  Shield,
  Settings,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  brush: Brush,
  flower: Flower2,
  wrench: Wrench,
  home: Home,
  truck: Truck,
  shield: Shield,
  settings: Settings,
};

// Color mapping for service category icons
const iconColors: Record<string, string> = {
  brush: "#9b87f5",    // Primary Purple
  flower: "#0EA5E9",   // Ocean Blue
  wrench: "#7E69AB",   // Secondary Purple
  home: "#33C3F0",     // Sky Blue
  truck: "#8B5CF6",    // Vivid Purple
  shield: "#1EAEDB",   // Bright Blue
  settings: "#6E59A5", // Tertiary Purple
};

const promotionalImages = [
  {
    url: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    title: "Special Spring Cleaning Offer",
    description: "Get 20% off on your first booking"
  },
  {
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    title: "Tech Support Services",
    description: "Expert technicians available 24/7"
  },
  {
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    title: "Work From Home Services",
    description: "Professional setup and maintenance"
  },
  {
    url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
    title: "Garden Maintenance",
    description: "Transform your outdoor space"
  },
];

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isMobile = useIsMobile();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['serviceCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as ServiceCategory[];
    }
  });

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
      {!isMobile && <BurgerMenu />}
      
      {/* Promotional Carousel */}
      <div className="max-w-7xl mx-auto pt-6 px-4 sm:px-6 lg:px-8">
        <Carousel className="w-full max-w-4xl mx-auto">
          <CarouselContent>
            {promotionalImages.map((promo, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card className="border-0 overflow-hidden">
                    <CardContent className="p-0 relative aspect-[16/9]">
                      <img
                        src={`${promo.url}?auto=format&fit=crop&w=1200&h=675`}
                        alt={promo.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
                        <h3 className="text-xl font-semibold mb-2">{promo.title}</h3>
                        <p className="text-sm">{promo.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>

      {/* Service Categories Grid */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-32">
                <CardContent className="h-full flex flex-col items-center justify-center p-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-4 w-24 mt-2" />
                </CardContent>
              </Card>
            ))
          ) : (
            categories?.map((category) => {
              const IconComponent = iconMap[category.icon] || Settings;
              return (
                <Link 
                  key={category.id} 
                  to={`/category/${category.id}`}
                  className="block group"
                >
                  <Card className="h-32 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <CardContent className="h-full flex flex-col items-center justify-center p-4">
                      <IconComponent 
                        className="h-12 w-12 mb-2 group-hover:scale-110 transition-transform" 
                        strokeWidth={1.5}
                        style={{ color: iconColors[category.icon] || '#6E59A5' }}
                      />
                      <span className="text-center font-medium text-gray-900">
                        {category.name}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      </div>
      
      {isAuthenticated && isMobile && <BottomNav />}
    </div>
  );
};

export default Index;