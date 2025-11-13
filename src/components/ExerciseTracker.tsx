import { useState } from "react";
import { Exercise, WorkoutLog } from "@/types/workout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dumbbell, Timer, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseTrackerProps {
  exercise: Exercise;
  onLog: (log: WorkoutLog) => void;
  initialLog?: WorkoutLog;
}

export const ExerciseTracker = ({ exercise, onLog, initialLog }: ExerciseTrackerProps) => {
  const [sets, setSets] = useState(initialLog?.actual.sets || exercise.target.sets || 0);
  const [reps, setReps] = useState(initialLog?.actual.reps || exercise.target.reps || 0);
  const [time, setTime] = useState(initialLog?.actual.time || exercise.target.time || 0);
  const [weight, setWeight] = useState(initialLog?.actual.weight || exercise.target.weight || 0);

  const handleChange = () => {
    onLog({
      exerciseId: exercise.id,
      actual: {
        ...(exercise.target.sets && { sets }),
        ...(exercise.target.reps && { reps }),
        ...(exercise.target.time && { time }),
        ...(exercise.target.weight && { weight }),
      },
      completedAt: new Date().toISOString(),
    });
  };

  const getTargetText = () => {
    const parts: string[] = [];
    if (exercise.target.sets) parts.push(`${exercise.target.sets} sets`);
    if (exercise.target.reps) parts.push(`${exercise.target.reps} reps`);
    if (exercise.target.time) parts.push(`${exercise.target.time}s`);
    if (exercise.target.weight) parts.push(`${exercise.target.weight}kg`);
    return parts.join(" × ");
  };

  return (
    <div className="p-4 rounded-xl border border-border bg-card/50 space-y-3">
      {/* Exercise Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-base mb-1">{exercise.name}</h4>
          <p className="text-sm text-muted-foreground">{exercise.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">Target: {getTargetText()}</span>
          </div>
        </div>
        
        {/* Exercise Type Icon */}
        <div className={cn(
          "p-2 rounded-lg",
          exercise.type === "weight" && "bg-coral/10",
          exercise.type === "reps" && "bg-teal/10",
          exercise.type === "time" && "bg-primary/10"
        )}>
          {exercise.type === "weight" || exercise.type === "reps" ? (
            <Dumbbell className={cn(
              "w-5 h-5",
              exercise.type === "weight" && "text-coral",
              exercise.type === "reps" && "text-teal"
            )} />
          ) : (
            <Timer className="w-5 h-5 text-primary" />
          )}
        </div>
      </div>

      {/* Data Entry Fields */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
        {exercise.target.sets !== undefined && (
          <div className="space-y-1.5">
            <Label htmlFor={`sets-${exercise.id}`} className="text-xs text-muted-foreground">
              Sets
            </Label>
            <Input
              id={`sets-${exercise.id}`}
              type="number"
              min="0"
              value={sets}
              onChange={(e) => {
                setSets(Number(e.target.value));
                handleChange();
              }}
              className="h-9 text-center font-semibold"
            />
          </div>
        )}

        {exercise.target.reps !== undefined && (
          <div className="space-y-1.5">
            <Label htmlFor={`reps-${exercise.id}`} className="text-xs text-muted-foreground">
              Reps
            </Label>
            <Input
              id={`reps-${exercise.id}`}
              type="number"
              min="0"
              value={reps}
              onChange={(e) => {
                setReps(Number(e.target.value));
                handleChange();
              }}
              className="h-9 text-center font-semibold"
            />
          </div>
        )}

        {exercise.target.time !== undefined && (
          <div className="space-y-1.5">
            <Label htmlFor={`time-${exercise.id}`} className="text-xs text-muted-foreground">
              Time (sec)
            </Label>
            <Input
              id={`time-${exercise.id}`}
              type="number"
              min="0"
              value={time}
              onChange={(e) => {
                setTime(Number(e.target.value));
                handleChange();
              }}
              className="h-9 text-center font-semibold"
            />
          </div>
        )}

        {exercise.target.weight !== undefined && (
          <div className="space-y-1.5">
            <Label htmlFor={`weight-${exercise.id}`} className="text-xs text-muted-foreground">
              Weight (kg)
            </Label>
            <Input
              id={`weight-${exercise.id}`}
              type="number"
              min="0"
              step="0.5"
              value={weight}
              onChange={(e) => {
                setWeight(Number(e.target.value));
                handleChange();
              }}
              className="h-9 text-center font-semibold"
            />
          </div>
        )}
      </div>
    </div>
  );
};
