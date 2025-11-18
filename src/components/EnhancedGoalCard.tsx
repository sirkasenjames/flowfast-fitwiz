import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface EnhancedGoalCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  benefit: string;
  heroImage: string;
  isSelected: boolean;
  onClick: () => void;
}

export const EnhancedGoalCard = ({ 
  icon: Icon, 
  title, 
  description, 
  benefit,
  heroImage,
  isSelected, 
  onClick 
}: EnhancedGoalCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full rounded-3xl border-2 transition-all duration-500 overflow-hidden",
        "hover:scale-[1.02] hover:shadow-[var(--shadow-card-hover)]",
        isSelected
          ? "border-primary shadow-[var(--shadow-card-hover)] scale-[1.02]"
          : "border-border shadow-[var(--shadow-card)] hover:border-primary/50"
      )}
    >
      {/* Hero Image Background */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={heroImage} 
          alt={title}
          className={cn(
            "w-full h-full object-cover object-top transition-all duration-700",
            isSelected ? "scale-110 brightness-110" : "scale-100 brightness-90 group-hover:scale-105 group-hover:brightness-100"
          )}
        />
        <div className={cn(
          "absolute inset-0 transition-all duration-500",
          isSelected 
            ? "bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" 
            : "bg-gradient-to-t from-background/95 via-background/60 to-transparent group-hover:from-primary/80 group-hover:via-primary/40"
        )} />
        
        {/* Icon Badge */}
        <div
          className={cn(
            "absolute top-4 left-4 p-3 rounded-2xl transition-all duration-500",
            isSelected
              ? "bg-white text-primary scale-110 shadow-lg"
              : "bg-white/90 text-foreground group-hover:bg-white group-hover:scale-105"
          )}
        >
          <Icon className="w-6 h-6" />
        </div>

        {/* Selection Indicator with Confetti Effect */}
        {isSelected && (
          <div className="absolute top-4 right-4 animate-scale-in">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-accent animate-pulse" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 text-left">
        <h3 className={cn(
          "text-2xl font-bold mb-2 transition-colors",
          isSelected ? "text-primary" : "text-foreground"
        )}>
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
        
        {/* Benefit Preview */}
        <div className={cn(
          "flex items-start gap-2 p-3 rounded-lg transition-all duration-300",
          isSelected 
            ? "bg-primary/10 border border-primary/20" 
            : "bg-muted/50 border border-transparent"
        )}>
          <Sparkles className={cn(
            "w-4 h-4 mt-0.5 flex-shrink-0",
            isSelected ? "text-primary" : "text-muted-foreground"
          )} />
          <p className={cn(
            "text-xs font-medium",
            isSelected ? "text-primary" : "text-muted-foreground"
          )}>
            {benefit}
          </p>
        </div>
      </div>
    </button>
  );
};
