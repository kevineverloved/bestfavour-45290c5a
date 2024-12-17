import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { BurgerMenu } from "@/components/BurgerMenu";
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNav } from "@/components/BottomNav";

const ServiceCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Return early if categoryId is undefined
  if (!categoryId) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Invalid category ID</p>
        <Button 
          variant="ghost" 
          className="mt-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  const { data: category, isLoading: categoryLoading, error: categoryError } = useQuery({
    queryKey: ['serviceCategory', categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .eq('id', categoryId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!categoryId // Only run query if categoryId exists
  });

  const { data: providers, isLoading: providersLoading, error: providersError } = useQuery({
    queryKey: ['serviceProviders', categoryId],
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
        .eq('service_types.category_id', categoryId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!categoryId // Only run query if categoryId exists
  });

  // Handle loading state
  if (categoryLoading || providersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        {!isMobile && <BurgerMenu />}
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
        {isMobile && <BottomNav />}
      </div>
    );
  }

  // Handle errors
  if (categoryError || providersError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        {!isMobile && <BurgerMenu />}
        <div className="text-center">
          <p className="text-red-500">Error loading category information</p>
          <Button 
            variant="ghost" 
            className="mt-4"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
        {isMobile && <BottomNav />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {!isMobile && <BurgerMenu />}
      
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">{category?.name}</h1>
        <p className="text-gray-600 mt-2">{category?.description}</p>
      </div>

      {/* Service Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers?.map((provider) => (
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
              <div className="flex justify-between items-center">
                <Badge variant="secondary">
                  R{provider.hourly_rate}/hour
                </Badge>
                <Link to={`/book/${provider.id}`}>
                  <Button>Book Now</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}

        {providers?.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No service providers found in this category.</p>
          </div>
        )}
      </div>
      
      {isMobile && <BottomNav />}
    </div>
  );
};

export default ServiceCategory;