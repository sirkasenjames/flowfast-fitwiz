import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { goal, bodyBattery, availableTime } = await req.json();

    if (!lovableApiKey) {
      throw new Error('Lovable AI key not configured');
    }

    // Determine intensity based on body battery
    let intensity = "moderate";
    let intensityDescription = "balanced";
    
    if (bodyBattery <= 30) {
      intensity = "low";
      intensityDescription = "gentle, recovery-focused";
    } else if (bodyBattery >= 80) {
      intensity = "high";
      intensityDescription = "challenging, high-performance";
    }

    // Determine number of exercises based on available time
    const exerciseCount = availableTime < 30 ? 5 : 10;

    // Map goal to descriptive terms
    const goalDescriptions = {
      "weight-loss": "weight loss and fat burning",
      "muscle-gain": "muscle building and strength",
      "endurance": "cardiovascular endurance and stamina"
    };

    const systemPrompt = `You are an expert fitness coach creating personalized workout plans. Generate ${exerciseCount} exercises for a ${intensity}-intensity workout focused on ${goalDescriptions[goal as keyof typeof goalDescriptions]}.

The user has ${availableTime} minutes available and feels ${intensityDescription} today (body battery: ${bodyBattery}%).

Return ONLY valid JSON in this exact format:
{
  "workouts": [
    {
      "name": "Personalized ${goal} Workout",
      "duration": "${availableTime}",
      "description": "Brief motivational description",
      "exercises": [
        {
          "name": "Exercise name",
          "type": "reps" | "time" | "weight",
          "target": {
            "sets": number,
            "reps": number (if type is reps),
            "time": number (if type is time, in seconds),
            "weight": number (if type is weight, in kg)
          },
          "description": "Clear instructions for proper form"
        }
      ]
    }
  ]
}

Guidelines:
- For low intensity (body battery ≤30%): Use easier exercises, lower sets/reps/times, include more rest
- For moderate intensity (30-70%): Standard difficulty, balanced work-to-rest ratio
- For high intensity (≥80%): Challenging exercises, higher volume, shorter rest periods
- Adjust exercise difficulty and volume appropriately for the available time
- Include a variety of exercises targeting different muscle groups
- Make descriptions motivating and technique-focused`;

    console.log('Generating workout with:', { goal, bodyBattery, availableTime, intensity, exerciseCount });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create a ${intensity}-intensity ${goal} workout with ${exerciseCount} exercises for someone with ${bodyBattery}% energy and ${availableTime} minutes available.` }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      throw new Error(`Lovable AI error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Lovable AI response received');

    let workoutData;
    try {
      const rawContent = data.choices[0].message.content as string;
      const cleanedContent = rawContent
        .replace(/```json\s*/g, "")
        .replace(/```/g, "")
        .trim();
      workoutData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      throw new Error('Invalid response format from AI');
    }

    // Add metadata to workouts
    const accentColors = ["coral", "teal", "primary"] as const;
    workoutData.workouts = workoutData.workouts.map((workout: any, index: number) => ({
      ...workout,
      id: `ai-workout-${Date.now()}-${index}`,
      goal: goal,
      accentColor: accentColors[index % accentColors.length],
      exercises: workout.exercises.map((exercise: any, exerciseIndex: number) => ({
        ...exercise,
        id: `exercise-${Date.now()}-${index}-${exerciseIndex}`,
      })),
    }));

    console.log('Generated workouts:', workoutData.workouts.length);

    return new Response(JSON.stringify(workoutData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-personalized-workout:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        workouts: [] 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
