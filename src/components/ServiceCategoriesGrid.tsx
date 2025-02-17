
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

// Custom colors and styles for each category
const categoryStyles: Record<string, {
  color: string;
  bgColor: string;
  hoverEffect: string;
  strokeWidth: number;
}> = {
  wrench: {
    color: "#4338CA", // Indigo
    bgColor: "bg-indigo-50",
    hoverEffect: "hover:rotate-45",
    strokeWidth: 1.5,
  },
  scissors: {
    color: "#DC2626", // Red
    bgColor: "bg-red-50",
    hoverEffect: "hover:scale-110",
    strokeWidth: 1.2,
  },
  laptop: {
    color: "#2563EB", // Blue
    bgColor: "bg-blue-50",
    hoverEffect: "hover:translate-y-[-4px]",
    strokeWidth: 1.3,
  },
  car: {
    color: "#059669", // Green
    bgColor: "bg-emerald-50",
    hoverEffect: "hover:scale-x-110",
    strokeWidth: 1.4,
  },
  utensils: {
    color: "#9333EA", // Purple
    bgColor: "bg-purple-50",
    hoverEffect: "hover:rotate-12",
    strokeWidth: 1.6,
  },
  briefcase: {
    color: "#D97706", // Amber
    bgColor: "bg-amber-50",
    hoverEffect: "hover:scale-105",
    strokeWidth: 1.5,
  },
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
            const style = categoryStyles[category.icon] || categoryStyles.wrench;
            return (
              <Link 
                key={category.id} 
                to={`/category/${category.id}`}
                className="block group"
              >
                <Card className={`h-32 transition-all duration-300 hover:shadow-xl ${style.bgColor} hover:bg-white`}>
                  <CardContent className="h-full flex flex-col items-center justify-center p-4">
                    <div className={`rounded-full p-3 transition-all duration-300 ${style.hoverEffect} group-hover:shadow-lg`}>
                      <IconComponent 
                        className={`h-12 w-12 transition-all duration-300`}
                        strokeWidth={style.strokeWidth}
                        style={{ color: style.color }}
                      />
                    </div>
                    <span className="text-center font-medium text-gray-900 text-lg mt-2">
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
