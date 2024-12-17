import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EligibilityStepProps {
  isSouthAfrican: string;
  setFormData: (prevData: any) => void;
  errors: { [key: string]: string };
}

export const EligibilityStep = ({ isSouthAfrican, setFormData, errors }: EligibilityStepProps) => {
  return (
    <div className="space-y-4">
      <Label>Are you a South African citizen or permanent resident?</Label>
      <RadioGroup
        value={isSouthAfrican}
        onValueChange={(value) => setFormData((prev: any) => ({ ...prev, isSouthAfrican: value }))}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id="yes" />
          <Label htmlFor="yes">Yes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id="no" />
          <Label htmlFor="no">No</Label>
        </div>
      </RadioGroup>
      {errors.isSouthAfrican && (
        <Alert variant="destructive">
          <AlertDescription>{errors.isSouthAfrican}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};