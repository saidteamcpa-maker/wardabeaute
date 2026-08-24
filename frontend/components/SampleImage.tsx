import { cn } from "@/lib/cn";

// Placeholder image (rose gradient + label). Replace with next/image once real assets arrive.
export function SampleImage({
  label,
  className,
  ratio = "aspect-[4/5]",
}: {
  label: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-2xl bg-gradient-to-br from-brume via-petal to-warda/30 text-center text-brun/70 font-display text-xl px-6",
        ratio,
        className
      )}
      aria-label={label}
      role="img"
    >
      {label}
    </div>
  );
}
