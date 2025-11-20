import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, Dumbbell, Heart, ArrowRight } from "lucide-react";
import { EnhancedGoalCard } from "./EnhancedGoalCard";
import { FrequencySelector } from "./FrequencySelector";
import { ProgressPreview } from "./ProgressPreview";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import weightLossHero from "@/assets/weight-loss-hero.jpg";
import muscleGainHero from "@/assets/muscle-gain-hero.jpg";
import enduranceHero from "@/assets/endurance-hero.jpg";

type Goal = "weight-loss" | "muscle-gain" | "endurance" | null;

const goals = [
  {
    id: "weight-loss" as const,
    icon: Flame,
    title: "Weight Loss",
    description: "Burn calories and shed pounds with targeted workouts",
    benefit: "Achieve your dream body with proven fat-burning techniques",
    heroImage: weightLossHero,
  },
  {
    id: "muscle-gain" as const,
    icon: Dumbbell,
    title: "Muscle Gain",
    description: "Build strength and increase muscle mass effectively",
    benefit: "Transform your physique with progressive strength training",
    heroImage: muscleGainHero,
  },
  {
    id: "endurance" as const,
    icon: Heart,
    title: "Endurance",
    description: "Boost stamina and cardiovascular performance",
    benefit: "Unlock limitless energy and outlast any challenge",
    heroImage: enduranceHero,
  },
];

export const ImprovedGoalSelection = () => {
  const navigate = useNavigate();
  const [selectedGoal, setSelectedGoal] = useState<Goal>(null);
  const [selectedFrequency, setSelectedFrequency] = useState<number | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const handleGoalSelect = (goalId: Goal) => {
    setSelectedGoal(goalId);
    // Auto-advance to frequency after short delay
    setTimeout(() => setStep(2), 600);
  };

  const handleContinue = () => {
    if (!selectedGoal || !selectedFrequency) return;
    
    const goalTitle = goals.find(g => g.id === selectedGoal)?.title;
    toast.success(`🎉 Amazing! Your ${goalTitle} journey starts now!`, {
      description: `${selectedFrequency}x per week - Let's create your account!`,
    });
    
    // Save goal and frequency, then navigate to signup
    localStorage.setItem('fitwiz-goal', selectedGoal);
    localStorage.setItem('fitwiz-frequency', selectedFrequency.toString());
    
    setTimeout(() => {
      navigate("/signup", { state: { goal: selectedGoal, frequency: selectedFrequency } });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary">Step {step} of 2</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
            {step === 1 ? "Choose Your Path" : "How Often Will You Train?"}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {step === 1 
              ? "Choose your goal, then choose your frequency. Start your journey and create an account to get your first daily workout." 
              : "Consistency beats intensity. Pick a schedule you can maintain."}
          </p>
        </div>

        {/* Goal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          {goals.map((goal) => (
            <EnhancedGoalCard
              key={goal.id}
              icon={goal.icon}
              title={goal.title}
              description={goal.description}
              benefit={goal.benefit}
              heroImage={goal.heroImage}
              isSelected={selectedGoal === goal.id}
              onClick={() => handleGoalSelect(goal.id)}
            />
          ))}
        </div>

        {/* Frequency Selector */}
        <div className={cn(
          "transition-all duration-500 mb-8",
          step === 2 ? "opacity-100 animate-fade-in" : "opacity-0 pointer-events-none absolute"
        )}>
          <FrequencySelector
            selectedFrequency={selectedFrequency}
            onSelect={setSelectedFrequency}
          />
        </div>

        {/* Progress Preview */}
        {selectedGoal && selectedFrequency && (
          <div className="mb-8 max-w-2xl mx-auto">
            <ProgressPreview goal={selectedGoal} frequency={selectedFrequency} />
          </div>
        )}

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedGoal || !selectedFrequency}
            size="lg"
            className={cn(
              "px-12 py-6 text-lg font-bold rounded-full transition-all duration-300 shadow-xl",
              "bg-gradient-to-r from-primary via-secondary to-accent",
              "hover:shadow-2xl hover:scale-105",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              "group"
            )}
          >
            Start Your Journey
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Social Proof */}
        <p className="text-center text-sm text-muted-foreground mt-8 animate-fade-in">
          ⭐️ Join 250,000+ members who transformed their lives this year
        </p>
      </div>
    </div>
  );
};
