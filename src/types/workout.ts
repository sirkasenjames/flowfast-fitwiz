export interface Exercise {
  id: string;
  name: string;
  type: "reps" | "time" | "weight";
  target: {
    sets?: number;
    reps?: number;
    time?: number; // in seconds
    weight?: number; // in kg or lbs
  };
  description: string;
  videoUrl?: string; // For future animated demos
}

export interface WorkoutLog {
  exerciseId: string;
  actual: {
    sets?: number;
    reps?: number;
    time?: number;
    weight?: number;
  };
  completedAt: string;
}

export interface WorkoutPerformance {
  workoutId: string;
  date: string;
  exercises: WorkoutLog[];
  totalDuration: number;
  completed: boolean;
}

export interface Workout {
  id: string;
  name: string;
  duration: string;
  description: string;
  accentColor: "coral" | "teal" | "primary";
  exercises: Exercise[];
  goal: "weight-loss" | "muscle-gain" | "endurance";
}
