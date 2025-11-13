import { useState, useEffect } from "react";
import { Workout, WorkoutLog, WorkoutPerformance } from "@/types/workout";
import { Button } from "@/components/ui/button";
import { ExerciseTracker } from "@/components/ExerciseTracker";
import { cn } from "@/lib/utils";
import { Clock, ChevronDown, ChevronUp, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  saveWorkoutPerformance,
  getPreviousPerformance,
  getTodayDateString,
  adaptWorkout,
} from "@/utils/workoutProgression";

interface GuidedWorkoutCardProps {
  workout: Workout;
}

export const GuidedWorkoutCard = ({ workout }: GuidedWorkoutCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [exerciseLogs, setExerciseLogs] = useState<WorkoutLog[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [adaptedExercises, setAdaptedExercises] = useState(workout.exercises);

  useEffect(() => {
    // Check if this workout was already completed today
    const todayKey = `fitwiz-performance-${getTodayDateString()}`;
    const todayPerformance = localStorage.getItem(todayKey);
    
    if (todayPerformance) {
      const performance: WorkoutPerformance = JSON.parse(todayPerformance);
      if (performance.workoutId === workout.id && performance.completed) {
        setIsCompleted(true);
        setExerciseLogs(performance.exercises);
      }
    }

    // Adapt workout based on previous performance
    const previousPerformance = getPreviousPerformance(workout.id);
    if (previousPerformance) {
      const adapted = adaptWorkout(workout.exercises, previousPerformance);
      setAdaptedExercises(adapted);
    }
  }, [workout]);

  const handleStartWorkout = () => {
    setIsExpanded(true);
    toast.success("Let's crush this workout!", {
      description: `${workout.exercises.length} exercises ahead. You've got this! 💪`,
      icon: "🔥",
    });
  };

  const handleExerciseLog = (log: WorkoutLog) => {
    setExerciseLogs((prev) => {
      const filtered = prev.filter((l) => l.exerciseId !== log.exerciseId);
      return [...filtered, log];
    });
  };

  const handleCompleteWorkout = () => {
    const performance: WorkoutPerformance = {
      workoutId: workout.id,
      date: getTodayDateString(),
      exercises: exerciseLogs,
      totalDuration: parseInt(workout.duration),
      completed: true,
    };

    saveWorkoutPerformance(performance);
    setIsCompleted(true);
    setIsExpanded(false);

    // Calculate completion percentage for motivation
    const completionRate =
      (exerciseLogs.length / workout.exercises.length) * 100;
    
    const messages = [
      "You crushed today's circuit! Let's keep that streak going. 🔥",
      "Amazing work! Your body is already getting stronger. 💪",
      "That's how champions train! See you tomorrow. ⭐",
      "Incredible effort! You're one step closer to your goal. 🎯",
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    toast.success(randomMessage, {
      description: `${exerciseLogs.length}/${workout.exercises.length} exercises logged (${Math.round(completionRate)}%)`,
      icon: "🎉",
      duration: 5000,
    });
  };

  const colorClasses = {
    coral: "border-coral hover:shadow-coral/20 data-[completed=true]:border-coral/50",
    teal: "border-teal hover:shadow-teal/20 data-[completed=true]:border-teal/50",
    primary: "border-primary hover:shadow-primary/20 data-[completed=true]:border-primary/50",
  };

  const badgeColorClasses = {
    coral: "bg-coral/10 text-coral",
    teal: "bg-teal/10 text-teal",
    primary: "bg-primary/10 text-primary",
  };

  const allExercisesLogged = exerciseLogs.length === workout.exercises.length;
  const canComplete = exerciseLogs.length > 0;

  return (
    <div
      data-completed={isCompleted}
      className={cn(
        "group relative rounded-2xl border-2 bg-card transition-all duration-300",
        colorClasses[workout.accentColor],
        isCompleted && "opacity-60",
        isExpanded && "shadow-2xl"
      )}
    >
      {/* Completion overlay effect */}
      {isCompleted && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-transparent rounded-2xl pointer-events-none" />
      )}

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3
              className={cn(
                "text-xl font-bold mb-2 transition-all duration-300",
                isCompleted && "line-through opacity-50"
              )}
            >
              {workout.name}
            </h3>
            <div
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
                badgeColorClasses[workout.accentColor]
              )}
            >
              <Clock className="w-3.5 h-3.5" />
              {workout.duration}
            </div>
          </div>

          {/* Status Icon */}
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-primary" />
          ) : (
            <Sparkles
              className={cn(
                "w-5 h-5 transition-all duration-300",
                "group-hover:scale-110 group-hover:rotate-12",
                workout.accentColor === "coral" && "text-coral",
                workout.accentColor === "teal" && "text-teal",
                workout.accentColor === "primary" && "text-primary"
              )}
            />
          )}
        </div>

        {/* Description */}
        <p
          className={cn(
            "text-muted-foreground leading-relaxed mb-4 transition-opacity duration-300",
            isCompleted && "opacity-40"
          )}
        >
          {workout.description}
        </p>

        {/* Action Button */}
        {!isCompleted && !isExpanded && (
          <Button
            onClick={handleStartWorkout}
            className={cn(
              "w-full font-semibold transition-all duration-300",
              "hover:scale-[1.02]"
            )}
            size="lg"
          >
            Start Workout
            <ChevronDown className="ml-2 w-4 h-4" />
          </Button>
        )}

        {/* Expanded Exercise View */}
        {isExpanded && !isCompleted && (
          <div className="mt-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold">Today's Circuit</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronUp className="w-4 h-4 mr-1" />
                Collapse
              </Button>
            </div>

            {/* Exercise List */}
            <div className="space-y-3">
              {adaptedExercises.map((exercise, index) => (
                <ExerciseTracker
                  key={exercise.id}
                  exercise={exercise}
                  onLog={handleExerciseLog}
                  initialLog={exerciseLogs.find(
                    (log) => log.exerciseId === exercise.id
                  )}
                />
              ))}
            </div>

            {/* Complete Button */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">
                  Progress: {exerciseLogs.length}/{workout.exercises.length} exercises logged
                </span>
                {allExercisesLogged && (
                  <span className="text-sm font-semibold text-primary">
                    All exercises logged! 🎉
                  </span>
                )}
              </div>
              <Button
                onClick={handleCompleteWorkout}
                disabled={!canComplete}
                className={cn(
                  "w-full font-semibold transition-all duration-300",
                  "hover:scale-[1.02]",
                  allExercisesLogged && "bg-gradient-to-r from-primary via-secondary to-accent"
                )}
                size="lg"
              >
                {allExercisesLogged ? "Complete Workout 🎉" : "Complete Workout"}
              </Button>
            </div>
          </div>
        )}

        {/* Completed State Button */}
        {isCompleted && (
          <Button
            disabled
            className="w-full font-semibold"
            size="lg"
            variant="outline"
          >
            <CheckCircle2 className="mr-2 w-4 h-4" />
            Workout Completed
          </Button>
        )}
      </div>
    </div>
  );
};
