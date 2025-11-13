import { Exercise, WorkoutPerformance } from "@/types/workout";

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

/**
 * Store workout performance in localStorage
 */
export function saveWorkoutPerformance(performance: WorkoutPerformance): void {
  const key = `fitwiz-performance-${performance.date}`;
  const existingData = localStorage.getItem("fitwiz-all-performances");
  const allPerformances: WorkoutPerformance[] = existingData
    ? JSON.parse(existingData)
    : [];

  // Remove any existing entry for the same workout on the same date
  const filtered = allPerformances.filter(
    (p) => !(p.workoutId === performance.workoutId && p.date === performance.date)
  );

  filtered.push(performance);
  localStorage.setItem("fitwiz-all-performances", JSON.stringify(filtered));
  localStorage.setItem(key, JSON.stringify(performance));
}

/**
 * Get previous performance for a specific workout
 */
export function getPreviousPerformance(
  workoutId: string
): WorkoutPerformance | undefined {
  const existingData = localStorage.getItem("fitwiz-all-performances");
  if (!existingData) return undefined;

  const allPerformances: WorkoutPerformance[] = JSON.parse(existingData);
  
  // Get the most recent completed performance for this workout
  const performances = allPerformances
    .filter((p) => p.workoutId === workoutId && p.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return performances[0];
}

/**
 * Get today's date string
 */
export function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}
