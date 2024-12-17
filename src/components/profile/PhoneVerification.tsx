import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AlertCircle, Loader2 } from "lucide-react";

interface PhoneVerificationProps {
  phoneNumber: string;
  onVerify: (code: string) => void;
  onCancel: () => void;
  error?: string;
  isLoading?: boolean;
}

export function PhoneVerification({
  phoneNumber,
  onVerify,
  onCancel,
  error,
  isLoading,
}: PhoneVerificationProps) {
  const [code, setCode] = React.useState("");

  const handleComplete = (value: string) => {
    onVerify(value);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Verify your phone number</h3>
        <p className="text-sm text-muted-foreground">
          We've sent a verification code to {phoneNumber}
        </p>
      </div>

      <div className="flex justify-center py-4">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={setCode}
          onComplete={handleComplete}
          disabled={isLoading}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={() => handleComplete(code)}
          disabled={code.length !== 6 || isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Verify
        </Button>
      </div>
    </div>
  );
}