import { Exercise, WorkoutPerformance, WorkoutLog } from "@/types/workout";
import { supabase } from "@/integrations/supabase/client";

const PROGRESSION_INCREMENT = 1.1; // 10% increase
const PROGRESSION_DECREMENT = 0.9; // 10% decrease
const PERFORMANCE_THRESHOLD_HIGH = 1.2; // User performed 20% above target
const PERFORMANCE_THRESHOLD_LOW = 0.8; // User performed 20% below target

export const getTodayDateString = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const saveWorkoutPerformance = async (
  performance: WorkoutPerformance
): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("No user found");
      return;
    }

    const { error } = await supabase
      .from("workout_performance")
      .insert([{
        user_id: user.id,
        workout_id: performance.workoutId,
        date: performance.date,
        exercises: performance.exercises as any,
        total_duration: performance.totalDuration,
        completed: performance.completed,
      }]);

    if (error) throw error;
  } catch (error) {
    console.error("Error saving workout performance:", error);
  }
};

export const getPreviousPerformance = async (
  workoutId: string
): Promise<WorkoutPerformance | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("workout_performance")
      .select("*")
      .eq("user_id", user.id)
      .eq("workout_id", workoutId)
      .eq("completed", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;

    return {
      workoutId: data.workout_id,
      date: data.date,
      exercises: data.exercises as unknown as WorkoutLog[],
      totalDuration: data.total_duration,
      completed: data.completed,
    };
  } catch (error) {
    console.error("Error fetching previous performance:", error);
    return null;
  }
};

/**
 * Adapts workout difficulty based on previous performance
 * Returns modified exercises with progressive overload
 */
export function adaptWorkout(
  exercises: Exercise[],
  previousPerformance?: WorkoutPerformance
): Exercise[] {
  if (!previousPerformance) {
    return exercises;
  }

  return exercises.map((exercise) => {
    const log = previousPerformance.exercises.find(
      (e) => e.exerciseId === exercise.id
    );

    if (!log) return exercise;

    // Calculate performance ratio
    const performanceRatio = calculatePerformanceRatio(exercise, log);

    // Progressive overload logic
    if (performanceRatio >= 1.0) {
      // User met or exceeded target - increase difficulty
      return increaseExerciseDifficulty(exercise, performanceRatio);
    } else if (performanceRatio < 0.7) {
      // User struggled - decrease difficulty slightly
      return decreaseExerciseDifficulty(exercise);
    }

    return exercise;
  });
}

function calculatePerformanceRatio(
  exercise: Exercise,
  log: { actual: any }
): number {
  switch (exercise.type) {
    case "reps":
      const targetReps = (exercise.target.sets || 1) * (exercise.target.reps || 1);
      const actualReps = (log.actual.sets || 1) * (log.actual.reps || 1);
      return actualReps / targetReps;

    case "time":
      return (log.actual.time || 0) / (exercise.target.time || 1);

    case "weight":
      const targetVolume =
        (exercise.target.sets || 1) *
        (exercise.target.reps || 1) *
        (exercise.target.weight || 1);
      const actualVolume =
        (log.actual.sets || 1) *
        (log.actual.reps || 1) *
        (log.actual.weight || 1);
      return actualVolume / targetVolume;

    default:
      return 1;
  }
}

function increaseExerciseDifficulty(
  exercise: Exercise,
  performanceRatio: number
): Exercise {
  const increaseRate = performanceRatio >= 1.2 ? 1.15 : 1.1; // 15% or 10% increase

  switch (exercise.type) {
    case "reps":
      return {
        ...exercise,
        target: {
          ...exercise.target,
          reps: Math.ceil((exercise.target.reps || 0) * increaseRate),
        },
      };

    case "time":
      return {
        ...exercise,
        target: {
          ...exercise.target,
          time: Math.ceil((exercise.target.time || 0) * increaseRate),
        },
      };

    case "weight":
      return {
        ...exercise,
        target: {
          ...exercise.target,
          weight: Math.round(((exercise.target.weight || 0) * increaseRate) * 2) / 2, // Round to nearest 0.5
        },
      };

    default:
      return exercise;
  }
}

function decreaseExerciseDifficulty(exercise: Exercise): Exercise {
  const decreaseRate = 0.9; // 10% decrease

  switch (exercise.type) {
    case "reps":
      return {
        ...exercise,
        target: {
          ...exercise.target,
          reps: Math.max(1, Math.floor((exercise.target.reps || 0) * decreaseRate)),
        },
      };

    case "time":
      return {
        ...exercise,
        target: {
          ...exercise.target,
          time: Math.max(10, Math.floor((exercise.target.time || 0) * decreaseRate)),
        },
      };

    case "weight":
      return {
        ...exercise,
        target: {
          ...exercise.target,
          weight: Math.max(2.5, Math.round(((exercise.target.weight || 0) * decreaseRate) * 2) / 2),
        },
      };

    default:
      return exercise;
  }
}
