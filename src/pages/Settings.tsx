import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  UserCircle2, 
  Bell, 
  Lock, 
  CreditCard, 
  Globe, 
  HelpCircle,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const settingsItems = [
  { 
    title: 'Personal Information', 
    icon: UserCircle2, 
    path: '/settings/personal-information',
    description: 'Manage your personal details and profile' 
  },
  { 
    title: 'Notifications', 
    icon: Bell, 
    path: '/settings/notifications',
    description: 'Control your notification preferences' 
  },
  { 
    title: 'Privacy', 
    icon: Lock, 
    path: '/settings/privacy',
    description: 'Manage your privacy settings' 
  },
  { 
    title: 'Payment Methods', 
    icon: CreditCard, 
    path: '/settings/payments',
    description: 'Manage your payment methods' 
  },
  { 
    title: 'Language & Region', 
    icon: Globe, 
    path: '/settings/language',
    description: 'Set your preferred language and region' 
  },
  { 
    title: 'Help & Support', 
    icon: HelpCircle, 
    path: '/settings/help',
    description: 'Get help and contact support' 
  },
];

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleItemClick = (path: string) => {
    if (path === '/settings/personal-information' || 
        path === '/settings/notifications' || 
        path === '/settings/privacy') {
      navigate(path);
    } else {
      toast({
        title: "Coming Soon",
        description: "This feature is not yet available.",
      });
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
          <h1 className="text-2xl font-semibold">Settings</h1>
        </div>

        <div className="space-y-4">
          {settingsItems.map((item, index) => (
            <div key={item.title}>
              <button
                onClick={() => handleItemClick(item.path)}
                className="w-full group"
              >
                <div className="flex items-center justify-between p-4 rounded-lg bg-card hover:bg-accent transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </button>
              {index < settingsItems.length - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;