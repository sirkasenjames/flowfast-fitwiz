import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GuidedWorkoutCard } from "@/components/GuidedWorkoutCard";
import { Sparkles, Wand2 } from "lucide-react";
import { workoutsByGoal } from "@/data/workouts";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Workout } from "@/types/workout";

type Goal = "weight-loss" | "muscle-gain" | "endurance";

const goalTitles = {
  "weight-loss": "Weight Loss",
  "muscle-gain": "Muscle Building",
  "endurance": "Endurance",
};

const DailyPlan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIWorkouts, setShowAIWorkouts] = useState(false);

  useEffect(() => {
    // Get goal from navigation state or localStorage
    const stateGoal = location.state?.goal;
    const storedGoal = localStorage.getItem('fitwiz-goal') as Goal;
    
    if (stateGoal) {
      setGoal(stateGoal);
      setWorkouts(workoutsByGoal[stateGoal]);
    } else if (storedGoal) {
      setGoal(storedGoal);
      setWorkouts(workoutsByGoal[storedGoal]);
    } else {
      // No goal found, redirect to home
      navigate('/');
    }
  }, [location, navigate]);

  const generateAIRecommendations = async () => {
    if (!goal) return;
    
    setIsGenerating(true);
    toast.loading("AI is crafting your personalized workouts...", { id: "ai-generation" });

    try {
      const { data, error } = await supabase.functions.invoke('generate-workout-recommendations', {
        body: { goal }
      });

      if (error) throw error;

      if (data?.workouts && data.workouts.length > 0) {
        setWorkouts(data.workouts);
        setShowAIWorkouts(true);
        toast.success("AI workouts generated!", {
          id: "ai-generation",
          description: `${data.workouts.length} personalized workouts ready for you! 🎯`,
          icon: "✨",
        });
      } else {
        throw new Error("No workouts generated");
      }
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      toast.error("Failed to generate AI recommendations", {
        id: "ai-generation",
        description: "Please try again in a moment.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!goal) {
    return null;
  }

  const goalTitle = goalTitles[goal];
  const totalDuration = workouts.reduce((sum, workout) => {
    return sum + parseInt(workout.duration);
  }, 0);
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Motivational Quote Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-coral/10 via-teal/10 to-primary/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-coral" />
            <span className="text-sm font-semibold bg-gradient-to-r from-coral via-teal to-primary bg-clip-text text-transparent">
              AI-Personalized for {goalTitle}
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Progress, not perfection.
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your AI companion has crafted today's plan to accelerate your {goalTitle.toLowerCase()} journey. 
            Every workout brings you closer to your goals.
          </p>
        </div>

        {/* Workout Cards */}
        <div className="space-y-4 animate-scale-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {showAIWorkouts ? "AI-Generated Workouts" : "Today's Workouts"}
              <span className="text-sm font-normal text-muted-foreground">
                • {workouts.length} sessions • {totalDuration} min total
              </span>
            </h2>
            <Button
              onClick={generateAIRecommendations}
              disabled={isGenerating}
              className="font-semibold"
              variant="outline"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              {isGenerating ? "Generating..." : "Generate AI Plan"}
            </Button>
          </div>
          
          {workouts.map((workout, index) => (
            <div
              key={workout.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <GuidedWorkoutCard workout={workout} />
            </div>
          ))}
        </div>

        {/* Motivational Footer */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-coral/5 via-teal/5 to-primary/5 border border-border text-center animate-fade-in">
          <p className="text-sm text-muted-foreground">
            💪 Remember: Consistency compounds. Every completed workout builds momentum toward your transformation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyPlan;
