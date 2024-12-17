import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Vuka Works
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Rise up and get things done! Find trusted local professionals across South Africa.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Button className="w-full sm:w-auto">
              Find Help Today
            </Button>
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
                <Button className="mt-4 w-full" variant="outline">
                  View Services
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;