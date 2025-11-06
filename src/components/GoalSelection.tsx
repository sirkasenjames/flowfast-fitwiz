import { useState } from "react";
import { Flame, Dumbbell, Heart } from "lucide-react";
import { GoalCard } from "./GoalCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Goal = "weight-loss" | "muscle-gain" | "endurance" | null;

const goals = [
  {
    id: "weight-loss" as const,
    icon: Flame,
    title: "Weight Loss",
    description: "Burn calories and shed pounds with targeted workouts",
  },
  {
    id: "muscle-gain" as const,
    icon: Dumbbell,
    title: "Muscle Gain",
    description: "Build strength and increase muscle mass effectively",
  },
  {
    id: "endurance" as const,
    icon: Heart,
    title: "Endurance",
    description: "Boost stamina and cardiovascular performance",
  },
];

export const GoalSelection = () => {
  const [selectedGoal, setSelectedGoal] = useState<Goal>(null);

  const handleContinue = () => {
    if (!selectedGoal) {
      toast.error("Please select a goal to continue");
      return;
    }
    
    const goalTitle = goals.find(g => g.id === selectedGoal)?.title;
    toast.success(`Great choice! Let's start your ${goalTitle} journey!`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Choose Your Fitness Goal
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the goal that aligns with your fitness journey. We'll personalize your experience to help you achieve it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              icon={goal.icon}
              title={goal.title}
              description={goal.description}
              isSelected={selectedGoal === goal.id}
              onClick={() => setSelectedGoal(goal.id)}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedGoal}
            size="lg"
            className="px-12 py-6 text-lg font-semibold rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};
