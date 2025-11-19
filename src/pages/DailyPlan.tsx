import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GuidedWorkoutCard } from "@/components/GuidedWorkoutCard";
import { CheckInDialog } from "@/components/CheckInDialog";
import { CompletionDialog } from "@/components/CompletionDialog";
import { BottomNav } from "@/components/BottomNav";
import { Sparkles, LogOut, User, ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Workout } from "@/types/workout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

type Goal = "weight-loss" | "muscle-gain" | "endurance";

const goalTitles = {
  "weight-loss": "Weight Loss",
  "muscle-gain": "Muscle Building",
  "endurance": "Endurance",
};

const DailyPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [hasCompletedToday, setHasCompletedToday] = useState(false);
  const [weeklyStreak, setWeeklyStreak] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [nextWorkoutDate, setNextWorkoutDate] = useState<string>("");

  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getFormattedDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getNextWorkoutDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  useEffect(() => {
    // Get goal from navigation state or localStorage
    const stateGoal = location.state?.goal;
    const storedGoal = localStorage.getItem('fitwiz-goal') as Goal;
    
    if (stateGoal) {
      setGoal(stateGoal);
      localStorage.setItem('fitwiz-goal', stateGoal);
    } else if (storedGoal) {
      setGoal(storedGoal);
    } else {
      // No goal found, redirect to home
      navigate('/');
      return;
    }

    // Check if user has completed today's workout
    checkTodayStatus();
  }, [location, navigate, user]);

  const checkTodayStatus = async () => {
    if (!user) return;
    
    const today = getTodayDateString();

    // Check for check-in
    const { data: checkin } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    setHasCheckedIn(!!checkin);

    // Check for completed workout
    const { data: performance } = await supabase
      .from('workout_performance')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .eq('completed', true)
      .single();

    if (performance) {
      setHasCompletedToday(true);
      setNextWorkoutDate(getNextWorkoutDate());
      
      // Calculate weekly and monthly stats
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);

      const { data: weekData } = await supabase
        .from('workout_performance')
        .select('date')
        .eq('user_id', user.id)
        .eq('completed', true)
        .gte('date', weekAgo.toISOString().split('T')[0]);

      const { data: monthData } = await supabase
        .from('workout_performance')
        .select('date')
        .eq('user_id', user.id)
        .eq('completed', true)
        .gte('date', monthAgo.toISOString().split('T')[0]);

      setWeeklyStreak(weekData?.length || 0);
      setMonthlyTotal(monthData?.length || 0);
    }
  };

  const handleCheckInSubmit = async (bodyBattery: number, availableTime: number) => {
    if (!user || !goal) {
      console.error('Missing user or goal:', { user: !!user, goal });
      toast.error("Session error. Please refresh the page.");
      return;
    }

    setIsGenerating(true);
    toast.loading("Creating your personalized workout...", { id: "workout-generation" });

    try {
      // Save check-in
      console.log('Saving check-in:', { bodyBattery, availableTime, goal });
      const { error: checkinError } = await supabase
        .from('daily_checkins')
        .insert({
          user_id: user.id,
          date: getTodayDateString(),
          body_battery: bodyBattery,
          available_time: availableTime
        });

      if (checkinError) {
        console.error('Check-in error:', checkinError);
        throw checkinError;
      }

      // Generate workouts based on check-in data
      console.log('Calling edge function with:', { goal, bodyBattery, availableTime });
      const { data, error } = await supabase.functions.invoke('generate-personalized-workout', {
        body: { 
          goal,
          bodyBattery,
          availableTime
        }
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (data?.workouts && data.workouts.length > 0) {
        console.log('Workouts generated:', data.workouts.length);
        setWorkouts(data.workouts);
        setHasCheckedIn(true);
        toast.success("Your workout plan is ready!", {
          id: "workout-generation",
          description: `${data.workouts.length} personalized workouts based on your energy and time`,
        });
      } else {
        console.error('No workouts in response:', data);
        throw new Error("No workouts generated");
      }
    } catch (error: any) {
      console.error('Error generating workout:', error);
      toast.error("Failed to generate workout plan", {
        id: "workout-generation",
        description: error?.message || "Please try again in a moment.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWorkoutComplete = () => {
    setHasCompletedToday(true);
    setNextWorkoutDate(getNextWorkoutDate());
    setShowCompletion(true);
    checkTodayStatus(); // Refresh stats
  };

  if (!goal) {
    return null;
  }

  const goalTitle = goalTitles[goal];
  const totalDuration = workouts.reduce((sum, workout) => {
    return sum + parseInt(workout.duration);
  }, 0);
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-4 md:p-8">
        {/* Top Navigation */}
        <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Goals
          </Button>
          
          <div className="flex items-center gap-3">
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
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header with Date */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-coral/10 via-teal/10 to-primary/10 rounded-full mb-4">
              <Calendar className="w-4 h-4 text-teal" />
              <span className="text-sm font-semibold">
                {getFormattedDate()}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Daily Workout
            </h1>
            
            {goal && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">
                  {goalTitles[goal]} Goal
                </span>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          {!hasCheckedIn && !hasCompletedToday && (
            <div className="text-center py-12 animate-fade-in">
              <div className="max-w-md mx-auto space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-coral via-teal to-primary flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Ready to train?</h2>
                  <p className="text-muted-foreground">
                    Let's check in and create today's personalized workout plan
                  </p>
                </div>
                <Button
                  onClick={() => setShowCheckIn(true)}
                  disabled={isGenerating}
                  size="lg"
                  className="px-8"
                >
                  Get Workout Plan
                </Button>
              </div>
            </div>
          )}

          {/* Workouts Display */}
          {hasCheckedIn && !hasCompletedToday && workouts.length > 0 && (
            <div className="space-y-4 animate-scale-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  Today's Workouts
                  <span className="text-sm font-normal text-muted-foreground">
                    • {workouts.length} sessions
                  </span>
                </h2>
              </div>
              
              {workouts.map((workout, index) => (
                <div
                  key={workout.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <GuidedWorkoutCard 
                    workout={workout} 
                    onComplete={handleWorkoutComplete}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Completion State */}
          {hasCompletedToday && (
            <div className="text-center py-12 animate-fade-in">
              <div className="max-w-md mx-auto space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-teal to-primary flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">You completed today's workout!</h2>
                  <p className="text-muted-foreground">
                    Your next daily workout plan will be available on
                  </p>
                  <p className="text-lg font-semibold text-primary mt-2">
                    {nextWorkoutDate}
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-r from-coral/5 via-teal/5 to-primary/5 border border-border">
                  <p className="text-sm text-muted-foreground">
                    🔥 Keep up the momentum! Consistency is key to reaching your goals.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <CheckInDialog
        open={showCheckIn}
        onOpenChange={setShowCheckIn}
        onSubmit={handleCheckInSubmit}
      />
      
      <CompletionDialog
        open={showCompletion}
        onOpenChange={setShowCompletion}
        weeklyStreak={weeklyStreak}
        monthlyTotal={monthlyTotal}
      />
      
      <BottomNav />
    </ProtectedRoute>
  );
};

export default DailyPlan;
