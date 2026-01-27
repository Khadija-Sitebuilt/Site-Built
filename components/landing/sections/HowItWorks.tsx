"use client";

import { images } from "../assets";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const steps = [
  {
    image: images.step1,
    title: "Drag and drop\nyour floor plan and\nsite photos here.",
    description:
      "Batch upload supported, save time by\ndropping all photos at once.",
  },
  {
    image: images.step2,
    title: "Our AI auto-pins your photos\nto the correct floor plan location.",
    description: "Adjust pins if needed , full control,\nzero hassle.",
  },
  {
    image: images.step3,
    title: "Generate a polished, photo-\nverified As-Builts in seconds.",
    description: "Share as PDF branded and\n client-ready",
  },
];

export function HowItWorks() {
  const titleAnim = useScrollAnimation({ threshold: 0.2 });
  const descAnim = useScrollAnimation({ threshold: 0.2 });
  const step1Anim = useScrollAnimation({ threshold: 0.1 });
  const step2Anim = useScrollAnimation({ threshold: 0.1 });
  const step3Anim = useScrollAnimation({ threshold: 0.1 });

  const stepAnims = [step1Anim, step2Anim, step3Anim];

  return (
    <section
      id="howitworks"
      className="bg-gray-50 box-border flex flex-col gap-10 md:gap-16 lg:gap-20 items-center left-0 overflow-clip px-4 sm:px-8 md:px-12 lg:px-12 xl:px-[120px] py-12 sm:py-16 md:py-20 lg:py-[112px] w-full"
    >
      <div className="flex flex-col gap-10 md:gap-16 lg:gap-20 items-center max-w-[1280px] relative shrink-0 w-full">
        <div className="flex flex-col gap-4 md:gap-6 items-start leading-[0] relative shrink-0 text-center w-full px-4 sm:px-0">
          <h2
            ref={titleAnim.ref}
            className={`font-['Inter',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-3xl sm:text-4xl tracking-[-0.96px] w-full max-w-full md:max-w-[768px] mx-auto whitespace-pre-wrap ${titleAnim.isVisible ? "animate-fade-in-up" : "opacity-0-animate"}`}
          >
            <span className="text-black">How It </span>
            <span className="font-['Inter',sans-serif] font-normal italic text-green-600">
              Works
            </span>
          </h2>
          <div
            ref={descAnim.ref}
            className={`font-['Open_Sans',sans-serif] font-normal leading-[normal] relative shrink-0 text-base md:text-lg text-black w-full max-w-full md:max-w-[768px] mx-auto whitespace-pre-wrap ${descAnim.isVisible ? "animate-fade-in-up animation-delay-200" : "opacity-0-animate"}`}
          >
            <p className="mb-0">Turn site photos into accurate As-Builts in </p>
            <p>three simple steps no CAD, no manual work.</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap gap-6 md:gap-6 lg:gap-12 items-start justify-center relative shrink-0 w-full">
          {steps.map((step, index) => {
            const anim = stepAnims[index];
            const delays = ["", "animation-delay-200", "animation-delay-400"];
            return (
              <div
                key={index}
                ref={anim.ref}
                className={`box-border flex flex-col gap-6 md:gap-8 items-start w-full md:w-[calc(50%-12px)] lg:w-auto lg:flex-[1_0_0] overflow-clip p-4 md:p-5 relative shrink-0 ${anim.isVisible ? `animate-fade-in-up ${delays[index]}` : "opacity-0-animate"}`}
              >
                <div className="h-auto aspect-[4/3] md:h-[215.676px] relative shrink-0 w-full">
                  <div
                    className="absolute border border-gray-50 border-solid h-full left-0 rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.05)] top-0 w-full bg-no-repeat bg-cover bg-center"
                    style={{ backgroundImage: `url('${step.image}')` }}
                  />
                </div>
                <div className="flex flex-col gap-4 md:gap-6 items-center relative shrink-0 w-full">
                  <div className="flex flex-col gap-3 md:gap-4 items-start leading-[0] relative shrink-0 text-center w-full">
                    <div className="font-['Inter',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-base sm:text-lg md:text-xl text-black tracking-[-0.48px] w-full whitespace-pre-wrap">
                      {step.title}
                    </div>
                    <div className="font-['Open_Sans',sans-serif] font-normal leading-[normal] relative shrink-0 text-xs sm:text-sm md:text-base text-slate-600 w-full whitespace-pre-wrap">
                      {step.description}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
