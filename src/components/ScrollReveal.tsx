import { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

type AnimationVariant = "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom-in" | "blur-in";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  threshold?: number;
}

const variantStyles: Record<AnimationVariant, { hidden: string; visible: string }> = {
  "fade-up": {
    hidden: "opacity-0 translate-y-8",
    visible: "opacity-100 translate-y-0",
  },
  "fade-down": {
    hidden: "opacity-0 -translate-y-8",
    visible: "opacity-100 translate-y-0",
  },
  "fade-left": {
    hidden: "opacity-0 translate-x-8",
    visible: "opacity-100 translate-x-0",
  },
  "fade-right": {
    hidden: "opacity-0 -translate-x-8",
    visible: "opacity-100 translate-x-0",
  },
  "zoom-in": {
    hidden: "opacity-0 scale-95",
    visible: "opacity-100 scale-100",
  },
  "blur-in": {
    hidden: "opacity-0 blur-sm",
    visible: "opacity-100 blur-0",
  },
};

export function ScrollReveal({
  children,
  className,
  variant = "fade-up",
  delay = 0,
  duration = 700,
  threshold = 0.1,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold });

  const styles = variantStyles[variant];

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all will-change-transform",
        isVisible ? styles.visible : styles.hidden,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {children}
    </div>
  );
}

// Staggered children animation helper
interface ScrollRevealGroupProps {
  children: ReactNode[];
  className?: string;
  childClassName?: string;
  variant?: AnimationVariant;
  staggerDelay?: number;
  duration?: number;
  threshold?: number;
}

export function ScrollRevealGroup({
  children,
  className,
  childClassName,
  variant = "fade-up",
  staggerDelay = 100,
  duration = 700,
  threshold = 0.1,
}: ScrollRevealGroupProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold });

  const styles = variantStyles[variant];

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(
            "transition-all will-change-transform",
            isVisible ? styles.visible : styles.hidden,
            childClassName
          )}
          style={{
            transitionDuration: `${duration}ms`,
            transitionDelay: `${index * staggerDelay}ms`,
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
