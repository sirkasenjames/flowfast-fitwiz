import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Target, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Goal = "weight-loss" | "muscle-gain" | "endurance";

const goalTitles: Record<Goal, string> = {
  "weight-loss": "Weight Loss",
  "muscle-gain": "Muscle Gain",
  "endurance": "Build Endurance",
};

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [goal, setGoal] = useState<Goal>("weight-loss");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadGoal();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setFullName(data.full_name || "");
      setEmail(data.email || user.email || "");
    }
  };

  const loadGoal = () => {
    const storedGoal = localStorage.getItem('userGoal') as Goal;
    if (storedGoal) {
      setGoal(storedGoal);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          email: email,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGoal = () => {
    localStorage.setItem('userGoal', goal);
    toast.success("Fitness goal updated!");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted pb-20">
        <div className="container max-w-2xl mx-auto p-6 space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your profile and preferences
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleSaveProfile} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Saving..." : "Save Profile"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-coral" />
                Fitness Goal
              </CardTitle>
              <CardDescription>Change your primary fitness goal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="goal">Current Goal</Label>
                <Select value={goal} onValueChange={(value) => setGoal(value as Goal)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight-loss">{goalTitles["weight-loss"]}</SelectItem>
                    <SelectItem value="muscle-gain">{goalTitles["muscle-gain"]}</SelectItem>
                    <SelectItem value="endurance">{goalTitles["endurance"]}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleSaveGoal}
                className="w-full"
              >
                Update Goal
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Sign Out</CardTitle>
              <CardDescription>End your current session</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive"
                onClick={signOut}
                className="w-full gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>

        <BottomNav />
      </div>
    </ProtectedRoute>
  );
}
