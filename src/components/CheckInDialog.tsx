import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Battery, Clock } from "lucide-react";

interface CheckInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (bodyBattery: number, availableTime: number) => void;
}

export const CheckInDialog = ({ open, onOpenChange, onSubmit }: CheckInDialogProps) => {
  const [bodyBattery, setBodyBattery] = useState(50);
  const [availableTime, setAvailableTime] = useState<number | null>(null);

  const handleSubmit = () => {
    if (availableTime) {
      onSubmit(bodyBattery, availableTime);
      onOpenChange(false);
    }
  };

  const getBatteryColor = () => {
    if (bodyBattery <= 30) return "text-coral";
    if (bodyBattery <= 70) return "text-amber-500";
    return "text-teal";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Daily Check-In</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Body Battery Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Battery className="w-5 h-5" />
                Body Battery
              </Label>
              <span className={`text-2xl font-bold ${getBatteryColor()}`}>
                {bodyBattery}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              How charged do you feel today?
            </p>
            <Slider
              value={[bodyBattery]}
              onValueChange={(values) => setBodyBattery(values[0])}
              min={10}
              max={100}
              step={10}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low Energy</span>
              <span>High Energy</span>
            </div>
          </div>

          {/* Available Time Selector */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Available Time
            </Label>
            <p className="text-sm text-muted-foreground">
              How long do you have for today's workout?
            </p>
            <Select onValueChange={(value) => setAvailableTime(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!availableTime}
            className="w-full"
            size="lg"
          >
            Generate My Workout Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
