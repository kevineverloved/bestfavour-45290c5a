import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { BurgerMenu } from "@/components/BurgerMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNav } from "@/components/BottomNav";

const ServiceCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { data: category, isLoading: categoryLoading } = useQuery({
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
    enabled: !!id
  });

  const { data: providers, isLoading: providersLoading } = useQuery({
    queryKey: ['serviceProviders', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_providers')
        .select(`
          *,
          service_types!inner(
            name,
            category_id
          )
        `)
        .eq('service_types.category_id', id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const isLoading = categoryLoading || providersLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        {!isMobile && <BurgerMenu />}
        <div className="animate-pulse space-y-4 max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="h-48" />
            ))}
          </div>
        </div>
        {isMobile && <BottomNav />}
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col items-center justify-center">
        <p className="text-xl text-gray-600 mb-4">Category not found</p>
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {!isMobile && <BurgerMenu />}
      
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
          <p className="text-gray-600">{category.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {providers?.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No service providers found in this category.</p>
              <p className="text-sm text-gray-400 mt-2">Check back later or try another category.</p>
            </div>
          ) : (
            providers?.map((provider) => (
              <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${provider.id}`}
                      alt={provider.business_name}
                    />
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{provider.business_name}</CardTitle>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm">4.8</span>
                      <span className="text-gray-400 text-sm">(24 reviews)</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{provider.description}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">2.5 km away</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">
                      R{provider.hourly_rate}/hour
                    </Badge>
                    <Link to={`/booking/${provider.id}`}>
                      <Button>Book Now</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {isMobile && <BottomNav />}
    </div>
  );
};

export default ServiceCategory;