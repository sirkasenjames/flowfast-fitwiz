import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

export const GoalCard = ({ icon: Icon, title, description, isSelected, onClick }: GoalCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full p-8 rounded-2xl border-2 transition-all duration-300",
        "hover:scale-105 hover:shadow-[var(--shadow-card-hover)]",
        "bg-gradient-to-br from-card to-muted/30",
        isSelected
          ? "border-primary shadow-[var(--shadow-card-hover)] scale-105"
          : "border-border shadow-[var(--shadow-card)] hover:border-primary/50"
      )}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className={cn(
            "p-4 rounded-2xl transition-all duration-300",
            isSelected
              ? "bg-gradient-to-br from-primary to-secondary text-primary-foreground scale-110"
              : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
          )}
        >
          <Icon className="w-8 h-8" />
        </div>
        <div>
          <h3 className={cn(
            "text-xl font-bold mb-2 transition-colors",
            isSelected ? "text-primary" : "text-foreground"
          )}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {isSelected && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
};
