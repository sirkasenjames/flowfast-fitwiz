import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Check, Dumbbell, Settings } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function Calendar() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [completedDates, setCompletedDates] = useState<Set<string>>(new Set());
  const [workoutFrequency, setWorkoutFrequency] = useState(3);
  const [preferredDays, setPreferredDays] = useState<number[]>([1, 3, 5]); // Mon, Wed, Fri
  const [randomize, setRandomize] = useState(false);

  useEffect(() => {
    if (user) {
      loadCalendarSettings();
      fetchCompletedWorkouts();
    }
  }, [user, currentDate]);

  const loadCalendarSettings = () => {
    const frequency = localStorage.getItem('workoutFrequency');
    if (frequency) setWorkoutFrequency(parseInt(frequency));

    const days = localStorage.getItem('preferredWorkoutDays');
    if (days) {
      setPreferredDays(JSON.parse(days));
    } else {
      // Default: Mon, Wed, Fri for 3x/week
      const defaultDays = getDefaultDays(parseInt(frequency || '3'));
      setPreferredDays(defaultDays);
    }

    const shouldRandomize = localStorage.getItem('randomizeWorkoutDays');
    if (shouldRandomize) setRandomize(shouldRandomize === 'true');
  };

  const getDefaultDays = (frequency: number): number[] => {
    const patterns: { [key: number]: number[] } = {
      2: [1, 4], // Mon, Thu
      3: [1, 3, 5], // Mon, Wed, Fri
      4: [1, 2, 4, 5], // Mon, Tue, Thu, Fri
      5: [1, 2, 3, 4, 5], // Mon-Fri
      6: [0, 1, 2, 3, 4, 5], // Sun-Fri
    };
    return patterns[frequency] || patterns[3];
  };

  const fetchCompletedWorkouts = async () => {
    if (!user) return;

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const { data } = await supabase
      .from('workout_performance')
      .select('date')
      .eq('user_id', user.id)
      .eq('completed', true)
      .gte('date', startOfMonth.toISOString().split('T')[0])
      .lte('date', endOfMonth.toISOString().split('T')[0]);

    if (data) {
      setCompletedDates(new Set(data.map(w => w.date)));
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isCompleted = (day: number | null) => {
    if (!day) return false;
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return completedDates.has(dateStr);
  };

  const isFuturePlanned = (day: number | null) => {
    if (!day) return false;
    const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dateObj <= today) return false;

    const dayOfWeek = dateObj.getDay();
    
    if (randomize && workoutFrequency < 6) {
      // Generate consistent random days for each week
      const weekStart = new Date(dateObj);
      weekStart.setDate(dateObj.getDate() - dateObj.getDay());
      const seed = weekStart.getTime();
      const randomDays = generateRandomDays(seed, workoutFrequency);
      return randomDays.includes(dayOfWeek);
    }
    
    return preferredDays.includes(dayOfWeek);
  };

  const generateRandomDays = (seed: number, count: number): number[] => {
    const days: number[] = [];
    let random = seed;
    const available = [0, 1, 2, 3, 4, 5, 6];
    
    for (let i = 0; i < count && available.length > 0; i++) {
      random = (random * 9301 + 49297) % 233280;
      const index = random % available.length;
      days.push(available[index]);
      available.splice(index, 1);
    }
    
    return days.sort((a, b) => a - b);
  };

  const togglePreferredDay = (dayIndex: number) => {
    setPreferredDays(prev => {
      if (prev.includes(dayIndex)) {
        return prev.filter(d => d !== dayIndex);
      } else {
        return [...prev, dayIndex].sort((a, b) => a - b);
      }
    });
  };

  const saveCalendarSettings = () => {
    localStorage.setItem('preferredWorkoutDays', JSON.stringify(preferredDays));
    localStorage.setItem('randomizeWorkoutDays', randomize.toString());
    toast.success("Calendar settings saved!");
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const days = getDaysInMonth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted pb-20">
        <div className="container max-w-2xl mx-auto p-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" size="icon" onClick={previousMonth}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              
              <h1 className="text-2xl font-bold">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h1>
              
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {DAYS.map(day => (
                <div key={day} className="text-center text-sm font-semibold text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`
                    aspect-square flex items-center justify-center rounded-lg relative
                    ${day ? 'bg-muted/50' : ''}
                    ${isToday(day) ? 'ring-2 ring-primary' : ''}
                  `}
                >
                  {day && (
                    <>
                      <span className={`text-sm ${isToday(day) ? 'font-bold' : ''}`}>
                        {day}
                      </span>
                      {isCompleted(day) && (
                        <div className="absolute top-1 right-1">
                          <Check className="w-4 h-4 text-teal" />
                        </div>
                      )}
                      {isFuturePlanned(day) && !isCompleted(day) && (
                        <div className="absolute top-1 right-1">
                          <Dumbbell className="w-4 h-4 text-primary" />
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <div className="mt-6 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded flex items-center justify-center bg-muted">
                <Check className="w-3 h-3 text-teal" />
              </div>
              <span>Workout Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded flex items-center justify-center bg-muted">
                <Dumbbell className="w-3 h-3 text-primary" />
              </div>
              <span>Planned Workout</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded ring-2 ring-primary bg-muted" />
              <span>Today</span>
            </div>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Calendar Settings
              </CardTitle>
              <CardDescription>
                Customize your workout schedule ({workoutFrequency}x per week)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {workoutFrequency < 6 && (
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="randomize">Randomize Workout Days</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically vary workout days each week
                    </p>
                  </div>
                  <Switch
                    id="randomize"
                    checked={randomize}
                    onCheckedChange={setRandomize}
                  />
                </div>
              )}

              {!randomize && (
                <div className="space-y-3">
                  <Label>Preferred Workout Days</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {DAYS.map((day, index) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${index}`}
                          checked={preferredDays.includes(index)}
                          onCheckedChange={() => togglePreferredDay(index)}
                        />
                        <label
                          htmlFor={`day-${index}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {day === "Sun" ? "Sunday" : day === "Mon" ? "Monday" : day === "Tue" ? "Tuesday" : day === "Wed" ? "Wednesday" : day === "Thu" ? "Thursday" : day === "Fri" ? "Friday" : "Saturday"}
                        </label>
                      </div>
                    ))}
                  </div>
                  {preferredDays.length !== workoutFrequency && (
                    <p className="text-sm text-muted-foreground">
                      Select {workoutFrequency} days for your workout schedule
                    </p>
                  )}
                </div>
              )}

              <Button onClick={saveCalendarSettings} className="w-full">
                Save Calendar Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        <BottomNav />
      </div>
    </ProtectedRoute>
  );
}
