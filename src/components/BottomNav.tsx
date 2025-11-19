import { NavLink } from "@/components/NavLink";
import { Calendar, TrendingUp, Settings, Dumbbell } from "lucide-react";

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-screen-xl mx-auto flex justify-around items-center h-16 px-4">
        <NavLink
          to="/daily-plan"
          className="flex flex-col items-center gap-1 text-muted-foreground transition-colors"
          activeClassName="text-primary"
        >
          <Dumbbell className="w-6 h-6" />
          <span className="text-xs font-medium">Workout</span>
        </NavLink>
        
        <NavLink
          to="/calendar"
          className="flex flex-col items-center gap-1 text-muted-foreground transition-colors"
          activeClassName="text-primary"
        >
          <Calendar className="w-6 h-6" />
          <span className="text-xs font-medium">Calendar</span>
        </NavLink>
        
        <NavLink
          to="/progress"
          className="flex flex-col items-center gap-1 text-muted-foreground transition-colors"
          activeClassName="text-primary"
        >
          <TrendingUp className="w-6 h-6" />
          <span className="text-xs font-medium">Progress</span>
        </NavLink>
        
        <NavLink
          to="/settings"
          className="flex flex-col items-center gap-1 text-muted-foreground transition-colors"
          activeClassName="text-primary"
        >
          <Settings className="w-6 h-6" />
          <span className="text-xs font-medium">Settings</span>
        </NavLink>
      </div>
    </nav>
  );
};
