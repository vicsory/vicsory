"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PricingSwitchProps = {
  onSwitch: (value: string) => void;
};

type PricingCardProps = {
  isYearly?: boolean;
  title: string;
  monthlyPrice?: number;
  yearlyPrice?: number;
  description: string;
  features: string[];
  actionLabel: string;
  popular?: boolean;
  exclusive?: boolean;
};

const PricingHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <section className="text-center mb-12 sm:mb-20 px-4">
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[var(--active-mode)] tracking-tight">
      <span>
        <span style={{ color: "var(--blue)" }}>P</span>
        <span style={{ color: "var(--hover-blue)" }}>r</span>
        <span style={{ color: "var(--red)" }}>i</span>
        <span style={{ color: "var(--hover-red)" }}>c</span>
        <span style={{ color: "var(--orange)" }}>i</span>
        <span style={{ color: "var(--orange)" }}>n</span>
        <span style={{ color: "var(--orange)" }}>g</span>
      </span>{" "}
      Plans
    </h2>
    <p className="text-base sm:text-lg md:text-xl text-[var(--text-2)] mt-4 max-w-3xl mx-auto leading-relaxed">
      {subtitle}
    </p>
  </section>
);

const PricingSwitch = ({ onSwitch }: PricingSwitchProps) => (
  <Tabs defaultValue="0" className="w-fit mx-auto mb-12 sm:mb-16" onValueChange={onSwitch}>
    <TabsList className="inline-grid grid-cols-2 w-64 sm:w-72 bg-[var(--grey)] rounded-full border border-solid h-10" style={{ borderColor: 'var(--border-color)' }}>
      <TabsTrigger
        value="0"
        className={cn(
          "relative z-10 rounded-full py-1.5 px-3 text-sm font-medium h-full flex items-center justify-center",
          "data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm",
          "data-[state=inactive]:text-[var(--text-2)]"
        )}
      >
        Monthly billing
      </TabsTrigger>
      <TabsTrigger
        value="1"
        className={cn(
          "relative z-10 rounded-full py-1.5 px-3 text-sm font-medium h-full flex items-center justify-center",
          "data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm",
          "data-[state=inactive]:text-[var(--text-2)]"
        )}
      >
        Yearly billing
      </TabsTrigger>
    </TabsList>
  </Tabs>
);

const PricingCard = ({
  isYearly,
  title,
  monthlyPrice,
  yearlyPrice,
  description,
  features,
  actionLabel,
  popular,
  exclusive,
}: PricingCardProps) => (
  <div
    className={cn(
      "w-full sm:w-80 rounded-xl border border-solid",
      popular ? "bg-[var(--grey)] border-2 border-[var(--blue)] relative z-10" : "border-[var(--border-color)]",
      exclusive && "bg-gradient-to-br from-[var(--blue)]/5 to-[var(--hover-blue)]/5"
    )}
  >
    {popular && (
      <div className="border-2 border-solid border-white absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--red)] text-white text-xs font-medium px-4 py-1 rounded-full shadow-md">
        Most Popular
      </div>
    )}
    <Card
      className={cn(
        "bg-transparent border-none shadow-none h-full flex flex-col",
        popular && "pt-2 sm:pt-4" // Adjust padding for popular badge
      )}
    >
      <CardHeader className={cn("pb-6 pt-8 sm:pt-10 px-6", popular && "pt-10 sm:pt-12")}>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
          <h3 className="flex items-center text-lg sm:text-xl md:text-2xl font-semibold text-[var(--active-mode)] tracking-tight">{title}</h3>
          {isYearly && yearlyPrice && monthlyPrice && (
            <span className="text-xs bg-[var(--grey)] text-[var(--active-mode)] px-3 py-1 rounded-md border border-solid font-medium" style={{ borderColor: 'var(--border-color)' }}>
              Save ${monthlyPrice * 12 - yearlyPrice}
            </span>
          )}
        </div>
        <div className="mt-4 sm:mt-6 flex items-center gap-2">
          <span className="flex items-center text-3xl sm:text-4xl font-bold text-[var(--active-mode)]">
            {yearlyPrice && isYearly ? `$${yearlyPrice}` : monthlyPrice ? `$${monthlyPrice}` : "Custom"}
          </span>
          <span className="text-xs sm:text-sm flex items-center text-[var(--text-2)] tracking-wide">
            {yearlyPrice && isYearly ? "/year" : monthlyPrice ? "/month" : ""}
          </span>
        </div>
        <p className="text-xs sm:text-sm md:text-base text-[var(--text-2)] mt-3 min-h-[40px] leading-relaxed">{description}</p>
      </CardHeader>
      <CardContent className="px-6 pb-8 flex flex-col flex-grow">
        <ul className="space-y-3 flex-grow">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <CheckCircle2 size={18} className="text-[var(--blue)] flex-shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm text-[var(--text-2)] leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          className={cn(
            "w-full mt-6 sm:mt-8 rounded-full py-2 sm:py-3 text-xs sm:text-sm font-semibold tracking-wide bg-[var(--blue)] text-white hover:bg-[var(--hover-blue)]"
          )}
        >
          {actionLabel}
        </Button>
      </CardContent>
    </Card>
  </div>
);

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const togglePricingPeriod = (value: string) => setIsYearly(parseInt(value) === 1);

  const plans = [
    {
      title: "Basic",
      monthlyPrice: 10,
      yearlyPrice: 100,
      description: "Essential features you need to get started",
      features: ["Example Feature Number 1", "Example Feature Number 2", "Example Feature Number 3"],
      actionLabel: "Get Started",
    },
    {
      title: "Pro",
      monthlyPrice: 25,
      yearlyPrice: 250,
      description: "Perfect for owners of small & medium businesses",
      features: ["Example Feature Number 1", "Example Feature Number 2", "Example Feature Number 3"],
      actionLabel: "Get Started",
      popular: true,
    },
    {
      title: "Enterprise",
      description: "Dedicated support and infrastructure to fit your needs",
      features: ["Example Feature Number 1", "Example Feature Number 2", "Example Feature Number 3", "Super Exclusive Feature"],
      actionLabel: "Contact Sales",
      exclusive: true,
    },
  ];

  return (
    <div className="py-12 sm:py-24 bg-[var(--background-primary)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PricingHeader title="Pricing Plans" subtitle="Choose the plan that best fits your needs and budget" />
        <PricingSwitch onSwitch={togglePricingPeriod} />
        <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2 md:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard key={plan.title} {...plan} isYearly={isYearly} />
          ))}
        </div>
      </div>
    </div>
  );
}