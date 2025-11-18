import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { goal } = await req.json();
    console.log('Generating workout recommendations for goal:', goal);

    const goalDescriptions = {
      'weight-loss': 'High-intensity cardio, fat-burning, and calorie-focused routines that emphasize HIIT and metabolic conditioning.',
      'muscle-gain': 'Strength training, resistance exercises, and progressive overload focused routines for building muscle mass.',
      'endurance': 'Long-duration cardio, tempo work, and stamina-based routines for building cardiovascular endurance.'
    };

    const systemPrompt = `You are an expert AI fitness coach specializing in creating personalized workout plans. 
Generate exactly 3 complete workout routines for someone focused on ${goal}.
Each workout should include:
- A compelling name (4-6 words)
- A motivational description (20-30 words)
- Duration in minutes
- 5-6 specific exercises with details

Focus: ${goalDescriptions[goal as keyof typeof goalDescriptions] || goalDescriptions['weight-loss']}

Return ONLY valid JSON in this exact structure:
{
  "workouts": [
    {
      "name": "Workout Name",
      "description": "Motivational description",
      "duration": "25 min",
      "exercises": [
        {
          "name": "Exercise Name",
          "type": "reps|time|weight",
          "target": "3 sets x 12 reps|30 seconds|3 sets x 10 reps @ 15 lbs",
          "description": "How to perform the exercise properly"
        }
      ]
    }
  ]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate 3 personalized ${goal} workouts with complete exercise details.` }
        ],
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    console.log('OpenAI response received');

    if (!response.ok) {
      console.error('OpenAI API error:', data);
      throw new Error(data.error?.message || 'Failed to generate recommendations');
    }

    const generatedText = data.choices[0].message.content;
    console.log('Generated text:', generatedText);

    // Parse the JSON response
    let workoutData;
    try {
      workoutData = JSON.parse(generatedText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      throw new Error('Invalid response format from AI');
    }

    // Add IDs and accent colors to the workouts
    const accentColors = ['coral', 'teal', 'primary'];
    const workoutsWithMetadata = workoutData.workouts.map((workout: any, index: number) => ({
      ...workout,
      id: `ai-${goal}-${Date.now()}-${index}`,
      accentColor: accentColors[index % accentColors.length],
      exercises: workout.exercises.map((exercise: any, exerciseIndex: number) => ({
        ...exercise,
        id: `exercise-${Date.now()}-${index}-${exerciseIndex}`
      }))
    }));

    console.log('Successfully generated', workoutsWithMetadata.length, 'workouts');

    return new Response(
      JSON.stringify({ workouts: workoutsWithMetadata }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in generate-workout-recommendations function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
