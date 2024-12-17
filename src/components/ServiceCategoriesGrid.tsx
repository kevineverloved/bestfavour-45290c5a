import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { 
  Wrench,
  Scissors,
  Laptop,
  Car,
  UtensilsCrossed,
  Briefcase,
} from "lucide-react";

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  wrench: Wrench,
  scissors: Scissors,
  laptop: Laptop,
  car: Car,
  utensils: UtensilsCrossed,
  briefcase: Briefcase,
};

// Use a consistent blue color for all icons as shown in the image
const ICON_COLOR = "#0066FF";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-6">Service Categories</h2>
      <div className="grid grid-cols-2 gap-4">
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
            const IconComponent = iconMap[category.icon] || Wrench;
            return (
              <Link 
                key={category.id} 
                to={`/category/${category.id}`}
                className="block group"
              >
                <Card className="h-32 transition-all duration-300 hover:shadow-lg bg-white">
                  <CardContent className="h-full flex flex-col items-center justify-center p-4">
                    <IconComponent 
                      className="h-12 w-12 mb-3"
                      strokeWidth={1.5}
                      color={ICON_COLOR}
                    />
                    <span className="text-center font-medium text-gray-900 text-lg">
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