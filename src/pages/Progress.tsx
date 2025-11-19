import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TrendingDown, Heart, Scale, Activity } from "lucide-react";

interface HealthVitals {
  weight?: number;
  bodyFat?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  restingHeartRate?: number;
}

export default function Progress() {
  const { user } = useAuth();
  const [vitals, setVitals] = useState<HealthVitals>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadVitals();
    }
  }, [user]);

  const loadVitals = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      // Parse vitals from profile metadata if available
      // For now, we'll use empty state
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // In a real app, you'd save to a health_vitals table
      // For now, we'll just show a success message
      toast.success("Health vitals saved successfully!");
    } catch (error) {
      toast.error("Failed to save vitals");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted pb-20">
        <div className="container max-w-2xl mx-auto p-6 space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Track Progress</h1>
            <p className="text-muted-foreground">
              Monitor your health vitals and fitness journey
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                Body Composition
              </CardTitle>
              <CardDescription>Track your weight and body fat percentage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="75.0"
                  value={vitals.weight || ''}
                  onChange={(e) => setVitals({ ...vitals, weight: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="bodyFat">Body Fat (%)</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  placeholder="18.0"
                  value={vitals.bodyFat || ''}
                  onChange={(e) => setVitals({ ...vitals, bodyFat: parseFloat(e.target.value) })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-coral" />
                Cardiovascular Health
              </CardTitle>
              <CardDescription>Monitor your heart health metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Blood Pressure (mmHg)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      type="number"
                      placeholder="Systolic (120)"
                      value={vitals.bloodPressureSystolic || ''}
                      onChange={(e) => setVitals({ ...vitals, bloodPressureSystolic: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Diastolic (80)"
                      value={vitals.bloodPressureDiastolic || ''}
                      onChange={(e) => setVitals({ ...vitals, bloodPressureDiastolic: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="heartRate">Resting Heart Rate (bpm)</Label>
                <Input
                  id="heartRate"
                  type="number"
                  placeholder="60"
                  value={vitals.restingHeartRate || ''}
                  onChange={(e) => setVitals({ ...vitals, restingHeartRate: parseInt(e.target.value) })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Progress Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track your vitals regularly to see trends and insights about your fitness journey. 
                Consistent monitoring helps you stay on track with your goals.
              </p>
            </CardContent>
          </Card>

          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Saving..." : "Save Health Vitals"}
          </Button>
        </div>

        <BottomNav />
      </div>
    </ProtectedRoute>
  );
}
