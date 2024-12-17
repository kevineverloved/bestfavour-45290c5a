import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProviderCard } from "@/components/booking/ProviderCard";
import { BurgerMenu } from "@/components/BurgerMenu";
import { BottomNav } from "@/components/BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";

const ServiceCategory = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();

  const { data: category } = useQuery({
    queryKey: ['serviceCategory', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: providers, isLoading } = useQuery({
    queryKey: ['serviceProviders', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_providers')
        .select(`
          *,
          service_type:service_types!inner(
            category_id
          )
        `)
        .eq('service_type.category_id', id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      {!isMobile && <BurgerMenu />}
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {category?.name}
        </h1>
        <p className="text-gray-600 mb-8">
          {category?.description || `Find the best ${category?.name} providers near you`}
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))
          ) : providers?.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center py-12">
              No service providers found in this category.
            </p>
          ) : (
            providers?.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))
          )}
        </div>
      </div>

      {isMobile && <BottomNav />}
    </div>
  );
};

export default ServiceCategory;