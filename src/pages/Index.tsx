import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BurgerMenu } from "@/components/BurgerMenu";
import { BottomNav } from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { Home, TreePine, SprayCan, Truck, Wrench, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const iconMap = {
  home: Home,
  tree: TreePine,
  "spray-can": SprayCan,
  truck: Truck,
  wrench: Wrench,
  shield: Shield,
};

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
      
      {/* Hero Section */}
      <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Best Favour
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your trusted community of local professionals across South Africa, ready to help!
          </p>
          {!isAuthenticated && (
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <Link to="/auth">
                <Button size="lg">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Service Categories Grid */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="h-32 animate-pulse bg-gray-100" />
            ))
          ) : (
            categories?.map((category) => {
              const IconComponent = iconMap[category.icon as keyof typeof iconMap];
              return (
                <Link 
                  key={category.id} 
                  to={`/category/${category.id}`}
                  className="block group"
                >
                  <Card className="h-32 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <CardContent className="h-full flex flex-col items-center justify-center p-4">
                      {IconComponent && (
                        <IconComponent className="h-8 w-8 mb-2 text-primary group-hover:scale-110 transition-transform" />
                      )}
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