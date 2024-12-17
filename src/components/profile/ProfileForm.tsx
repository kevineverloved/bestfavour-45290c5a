import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save, X, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  // Add more country codes as needed
];

export function ProfileForm({ initialData, onSubmit, onCancel }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    first_name: initialData.first_name || "",
    last_name: initialData.last_name || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
  });

  const [countryCode, setCountryCode] = useState("+27");

  const handlePhoneChange = (value: string) => {
    // Remove any non-digit characters except plus sign
    const cleanedValue = value.replace(/[^\d+]/g, "");
    setFormData({ ...formData, phone: cleanedValue });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneWithCode = formData.phone.startsWith("+") 
      ? formData.phone 
      : `${countryCode}${formData.phone}`;
    onSubmit({
      ...formData,
      phone: phoneWithCode,
    });
  };

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