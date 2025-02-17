
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

// Modern styling configuration for categories
const categoryStyles: Record<string, {
  gradient: string;
  iconColor: string;
  shadowColor: string;
}> = {
  wrench: {
    gradient: "from-cyan-500 to-blue-500",
    iconColor: "text-white",
    shadowColor: "shadow-cyan-500/20",
  },
  scissors: {
    gradient: "from-purple-500 to-pink-500",
    iconColor: "text-white",
    shadowColor: "shadow-purple-500/20",
  },
  laptop: {
    gradient: "from-blue-600 to-indigo-500",
    iconColor: "text-white",
    shadowColor: "shadow-blue-500/20",
  },
  car: {
    gradient: "from-emerald-500 to-teal-500",
    iconColor: "text-white",
    shadowColor: "shadow-emerald-500/20",
  },
  utensils: {
    gradient: "from-orange-500 to-amber-500",
    iconColor: "text-white",
    shadowColor: "shadow-orange-500/20",
  },
  briefcase: {
    gradient: "from-violet-500 to-purple-500",
    iconColor: "text-white",
    shadowColor: "shadow-violet-500/20",
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                className="block group transform transition-all duration-300 hover:scale-105"
              >
                <Card className={`relative overflow-hidden border-0 ${style.shadowColor} shadow-lg hover:shadow-xl transition-all duration-300`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-90`} />
                  <CardContent className="relative h-32 flex flex-col items-center justify-center p-4">
                    <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-3 mb-3">
                      <IconComponent 
                        className={`h-8 w-8 ${style.iconColor}`}
                        strokeWidth={1.5}
                      />
                    </div>
                    <span className="text-center font-medium text-white text-sm">
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
