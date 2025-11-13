import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { WorkoutCard } from "@/components/WorkoutCard";
import { Sparkles } from "lucide-react";

type Goal = "weight-loss" | "muscle-gain" | "endurance";

const workoutsByGoal = {
  "weight-loss": [
    {
      name: "Cardio Blast",
      duration: "30 min",
      description: "High-intensity cardio session designed to maximize calorie burn. Get your heart pumping with dynamic movements that torch fat fast.",
      accentColor: "coral" as const,
    },
    {
      name: "HIIT Core Burn",
      duration: "20 min",
      description: "Explosive core exercises that ignite fat loss. Quick, intense bursts targeting your midsection for maximum definition.",
      accentColor: "teal" as const,
    },
    {
      name: "Fat-Burning Yoga",
      duration: "25 min",
      description: "Active yoga flows that combine mindfulness with calorie burn. Stretch, strengthen, and sweat your way to your goals.",
      accentColor: "primary" as const,
    },
  ],
  "muscle-gain": [
    {
      name: "Upper Strength Circuit",
      duration: "45 min",
      description: "Progressive resistance training targeting chest, back, and shoulders. Build power and size with compound movements.",
      accentColor: "coral" as const,
    },
    {
      name: "Power Push",
      duration: "35 min",
      description: "Explosive push exercises designed for muscle growth. Heavy compound lifts that trigger hypertrophy and strength gains.",
      accentColor: "teal" as const,
    },
    {
      name: "Leg Day Build",
      duration: "40 min",
      description: "Lower body strength training with progressive overload. Squats, lunges, and deadlifts to build massive leg strength.",
      accentColor: "primary" as const,
    },
  ],
  "endurance": [
    {
      name: "Tempo Run",
      duration: "40 min",
      description: "Steady-state running at a challenging but sustainable pace. Build aerobic capacity and mental toughness.",
      accentColor: "coral" as const,
    },
    {
      name: "Cycling Stamina",
      duration: "35 min",
      description: "Long-duration cycling session to boost cardiovascular endurance. Maintain consistent effort for maximum stamina gains.",
      accentColor: "teal" as const,
    },
    {
      name: "Full-Body Mobility Flow",
      duration: "30 min",
      description: "Dynamic stretching and mobility work to enhance range of motion. Keep your body resilient and ready for long efforts.",
      accentColor: "primary" as const,
    },
  ],
};

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
              key={workout.name}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <WorkoutCard {...workout} />
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
