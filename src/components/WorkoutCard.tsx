import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Clock, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface WorkoutCardProps {
  name: string;
  duration: string;
  description: string;
  accentColor: "coral" | "teal" | "primary";
}

export const WorkoutCard = ({ name, duration, description, accentColor }: WorkoutCardProps) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleCheckboxChange = (checked: boolean) => {
    setIsCompleted(checked);
    if (checked) {
      toast.success("Nice work — you're one step closer!", {
        description: `${name} completed!`,
        icon: "🎉",
      });
    }
  };

  const colorClasses = {
    coral: "border-coral hover:shadow-coral/20 data-[completed=true]:border-coral/50",
    teal: "border-teal hover:shadow-teal/20 data-[completed=true]:border-teal/50",
    primary: "border-primary hover:shadow-primary/20 data-[completed=true]:border-primary/50",
  };

  const badgeColorClasses = {
    coral: "bg-coral/10 text-coral",
    teal: "bg-teal/10 text-teal",
    primary: "bg-primary/10 text-primary",
  };

  return (
    <div
      data-completed={isCompleted}
      className={cn(
        "group relative rounded-2xl border-2 bg-card p-6 transition-all duration-300",
        "hover:scale-[1.02] hover:shadow-xl",
        colorClasses[accentColor],
        isCompleted && "opacity-60"
      )}
    >
      {/* Completion overlay effect */}
      {isCompleted && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-transparent rounded-2xl pointer-events-none" />
      )}

      <div className="relative">
        {/* Header with checkbox */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className={cn(
              "text-xl font-bold mb-2 transition-all duration-300",
              isCompleted && "line-through opacity-50"
            )}>
              {name}
            </h3>
            <div className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
              badgeColorClasses[accentColor]
            )}>
              <Clock className="w-3.5 h-3.5" />
              {duration}
            </div>
          </div>
          
          <Checkbox
            checked={isCompleted}
            onCheckedChange={handleCheckboxChange}
            className={cn(
              "h-6 w-6 transition-all duration-300",
              "data-[state=checked]:scale-110"
            )}
          />
        </div>

        {/* Description */}
        <p className={cn(
          "text-muted-foreground leading-relaxed transition-opacity duration-300",
          isCompleted && "opacity-40"
        )}>
          {description}
        </p>

        {/* Motivational sparkle on hover */}
        {!isCompleted && (
          <Sparkles className={cn(
            "absolute -top-2 -right-2 w-5 h-5 opacity-0 transition-all duration-300",
            "group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-12",
            accentColor === "coral" && "text-coral",
            accentColor === "teal" && "text-teal",
            accentColor === "primary" && "text-primary"
          )} />
        )}
      </div>
    </div>
  );
};
