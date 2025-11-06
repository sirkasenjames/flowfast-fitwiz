import { cn } from "@/lib/utils";

interface FrequencySelectorProps {
  selectedFrequency: number | null;
  onSelect: (frequency: number) => void;
}

const frequencies = [
  { value: 2, label: "2x", description: "Light" },
  { value: 3, label: "3x", description: "Moderate" },
  { value: 4, label: "4x", description: "Active" },
  { value: 5, label: "5x", description: "Intense" },
  { value: 6, label: "6+", description: "Athlete" },
];

export const FrequencySelector = ({ selectedFrequency, onSelect }: FrequencySelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Workout Frequency</h2>
        <p className="text-muted-foreground">How many days per week will you train?</p>
      </div>
      
      <div className="flex gap-3 justify-center flex-wrap">
        {frequencies.map((freq) => (
          <button
            key={freq.value}
            onClick={() => onSelect(freq.value)}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-xl border-2 min-w-[80px] transition-all duration-300",
              "hover:scale-105",
              selectedFrequency === freq.value
                ? "border-primary bg-gradient-to-br from-primary/10 to-secondary/10 shadow-[var(--shadow-card)]"
                : "border-border bg-card hover:border-primary/50"
            )}
          >
            <span className={cn(
              "text-2xl font-bold mb-1",
              selectedFrequency === freq.value ? "text-primary" : "text-foreground"
            )}>
              {freq.label}
            </span>
            <span className="text-xs text-muted-foreground">{freq.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
