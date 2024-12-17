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
  X
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

const testimonialImages = [
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
];

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCarousel, setShowCarousel] = useState(true);
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
                        className="h-12 w-12 mb-2 text-primary group-hover:scale-110 transition-transform" 
                        strokeWidth={1.5}
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

      {/* Floating Carousel */}
      {showCarousel && (
        <div className="fixed bottom-20 right-4 z-50 w-80 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-4 bg-primary text-white flex justify-between items-center">
            <h3 className="font-semibold">Our Happy Customers</h3>
            <button
              onClick={() => setShowCarousel(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <Carousel className="w-full max-w-xs mx-auto">
            <CarouselContent>
              {testimonialImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-2">
                        <img
                          src={`${image}?auto=format&fit=crop&w=300&h=300`}
                          alt={`Happy customer ${index + 1}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}
      
      {isAuthenticated && isMobile && <BottomNav />}
    </div>
  );
};

export default Index;