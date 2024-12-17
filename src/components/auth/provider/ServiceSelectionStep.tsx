import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ServiceSelectionStepProps {
  formData: {
    serviceCategory: string;
    specificService: string;
  };
  serviceCategories: Record<string, string[]>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: { [key: string]: string };
}

export const ServiceSelectionStep = ({ 
  formData, 
  serviceCategories, 
  handleInputChange, 
  errors 
}: ServiceSelectionStepProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Service Category</Label>
        <RadioGroup
          value={formData.serviceCategory}
          onValueChange={(value) => handleInputChange({ 
            target: { name: 'serviceCategory', value } 
          } as React.ChangeEvent<HTMLInputElement>)}
          className="space-y-2"
        >
          {Object.keys(serviceCategories).map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <RadioGroupItem value={category} id={category} />
              <Label htmlFor={category}>{category}</Label>
            </div>
          ))}
        </RadioGroup>
        {errors.serviceCategory && (
          <Alert variant="destructive">
            <AlertDescription>{errors.serviceCategory}</AlertDescription>
          </Alert>
        )}
      </div>

      {formData.serviceCategory && (
        <div className="space-y-2">
          <Label>Specific Service</Label>
          <RadioGroup
            value={formData.specificService}
            onValueChange={(value) => handleInputChange({ 
              target: { name: 'specificService', value } 
            } as React.ChangeEvent<HTMLInputElement>)}
            className="space-y-2"
          >
            {serviceCategories[formData.serviceCategory].map((service) => (
              <div key={service} className="flex items-center space-x-2">
                <RadioGroupItem value={service} id={service} />
                <Label htmlFor={service}>{service}</Label>
              </div>
            ))}
          </RadioGroup>
          {errors.specificService && (
            <Alert variant="destructive">
              <AlertDescription>{errors.specificService}</AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};