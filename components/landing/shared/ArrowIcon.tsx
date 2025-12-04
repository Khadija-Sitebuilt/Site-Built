import { ArrowRight } from "lucide-react";

type ArrowIconProps = {
  className?: string;
  size?: number;
};

export function ArrowIcon({ className, size = 16 }: ArrowIconProps) {
  return (
    <ArrowRight className={className} size={size} />
  );
}

