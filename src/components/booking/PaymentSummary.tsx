import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

interface Provider {
  business_name: string;
  created_at: string;
  description: string;
  hourly_rate: number;
  id: string;
  service_type_id: string;
  user_id: string;
}

interface PaymentSummaryProps {
  provider: Provider;
  duration?: number;
  onConfirm?: () => void;
}

export const PaymentSummary = ({ provider, duration = 2, onConfirm }: PaymentSummaryProps) => {
  const totalCost = provider.hourly_rate * duration;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Service Rate</span>
          <span>R{provider.hourly_rate}/hour</span>
        </div>
        <div className="flex justify-between">
          <span>Duration</span>
          <span>{duration} hours</span>
        </div>
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>R{totalCost}</span>
        </div>

        <Button className="w-full" onClick={onConfirm}>
          <CreditCard className="h-4 w-4 mr-2" />
          Confirm Booking
        </Button>
      </CardContent>
    </Card>
  );
};