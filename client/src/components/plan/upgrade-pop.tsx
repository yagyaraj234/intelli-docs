import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function UpgradePopup({ isOpen, onClose }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upgrade to Pro</DialogTitle>
          <DialogDescription>
            You've reached the{" "}
            <span className="font-semibold text-black">upload/workspace</span>{" "}
            limit for free users. Upgrade to Pro to unlock more storage and
            features!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <span className="font-medium">Current plan:</span>
            <span>Free (10MB limit)</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium">Pro plan:</span>
            <span>100MB upload limit</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Maybe later
          </Button>
          <Button
            onClick={() => {
              /* Implement upgrade logic */
            }}
            disabled
          >
            Upgrade to Pro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
