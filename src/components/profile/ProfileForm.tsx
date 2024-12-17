import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneVerification } from "./PhoneVerification";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ProfileFormProps {
  initialData: {
    first_name: string | null;
    last_name: string | null;
    email?: string | null;
    phone?: string | null;
  };
  onSubmit: (data: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  }) => void;
  onCancel: () => void;
}

const countryCodes = [
  { code: "+27", flag: "🇿🇦", country: "South Africa" },
  { code: "+1", flag: "🇺🇸", country: "United States" },
  { code: "+44", flag: "🇬🇧", country: "United Kingdom" },
];

export function ProfileForm({ initialData, onSubmit, onCancel }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    first_name: initialData.first_name || "",
    last_name: initialData.last_name || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
  });
  const [countryCode, setCountryCode] = useState("+27");
  const [showVerification, setShowVerification] = useState(false);
  const [verificationError, setVerificationError] = useState<string>();
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const handlePhoneChange = (value: string) => {
    const cleanedValue = value.replace(/[^\d+]/g, "");
    setFormData({ ...formData, phone: cleanedValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneWithCode = formData.phone.startsWith("+") 
      ? formData.phone 
      : `${countryCode}${formData.phone}`;

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneWithCode,
      });

      if (error) {
        if (error.message.includes("phone_provider_disabled") || error.message.includes("Unsupported phone provider")) {
          toast({
            title: "Phone Verification Unavailable",
            description: "Phone verification is currently not configured. Please contact support.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      setShowVerification(true);
      toast({
        title: "Verification code sent",
        description: "Please check your phone for the verification code.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code",
        variant: "destructive",
      });
    }
  };

  const handleVerifyCode = async (code: string) => {
    setIsVerifying(true);
    setVerificationError(undefined);

    try {
      const phoneWithCode = formData.phone.startsWith("+") 
        ? formData.phone 
        : `${countryCode}${formData.phone}`;

      const { error } = await supabase.auth.verifyOtp({
        phone: phoneWithCode,
        token: code,
        type: 'sms',
      });

      if (error) throw error;

      onSubmit({
        ...formData,
        phone: phoneWithCode,
      });

      toast({
        title: "Phone number verified",
        description: "Your phone number has been verified successfully.",
      });
      setShowVerification(false);
    } catch (error: any) {
      setVerificationError(error.message || "Invalid verification code");
    } finally {
      setIsVerifying(false);
    }
  };

  if (showVerification) {
    return (
      <Card>
        <CardContent className="pt-6">
          <PhoneVerification
            phoneNumber={formData.phone.startsWith("+") 
              ? formData.phone 
              : `${countryCode}${formData.phone}`}
            onVerify={handleVerifyCode}
            onCancel={() => setShowVerification(false)}
            error={verificationError}
            isLoading={isVerifying}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Info</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  placeholder="Enter your first name"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  placeholder="Enter your last name"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="text-sm text-muted-foreground mb-2">
                You'll use this number to get notifications, sign in and recover your account.
              </div>
              <div className="flex gap-2">
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <span className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span>{country.code}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  type="tel"
                  className="flex-1"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                />
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                A verification code will be sent to this number
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Update
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}