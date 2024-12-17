import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    YocoSDK: any;
  }
}

const PaymentMethods = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddCard = async () => {
    setIsLoading(true);
    try {
      const yoco = new window.YocoSDK({
        publicKey: 'pk_test_ed3c54a6gOol69qa7f45',
      });

      yoco.showPopup({
        amountInCents: 0,
        currency: 'ZAR',
        name: 'Add Payment Method',
        description: 'Verify your card for future bookings',
        callback: async function (result: any) {
          if (result.error) {
            toast({
              title: "Error",
              description: result.error.message,
              variant: "destructive",
            });
            return;
          }

          // Token created successfully
          try {
            const { data, error } = await supabase.functions.invoke('create-payment', {
              body: {
                token: result.id,
                verifyOnly: true
              }
            });

            if (error) throw error;

            toast({
              title: "Success",
              description: "Payment method added successfully",
            });

          } catch (error: any) {
            toast({
              title: "Error",
              description: error.message,
              variant: "destructive",
            });
          }
        }
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Go back</span>
          </Button>
          <h1 className="text-2xl font-semibold">Payment Methods</h1>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center text-muted-foreground py-8">
                  <CreditCard className="mx-auto h-12 w-12 mb-4 text-muted-foreground/50" />
                  <p>No payment methods added yet</p>
                </div>

                <Button
                  onClick={handleAddCard}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-sm text-muted-foreground text-center">
            <p>Your payment information is securely processed by Yoco.</p>
            <p>We never store your card details.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;