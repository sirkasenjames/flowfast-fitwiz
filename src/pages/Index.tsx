import { ImprovedGoalSelection } from "@/components/ImprovedGoalSelection";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User } from "lucide-react";

const Index = () => {
  const { user, signOut } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen relative">
        {/* User header */}
        <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{user?.email}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        <ImprovedGoalSelection />
      </div>
    </ProtectedRoute>
  );
};

export default Index;
