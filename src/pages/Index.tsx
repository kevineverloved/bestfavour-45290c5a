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
  Award,
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

// Each icon has a unique color from the specified palette
const iconColors: Record<string, string> = {
  brush: "#0EA5E9",    // Ocean Blue for cleaning
  flower: "#0000FF",   // Blue
  wrench: "#FFD700",   // Yellow
  home: "#008000",     // Green
  truck: "#FFA500",    // Orange
  shield: "#800080",   // Purple
  settings: "#4B0082", // Different shade of purple for settings
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
      {/* Header with Logo and Burger Menu */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
        <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
          {/* Left section - empty for balance */}
          <div className="w-16" />
          
          {/* Center section - Logo */}
          <div className="flex items-center gap-2">
            <Award className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold text-primary">Best Favour</span>
          </div>
          
          {/* Right section - Burger Menu */}
          <div className="w-16 flex justify-end">
            <BurgerMenu />
          </div>
        </div>
      </div>

      {/* Add padding to account for fixed header */}
      <div className="pt-20">
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
                          style={{ color: iconColors[category.icon] || '#4B0082' }}
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
      </div>
      
      {isAuthenticated && isMobile && <BottomNav />}
    </div>
  );
};

export default Index;
