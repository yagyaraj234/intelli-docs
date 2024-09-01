import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function OTPVerifierPopup({ isOpen, onClose, onVerify }: any) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setIsVerifying(true);

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      setIsVerifying(false);
      return;
    }

    try {
      // Simulating an API call to verify OTP
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demonstration, let's consider '123456' as the correct OTP
      if (otp === "123456") {
        onVerify(true);
        onClose();
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verify OTP</DialogTitle>
          <DialogDescription>
            Enter the 6-digit code sent to your device.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="otp" className="text-right">
                OTP
              </Label>
              <Input
                id="otp"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="col-span-3"
                placeholder="Enter 6-digit code"
                maxLength={6}
                inputMode="numeric"
                pattern="\d{6}"
                required
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "otp-error" : undefined}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription id="otp-error">{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isVerifying}>
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
