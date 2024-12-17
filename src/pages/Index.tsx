import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BurgerMenu } from "@/components/BurgerMenu";

const services = [
  {
    title: "Home Maintenance",
    description: "Plumbing, electrical work, general repairs",
    icon: "🏠"
  },
  {
    title: "Garden Services",
    description: "Lawn maintenance, tree trimming, landscaping",
    icon: "🌿"
  },
  {
    title: "Cleaning",
    description: "Home cleaning, office cleaning, deep cleaning",
    icon: "✨"
  },
  {
    title: "Moving Help",
    description: "Furniture moving, home relocations, heavy lifting",
    icon: "📦"
  },
  {
    title: "Handyman",
    description: "Furniture assembly, mounting, installations",
    icon: "🔧"
  },
  {
    title: "Security",
    description: "Gate motors, electric fencing, CCTV installation",
    icon: "🔒"
  }
];

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <BurgerMenu />}
      {/* Hero Section */}
      <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Best Favour
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your trusted community of local professionals across South Africa, ready to help!
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 gap-4">
            <Link to={isAuthenticated ? "/services" : "/auth"}>
              <Button>
                {isAuthenticated ? "Book Service Now" : "Get Started"}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{service.icon}</span>
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">{service.description}</p>
                <Link to={isAuthenticated ? "/services" : "/auth"}>
                  <Button className="mt-4 w-full" variant="outline">
                    {isAuthenticated ? "Book Now" : "View Services"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;