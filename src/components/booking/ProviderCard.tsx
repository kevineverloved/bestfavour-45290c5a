import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface ProviderCardProps {
  provider: {
    business_name: string;
    description: string | null;
    hourly_rate: number | null;
  };
}

export const ProviderCard = ({ provider }: ProviderCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Provider</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${provider.business_name}`}
            alt={provider.business_name}
            className="w-20 h-20 rounded-full"
          />
          <div>
            <h2 className="text-xl font-semibold">{provider.business_name}</h2>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span>4.8</span>
              <span className="text-gray-400">(24 reviews)</span>
            </div>
            <p className="text-lg font-semibold text-primary">
              R{provider.hourly_rate}/hour
            </p>
          </div>
        </div>
        <p className="text-gray-600">{provider.description}</p>
      </CardContent>
    </Card>
  );
};