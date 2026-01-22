"use client";

import { Clock, ShieldCheck, Upload } from "lucide-react";
import { BenefitCard } from "../shared/BenefitCard";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { images } from "../assets";

const benefits = [
  {
    title: "Saves Time\nvs. Manual CAD",
    description:
      "Eliminate hours of manual markups. SiteSync automates photo-to-plan mapping so your team can focus on building, not paperwork",
    IconComponent: Clock,
    descriptionFont: "Open_Sans" as const,
  },
  {
    title: "Reduces Errors,\nEnsures Accuracy",
    description:
      "Every photo is geo-tagged and pinned with precision, creating reliable As-Builts you can trust",
    IconComponent: ShieldCheck,
    descriptionFont: "Arial" as const,
  },
  {
    title: "Simple Interface\nfor Field Engineers",
    description:
      "Designed for the field: drag-and-drop uploads, clear visual feedback, and zero training required.",
    IconComponent: Upload,
    descriptionFont: "Open_Sans" as const,
  },
];

export function Benefits() {
  const titleAnim = useScrollAnimation({ threshold: 0.2 });
  const descAnim = useScrollAnimation({ threshold: 0.2 });
  const card1Anim = useScrollAnimation({ threshold: 0.1 });
  const card2Anim = useScrollAnimation({ threshold: 0.1 });
  const card3Anim = useScrollAnimation({ threshold: 0.1 });

  const cardAnims = [card1Anim, card2Anim, card3Anim];

  return (
    <section
      id="benefits"
      className="box-border flex flex-col gap-12 md:gap-16 lg:gap-[80px] items-start justify-center px-4 sm:px-8 md:px-12 lg:px-12 xl:px-[120px] py-12 sm:py-16 md:py-20 lg:py-[112px] relative"
      style={{
        background:
          "linear-gradient(180deg, rgba(249,250,251,1) 55%, rgba(84,122,204,0.2) 71%, rgba(11,64,182,0.05) 95%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-center opacity-20 bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url(${images.benefitBackgroundImage})`,
        }}
      />
      <div className="box-border flex flex-col gap-4 md:gap-6 items-center leading-[0] not-italic px-4 sm:px-0 py-0 relative shrink-0 text-center w-full max-w-[1280px] mx-auto">
        <h2
          ref={titleAnim.ref}
          className={`font-['Inter',sans-serif] font-bold leading-[normal] relative shrink-0 text-3xl sm:text-4xl text-neutral-950 tracking-[-0.96px] ${titleAnim.isVisible ? "animate-fade-in-up" : "opacity-0-animate"}`}
        >
          Why <span className="text-blue-600">Site</span>
          <span className="text-green-600">Built?</span>
        </h2>
        <div
          ref={descAnim.ref}
          className={`font-['Arial',sans-serif] leading-[28px] relative shrink-0 text-base md:text-lg text-slate-600 ${descAnim.isVisible ? "animate-fade-in-up animation-delay-200" : "opacity-0-animate"}`}
        >
          <p className="mb-0">Built to simplify site documentation </p>
          <p>for engineers, managers, and clients alike</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 relative shrink-0 w-full max-w-[1280px] mx-auto">
        {benefits.map((benefit, index) => {
          const anim = cardAnims[index];
          const delays = [
            "animation-delay-400",
            "animation-delay-500",
            "animation-delay-600",
          ];
          return (
            <div
              key={index}
              ref={anim.ref}
              className={
                anim.isVisible
                  ? `animate-fade-in-up ${delays[index]}`
                  : "opacity-0-animate"
              }
            >
              <BenefitCard
                icon={true}
                title={benefit.title}
                description={benefit.description}
                IconComponent={benefit.IconComponent}
                descriptionFont={benefit.descriptionFont}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
