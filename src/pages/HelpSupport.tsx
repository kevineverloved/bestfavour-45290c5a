import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const HelpSupport = () => {
  const navigate = useNavigate();

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
          <h1 className="text-2xl font-semibold">Help & Support</h1>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Contact Us</h2>
            <div className="space-y-4">
              <a 
                href="mailto:thamsanxamudau@gmail.com" 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-muted-foreground">thamsanxamudau@gmail.com</p>
                </div>
              </a>
              
              <Separator />
              
              <a 
                href="tel:+27832918957" 
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-muted-foreground">083 291 8957</p>
                  <p className="text-xs text-muted-foreground">Available Mon-Fri, 9am-5pm SAST</p>
                </div>
              </a>
              
              <Separator />
              
              <button 
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                onClick={() => window.open('https://wa.me/27832918957', '_blank')}
              >
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-medium">WhatsApp Support</p>
                  <p className="text-sm text-muted-foreground">Chat with us on WhatsApp</p>
                </div>
              </button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">How do I book a service?</h3>
                <p className="text-sm text-muted-foreground">
                  Browse through our service categories, select a provider, choose your preferred date and time, and follow the booking process.
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="font-medium">How do I cancel a booking?</h3>
                <p className="text-sm text-muted-foreground">
                  Go to your bookings page, select the booking you want to cancel, and click on the cancel button. Please note our cancellation policy.
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="font-medium">What payment methods do you accept?</h3>
                <p className="text-sm text-muted-foreground">
                  We accept all major credit and debit cards. You can manage your payment methods in your account settings.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;