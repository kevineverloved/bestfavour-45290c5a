import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ServiceTypeSelectionProps {
  userType: string;
  setUserType: (value: string) => void;
  isLoading: boolean;
}

const ServiceTypeSelection = ({ userType, setUserType, isLoading }: ServiceTypeSelectionProps) => {
  return (
    <div className="space-y-2">
      <Label>I want to...</Label>
      <RadioGroup value={userType} onValueChange={setUserType} className="flex flex-col space-y-1">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="seeker" id="seeker" disabled={isLoading} />
          <Label htmlFor="seeker">Find and book services</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="provider" id="provider" disabled={isLoading} />
          <Label htmlFor="provider">Offer my services</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ServiceTypeSelection;