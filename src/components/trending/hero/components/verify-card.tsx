"use client";

import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { BadgeBlue, BadgeGold, BadgeRed } from "../../../../../public/svg/verify-badge";
import { VerifiedIcon } from "lucide-react";
import LogInDialog from "@/components/dialog/LogInDialog";
import { AuthContext } from "@/contexts/auth-context";

export default function VerifyCard() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const [isLogInOpen, setIsLogInOpen] = useState(false);
  const { token } = useContext(AuthContext);

  const toggle = (tier: string) =>
    setExpanded((prev) => ({ ...prev, [tier]: !prev[tier] }));

  const plans = [
    {
      tier: "Start",
      monthly: 0,
      cent: 0,
      yearly: 0,
      description: "Start building your profile and connect with others for free",
      audience: "Anyone starting out",
      features: ["Create a profile", "Follow other users", "Basic feed access"],
      color: "gray",
      free: true,
    },
    {
      tier: "Premium",
      badge: BadgeBlue,
      monthly: 2,
      cent: 79,
      yearly: 24,
      description: "Perfect for creators and professionals building credibility",
      audience: "Individuals • Freelancers • Early-stage founders",
      features: ["Verified blue badge on profile", "Priority in search results", "Basic engagement analytics", "Verified status in comments"],
      color: "blue",
    },
    {
      tier: "VIP",
      badge: BadgeGold,
      monthly: 8,
      cent: 79,
      yearly: 78,
      description: "Stand out instantly and attract high-value opportunities",
      audience: "Growing brands • Influencers • Agencies",
      features: ["Exclusive gold verification badge", "Top 10% placement in all searches", "Advanced analytics dashboard", "Priority support (24h response)", "Featured in 'Trending' section weekly"],
      color: "yellow",
      popular: true,
    },
    {
      tier: "Elite",
      badge: BadgeRed,
      monthly: 97,
      cent: 79,
      yearly: 867,
      description: "Maximum authority — dominate your niche with unmatched presence",
      audience: "Established companies • Top influencers • Industry leaders",
      features: ["Rare red Elite badge (limited availability)", "Guaranteed #1 ranking in your category", "Real-time heatmaps & competitor insights", "Dedicated account manager", "Featured on homepage & app push", "Custom badge animation"],
      color: "red",
    },
  ];

  return (
    <div className="w-full bg-transparent p-4">
      {/* Header */}
      <div className="flex items-center mb-4 gap-8">
        {/* Title */}
        <div className="flex items-center order-1 sm:order-1 gap-2">
          <VerifiedIcon className="text-[var(--text)]" />
          <h3 className="font-semibold text-[var(--text)]">
            Get Verified • Stand Out
          </h3>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center gap-2 text-xs order-2 sm:order-2">
          <span className={billing === "monthly" ? "font-medium text-[var(--text)]" : "text-[var(--text-secondary)]"}>monthly</span>
          <button
            onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
            className="relative w-10 h-6 bg-[var(--blue)] rounded-full transition-all"
            aria-label="Toggle billing"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${billing === "yearly" ? "translate-x-4" : ""
                }`}
            />
          </button>
          <span className={billing === "yearly" ? "font-medium text-[var(--text)]" : "text-[var(--text-secondary)]"}>yearly</span>
          {billing === "yearly" && (
            <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs px-2 py-0.5 rounded-full font-medium ml-1">
              Save up to 27%
            </span>
          )}
        </div>
      </div>

      {/* Horizontal Scroll Cards */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-3 -mx-4 px-4">
        {plans.map((plan) => {
          const price = billing === "monthly" ? plan.monthly : plan.yearly;
          const cent = billing === "monthly" ? plan.cent : plan.cent;
          const per = billing === "monthly" ? "/month" : "/year";
          const showMore = plan.features.length > 2;
          const isExpanded = expanded[plan.tier];

          return (
            <div
              key={plan.tier}
              className="flex-shrink-0 w-[280px] sm:w-[300px] bg-[var(--background-primary)] rounded-2xl border border-solid border-[var(--border)] shadow-sm overflow-hidden snap-start flex flex-col justify-between"
            >
              <div className="p-5 flex flex-col h-full">
                {/* Top Section */}
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {plan.badge && <plan.badge className="w-11 h-11 flex-shrink-0" />}
                      <div>
                        <h4 className="font-bold flex gap-4 text-lg text-[var(--text)]">
                          {plan.tier} {plan.popular}
                          {plan.popular && (
                            <span className="inline-block bg-yellow-500 text-black text-xs font-bold px-2.5 py-1 rounded-full mt-1">
                              Most Popular
                            </span>
                          )}
                          {plan.free && (
                            <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full mt-1">
                              Free
                            </span>
                          )}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-[var(--text)]">${price}</span>
                      <span className="text-sm font-extrabold text-[var(--text-secondary)]">.{cent}</span>
                      <span className="text-[var(--text)] text-sm">{per}</span>
                    </div>
                  </div>


                  {/* Description */}
                  <p className="text-[var(--text)] text-sm mb-1">{plan.description}</p>
                  <p className="text-[var(--text-secondary)] text-sm mb-2">{plan.audience}</p>

                  {/* Features */}
                  <ul className="space-y-2 mb-3 text-sm text-[var(--text)]">
                    {(isExpanded ? plan.features : plan.features.slice(0, 2)).map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                        </svg>
                        <span className="leading-tight">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* See More / Less */}
                  {showMore && (
                    <button
                      onClick={() => toggle(plan.tier)}
                      className="text-[var(--blue)] hover:text-[var(--blue-secondary)] text-xs font-medium hover:underline mb-4 block"
                    >
                      {isExpanded ? "See Less" : `+ ${plan.features.length - 2} more`}
                    </button>
                  )}
                </div>

                {/* Bottom CTA */}
                <div className="mt-auto">
                  <Button
                    className={`
                      w-full font-semibold rounded-xl py-5 text-base transition-all
                      ${plan.popular
                        ? "bg-[var(--background-2)] hover:bg-[var(--text)] text-[var(--text-2)] transition border border-solid border-[var(--border)]"
                        : plan.tier === "Premium"
                          ? "bg-[var(--background-secondary)] text-[var(--text)] border border-solid border-[var(--border)]"
                          : plan.tier === "Elite"
                            ? "bg-[var(--background-secondary)] text-[var(--text)] border border-solid border-[var(--border)]"
                            : "bg-[var(--background-primary)] text-[var(--text)] border border-solid border-[var(--border)]"

                      }
                    `}
                  >
                    {plan.tier === "Start" ?
                      <Button
                        onClick={() => setIsLogInOpen(true)}
                        className="font-semibold text-base transition-all border-none shadow-none"
                      >
                        Get Started
                      </Button>
                      : plan.popular
                        ? "Go VIP Now"
                        : `Choose ${plan.tier}
                    `}
                  </Button>
                </div>

                {/* <div className="flex items-center gap-3">
                  {!token === plan.free ? (
                    <Button
                      onClick={() => setIsLogInOpen(true)}
                      className="w-full font-semibold rounded-xl py-5 text-base transition-all bg-[var(--background-secondary)] text-[var(--text)] border border-solid border-[var(--border)]"
                    >
                      Get Started
                    </Button>
                  ) : (
                    <>
                      < p className="font-semibold text-base text-[var(--text)]">Logged In</p>
                    </>
                  )}
                  <LogInDialog open={isLogInOpen} handleLogInClose={() => setIsLogInOpen(false)} />
                </div> */}
              </div>
              <LogInDialog open={isLogInOpen} handleLogInClose={() => setIsLogInOpen(false)} />
            </div>
          );
        })}
      </div>

      {/* Scroll Indicators */}
      <div className="flex justify-center gap-1.5 mt-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === 1 ? "w-5 bg-[var(--background-primary)]" : "w-1.5 bg-[var(--background-primary)]"}`}
          />
        ))}
      </div>

      {/* Hide Scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div >
  );
}
