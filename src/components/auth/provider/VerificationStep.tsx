import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

interface VerificationStepProps {
  formData: {
    idDocument: File | null;
    proofOfAddress: File | null;
    consentToBackgroundCheck: boolean;
  };
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
  errors: { [key: string]: string };
}

export const VerificationStep = ({ 
  formData, 
  handleFileChange, 
  handleCheckboxChange, 
  errors 
}: VerificationStepProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="idDocument">ID Document</Label>
        <Input
          id="idDocument"
          name="idDocument"
          type="file"
          onChange={handleFileChange}
          accept="image/jpeg,image/png"
        />
        {errors.idDocument && (
          <Alert variant="destructive">
            <AlertDescription>{errors.idDocument}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="proofOfAddress">Proof of Address</Label>
        <Input
          id="proofOfAddress"
          name="proofOfAddress"
          type="file"
          onChange={handleFileChange}
          accept="image/jpeg,image/png"
        />
        {errors.proofOfAddress && (
          <Alert variant="destructive">
            <AlertDescription>{errors.proofOfAddress}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="consentToBackgroundCheck"
          checked={formData.consentToBackgroundCheck}
          onCheckedChange={(checked) => 
            handleCheckboxChange('consentToBackgroundCheck', checked as boolean)
          }
        />
        <Label htmlFor="consentToBackgroundCheck">
          I consent to a background check
        </Label>
      </div>
      {errors.consentToBackgroundCheck && (
        <Alert variant="destructive">
          <AlertDescription>{errors.consentToBackgroundCheck}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};