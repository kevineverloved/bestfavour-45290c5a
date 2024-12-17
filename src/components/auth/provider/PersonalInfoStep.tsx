import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PersonalInfoStepProps {
  formData: {
    fullName: string;
    idNumber: string;
    dateOfBirth: string;
    phoneNumber: string;
    email: string;
    streetAddress: string;
    city: string;
    postalCode: string;
    province: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: { [key: string]: string };
}

export const PersonalInfoStep = ({ formData, handleInputChange, errors }: PersonalInfoStepProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          required
        />
        {errors.fullName && (
          <Alert variant="destructive">
            <AlertDescription>{errors.fullName}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="idNumber">ID Number</Label>
        <Input
          id="idNumber"
          name="idNumber"
          value={formData.idNumber}
          onChange={handleInputChange}
          required
        />
        {errors.idNumber && (
          <Alert variant="destructive">
            <AlertDescription>{errors.idNumber}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          required
        />
        {errors.dateOfBirth && (
          <Alert variant="destructive">
            <AlertDescription>{errors.dateOfBirth}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
          {errors.phoneNumber && (
            <Alert variant="destructive">
              <AlertDescription>{errors.phoneNumber}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          {errors.email && (
            <Alert variant="destructive">
              <AlertDescription>{errors.email}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="streetAddress">Street Address</Label>
        <Input
          id="streetAddress"
          name="streetAddress"
          value={formData.streetAddress}
          onChange={handleInputChange}
          required
        />
        {errors.streetAddress && (
          <Alert variant="destructive">
            <AlertDescription>{errors.streetAddress}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
          {errors.city && (
            <Alert variant="destructive">
              <AlertDescription>{errors.city}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            required
          />
          {errors.postalCode && (
            <Alert variant="destructive">
              <AlertDescription>{errors.postalCode}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="province">Province</Label>
          <Input
            id="province"
            name="province"
            value={formData.province}
            onChange={handleInputChange}
            required
          />
          {errors.province && (
            <Alert variant="destructive">
              <AlertDescription>{errors.province}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};