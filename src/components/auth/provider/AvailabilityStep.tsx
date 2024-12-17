import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

const availabilityOptions = [
  "Monday Morning",
  "Monday Afternoon",
  "Tuesday Morning",
  "Tuesday Afternoon",
  "Wednesday Morning",
  "Wednesday Afternoon",
  "Thursday Morning",
  "Thursday Afternoon",
  "Friday Morning",
  "Friday Afternoon",
  "Saturday Morning",
  "Saturday Afternoon",
  "Sunday Morning",
  "Sunday Afternoon"
];

interface AvailabilityStepProps {
  availability: string[];
  handleMultiSelectChange: (name: string, value: string) => void;
  errors: { [key: string]: string };
}

export const AvailabilityStep = ({ 
  availability, 
  handleMultiSelectChange, 
  errors 
}: AvailabilityStepProps) => {
  return (
    <div className="space-y-4">
      <Label>When are you available to work?</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availabilityOptions.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={option}
              checked={availability.includes(option)}
              onCheckedChange={(checked) => handleMultiSelectChange('availability', option)}
            />
            <Label htmlFor={option}>{option}</Label>
          </div>
        ))}
      </div>
      {errors.availability && (
        <Alert variant="destructive">
          <AlertDescription>{errors.availability}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};