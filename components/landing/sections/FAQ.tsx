
"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ArrowIcon } from "../shared/ArrowIcon";
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const faqItems = [
  {
    question: "What is SiteBuilt?",
    answer: "SiteBuilt is a tool that converts your site photos into accurate, aligned floor plans — fast and simple.",
    expanded: false,
  },
  {
    question: "Do I need CAD experience to use it?",
    answer: "No. SiteBuilt is designed for field and project teams, not CAD specialists. If you can take photos and read a floor plan, you can use it.",
    expanded: false,
  },
  {
    question: "How accurate are the plans?",
    answer: "SiteBuilt is built to deliver construction-grade accuracy by combining geo-tagged photos, plan alignment, and review tools so your team can verify and adjust before export.",
    expanded: false,
  },
  {
    question: "What formats can I export to?",
    answer: "You can export as project-ready PDFs for sharing, as well as CAD-friendly formats like DXF so your design and BIM teams can keep working in their existing tools.",
    expanded: false,
  },
  {
    question: "Is my data secure?",
    answer: "Yes. SiteBuilt uses modern cloud security practices, including encrypted storage and access controls, so your project data stays protected.",
    expanded: false,
  },
  {
    question: "What's the difference between Per Project and Subscription?",
    answer: "Per Project is ideal for one-off jobs where you pay per project or per batch of photos. Subscription is best for active teams who want predictable monthly pricing and volume discounts across multiple projects.",
    expanded: false,
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const titleAnim = useScrollAnimation({ threshold: 0.2 });
  const descAnim = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      id="faq"
      className="box-border flex flex-col gap-10 md:gap-16 lg:gap-20 items-center justify-center left-0 px-4 sm:px-8 md:px-12 lg:px-12 xl:px-[120px] py-12 sm:py-16 md:py-20 lg:py-[112px] w-full"
      style={{
        background:
          "linear-gradient(180deg, rgba(249,250,251,1) 55%, rgba(84,122,204,0.2) 71%, rgba(11,64,182,0.05) 95%)",
      }}
    >
      <div className="flex flex-col gap-4 md:gap-6 items-center leading-[normal] relative shrink-0 text-center w-full max-w-[1280px]">
        <h2
          ref={titleAnim.ref}
          className={`font-['Inter',sans-serif] font-bold not-italic relative shrink-0 text-center text-3xl sm:text-4xl text-neutral-950 tracking-[-0.96px] leading-[1.2] ${titleAnim.isVisible ? 'animate-fade-in-up' : 'opacity-0-animate'}`}
        >
          <span className="block">Frequently Asked</span>
          <span className="block font-['Inter',sans-serif] font-normal italic text-green-600">Questions</span>
        </h2>
        <p
          ref={descAnim.ref}
          className={`flex-[1_0_0] font-['Open_Sans',sans-serif] font-normal min-h-px min-w-px relative shrink-0 text-[#717182] text-base md:text-lg w-full max-w-[768px] whitespace-pre-wrap ${descAnim.isVisible ? 'animate-fade-in-up animation-delay-200' : 'opacity-0-animate'}`}
        >
          Clear answers to help you get started.
        </p>
      </div>
      <div className="flex flex-col gap-8 md:gap-12 items-start relative shrink-0 w-full max-w-[768px]">
        <div className="flex flex-col gap-3 md:gap-4 items-start relative shrink-0 w-full">
          {faqItems.map((item, index) => {
            const isExpanded = openIndex === index;

            return (
              <div
                key={index}
                className={`border-[1.333px] border-[rgba(0,0,0,0.1)] border-solid box-border flex flex-col ${isExpanded
                  ? "items-start justify-center px-4 md:px-[25.333px] py-1"
                  : "min-h-[48px] md:h-[54.667px] items-start px-4 md:px-[25.333px] py-[1.333px]"
                  } relative rounded-[10px] shrink-0 w-full`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isExpanded ? null : index)}
                  className={`box-border flex items-center justify-between ${isExpanded ? "px-0 py-[13px]" : "min-h-[48px] md:h-[52px]"
                    } relative rounded-[8px] shrink-0 w-full text-left`}
                  aria-expanded={isExpanded}
                >
                  <span className="font-['Inter',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-base md:text-lg text-neutral-950 tracking-[-0.36px]">
                    {item.question}
                  </span>
                  <span className="relative shrink-0 size-5 text-slate-600 flex items-center justify-center">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </span>
                </button>
                {isExpanded && item.answer && (
                  <div className="box-border flex items-start overflow-clip pb-4 md:pb-6 pt-0 px-0 relative shrink-0 w-full">
                    <p className="flex-[1_0_0] font-['Open_Sans',sans-serif] font-normal leading-[normal] min-h-px min-w-px relative shrink-0 text-[#717182] text-sm md:text-base whitespace-pre-wrap">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-3 md:gap-4 items-center relative shrink-0 w-full">
          <div className="h-auto md:h-6 relative shrink-0 w-full">
            <p className="font-['Arial',sans-serif] leading-[24px] not-italic text-[#717182] text-sm md:text-base text-center">
              Still have questions?
            </p>
          </div>
          <Link
            href="/contact"
            className="group border border-blue-600 border-solid box-border flex gap-2 h-[60px] items-center justify-center px-5 py-[10px] relative rounded-[30px] shrink-0 w-full sm:w-auto min-w-[275px] transition-all duration-200 hover:bg-blue-50 hover:border-blue-700"
          >
            <span className="font-['Inter',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-sm md:text-base text-blue-600 group-hover:text-blue-700 transition-colors">
              Contact Support
            </span>
            <ArrowIcon className="relative shrink-0 text-blue-600 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

