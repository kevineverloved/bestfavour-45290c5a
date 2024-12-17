import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ProviderFormProps {
  formData: {
    businessName: string;
    serviceType: string;
    experience: string;
    availability: string;
    location: string;
    rates: string;
    insurance: string;
  };
  setFormData: (key: string, value: string) => void;
  isLoading: boolean;
}

const ProviderForm = ({ formData, setFormData, isLoading }: ProviderFormProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="businessName">Business/Service Name</Label>
        <Input
          id="businessName"
          value={formData.businessName}
          onChange={(e) => setFormData("businessName", e.target.value)}
          required
          disabled={isLoading}
          placeholder="Your business name"
        />
      </div>

      <div className="space-y-2">
        <Label>Service Category</Label>
        <RadioGroup 
          value={formData.serviceType} 
          onValueChange={(value) => setFormData("serviceType", value)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="maintenance" id="maintenance" disabled={isLoading} />
            <Label htmlFor="maintenance">Home Maintenance</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="garden" id="garden" disabled={isLoading} />
            <Label htmlFor="garden">Garden Services</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cleaning" id="cleaning" disabled={isLoading} />
            <Label htmlFor="cleaning">Cleaning</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="moving" id="moving" disabled={isLoading} />
            <Label htmlFor="moving">Moving Help</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="handyman" id="handyman" disabled={isLoading} />
            <Label htmlFor="handyman">Handyman</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="security" id="security" disabled={isLoading} />
            <Label htmlFor="security">Security</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Years of Experience</Label>
        <Input
          id="experience"
          value={formData.experience}
          onChange={(e) => setFormData("experience", e.target.value)}
          required
          disabled={isLoading}
          type="number"
          min="0"
          placeholder="Years of experience"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="availability">Availability</Label>
        <Textarea
          id="availability"
          value={formData.availability}
          onChange={(e) => setFormData("availability", e.target.value)}
          required
          disabled={isLoading}
          placeholder="e.g., Monday-Friday 9AM-5PM, Weekends available"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Service Area</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData("location", e.target.value)}
          required
          disabled={isLoading}
          placeholder="Areas you service"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rates">Rates</Label>
        <Textarea
          id="rates"
          value={formData.rates}
          onChange={(e) => setFormData("rates", e.target.value)}
          required
          disabled={isLoading}
          placeholder="Your pricing structure"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="insurance">Insurance Information</Label>
        <Input
          id="insurance"
          value={formData.insurance}
          onChange={(e) => setFormData("insurance", e.target.value)}
          required
          disabled={isLoading}
          placeholder="Insurance provider and policy number"
        />
      </div>
    </>
  );
};

export default ProviderForm;