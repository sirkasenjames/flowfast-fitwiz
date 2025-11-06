import { TrendingUp, Calendar, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressPreviewProps {
  goal: string;
  frequency: number;
}

const previewData = {
  "weight-loss": {
    metric: "8-12 lbs in 4 weeks",
    icon: TrendingUp,
    color: "text-primary"
  },
  "muscle-gain": {
    metric: "2-4 lbs muscle in 4 weeks",
    icon: Target,
    color: "text-accent"
  },
  "endurance": {
    metric: "30% stamina boost in 4 weeks",
    icon: TrendingUp,
    color: "text-secondary"
  }
};

export const ProgressPreview = ({ goal, frequency }: ProgressPreviewProps) => {
  const preview = previewData[goal as keyof typeof previewData];
  const Icon = preview.icon;

  return (
    <div className="animate-fade-in bg-gradient-to-br from-card via-card to-muted/30 rounded-2xl p-6 border-2 border-primary/20 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Your Journey Preview</h3>
          <p className="text-sm text-muted-foreground">Based on {frequency}x/week commitment</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Expected Progress</span>
          </div>
          <span className={cn("text-sm font-bold", preview.color)}>{preview.metric}</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{frequency * 4}</div>
            <div className="text-xs text-muted-foreground">Workouts/month</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-secondary">{frequency * 45}</div>
            <div className="text-xs text-muted-foreground">Active mins/week</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-accent">100%</div>
            <div className="text-xs text-muted-foreground">Your potential</div>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground pt-2">
          🎯 Join 50,000+ users who crushed their goals this month
        </p>
      </div>
    </div>
  );
};
