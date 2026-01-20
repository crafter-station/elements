"use client";

import { useCallback, useState } from "react";

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}

export interface PricingFeature {
  text: string;
  included?: boolean;
}

export interface PolarPricingCardProps {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  interval?: "month" | "year" | "one_time";
  features: (string | PricingFeature)[];
  popular?: boolean;
  highlighted?: boolean;
  ctaText?: string;
  ctaUrl?: string;
  onCheckout?: () => void;
  disabled?: boolean;
  className?: string;
}

export function PolarPricingCard({
  name,
  description,
  price,
  currency = "$",
  interval = "month",
  features,
  popular = false,
  highlighted = false,
  ctaText = "Get Started",
  ctaUrl,
  onCheckout,
  disabled = false,
  className,
}: PolarPricingCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = useCallback(() => {
    if (disabled) return;
    if (onCheckout) {
      onCheckout();
    } else if (ctaUrl) {
      window.location.href = ctaUrl;
    }
  }, [disabled, onCheckout, ctaUrl]);

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `${currency}${price}`;
  };

  const getIntervalText = () => {
    if (price === 0) return "";
    switch (interval) {
      case "month":
        return "/mo";
      case "year":
        return "/yr";
      case "one_time":
        return "";
      default:
        return "/mo";
    }
  };

  return (
    <div
      data-slot="polar-pricing-card"
      className={cn(
        "relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300",
        highlighted && "border-primary bg-primary/5 shadow-lg shadow-primary/10",
        !highlighted && "border-border hover:border-primary/50",
        isHovered && !highlighted && "shadow-md",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {popular && (
        <div
          data-slot="popular-badge"
          className="absolute -top-3 left-1/2 -translate-x-1/2"
        >
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
            <SparklesIcon className="h-3 w-3" />
            Most Popular
          </span>
        </div>
      )}

      <div data-slot="header" className="mb-6">
        <h3
          data-slot="name"
          className="text-lg font-semibold text-foreground"
        >
          {name}
        </h3>
        {description && (
          <p
            data-slot="description"
            className="mt-1 text-sm text-muted-foreground"
          >
            {description}
          </p>
        )}
      </div>

      <div data-slot="price" className="mb-6">
        <span className="text-4xl font-bold text-foreground">
          {formatPrice(price)}
        </span>
        <span className="text-muted-foreground">{getIntervalText()}</span>
      </div>

      <ul data-slot="features" className="mb-8 flex-1 space-y-3">
        {features.map((feature, index) => {
          const isString = typeof feature === "string";
          const text = isString ? feature : feature.text;
          const included = isString ? true : feature.included !== false;

          return (
            <li
              key={index}
              data-slot="feature"
              className={cn(
                "flex items-start gap-2 text-sm",
                included ? "text-foreground" : "text-muted-foreground line-through"
              )}
            >
              <CheckIcon
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0",
                  included ? "text-primary" : "text-muted-foreground/50"
                )}
              />
              {text}
            </li>
          );
        })}
      </ul>

      <button
        data-slot="cta"
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          "w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
          highlighted
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        {ctaText}
      </button>
    </div>
  );
}
