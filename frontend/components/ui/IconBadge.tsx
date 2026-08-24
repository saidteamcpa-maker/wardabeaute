import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

// Brand-colored circular icon badge. Uses lucide-react icons.
export function IconBadge({
  icon: Icon,
  className,
  tone = "warda",
  size = "md",
}: {
  icon: LucideIcon;
  className?: string;
  tone?: "warda" | "profond" | "champagne" | "brume";
  size?: "sm" | "md" | "lg";
}) {
  const tones: Record<string, string> = {
    warda: "bg-warda/15 text-warda",
    profond: "bg-profond/10 text-profond",
    champagne: "bg-champagne/15 text-champagne",
    brume: "bg-brume text-profond",
  };
  const sizes: Record<string, string> = {
    sm: "w-9 h-9",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };
  const iconSizes: Record<string, string> = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };
  return (
    <span
      className={cn(
        "inline-grid place-items-center rounded-full shrink-0",
        tones[tone],
        sizes[size],
        className
      )}
    >
      <Icon className={iconSizes[size]} strokeWidth={1.75} />
    </span>
  );
}
