import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp } from "lucide-react";

interface CompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weeklyStreak: number;
  monthlyTotal: number;
}

const motivationalMessages = [
  "Progress, not perfection. You showed up today!",
  "Every workout brings you closer to your goals!",
  "Consistency compounds. Great work today!",
  "You're building momentum—keep it going!",
  "Today's effort is tomorrow's strength!",
  "You invested in yourself today. That's powerful!",
  "One more workout in the books. You're unstoppable!",
];

export const CompletionDialog = ({ 
  open, 
  onOpenChange, 
  weeklyStreak, 
  monthlyTotal 
}: CompletionDialogProps) => {
  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center space-y-6 py-4">
          {/* Celebration Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-coral via-teal to-primary flex items-center justify-center animate-scale-in">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Motivational Message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Workout Complete! 🎉</h2>
            <p className="text-lg text-muted-foreground italic">
              "{randomMessage}"
            </p>
          </div>

          {/* Progress Summary */}
          <div className="bg-gradient-to-r from-coral/5 via-teal/5 to-primary/5 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm font-semibold">
              <TrendingUp className="w-4 h-4" />
              <span>Your Progress</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-teal">{weeklyStreak}</div>
                <div className="text-xs text-muted-foreground">Days this week</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-primary">{monthlyTotal}</div>
                <div className="text-xs text-muted-foreground">Workouts this month</div>
              </div>
            </div>
            {weeklyStreak >= 3 && (
              <p className="text-sm text-coral font-medium">
                🔥 You've stayed consistent {weeklyStreak} days this week — momentum matters!
              </p>
            )}
          </div>

          <Button onClick={() => onOpenChange(false)} className="w-full" size="lg">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
