-- Create daily check-ins table
CREATE TABLE public.daily_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date TEXT NOT NULL,
  body_battery INTEGER NOT NULL CHECK (body_battery >= 10 AND body_battery <= 100),
  available_time INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own check-ins" 
ON public.daily_checkins 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own check-ins" 
ON public.daily_checkins 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own check-ins" 
ON public.daily_checkins 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own check-ins" 
ON public.daily_checkins 
FOR DELETE 
USING (auth.uid() = user_id);