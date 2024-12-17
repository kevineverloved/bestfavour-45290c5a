import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface ProviderCardProps {
  provider: {
    id: string;
    business_name: string;
    description: string | null;
    hourly_rate: number | null;
  };
}

export const ProviderCard = ({ provider }: ProviderCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{provider.business_name}</span>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span>4.8</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${provider.business_name}`}
            alt={provider.business_name}
            className="w-20 h-20 rounded-full"
          />
          <div className="space-y-2">
            <div className="flex items-center text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              <span>2.5 km away</span>
            </div>
            <p className="text-lg font-semibold text-primary">
              R{provider.hourly_rate}/hour
            </p>
          </div>
        </div>
        <p className="text-gray-600 line-clamp-2">{provider.description}</p>
        <Link to={`/booking/${provider.id}`}>
          <Button className="w-full">Book Now</Button>
        </Link>
      </CardContent>
    </Card>
  );
};