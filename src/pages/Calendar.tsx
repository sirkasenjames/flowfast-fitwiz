import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Check, Dumbbell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function Calendar() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [completedDates, setCompletedDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      fetchCompletedWorkouts();
    }
  }, [user, currentDate]);

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
    return dateObj > today;
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
        </div>

        <BottomNav />
      </div>
    </ProtectedRoute>
  );
}
