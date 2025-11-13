import { WorkoutCard } from "@/components/WorkoutCard";
import { Sparkles } from "lucide-react";

const workouts = [
  {
    name: "Cardio Blast",
    duration: "30 min",
    description: "High-intensity cardio session designed to maximize calorie burn. Get your heart pumping with dynamic movements that torch fat fast.",
    accentColor: "coral" as const,
  },
  {
    name: "Core Flow",
    duration: "20 min",
    description: "Strengthen your core with focused exercises that build stability and definition. Perfect for targeting those hard-to-reach muscles.",
    accentColor: "teal" as const,
  },
  {
    name: "Fat-Burning Yoga",
    duration: "25 min",
    description: "Active yoga flows that combine mindfulness with calorie burn. Stretch, strengthen, and sweat your way to your goals.",
    accentColor: "primary" as const,
  },
];

const DailyPlan = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Motivational Quote Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-coral/10 via-teal/10 to-primary/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-coral" />
            <span className="text-sm font-semibold bg-gradient-to-r from-coral via-teal to-primary bg-clip-text text-transparent">
              AI-Personalized for Weight Loss
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Progress, not perfection.
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your AI companion has crafted today's plan to accelerate your weight loss journey. 
            Every workout brings you closer to your goals.
          </p>
        </div>

        {/* Workout Cards */}
        <div className="space-y-4 animate-scale-in">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Today's Workouts
            <span className="text-sm font-normal text-muted-foreground">
              • 3 sessions • 75 min total
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
