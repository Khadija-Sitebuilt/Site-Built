"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowIcon } from "../shared/ArrowIcon";

const plans = [
  {
    name: "Starter",
    monthlyPrice: 149,
    annualTotal: "1,518",
    annualMonthly: "126.50",
    description: "Small GC & drafting shop",
    photoLimit: "500 photos, $0.20/photo",
    features: [
      "3 seats, ",
      "Unlimited projects, ",
      "Basic alignment/detection, ",
      "Review UI, ",
      "PDF/DXF export, ",
      "Email support"
    ],
    buttonText: "Start Project",
    buttonStyle: "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200",
    borderStyle: "border-[1.02px] border-[rgba(0,0,0,0.1)]",
  },
  {
    name: "Professional",
    monthlyPrice: 399,
    annualTotal: "4,071",
    annualMonthly: "339",
    description: "Active MEP/BIM teams",
    photoLimit: "3,000 photos, $0.12/photo",
    features: [
      "10 seats, ",
      "Batch uploads, ",
      "Drive/Dropbox connectors,",
      "Confidence filters,",
      " CSV export, ",
      "Priority queue"
    ],
    buttonText: "Start Project",
    buttonStyle: "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/25 transition-all duration-200",
    borderStyle: "border-[1.088px] border-green-600",
    priceColor: "text-green-600",
    photoBorderColor: "green-600",
  },
  {
    name: "Enterprise",
    monthlyPrice: 999,
    annualTotal: "10,189",
    annualMonthly: "849",
    description: "Large contractors, VDC departments",
    photoLimit: "10,000 photos, $0.08/photo",
    features: [
      "25 seats, ",
      "SSO & roles, ",
      "API/webhooks, ",
      "Region pinning, ",
      "SLA, ",
      "white-label reports"
    ],
    buttonText: "Start Project",
    buttonStyle: "bg-white text-blue-600 hover:bg-gray-50 hover:shadow-md transition-all duration-200",
    borderStyle: "border-[1.088px] border-[rgba(0,0,0,0.1)]",
    cardStyle: "bg-blue-600",
    annualCardStyle: "bg-green-600",
    textStyle: "text-white",
  },
  {
    name: "Enterprise Plus",
    price: "Custom Pricing",
    description: "High-volume global contractors",
    photoLimit: "25k–100k photos, $0.05–$0.07/photo",
    features: [
      "Dedicated GPU workers, ",
      "private queue, ",
      "custom retention/security, ",
      "quarterly model review"
    ],
    buttonText: "Contact for Sales",
    buttonStyle: "border border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 transition-all duration-200",
    borderStyle: "border-[1.088px] border-[rgba(0,0,0,0.1)]",
    link: "/contact",
  },
];

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="bg-gray-50 box-border flex flex-col gap-12 md:gap-16 lg:gap-[80px] items-center justify-center px-4 sm:px-8 md:px-12 lg:px-12 xl:px-[120px] py-12 sm:py-16 md:py-20 lg:py-[112px] relative w-full">
      <div className="flex flex-col gap-12 md:gap-16 lg:gap-[80px] items-center max-w-[1280px] relative shrink-0 w-full">
        <div className="box-border flex flex-col gap-4 md:gap-6 items-center not-italic px-4 sm:px-0 py-0 relative shrink-0 text-center w-full">
          <h2 className="font-['Inter',sans-serif] font-bold leading-[1.2] relative shrink-0 text-center text-neutral-950 tracking-[-0.96px]">
            <span className="block text-3xl sm:text-4xl">Simple,</span>
            <span className="block text-3xl sm:text-4xl">
              <span>Transparent </span>
              <span className="font-['Inter',sans-serif] font-normal italic text-green-600 tracking-[-0.96px]">Pricing</span>
            </span>
          </h2>
          <p className="font-['Arial',sans-serif] leading-[28px] min-w-full relative shrink-0 text-base md:text-lg text-slate-600 w-[min-content] whitespace-pre-wrap">
            Choose the plan that fits your team size and project needs.
          </p>
        </div>
        <div className="flex flex-col gap-12 md:gap-16 lg:gap-20 items-center relative shrink-0 w-full">
          <div className="bg-[#ececf0] box-border flex items-center p-1 relative rounded-[10px] shrink-0 w-full max-w-[273px]">
            <button
              onClick={() => setIsAnnual(false)}
              className={`cursor-pointer flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] shrink-0 transition-all duration-200 ${!isAnnual ? 'bg-blue-600' : ''}`}
            >
              <div className="flex gap-[10px] items-center justify-center px-[22px] py-[6px] relative">
                <p className={`font-['Arial',sans-serif] leading-[24px] not-italic relative shrink-0 text-sm md:text-base ${!isAnnual ? 'text-white' : 'text-slate-600'}`}>
                  Monthly Plan
                </p>
              </div>
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`cursor-pointer flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] shrink-0 transition-all duration-200 ${isAnnual ? 'bg-green-600' : ''}`}
            >
              <div className="flex gap-[10px] items-center justify-center px-4 md:px-6 py-[6px] relative w-full">
                <p className={`font-['Arial',sans-serif] leading-[24px] not-italic relative shrink-0 text-sm md:text-base ${isAnnual ? 'text-white' : 'text-slate-600'}`}>
                  Annual Plan
                </p>
              </div>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-6 items-stretch justify-center relative shrink-0 w-full">
            {plans.map((plan, index) => {
              const displayPrice = plan.price || (isAnnual ? `$${plan.annualTotal}/` : `$${plan.monthlyPrice}/`);
              const displayPeriod = plan.price ? "" : (isAnnual ? "yr" : "Month");
              const displaySubPrice = (!plan.price && isAnnual) ? `($${plan.annualMonthly}/mo)` : "";
              const cardBg = isAnnual && plan.annualCardStyle ? plan.annualCardStyle : plan.cardStyle;

              return (
                <div
                  key={index}
                  className={`${cardBg || "bg-white"} ${plan.borderStyle} border-solid box-border flex flex-col h-full min-h-[480px] items-center justify-between p-4 relative rounded-[11.424px] shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[280px]`}
                >
                  <div className="flex flex-col items-start relative shrink-0 w-full flex-1">
                    <div className="flex items-start relative shrink-0 w-full mb-6">
                      <p className={`flex-[1_0_0] font-['Inter',sans-serif] font-normal leading-[26.113px] min-h-px min-w-px not-italic relative shrink-0 text-xs md:text-sm ${plan.textStyle || "text-neutral-950"} whitespace-pre-wrap`}>
                        {plan.name}
                      </p>
                    </div>
                    <div className="flex gap-[6.528px] items-baseline relative shrink-0 w-full mb-4">
                      <div className="flex gap-2 items-center justify-center relative shrink-0">
                        <p className={`font-['Arial',sans-serif] leading-[32.641px] not-italic relative shrink-0 text-xl md:text-2xl font-bold ${plan.priceColor || plan.textStyle || "text-blue-600"}`}>
                          {displayPrice}
                        </p>
                      </div>
                      {displayPeriod && (
                        <p className={`font-['Open_Sans',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[11.424px] ${plan.textStyle || "text-[#717182]"}`}>
                          {displayPeriod}
                          {displaySubPrice && <span className="ml-2 opacity-80 font-normal">{displaySubPrice}</span>}
                        </p>
                      )}
                    </div>
                    <p className={`font-['Inter',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-sm md:text-base ${plan.textStyle || "text-black"} tracking-[-0.32px] w-full whitespace-pre-wrap mb-6`}>
                      {plan.description}
                    </p>
                    <div className={`border-[0.816px] border-dashed ${plan.photoBorderColor === "green-600" ? "border-green-600" : plan.textStyle === "text-white" ? "border-white" : "border-blue-600"} box-border flex gap-2 items-center p-1 relative shrink-0 w-full mb-4`}>
                      <p className={`flex-[1_0_0] font-['Open_Sans',sans-serif] font-normal leading-[normal] min-h-px min-w-px relative shrink-0 text-[11.424px] ${plan.textStyle || "text-black"} whitespace-pre-wrap`}>
                        {plan.photoLimit}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center justify-center relative shrink-0 w-full pl-5">
                      <ul className={`block flex-[1_0_0] font-['Open_Sans',sans-serif] font-normal leading-[0] min-h-px min-w-px relative shrink-0 text-xs md:text-[13.056px] ${plan.textStyle || "text-[#717182]"} whitespace-pre-wrap list-disc`}>
                        {plan.features.map((feature, i) => (
                          <li key={i} className={i < plan.features.length - 1 ? "mb-1" : ""}>
                            <span className="leading-[normal]">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Link
                    href={plan.link || "/signup"}
                    className={`group ${plan.buttonStyle} box-border flex gap-2 h-[60px] items-center justify-center px-4 py-2 relative rounded-[54px] shrink-0 w-full mt-8`}
                  >
                    <span className="font-['Inter',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-xs md:text-[13.06px]">
                      {plan.buttonText}
                    </span>
                    <ArrowIcon
                      className={`relative shrink-0 group-hover:translate-x-0.5 transition-all ${plan.buttonStyle.includes("text-blue-600") ? "text-blue-600" : "text-white"}`}
                      size={14}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
