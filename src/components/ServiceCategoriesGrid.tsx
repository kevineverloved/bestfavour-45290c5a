import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { 
  Brush,
  Flower2,
  Wrench,
  Home,
  Truck,
  Shield,
  Settings,
} from "lucide-react";

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

const iconColors: Record<string, string> = {
  brush: "#0EA5E9",    // Ocean Blue for cleaning
  flower: "#0000FF",   // Blue
  wrench: "#FFD700",   // Yellow
  home: "#008000",     // Green
  truck: "#FFA500",    // Orange
  shield: "#800080",   // Purple
  settings: "#4B0082", // Different shade of purple for settings
};

export const ServiceCategoriesGrid = () => {
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

  return (
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
  );
};