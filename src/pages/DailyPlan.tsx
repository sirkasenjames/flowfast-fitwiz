import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GuidedWorkoutCard } from "@/components/GuidedWorkoutCard";
import { Sparkles } from "lucide-react";
import { workoutsByGoal } from "@/data/workouts";

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

  useEffect(() => {
    // Get goal from navigation state or localStorage
    const stateGoal = location.state?.goal;
    const storedGoal = localStorage.getItem('fitwiz-goal') as Goal;
    
    if (stateGoal) {
      setGoal(stateGoal);
    } else if (storedGoal) {
      setGoal(storedGoal);
    } else {
      // No goal found, redirect to home
      navigate('/');
    }
  }, [location, navigate]);

  if (!goal) {
    return null;
  }

  const workouts = workoutsByGoal[goal];
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
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Today's Workouts
            <span className="text-sm font-normal text-muted-foreground">
              • 3 sessions • {totalDuration} min total
            </span>
          </h2>
          
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
